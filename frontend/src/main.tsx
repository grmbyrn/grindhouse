import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Provider } from 'react-redux'
import store from './store'
import './index.css'
import App from './App'
import { ThemeProvider } from './components/ThemeProvider'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import ProfileScreen from './screens/ProfileScreen'

// Admin screens load on first visit, so customers never download them
const adminScreen = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({
    Component: (await load()).default,
})

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index={true} path='/' element={<HomeScreen />} />
            <Route path='/search/:keyword' element={<HomeScreen />} />
            <Route path='/page/:pageNumber' element={<HomeScreen />} />
            <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/cart' element={<CartScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />

            <Route path='' element={<PrivateRoute />}>
                <Route path='/shipping' element={<ShippingScreen />} />
                <Route path='/payment' element={<PaymentScreen />} />
                <Route path='/placeorder' element={<PlaceOrderScreen />} />
                <Route path='/order/:id' element={<OrderScreen />} />
                <Route path='/profile' element={<ProfileScreen />} />
            </Route>

            <Route path='' element={<AdminRoute />}>
                <Route path='/admin/orderlist' lazy={adminScreen(() => import('./screens/admin/OrderListScreen'))} />
                <Route
                    path='/admin/productlist'
                    lazy={adminScreen(() => import('./screens/admin/ProductListScreen'))}
                />
                <Route
                    path='/admin/productlist/:pageNumber'
                    lazy={adminScreen(() => import('./screens/admin/ProductListScreen'))}
                />
                <Route
                    path='/admin/product/:id/edit'
                    lazy={adminScreen(() => import('./screens/admin/ProductEditScreen'))}
                />
                <Route path='/admin/userlist' lazy={adminScreen(() => import('./screens/admin/UserListScreen'))} />
                <Route path='/admin/user/:id/edit' lazy={adminScreen(() => import('./screens/admin/UserEditScreen'))} />
            </Route>
        </Route>,
    ),
)

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <Provider store={store}>
                {/* Placeholder client ID: OrderScreen swaps in the real one before the script loads */}
                <PayPalScriptProvider options={{ clientId: 'test' }} deferLoading={true}>
                    <RouterProvider router={router} />
                </PayPalScriptProvider>
            </Provider>
        </ThemeProvider>
    </React.StrictMode>,
)
