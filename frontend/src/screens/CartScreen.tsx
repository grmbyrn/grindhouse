import { Link, useNavigate } from 'react-router'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '../hooks'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../slices/cartSlice'
import type { CartItem } from '../types'

const CartScreen = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const cart = useAppSelector((state) => state.cart)
    const { cartItems } = cart

    const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0)
    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)

    const addToCartHandler = async (product: CartItem, qty: number) => {
        dispatch(addToCart({ ...product, qty }))
    }

    const removeFromCartHandler = async (id: string) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping')
    }

    return (
        <div className='grid gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-2'>
                <h1 className='mb-6 text-2xl font-semibold tracking-tight'>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message>
                        Your cart is empty. <Link to='/'>Go Back</Link>
                    </Message>
                ) : (
                    <ul className='divide-y border-y'>
                        {cartItems.map((item) => (
                            <li key={item._id} className='flex items-center gap-4 py-4'>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className='size-20 shrink-0 rounded-lg bg-muted object-cover'
                                />
                                <div className='flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4'>
                                    <Link
                                        to={`/product/${item._id}`}
                                        className='line-clamp-2 flex-1 font-medium hover:underline'
                                    >
                                        {item.name}
                                    </Link>
                                    <span className='text-sm font-semibold sm:w-20 sm:text-right'>${item.price}</span>
                                </div>
                                <Select
                                    value={String(item.qty)}
                                    onValueChange={(v) => addToCartHandler(item, Number(v))}
                                >
                                    <SelectTrigger className='w-18' aria-label={`Quantity of ${item.name}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <SelectItem key={x + 1} value={String(x + 1)}>
                                                {x + 1}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    aria-label={`Remove ${item.name}`}
                                    onClick={() => removeFromCartHandler(item._id)}
                                >
                                    <Trash2 />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div>
                <Card className='lg:sticky lg:top-24'>
                    <CardContent className='flex flex-col gap-4'>
                        <h2 className='text-lg font-semibold'>Order Summary</h2>
                        <div className='flex justify-between text-sm'>
                            <span className='text-muted-foreground'>
                                Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                            </span>
                            <span className='font-semibold'>${subtotal}</span>
                        </div>
                        <Separator />
                        <Button
                            type='button'
                            size='lg'
                            className='w-full'
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed To Checkout
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
export default CartScreen
