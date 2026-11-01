import { Link } from 'react-router-dom'
import { Check, Pencil, Trash2, X } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import ConfirmDialog from "../../components/ConfirmDialog"
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice'
import {toast} from 'react-toastify'
import { getErrorMessage } from '../../utils/getErrorMessage'

const UserListScreen = () => {
  const {data: users, refetch, isLoading, error} = useGetUsersQuery()

  const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation()

  const deleteHandler = async (id: string) => {
    try{
        await deleteUser(id).unwrap()
        toast.success('User deleted')
        refetch()
    } catch(error){
        toast.error(getErrorMessage(error))
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Users</h1>
      {loadingDelete && <Loader />}
      {error ? (
        <Message variant='danger'>{getErrorMessage(error)}</Message>
      ) : !users ? (
        <Loader />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{user._id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${user.email}`} className="text-brand hover:underline">{user.email}</a>
                  </TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Check className="size-4 text-emerald-600" aria-label="Yes" />
                    ) : (
                      <X className="size-4 text-destructive" aria-label="No" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link to={`/admin/user/${user._id}/edit`} aria-label={`Edit ${user.name}`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="destructive" size="icon-sm" aria-label={`Delete ${user.name}`}>
                            <Trash2 />
                          </Button>
                        }
                        title={`Delete ${user.name}?`}
                        description="This permanently removes the user account. It can't be undone."
                        confirmLabel="Delete"
                        destructive
                        onConfirm={() => deleteHandler(user._id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
export default UserListScreen
