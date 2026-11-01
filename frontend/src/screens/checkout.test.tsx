import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShippingScreen from './ShippingScreen'
import PaymentScreen from './PaymentScreen'
import { renderWithProviders } from '../test/utils'

describe('ShippingScreen', () => {
    it('saves the address and moves on to payment', async () => {
        const { store } = renderWithProviders(<ShippingScreen />, { route: '/shipping' })

        await userEvent.type(screen.getByLabelText('Address'), '1 Main St')
        await userEvent.type(screen.getByLabelText('City'), 'Dublin')
        await userEvent.type(screen.getByLabelText('Postal Code'), 'D01')
        await userEvent.type(screen.getByLabelText('Country'), 'Ireland')
        await userEvent.click(screen.getByRole('button', { name: 'Continue' }))

        expect(store.getState().cart.shippingAddress).toEqual({
            address: '1 Main St',
            city: 'Dublin',
            postalCode: 'D01',
            country: 'Ireland',
        })
        expect(screen.getByTestId('location')).toHaveTextContent('/payment')
    })

    it('fills in a previously saved address', () => {
        renderWithProviders(<ShippingScreen />, {
            route: '/shipping',
            preloadedState: {
                cart: {
                    ...emptyCart(),
                    shippingAddress: { address: '1 Main St', city: 'Dublin', postalCode: 'D01', country: 'Ireland' },
                },
            },
        })

        expect(screen.getByLabelText('City')).toHaveValue('Dublin')
    })
})

describe('PaymentScreen', () => {
    it('sends the customer back to shipping if no address has been entered', () => {
        renderWithProviders(<PaymentScreen />, { route: '/payment' })

        expect(screen.getByTestId('location')).toHaveTextContent('/shipping')
    })

    it('saves PayPal as the payment method and moves on to place order', async () => {
        const { store } = renderWithProviders(<PaymentScreen />, {
            route: '/payment',
            preloadedState: {
                cart: {
                    ...emptyCart(),
                    paymentMethod: '',
                    shippingAddress: { address: '1 Main St', city: 'Dublin', postalCode: 'D01', country: 'Ireland' },
                },
            },
        })

        expect(screen.getByRole('radio', { name: /paypal/i })).toBeChecked()
        await userEvent.click(screen.getByRole('button', { name: 'Continue' }))

        expect(store.getState().cart.paymentMethod).toBe('PayPal')
        expect(screen.getByTestId('location')).toHaveTextContent('/placeorder')
    })
})

function emptyCart() {
    return {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: 'PayPal',
        itemsPrice: '0.00',
        shippingPrice: '0.00',
        taxPrice: '0.00',
        totalPrice: '0.00',
    }
}
