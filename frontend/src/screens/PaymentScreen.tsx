import { useState, useEffect, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../slices/cartSlice'

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const cart = useAppSelector((state) => state.cart)
    const { shippingAddress } = cart

    // An empty cart has shippingAddress {}, so check for an actual address
    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping')
        }
    }, [shippingAddress.address, navigate])

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl font-semibold'>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submitHandler} className='flex flex-col gap-4'>
                        <fieldset className='flex flex-col gap-3'>
                            <legend className='mb-3 text-sm text-muted-foreground'>Select Method</legend>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                <Label
                                    htmlFor='paypal'
                                    className='flex cursor-pointer items-center gap-3 rounded-lg border p-4 font-normal has-data-[state=checked]:border-primary'
                                >
                                    <RadioGroupItem id='paypal' value='PayPal' />
                                    PayPal or Credit Card
                                </Label>
                            </RadioGroup>
                        </fieldset>
                        <Button type='submit' size='lg' className='mt-2 w-full'>
                            Continue
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </FormContainer>
    )
}
export default PaymentScreen
