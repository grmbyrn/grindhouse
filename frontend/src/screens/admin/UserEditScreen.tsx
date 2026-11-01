import { useState, useEffect, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import FormContainer from "../../components/FormContainer"
import FormField from "../../components/FormField"
import {toast} from 'react-toastify'
import {
    useUpdateUserMutation,
    useGetUserDetailsQuery
} from "../../slices/usersApiSlice"
import { getErrorMessage } from '../../utils/getErrorMessage'

const UserEditScreen = () => {
    const {id: userId} = useParams() as {id: string}

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const {data: user, isLoading, refetch, error} = useGetUserDetailsQuery(userId)

    const [updateUser, {isLoading: loadingUpdate}] = useUpdateUserMutation()

    const navigate = useNavigate()

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            await updateUser({userId, name, email, isAdmin}).unwrap()
            toast.success('User updated successfully')
            refetch()
            navigate('/admin/userlist')
        } catch(error){
            toast.error(getErrorMessage(error))
        }
    }

    useEffect(() => {
        if(user){
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin)
        }
    }, [user])

  return (
    <div>
        <Button asChild variant='ghost' className='mb-4 -ml-2.5'>
            <Link to='/admin/userlist'><ArrowLeft />Go Back</Link>
        </Button>

        <FormContainer>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Edit User</CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingUpdate && <Loader />}

                    {isLoading ? <Loader /> : error ? <Message variant='danger'>
                        {getErrorMessage(error)}
                    </Message> : (
                        <form onSubmit={submitHandler} className="flex flex-col gap-4">
                            <FormField id="name" label="Name">
                                <Input
                                    id="name"
                                    type='text'
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FormField>

                            <FormField id="email" label="Email">
                                <Input
                                    id="email"
                                    type='email'
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormField>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="isAdmin"
                                    checked={isAdmin}
                                    onCheckedChange={(checked) => setIsAdmin(checked === true)}
                                />
                                <Label htmlFor="isAdmin">Is Admin</Label>
                            </div>

                            <Button
                                type='submit'
                                size="lg"
                                className="mt-2 w-full"
                                disabled={loadingUpdate}
                            >
                                Update
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </FormContainer>
    </div>
  )
}
export default UserEditScreen
