import { describe, expect, it } from 'vitest'
import { setupStore } from '../store'
import { makeCartItem } from '../test/utils'
import { addToCart, clearCartItems, removeFromCart } from './cartSlice'

describe('cart', () => {
    it('adds an item and works out the totals', () => {
        const store = setupStore()

        store.dispatch(addToCart(makeCartItem({ _id: 'a', price: 20, qty: 2 })))

        // $40 of items: $10 shipping (not over $100), 15% tax
        expect(store.getState().cart).toMatchObject({
            itemsPrice: '40.00',
            shippingPrice: '10.00',
            taxPrice: '6.00',
            totalPrice: '56.00',
        })
    })

    it('gives free shipping over $100', () => {
        const store = setupStore()

        store.dispatch(addToCart(makeCartItem({ _id: 'a', price: 60, qty: 2 })))

        expect(store.getState().cart).toMatchObject({
            itemsPrice: '120.00',
            shippingPrice: '0.00',
            taxPrice: '18.00',
            totalPrice: '138.00',
        })
    })

    it('updates the quantity instead of adding the same product twice', () => {
        const store = setupStore()

        store.dispatch(addToCart(makeCartItem({ _id: 'a', qty: 1 })))
        store.dispatch(addToCart(makeCartItem({ _id: 'a', qty: 3 })))

        expect(store.getState().cart.cartItems).toHaveLength(1)
        expect(store.getState().cart.cartItems[0].qty).toBe(3)
    })

    it('recalculates after removing an item', () => {
        const store = setupStore()
        store.dispatch(addToCart(makeCartItem({ _id: 'a', price: 60, qty: 2 })))
        store.dispatch(addToCart(makeCartItem({ _id: 'b', price: 10, qty: 1 })))

        store.dispatch(removeFromCart('a'))

        expect(store.getState().cart.cartItems.map((i) => i._id)).toEqual(['b'])
        expect(store.getState().cart).toMatchObject({
            itemsPrice: '10.00',
            shippingPrice: '10.00',
            totalPrice: '21.50',
        })
    })

    it('saves the cart to localStorage so it survives a reload', () => {
        const store = setupStore()

        store.dispatch(addToCart(makeCartItem({ _id: 'a' })))
        expect(JSON.parse(localStorage.getItem('cart')!).cartItems).toHaveLength(1)

        store.dispatch(clearCartItems())
        expect(JSON.parse(localStorage.getItem('cart')!).cartItems).toHaveLength(0)
    })
})
