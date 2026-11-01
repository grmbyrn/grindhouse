import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { createMemoryRouter, useLocation } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { render } from '@testing-library/react'
import { setupStore, type RootState } from '../store'
import type { CartItem, Product } from '../types'

// Shows where the app navigated to, so tests can assert on redirects
const LocationDisplay = () => {
    const location = useLocation()
    return <div data-testid='location'>{location.pathname + location.search}</div>
}

// Renders `ui` at `route` with a fresh store; other paths render only the location marker
export const renderWithProviders = (
    ui: ReactElement,
    {
        route = '/',
        path = route,
        preloadedState,
    }: { route?: string; path?: string; preloadedState?: Partial<RootState> } = {},
) => {
    const store = setupStore(preloadedState)
    const router = createMemoryRouter(
        [
            {
                path,
                element: (
                    <>
                        {ui}
                        <LocationDisplay />
                    </>
                ),
            },
            { path: '*', element: <LocationDisplay /> },
        ],
        { initialEntries: [route] },
    )
    return {
        store,
        ...render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>,
        ),
    }
}

export const makeProduct = (overrides: Partial<Product> = {}): Product => ({
    _id: 'p1',
    user: 'u1',
    name: 'Airpods',
    image: '/images/airpods.jpg',
    brand: 'Apple',
    category: 'Electronics',
    description: 'Headphones',
    reviews: [],
    rating: 4.5,
    numReviews: 10,
    price: 89.99,
    countInStock: 5,
    ...overrides,
})

export const makeCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
    ...makeProduct(overrides),
    qty: 1,
    ...overrides,
})
