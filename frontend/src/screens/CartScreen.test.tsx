import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartScreen from './CartScreen'
import { setupStore } from '../store'
import { addToCart } from '../slices/cartSlice'
import { makeCartItem, renderWithProviders } from '../test/utils'

const cartWith = (...items: ReturnType<typeof makeCartItem>[]) => {
    const store = setupStore()
    for (const item of items) store.dispatch(addToCart(item))
    return { cart: store.getState().cart }
}

describe('CartScreen', () => {
    it('shows a message and disables checkout when the cart is empty', () => {
        renderWithProviders(<CartScreen />, { route: '/cart' })

        expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeDisabled()
    })

    it('lists the items with the item count and subtotal', () => {
        renderWithProviders(<CartScreen />, {
            route: '/cart',
            preloadedState: cartWith(
                makeCartItem({ _id: 'a', name: 'Airpods', price: 89.99, qty: 2 }),
                makeCartItem({ _id: 'b', name: 'Mouse', price: 49.99, qty: 1 }),
            ),
        })

        expect(screen.getByRole('link', { name: 'Airpods' })).toHaveAttribute('href', '/product/a')
        expect(screen.getByRole('link', { name: 'Mouse' })).toBeInTheDocument()
        expect(screen.getByText('Subtotal (3 items)')).toBeInTheDocument()
        expect(screen.getByText('$229.97')).toBeInTheDocument()
    })

    it('removes an item', async () => {
        const { store } = renderWithProviders(<CartScreen />, {
            route: '/cart',
            preloadedState: cartWith(
                makeCartItem({ _id: 'a', name: 'Airpods' }),
                makeCartItem({ _id: 'b', name: 'Mouse' }),
            ),
        })

        await userEvent.click(screen.getByRole('button', { name: 'Remove Airpods' }))

        expect(screen.queryByRole('link', { name: 'Airpods' })).not.toBeInTheDocument()
        expect(store.getState().cart.cartItems.map((i) => i._id)).toEqual(['b'])
    })

    it('sends the customer to sign in, then on to shipping, at checkout', async () => {
        renderWithProviders(<CartScreen />, { route: '/cart', preloadedState: cartWith(makeCartItem()) })

        await userEvent.click(screen.getByRole('button', { name: /proceed to checkout/i }))

        expect(screen.getByTestId('location')).toHaveTextContent('/login?redirect=/shipping')
    })
})
