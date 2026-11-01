import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import Rating from './Rating'
import type { Product as ProductType } from '../types'

const Product = ({product}: {product: ProductType}) => {
  return (
    <Card className='group h-full gap-0 py-0 transition-shadow hover:shadow-md'>
        <Link to={`/product/${product._id}`} className='block overflow-hidden bg-muted'>
            <img
                src={product.image}
                alt={product.name}
                className='aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
        </Link>

        <CardContent className='flex flex-1 flex-col gap-2 py-4'>
            <Link
                to={`/product/${product._id}`}
                className='line-clamp-2 min-h-10 font-medium text-foreground hover:underline'
            >
                {product.name}
            </Link>

            <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
            />

            <p className='mt-auto pt-1 text-lg font-semibold'>
                ${product.price}
            </p>
        </CardContent>
    </Card>
  )
}
export default Product
