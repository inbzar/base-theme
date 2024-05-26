import {
  PricedProduct,
  PricedVariant,
} from "@medusajs/medusa/dist/types/pricing"
import { PurchasePreferences } from "extended-types"
import { getProductOrderRestriction } from "./get-product-order-restriction"

export const getPurchasePrefs = (
  product: PricedProduct,
  variant: PricedVariant
): PurchasePreferences => {
  let prefs: PurchasePreferences = { type: "onetime" }

  if (product.is_subscription_box) {
    const { isRestricted, isOpen, isCeased } =
      getProductOrderRestriction(product)

    if (product.subscription_config) {
      const subConfig = product.subscription_config

      if (variant.is_onetime_purchase) {
        prefs = {
          type: "onetime",
        }
      } else {
        prefs = {
          type: "subscription",
          delivery_day: subConfig.delivery_day,
          delivery_interval: subConfig.delivery_interval,
          delivery_interval_count: subConfig.delivery_interval_count,
          total_deliveries: subConfig.total_deliveries,
        }

        if (isRestricted && !isOpen && !isCeased) {
          prefs.delivery_on_next_interval = true
        }
      }
    }
  }

  return prefs
}
