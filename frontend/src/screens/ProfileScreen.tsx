import { Link } from 'react-router-dom'
import { useState, useEffect, type FormEvent } from "react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAppDispatch, useAppSelector } from '../hooks'
import {toast} from 'react-toastify'
import Message from "../components/Message"
import Loader from "../components/Loader"
import FormField from "../components/FormField"
import StatusBadge from "../components/StatusBadge"
import { useProfileMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import {useGetMyOrdersQuery} from '../slices/ordersApiSlice'
import { getErrorMessage } from '../utils/getErrorMessage'
import { formatDate } from '../utils/formatDate'

const ProfileScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useAppDispatch()

    const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation()

    const {data: orders, isLoading, error} = useGetMyOrdersQuery()

    const {userInfo} = useAppSelector((state) => state.auth)

    useEffect(() => {
        if(userInfo){
            setName(userInfo.name)
            setEmail(userInfo.email)
        }
    }, [userInfo])

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(password !== confirmPassword){
            toast.error('Passwords do not match')
        } else {
            try{
                const res = await updateProfile({_id: userInfo!._id, name, email, password}).unwrap()
                dispatch(setCredentials(res))
                toast.success('Profile updated successfully')
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        }
    }

  return (
    <div className="grid gap-8 lg:grid-cols-4">
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">User Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submitHandler} className="flex flex-col gap-4">
                        <FormField id='name' label='Name'>
                            <Input
                                id='name'
                                type='text'
                                autoComplete='name'
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormField>

                        <FormField id='email' label='Email Address'>
                            <Input
                                id='email'
                                type='email'
                                autoComplete='email'
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormField>

                        <FormField id='password' label='Password'>
                            <Input
                                id='password'
                                type='password'
                                autoComplete='new-password'
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormField>

                        <FormField id='confirmPassword' label='Confirm Password'>
                            <Input
                                id='confirmPassword'
                                type='password'
                                autoComplete='new-password'
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </FormField>

                        <Button type='submit' className="mt-2 w-full" disabled={loadingUpdateProfile}>
                            Update
                        </Button>
                        {loadingUpdateProfile && <Loader />}
                    </form>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-3">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">My Orders</h2>
            {error ? (<Message variant='danger'>
                {getErrorMessage(error)}
            </Message>) : !orders ? (
                <Loader />
            ) : orders.length === 0 ? (
                <Message>You haven't placed any orders yet. <Link to='/'>Start shopping</Link></Message>
            ) : (
                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Paid</TableHead>
                                <TableHead>Delivered</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{order._id}</TableCell>
                                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                                    <TableCell className="font-medium">${order.totalPrice.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <StatusBadge done={order.isPaid} date={order.paidAt} pendingLabel='Not paid' />
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge done={order.isDelivered} date={order.deliveredAt} pendingLabel='Not delivered' />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link to={`/order/${order._id}`}>Details</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    </div>
  )
}
export default ProfileScreen
