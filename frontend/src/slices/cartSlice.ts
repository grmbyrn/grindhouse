import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { updateCart } from '../utils/cartUtils'
import type { CartItem, ShippingAddress } from '../types'

export interface CartState {
    cartItems: CartItem[]
    shippingAddress: Partial<ShippingAddress>
    paymentMethod: string
    itemsPrice: string
    shippingPrice: string
    taxPrice: string
    totalPrice: string
}

const emptyCart: CartState = {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: 'PayPal',
    itemsPrice: '0.00',
    shippingPrice: '0.00',
    taxPrice: '0.00',
    totalPrice: '0.00',
}

const storedCart = localStorage.getItem('cart')

const initialState: CartState = storedCart ? JSON.parse(storedCart) : emptyCart

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload

            const existItem = state.cartItems.find((x) => x._id === item._id)

            if (existItem) {
                state.cartItems = state.cartItems.map((x) => (x._id === existItem._id ? item : x))
            } else {
                state.cartItems = [...state.cartItems, item]
            }

            return updateCart(state)
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload)

            return updateCart(state)
        },
        saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
            state.shippingAddress = action.payload
            return updateCart(state)
        },
        savePaymentMethod: (state, action: PayloadAction<string>) => {
            state.paymentMethod = action.payload
            return updateCart(state)
        },
        clearCartItems: (state) => {
            state.cartItems = []
            return updateCart(state)
        },
        resetCart: () => emptyCart,
    },
})

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems, resetCart } =
    cartSlice.actions

export default cartSlice.reducer
