import { User, Store, Payment, Order, Region } from "@medusajs/medusa"
import { Library as OriginalLibrary } from "./models/library"
import { LibraryFile as OriginalLibraryFile } from "./models/library-file"

/**
 * =======================
 * Extended Models
 * =======================
 */

export declare module "@medusajs/medusa/dist/models" {
  declare interface Library extends OriginalLibrary {}
  declare interface LibraryFile extends OriginalLibraryFile {}
}

/**
 * =======================
 * MODELS
 * =======================
 */
export declare module "@medusajs/medusa/dist/models/sales-channel" {
  declare interface SalesChannel {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/store" {
  declare interface Store {
    members?: User[]
    inbzar_domain?: string
    domain?: string
    admin_email?: string
    logo?: string
  }
}

export declare module "@medusajs/medusa/dist/models/user" {
  declare interface User {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/region" {
  declare interface Region {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/country" {
  declare interface Country {
    regions: Region[]
  }
}

export declare module "@medusajs/medusa/dist/models/customer" {
  declare interface Customer {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/draft-order" {
  declare interface DraftOrder {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/order" {
  declare interface Order {
    store_id?: string
    store?: Store
    upcoming?: boolean
  }
}

export declare module "@medusajs/medusa/dist/models/invite" {
  declare interface Invite {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/publishable-api-key" {
  declare interface Customer {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/return-reason" {
  declare interface ReturnReason {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/customer" {
  declare interface Customer {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/customer-group" {
  declare interface CustomerGroup {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/discount" {
  declare interface Discount {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/gift-card" {
  declare interface GiftCard {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/product-collection" {
  declare interface ProductCollection {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/product-type" {
  declare interface ProductType {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/product-tag" {
  declare interface ProductTag {
    store_id?: string
    store?: Store
  }
}

export interface SubscriptionConfig {
  customer_defined_delivery?: boolean
  delivery_day?: number
  delivery_interval?: "DAY" | "WEEK" | "MONTH" | "YEAR"
  delivery_interval_count?: number
  total_deliveries?: "unlimited" | number
  orders_opening?: {
    interval?: "WEEK" | "MONTH"
    start?: number
    end?: number
    cease_orders?: boolean
  }
  [x: string]: any
}
export declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    is_subscription_box?: boolean
    subscription_config?: SubscriptionConfig | null
    subscription_metadata?: Record<string, any> | null

    store_id?: string
    store?: Store

    library?: OriginalLibrary
  }
}

export declare module "@medusajs/medusa/dist/models/product-variant" {
  declare interface ProductVariant {
    is_onetime_purchase?: boolean
  }
}

export interface PurchasePreferences {
  type?: "onetime" | "subscription"
  delivery_interval?: "DAY" | "WEEK" | "MONTH" | "YEAR"
  delivery_interval_count?: number
  total_deliveries?: string | number
  delivery_on_next_interval?: boolean
  [x: string]: any
}
export declare module "@medusajs/medusa/dist/models/cart" {
  declare interface Cart {
    purchase_preferences?: PurchasePreferences | null
    store_id?: string
    store?: Store
  }
}

/**
 * =======================
 * SERVICES
 * =======================
 */
export declare module "@medusajs/medusa/dist/services/store" {
  export default interface StoreService {
    retrieveById(id: string, config?: FindConfig<Store>): Promise<Store>
  }
}

export declare module "@medusajs/medusa/dist/services/payment" {
  export default interface PaymentService {
    updateSessionData(paymentId: string, data: { data: any }): Promise<Payment>
  }
}

export declare module "@medusajs/medusa/dist/services/order" {
  export default interface OrderService {
    duplicateOrder(
      cartId: string,
      paymentData?: { key: string; data: any }
    ): Promise<Order | Error>
  }
}

/**
 * =======================
 * API ROUTES
 * =======================
 */
export declare module "@medusajs/medusa/dist/api/routes/admin/products/update-product" {
  declare interface AdminPostProductsProductReq {
    is_subscription_box?: boolean
    subscription_config?: SubscriptionConfig | null
    subscription_metadata?: Record<string, any> | null
  }
}

export declare module "@medusajs/medusa/dist/api/routes/store/carts/update-cart" {
  declare interface StorePostCartsCartReq {
    purchase_preferences?: PurchasePreferences | null
  }
}

export declare module "@medusajs/medusa/dist/api/routes/store/carts/create-cart" {
  declare interface StorePostCartReq {
    purchase_preferences?: PurchasePreferences | null
  }
}

export declare module "@medusajs/medusa/dist/api/routes/store/products/list-products" {
  declare interface StoreGetProductsParams {
    is_subscription_box?: boolean
  }
}
