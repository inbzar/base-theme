"use client"

import { Cart, PaymentSession } from "@medusajs/medusa"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import StripeWrapper from "./stripe-wrapper"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { createContext } from "react"

type WrapperProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
  children: React.ReactNode
}

export const StripeContext = createContext(false)

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const Wrapper: React.FC<WrapperProps> = ({ cart, children }) => {
  const paymentSession = cart.payment_session as PaymentSession

  const isStripe = paymentSession?.provider_id?.includes("stripe")

  if (isStripe && paymentSession && stripePromise) {
    return (
      <StripeContext.Provider value={true}>
        <StripeWrapper
          paymentSession={paymentSession}
          stripeKey={stripeKey}
          stripePromise={stripePromise}
        >
          {children}
        </StripeWrapper>
      </StripeContext.Provider>
    )
  }

  if (paymentSession?.provider_id === "paypal" && cart) {
    const paypalClientId = (cart.payment_session?.data.paypal_client_id ||
      "test") as string

    if (cart.payment_session?.data.subscription) {
      return (
        <PayPalScriptProvider
          options={{
            "client-id": paypalClientId,
            currency: cart?.region.currency_code.toUpperCase(),
            vault: true,
            intent: "subscription",
            components: "buttons",
          }}
        >
          {children}
        </PayPalScriptProvider>
      )
    }

    return (
      <PayPalScriptProvider
        options={{
          "client-id": paypalClientId,
          currency: cart?.region.currency_code.toUpperCase(),
          intent: cart.payment_session?.data.auto_capture
            ? "capture"
            : "authorize",
          components: "buttons",
        }}
      >
        {children}
      </PayPalScriptProvider>
    )
  }

  return <div>{children}</div>
}

export default Wrapper
