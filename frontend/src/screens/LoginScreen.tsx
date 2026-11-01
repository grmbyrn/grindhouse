import { useState, useEffect, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '../hooks'
import FormContainer from "../components/FormContainer"
import FormField from "../components/FormField"
import Loader from "../components/Loader"
import { useLoginMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import {toast} from 'react-toastify'
import { getErrorMessage } from '../utils/getErrorMessage'

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [login, {isLoading}] = useLoginMutation()

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
        try{
            const res = await login({email, password}).unwrap()
            dispatch(setCredentials({...res}))
            navigate(redirect)
        } catch(error){
            toast.error(getErrorMessage(error))
        }
    }

  return (
    <FormContainer>
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Sign In</CardTitle>
                <CardDescription>Welcome back. Sign in to continue.</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={submitHandler} className="flex flex-col gap-4">
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
                            autoComplete="current-password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormField>

                    <Button type='submit' size="lg" className="mt-2 w-full" disabled={isLoading}>
                        Sign In
                    </Button>

                    {isLoading && <Loader />}
                </form>
            </CardContent>

            <CardFooter className="justify-center text-sm text-muted-foreground">
                New Customer?&nbsp;
                <Link
                    to={redirect ? `/register?redirect=${redirect}` : '/register'}
                    className="font-medium text-foreground hover:underline"
                >
                    Register
                </Link>
            </CardFooter>
        </Card>
    </FormContainer>
  )
}
export default LoginScreen
