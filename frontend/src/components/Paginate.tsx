import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

interface PaginateProps {
    pages: number
    page: number
    isAdmin?: boolean
    keyword?: string
}

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }: PaginateProps) => {
    return (
        pages > 1 && (
            <nav aria-label='Pagination' className='mt-8 flex flex-wrap justify-center gap-1'>
                {[...Array(pages).keys()].map((x) => (
                    <Button key={x + 1} asChild size='icon' variant={x + 1 === page ? 'default' : 'ghost'}>
                        <Link
                            to={
                                !isAdmin
                                    ? keyword
                                        ? `/search/${keyword}/page/${x + 1}`
                                        : `/page/${x + 1}`
                                    : `/admin/productlist/${x + 1}`
                            }
                            aria-current={x + 1 === page ? 'page' : undefined}
                        >
                            {x + 1}
                        </Link>
                    </Button>
                ))}
            </nav>
        )
    )
}
export default Paginate
