import { useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '../hooks'
import { toast } from 'react-toastify'
import Rating from '../components/Rating'
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { addToCart } from '../slices/cartSlice'
import Meta from '../components/Meta'
import { getErrorMessage } from '../utils/getErrorMessage'
import { formatDate } from '../utils/formatDate'

const ratingOptions = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

const ProductScreen = () => {
    const { id: productId } = useParams() as { id: string }

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const { data: product, refetch, error } = useGetProductDetailsQuery(productId)

    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation()

    const { userInfo } = useAppSelector((state) => state.auth)

    const addToCartHandler = () => {
        if (!product) return
        dispatch(addToCart({ ...product, qty }))
        navigate('/cart')
    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await createReview({
                productId,
                rating,
                comment,
            }).unwrap()
            refetch()
            toast.success('Review Submitted')
            setRating(0)
            setComment('')
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <div>
            <Button asChild variant='ghost' className='mb-4 -ml-2.5'>
                <Link to='/'>
                    <ArrowLeft />
                    Go Back
                </Link>
            </Button>

            {error ? (
                <Message variant='danger'>{getErrorMessage(error)}</Message>
            ) : !product ? (
                <Loader />
            ) : (
                <>
                    <Meta title={product.name} />
                    <div className='grid gap-8 md:grid-cols-12'>
                        <div className='overflow-hidden rounded-2xl bg-muted md:col-span-5'>
                            <img src={product.image} alt={product.name} className='aspect-square w-full object-cover' />
                        </div>

                        <div className='flex flex-col gap-4 md:col-span-4'>
                            <h1 className='text-2xl font-semibold tracking-tight'>{product.name}</h1>
                            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                            <p className='text-2xl font-semibold'>${product.price}</p>
                            <Separator />
                            <p className='leading-relaxed text-muted-foreground'>{product.description}</p>
                        </div>

                        <div className='md:col-span-3'>
                            <Card>
                                <CardContent className='flex flex-col gap-3 text-sm'>
                                    <div className='flex justify-between'>
                                        <span className='text-muted-foreground'>Price</span>
                                        <span className='font-semibold'>${product.price}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-muted-foreground'>Status</span>
                                        <span
                                            className={
                                                product.countInStock > 0
                                                    ? 'font-semibold text-emerald-700 dark:text-emerald-400'
                                                    : 'font-semibold text-destructive'
                                            }
                                        >
                                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>

                                    {product.countInStock > 0 && (
                                        <div className='flex items-center justify-between'>
                                            <Label htmlFor='qty' className='font-normal text-muted-foreground'>
                                                Qty
                                            </Label>
                                            <Select value={String(qty)} onValueChange={(v) => setQty(Number(v))}>
                                                <SelectTrigger id='qty' className='w-20'>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[...Array(product.countInStock).keys()].map((x) => (
                                                        <SelectItem key={x + 1} value={String(x + 1)}>
                                                            {x + 1}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <Button
                                        size='lg'
                                        className='mt-2 w-full'
                                        type='button'
                                        disabled={product.countInStock === 0}
                                        onClick={addToCartHandler}
                                    >
                                        Add To Cart
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <section className='mt-12 max-w-2xl'>
                        <h2 className='mb-4 text-xl font-semibold tracking-tight'>Reviews</h2>
                        {product.reviews.length === 0 && <Message>No Reviews</Message>}
                        <ul className='divide-y'>
                            {product.reviews.map((review) => (
                                <li key={review._id} className='flex flex-col gap-1.5 py-4'>
                                    <div className='flex items-center justify-between gap-4'>
                                        <strong className='font-medium'>{review.name}</strong>
                                        <span className='text-xs text-muted-foreground'>
                                            {formatDate(review.createdAt)}
                                        </span>
                                    </div>
                                    <Rating value={review.rating} />
                                    <p className='text-sm leading-relaxed'>{review.comment}</p>
                                </li>
                            ))}
                        </ul>

                        <Card className='mt-6'>
                            <CardContent>
                                <h2 className='mb-4 text-lg font-semibold'>Write a Customer Review</h2>

                                {loadingProductReview && <Loader />}

                                {userInfo ? (
                                    <form onSubmit={submitHandler} className='flex flex-col gap-4'>
                                        <div className='flex flex-col gap-2'>
                                            <Label htmlFor='rating'>Rating</Label>
                                            <Select
                                                value={rating ? String(rating) : ''}
                                                onValueChange={(v) => setRating(Number(v))}
                                            >
                                                <SelectTrigger id='rating' className='w-48'>
                                                    <SelectValue placeholder='Select...' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ratingOptions.map((label, i) => (
                                                        <SelectItem key={label} value={String(i + 1)}>
                                                            {i + 1} - {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <Label htmlFor='comment'>Comment</Label>
                                            <Textarea
                                                id='comment'
                                                rows={3}
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        </div>
                                        <Button disabled={loadingProductReview} type='submit' className='self-start'>
                                            Submit
                                        </Button>
                                    </form>
                                ) : (
                                    <Message>
                                        Please <Link to='/login'>sign in</Link> to write a review.
                                    </Message>
                                )}
                            </CardContent>
                        </Card>
                    </section>
                </>
            )}
        </div>
    )
}
export default ProductScreen
