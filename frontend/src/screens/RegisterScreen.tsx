import { useState, useEffect, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '../hooks'
import FormContainer from "../components/FormContainer"
import FormField from "../components/FormField"
import Loader from "../components/Loader"
import { useRegisterMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import {toast} from 'react-toastify'
import { getErrorMessage } from '../utils/getErrorMessage'

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [register, {isLoading}] = useRegisterMutation()

    const {userInfo} = useAppSelector((state) => state.auth)

    const {search} = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if(userInfo){
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(password !== confirmPassword){
            toast.error('Passwords do not match')
        } else {
            try{
                const res = await register({name, email, password}).unwrap()
                dispatch(setCredentials({...res}))
                navigate(redirect)
            } catch(error){
                toast.error(getErrorMessage(error))
            }
        }
    }

  return (
    <FormContainer>
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Create an account</CardTitle>
                <CardDescription>Sign up to start shopping.</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={submitHandler} className="flex flex-col gap-4">
                    <FormField id="name" label="Name">
                        <Input
                            id="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormField>

                    <FormField id="email" label="Email Address">
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormField>

                    <FormField id="password" label="Password">
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormField>

                    <FormField id="confirmPassword" label="Confirm Password">
                        <Input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </FormField>

                    <Button type='submit' size="lg" className="mt-2 w-full" disabled={isLoading}>
                        Register
                    </Button>

                    {isLoading && <Loader />}
                </form>
            </CardContent>

            <CardFooter className="justify-center text-sm text-muted-foreground">
                Already have an account?&nbsp;
                <Link
                    to={redirect ? `/login?redirect=${redirect}` : '/login'}
                    className="font-medium text-foreground hover:underline"
                >
                    Login
                </Link>
            </CardFooter>
        </Card>
    </FormContainer>
  )
}
export default RegisterScreen
