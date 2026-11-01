import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {toast} from 'react-toastify'
import { useAppSelector } from '../hooks'
import {
    PayPalButtons,
    usePayPalScriptReducer,
    DISPATCH_ACTION,
    SCRIPT_LOADING_STATE,
    type PayPalButtonsComponentProps
} from '@paypal/react-paypal-js';
import Message from "../components/Message"
import Loader from "../components/Loader"
import OrderItemList from "../components/OrderItemList"
import OrderSummary from "../components/OrderSummary"
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useDeliverOrderMutation
} from "../slices/ordersApiSlice"
import { getErrorMessage } from '../utils/getErrorMessage'
import { formatDateTime } from '../utils/formatDate'

const OrderScreen = () => {
    const {id: orderId} = useParams() as {id: string}

    const {data: order, refetch, error} = useGetOrderDetailsQuery(orderId)

    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation()

    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation()

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer()

    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery()

    const {userInfo} = useAppSelector((state) => state.auth)

    useEffect(() => {
        if(!errorPayPal && !loadingPayPal && paypal?.clientId){
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: DISPATCH_ACTION.RESET_OPTIONS,
                    value: {
                        clientId: paypal.clientId,
                        currency: 'USD'
                    }
                })
                paypalDispatch({type: DISPATCH_ACTION.LOADING_STATUS, value: SCRIPT_LOADING_STATE.PENDING})
            }
            if(order && !order.isPaid){
                if(!window.paypal){
                    loadPayPalScript()
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal])

    const onApprove: PayPalButtonsComponentProps['onApprove'] = (data, actions) => {
        return actions.order!.capture().then(async function(details){
            try{
                await payOrder({orderId, details}).unwrap()
                refetch()
                toast.success('Payment successful')
            } catch(error){
                toast.error(getErrorMessage(error))
            }
        })
    }

    // TESTING ONLY! REMOVE BEFORE PRODUCTION
    // async function onApproveTest(){
    //     await payOrder({orderId, details: {payer: {}}})
    //     refetch()
    //     toast.success('Payment successful')
    // }

    const onError: PayPalButtonsComponentProps['onError'] = (err) => {
        toast.error(getErrorMessage(err))
    }

    const createOrder: PayPalButtonsComponentProps['createOrder'] = (data, actions) => {
        return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: order!.totalPrice.toFixed(2)
                    }
                }
            ]
        }).then((orderId) => {
            return orderId
        })
    }

    const deliverOrderHandler = async () => {
        try{
            await deliverOrder(orderId).unwrap()
            refetch()
            toast.success('Order delivered')
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

  return error ? <Message variant='danger'>{getErrorMessage(error)}</Message>
  : !order ? <Loader /> : (
    <div>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
            Order <span className="font-mono text-base font-normal break-all text-muted-foreground">#{order._id}</span>
        </h1>
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
                <Card>
                    <CardContent className="flex flex-col gap-2 text-sm">
                        <h2 className="text-lg font-semibold">Shipping</h2>
                        <p><span className="text-muted-foreground">Name:</span> {order.user.name}</p>
                        <p><span className="text-muted-foreground">Email:</span> {order.user.email}</p>
                        <p>
                            <span className="text-muted-foreground">Address:</span>{' '}
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <Message variant='success'>
                                Delivered on {formatDateTime(order.deliveredAt)}
                            </Message>
                        ) : (
                            <Message variant='danger'>
                                Not Delivered
                            </Message>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-col gap-2 text-sm">
                        <h2 className="text-lg font-semibold">Payment Method</h2>
                        <p><span className="text-muted-foreground">Method:</span> {order.paymentMethod}</p>
                        {order.isPaid ? (
                            <Message variant='success'>
                                Paid on {formatDateTime(order.paidAt)}
                            </Message>
                        ) : (
                            <Message variant='danger'>
                                Not Paid
                            </Message>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-col gap-2">
                        <h2 className="text-lg font-semibold">Order Items</h2>
                        <OrderItemList
                            items={order.orderItems.map(item => ({...item, productId: item.product}))}
                        />
                    </CardContent>
                </Card>
            </div>

            <div>
                <OrderSummary
                    itemsPrice={order.itemsPrice}
                    shippingPrice={order.shippingPrice}
                    taxPrice={order.taxPrice}
                    totalPrice={order.totalPrice}
                >
                    {!order.isPaid && (
                        <>
                            {loadingPay && <Loader />}

                            {isPending ? (
                                <Loader />
                            ) : (
                                // Own stacking context so PayPal's iframes stay under the sticky header
                                <div className="relative z-0">
                                    {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                                    {/* <Button
                                        className="mb-2.5 w-full"
                                        onClick={onApproveTest}
                                    >
                                        Test Pay Order
                                    </Button> */}

                                    <PayPalButtons
                                        createOrder={createOrder}
                                        onApprove={onApprove}
                                        onError={onError}
                                    ></PayPalButtons>
                                </div>
                            )}
                        </>
                    )}
                    {loadingDeliver && <Loader />}
                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <Button
                            type='button'
                            size="lg"
                            className="w-full"
                            disabled={loadingDeliver}
                            onClick={deliverOrderHandler}
                        >
                            Mark As Delivered
                        </Button>
                    )}
                </OrderSummary>
            </div>
        </div>
    </div>
  )
}
export default OrderScreen
