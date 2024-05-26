import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

interface ProductOrderRestriction {
  isRestricted: boolean
  isOpen: boolean
  isCeased: boolean
}

export const getProductOrderRestriction = (
  product: PricedProduct
): ProductOrderRestriction => {
  const restriction: ProductOrderRestriction = {
    isRestricted: false,
    isOpen: true,
    isCeased: false,
  }

  const opening = product?.subscription_config?.orders_opening

  if (!opening) {
    return restriction
  }

  restriction.isRestricted = opening.start !== 0 && opening.end !== 0
  restriction.isCeased = opening.cease_orders!

  const currentDay =
    opening.interval === "MONTH" ? new Date().getDate() : new Date().getDay()

  if (opening.start && opening.end) {
    restriction.isOpen =
      currentDay >= opening.start && currentDay <= opening.end
  } else {
    restriction.isOpen = true
  }

  return restriction
}
