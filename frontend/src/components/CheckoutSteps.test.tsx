import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import CheckoutSteps from './CheckoutSteps'
import { renderWithProviders } from '../test/utils'

describe('CheckoutSteps', () => {
    it('links the steps already reached and marks the current one', () => {
        renderWithProviders(<CheckoutSteps step1 step2 step3 />)

        expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
        expect(screen.getByRole('link', { name: /shipping/i })).toHaveAttribute('href', '/shipping')
        expect(screen.getByRole('link', { name: /payment/i })).toHaveAttribute('aria-current', 'step')
    })

    it('does not link steps the customer has not reached yet', () => {
        renderWithProviders(<CheckoutSteps step1 step2 />)

        expect(screen.queryByRole('link', { name: /payment/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /place order/i })).not.toBeInTheDocument()
        expect(screen.getByText('Place Order')).toBeInTheDocument()
    })
})
