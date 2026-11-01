// Mirrors frontend/src/utils/cartUtils.ts so the totals the customer sees match what they're charged
const addDecimals = (num: number) => {
    return Math.round(num * 100) / 100
}

const calcPrices = (orderItems: { price: number; qty: number }[]) => {
    // Calculate items price
    const itemsPrice = addDecimals(orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))

    // Calculate shipping price (If order is over $100 then free, else $10 shipping)
    const shippingPrice = itemsPrice > 100 ? 0 : 10

    // Calculate tax price (15% tax)
    const taxPrice = addDecimals(0.15 * itemsPrice)

    // Calculate total price
    const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice)

    return { itemsPrice, shippingPrice, taxPrice, totalPrice }
}

export default calcPrices
