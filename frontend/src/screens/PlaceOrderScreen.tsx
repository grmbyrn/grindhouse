import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppSelector, useAppDispatch } from '../hooks'
import CheckoutSteps from '../components/CheckoutSteps'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import Message from '../components/Message'
import OrderItemList from '../components/OrderItemList'
import OrderSummary from '../components/OrderSummary'
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice'
import { getErrorMessage } from '../utils/getErrorMessage'

const PlaceOrderScreen = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const cart = useAppSelector((state) => state.cart)

    const [createOrder, { isLoading, error }] = useCreateOrderMutation()

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping')
        } else if (!cart.paymentMethod) {
            navigate('/payment')
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate])

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap()
            dispatch(clearCartItems())
            navigate(`/order/${res._id}`)
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <div className='grid gap-8 lg:grid-cols-3'>
                <div className='flex flex-col gap-6 lg:col-span-2'>
                    <Card>
                        <CardContent className='flex flex-col gap-2'>
                            <h2 className='text-lg font-semibold'>Shipping</h2>
                            <p className='text-sm text-muted-foreground'>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className='flex flex-col gap-2'>
                            <h2 className='text-lg font-semibold'>Payment Method</h2>
                            <p className='text-sm text-muted-foreground'>{cart.paymentMethod}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className='flex flex-col gap-2'>
                            <h2 className='text-lg font-semibold'>Order Items</h2>
                            {cart.cartItems.length === 0 ? (
                                <Message>Your cart is empty</Message>
                            ) : (
                                <OrderItemList
                                    items={cart.cartItems.map((item) => ({ ...item, productId: item._id }))}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <OrderSummary
                        itemsPrice={cart.itemsPrice}
                        shippingPrice={cart.shippingPrice}
                        taxPrice={cart.taxPrice}
                        totalPrice={cart.totalPrice}
                    >
                        {error && <Message variant='danger'>{getErrorMessage(error)}</Message>}
                        <Button
                            type='button'
                            size='lg'
                            className='w-full'
                            disabled={cart.cartItems.length === 0 || isLoading}
                            onClick={placeOrderHandler}
                        >
                            Place Order
                        </Button>
                        {isLoading && <Loader />}
                    </OrderSummary>
                </div>
            </div>
        </div>
    )
}
export default PlaceOrderScreen
