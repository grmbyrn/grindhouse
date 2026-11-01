import { Link } from 'react-router-dom'

interface OrderItemListProps {
    items: {
        productId: string
        name: string
        image: string
        qty: number
        price: number
    }[]
}

const OrderItemList = ({items}: OrderItemListProps) => {
  return (
    <ul className='divide-y'>
        {items.map((item, index) => (
            <li key={index} className='flex items-center gap-4 py-3'>
                <img src={item.image} alt={item.name} className='size-12 shrink-0 rounded-md bg-muted object-cover' />
                <Link to={`/product/${item.productId}`} className='line-clamp-2 flex-1 text-sm font-medium hover:underline'>
                    {item.name}
                </Link>
                <span className='shrink-0 text-right text-sm text-muted-foreground'>
                    {item.qty} × ${item.price}
                    <span className='block font-semibold text-foreground'>${(item.qty * item.price).toFixed(2)}</span>
                </span>
            </li>
        ))}
    </ul>
  )
}
export default OrderItemList
