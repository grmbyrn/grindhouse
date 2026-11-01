import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import { getErrorMessage } from '../utils/getErrorMessage'

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams()

    const { data, error } = useGetProductsQuery({
        keyword,
        pageNumber,
    })

    return (
        <div>
            {!keyword ? (
                <ProductCarousel />
            ) : (
                <Button asChild variant='ghost' className='mb-4 -ml-2.5'>
                    <Link to='/'>
                        <ArrowLeft />
                        Go Back
                    </Link>
                </Button>
            )}
            {error ? (
                <Message variant='danger'>{getErrorMessage(error)}</Message>
            ) : !data ? (
                <Loader />
            ) : (
                <>
                    <h1 className='mb-6 text-2xl font-semibold tracking-tight'>
                        {keyword ? `Results for “${keyword}”` : 'Latest Products'}
                    </h1>
                    {data.products.length === 0 && <Message>No products found.</Message>}
                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {data.products.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>
                    <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
                </>
            )}
        </div>
    )
}
export default HomeScreen
