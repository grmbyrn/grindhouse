import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Autoplay from 'embla-carousel-autoplay'
import { Button } from '@/components/ui/button'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Message from './Message'
import Rating from './Rating'
import { useGetTopProductsQuery } from '../slices/productsApiSlice'
import { getErrorMessage } from '../utils/getErrorMessage'

// Light, see-through arrows that read on both the photo and the text panel
const arrowClasses = 'size-9 border-border/50 bg-background/80 shadow-sm backdrop-blur hover:bg-background'

const ProductCarousel = () => {
    const { data: products, error } = useGetTopProductsQuery()

    const [api, setApi] = useState<CarouselApi>()
    const [selected, setSelected] = useState(0)

    useEffect(() => {
        if (!api) return
        const onSelect = () => setSelected(api.selectedScrollSnap())
        onSelect()
        api.on('select', onSelect)
        return () => {
            api.off('select', onSelect)
        }
    }, [api])

    return error ? (
        <Message variant='danger'>{getErrorMessage(error)}</Message>
    ) : !products ? null : (
        <Carousel
            setApi={setApi}
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false })]}
            className='mb-10 overflow-hidden rounded-2xl border bg-muted'
        >
            <CarouselContent className='ml-0'>
                {products.map((product) => (
                    <CarouselItem key={product._id} className='pl-0'>
                        {/* Same height at every width. From sm up the photo box is 4:3 at that height
                        (288 × 384, 384 × 512), so it is never cropped; the text panel takes the rest. */}
                        <div className='relative grid h-64 sm:h-72 sm:grid-cols-[1fr_auto] lg:h-96'>
                            <Link
                                to={`/product/${product._id}`}
                                tabIndex={-1}
                                className='absolute inset-0 sm:relative sm:order-2 sm:w-96 lg:w-128'
                            >
                                <img src={product.image} alt={product.name} className='size-full object-cover' />
                            </Link>

                            {/* Phones: caption over the photo */}
                            <Link
                                to={`/product/${product._id}`}
                                className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pt-12 pb-8 text-white sm:hidden'
                            >
                                <h2 className='text-lg font-semibold'>{product.name}</h2>
                                <p className='text-sm text-white/80'>${product.price}</p>
                            </Link>

                            {/* Tablet and up: text panel beside the photo */}
                            <div className='hidden flex-col items-start justify-center gap-3 py-8 pr-8 pl-16 sm:flex lg:pl-20'>
                                <span className='text-xs font-medium tracking-wider text-brand uppercase'>
                                    Top rated
                                </span>
                                <h2 className='line-clamp-2 text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl'>
                                    {product.name}
                                </h2>
                                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                <p className='text-xl font-semibold'>${product.price}</p>
                                <Button asChild size='lg' className='mt-1'>
                                    <Link to={`/product/${product._id}`}>Shop now</Link>
                                </Button>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious className={cn('left-3', arrowClasses)} />
            <CarouselNext className={cn('right-3', arrowClasses)} />

            <div className='absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:right-48 sm:left-auto sm:translate-x-1/2 lg:right-64 rounded-full bg-black/25 px-2 py-1.5 backdrop-blur'>
                {products.map((product, i) => (
                    <button
                        key={product._id}
                        type='button'
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={i === selected}
                        onClick={() => api?.scrollTo(i)}
                        className={cn(
                            'h-1.5 rounded-full transition-all',
                            i === selected ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/90',
                        )}
                    />
                ))}
            </div>
        </Carousel>
    )
}
export default ProductCarousel
