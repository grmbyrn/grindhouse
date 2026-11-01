import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import FormContainer from '../components/FormContainer'
import FormField from '../components/FormField'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../hooks'
import { saveShippingAddress } from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = () => {
    const cart = useAppSelector((state) => state.cart)
    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress?.address || '')
    const [city, setCity] = useState(shippingAddress?.city || '')
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '')
    const [country, setCountry] = useState(shippingAddress?.country || '')

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        navigate('/payment')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl font-semibold'>Shipping</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submitHandler} className='flex flex-col gap-4'>
                        <FormField id='address' label='Address'>
                            <Input
                                id='address'
                                type='text'
                                autoComplete='street-address'
                                placeholder='Enter address'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </FormField>
                        <div className='grid gap-4 sm:grid-cols-2'>
                            <FormField id='city' label='City'>
                                <Input
                                    id='city'
                                    type='text'
                                    autoComplete='address-level2'
                                    placeholder='Enter city'
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </FormField>
                            <FormField id='postalCode' label='Postal Code'>
                                <Input
                                    id='postalCode'
                                    type='text'
                                    autoComplete='postal-code'
                                    placeholder='Enter postal code'
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                            </FormField>
                        </div>
                        <FormField id='country' label='Country'>
                            <Input
                                id='country'
                                type='text'
                                autoComplete='country-name'
                                placeholder='Enter country'
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </FormField>
                        <Button type='submit' size='lg' className='mt-2 w-full'>
                            Continue
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </FormContainer>
    )
}
export default ShippingScreen
