import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type Price = number | string

interface OrderSummaryProps {
    itemsPrice: Price
    shippingPrice: Price
    taxPrice: Price
    totalPrice: Price
    // Actions shown under the totals (place order, PayPal, mark delivered...)
    children?: ReactNode
}

const formatPrice = (value: Price) => `$${Number(value).toFixed(2)}`

const OrderSummary = ({itemsPrice, shippingPrice, taxPrice, totalPrice, children}: OrderSummaryProps) => {
  const rows = [
    ['Items', itemsPrice],
    ['Shipping', shippingPrice],
    ['Tax', taxPrice],
  ] as const

  return (
    <Card className='lg:sticky lg:top-24'>
        <CardContent className='flex flex-col gap-3 text-sm'>
            <h2 className='text-lg font-semibold'>Order Summary</h2>
            {rows.map(([label, value]) => (
                <div key={label} className='flex justify-between'>
                    <span className='text-muted-foreground'>{label}</span>
                    <span>{formatPrice(value)}</span>
                </div>
            ))}
            <Separator />
            <div className='flex justify-between text-base font-semibold'>
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
            </div>
            {children && <div className='mt-2 flex flex-col gap-3'>{children}</div>}
        </CardContent>
    </Card>
  )
}
export default OrderSummary
