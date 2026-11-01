// Read at call time: dotenv.config() runs after imports are evaluated
const paypalApiUrl = () => process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com'

// Get a short-lived access token for PayPal's REST API
const getPayPalAccessToken = async () => {
    const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString('base64')

    const response = await fetch(`${paypalApiUrl()}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })

    if (!response.ok) {
        throw new Error('Failed to get PayPal access token')
    }

    const data = (await response.json()) as { access_token: string }
    return data.access_token
}

interface PayPalOrder {
    status: string
    purchase_units: { amount: { currency_code: string; value: string } }[]
}

// Ask PayPal whether a payment really went through, rather than trusting the browser
const verifyPayPalPayment = async (paypalOrderId: string) => {
    const accessToken = await getPayPalAccessToken()

    const response = await fetch(`${paypalApiUrl()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to verify payment')
    }

    const data = (await response.json()) as PayPalOrder
    return {
        verified: data.status === 'COMPLETED',
        value: data.purchase_units[0]?.amount.value,
        currency: data.purchase_units[0]?.amount.currency_code,
    }
}

export { verifyPayPalPayment }
