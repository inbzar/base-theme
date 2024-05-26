"use client"

import { RadioGroup } from "@headlessui/react"
import { CheckCircleSolid } from "@medusajs/icons"
import { Cart } from "@medusajs/medusa"
import { Button, Heading, Text, clx } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Radio from "@modules/common/components/radio"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import NativeSelect from "@modules/common/components/native-select"
import { setCartPurchasePreferences } from "@modules/cart/actions"

const deliveryIntervals = [
  { value: "1-DAY", label: "Every Day" },
  { value: "2-DAY", label: "Every 2 Day" },
  { value: "3-DAY", label: "Every 3 Day" },
  { value: "1-WEEK", label: "Every Week" },
  { value: "2-WEEK", label: "Every 2 Week" },
  { value: "3-WEEK", label: "Every 3 Week" },
  { value: "1-MONTH", label: "Every Month" },
  { value: "2-MONTH", label: "Every 2 Month" },
  { value: "3-MONTH", label: "Every 3 Month" },
  { value: "4-MONTH", label: "Every 4 Month" },
  { value: "5-MONTH", label: "Every 5 Month" },
  { value: "6-MONTH", label: "Every 6 Month" },
  { value: "1-YEAR", label: "Every Year" },
]

type PurchasePreferencesProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const PurchasePreferences: React.FC<PurchasePreferencesProps> = ({ cart }) => {
  const [preferences, setPreferences] = useState(cart.purchase_preferences)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "purchase-preferences"
  const { canPickType, isEditable } = useMemo(() => {
    const prefs = { canPickType: true, isEditable: true }

    const variant = cart.items[0].variant
    const product = variant.product

    if (product.is_subscription_box) {
      prefs.canPickType = false

      if (!product.subscription_config?.customer_defined_delivery) {
        prefs.isEditable = false
      }
    }

    return prefs
  }, [cart])

  const handleEdit = () => {
    router.push(pathname + "?step=purchase-preferences", { scroll: false })
  }

  const handleSubmit = async () => {
    if (!preferences) {
      return
    }

    if (
      preferences.type === "subscription" &&
      (!preferences.delivery_interval ||
        !preferences.delivery_interval_count ||
        !preferences.total_deliveries)
    ) {
      return
    }

    setIsLoading(true)

    try {
      await setCartPurchasePreferences(preferences)
      router.push(pathname + "?step=payment", { scroll: false })
    } catch (err: any) {
      setError(err.toString())
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    if (field === "delivery_interval") {
      const [delivery_interval_count, delivery_interval] = value.split("-")
      setPreferences((prefs) => ({
        ...prefs,
        delivery_interval,
        delivery_interval_count: parseInt(delivery_interval_count),
      }))
    } else {
      setPreferences((prefs) => ({ ...prefs, [field]: value }))
    }
  }

  useEffect(() => {
    setPreferences(cart.purchase_preferences)
  }, [cart])

  useEffect(() => {
    setIsLoading(false)
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Purchase Preferences
          {!isOpen && preferences?.type && <CheckCircleSolid />}
        </Heading>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email &&
          preferences &&
          isEditable && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                Edit
              </button>
            </Text>
          )}
      </div>
      {isOpen && isEditable && (
        <div>
          {canPickType && (
            <div className="pb-8">
              <RadioGroup
                value={preferences?.type}
                onChange={(purchaseType: string) =>
                  handleChange("type", purchaseType)
                }
              >
                <RadioGroup.Option
                  value="onetime"
                  className={clx(
                    "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                    {
                      "border-ui-border-interactive":
                        preferences?.type === "onetime",
                    }
                  )}
                >
                  <div className="flex items-center gap-x-4">
                    <Radio checked={preferences?.type === "onetime"} />
                    <span className="text-base-regular">One Time</span>
                  </div>
                  <span className="justify-self-end text-ui-fg-base">
                    A single transaction for a product(s), requiring payment
                    only once
                  </span>
                </RadioGroup.Option>
                <RadioGroup.Option
                  value="subscription"
                  className={clx(
                    "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                    {
                      "border-ui-border-interactive":
                        preferences?.type === "subscription",
                    }
                  )}
                >
                  <div className="flex items-center gap-x-4">
                    <Radio checked={preferences?.type === "subscription"} />
                    <span className="text-base-regular">Subscription</span>
                  </div>
                  <span className="justify-self-end text-ui-fg-base">
                    Recurring payments at regular intervals for delivery of a
                    product(s).
                  </span>
                </RadioGroup.Option>
              </RadioGroup>
            </div>
          )}

          {preferences?.type === "subscription" && (
            <div className="pb-8 grid grid-cols-2 gap-4">
              <NativeSelect
                placeholder="Delivery interval"
                value={
                  preferences.delivery_interval
                    ? `${preferences.delivery_interval_count}-${preferences.delivery_interval}`
                    : ""
                }
                onChange={(e) =>
                  handleChange("delivery_interval", e.target.value)
                }
              >
                {deliveryIntervals.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </NativeSelect>

              <NativeSelect
                placeholder="Total deliveries"
                value={preferences.total_deliveries || ""}
                onChange={(e) =>
                  handleChange(
                    "total_deliveries",
                    e.target.value === "unlimited"
                      ? "unlimited"
                      : parseInt(e.target.value)
                  )
                }
              >
                {["unlimited", 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                  (opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  )
                )}
              </NativeSelect>
            </div>
          )}

          <ErrorMessage error={error} />
        </div>
      )}
      {preferences && (
        <div>
          <div className="text-small-regular">
            {cart && preferences?.type && (
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  {preferences?.type.toUpperCase()}
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  {preferences?.type === "onetime"
                    ? "A single transaction for a product(s), requiring payment only once"
                    : "Recurring payments at regular intervals for delivery of a product(s)."}
                  <br />
                  {preferences?.type === "subscription" && (
                    <span>
                      <br />
                      {preferences?.delivery_day && (
                        <span>
                          <strong>Delivery day</strong>{" "}
                          {preferences?.delivery_day}
                          <br />
                        </span>
                      )}
                      {preferences.delivery_interval &&
                        preferences.delivery_interval_count && (
                          <span>
                            <strong>Delivery interval</strong>{" "}
                            {
                              deliveryIntervals.find(
                                (d) =>
                                  d.value ===
                                  `${preferences.delivery_interval_count}-${preferences.delivery_interval}`
                              )?.label
                            }
                            <br />
                          </span>
                        )}

                      {preferences.total_deliveries && (
                        <span>
                          <strong>Total deliveries</strong>{" "}
                          {preferences.total_deliveries}
                          <br />
                        </span>
                      )}
                    </span>
                  )}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
      {isOpen && (
        <Button
          size="large"
          className="mt-6"
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={!preferences?.type}
        >
          Continue to payment
        </Button>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default PurchasePreferences
