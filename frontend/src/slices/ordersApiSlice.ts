import { apiSlice } from './apiSlice'
import { ORDERS_URL, PAYPAL_URL } from '../constants'
import type { CartItem, MyOrder, Order, ShippingAddress } from '../types'

export interface CreateOrderRequest {
    orderItems: CartItem[]
    shippingAddress: Partial<ShippingAddress>
    paymentMethod: string
    itemsPrice: string
    shippingPrice: string
    taxPrice: string
    totalPrice: string
}

// The PayPal capture details passed through to the backend
export interface PaymentDetails {
    id?: string
    status?: string
    update_time?: string
    payer?: { email_address?: string }
}

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation<Order, CreateOrderRequest>({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: { ...order },
            }),
        }),
        getOrderDetails: builder.query<Order, string>({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        payOrder: builder.mutation<Order, { orderId: string; details: PaymentDetails }>({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: { ...details },
            }),
        }),
        getPayPalClientId: builder.query<{ clientId: string }, void>({
            query: () => ({
                url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        getMyOrders: builder.query<MyOrder[], void>({
            query: () => ({
                url: `${ORDERS_URL}/mine`,
            }),
            keepUnusedDataFor: 5,
        }),
        getOrders: builder.query<Order[], void>({
            query: () => ({
                url: ORDERS_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        deliverOrder: builder.mutation<Order, string>({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT',
            }),
        }),
    }),
})

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation,
} = ordersApiSlice
