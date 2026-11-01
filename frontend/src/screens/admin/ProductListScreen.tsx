import { Pencil, Plus, Trash2 } from "lucide-react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import Paginate from "../../components/Paginate"
import ConfirmDialog from "../../components/ConfirmDialog"
import {toast} from 'react-toastify'
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "../../slices/productsApiSlice"
import { getErrorMessage } from '../../utils/getErrorMessage'

const ProductListScreen = () => {
    const {pageNumber} = useParams()

    const {data, isLoading, error, refetch} = useGetProductsQuery({
        pageNumber
    })

    const [createProduct, {isLoading: loadingCreate }] = useCreateProductMutation()

    const [deleteProduct, {isLoading: loadingDelete}] = useDeleteProductMutation()

    const deleteHandler = async (id: string) => {
        try{
            await deleteProduct(id).unwrap()
            toast.success('Product deleted')
            refetch()
        } catch(error){
            toast.error(getErrorMessage(error))
        }
    }

    const createProductHandler = async () => {
        try{
            await createProduct().unwrap()
            refetch()
        } catch(error){
            toast.error(getErrorMessage(error))
        }
    }

  return (
    <div>
        <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
            <ConfirmDialog
                trigger={
                    <Button disabled={loadingCreate}>
                        <Plus /> Create Product
                    </Button>
                }
                title="Create a new product?"
                description="A sample product is added to the list, ready for you to edit."
                confirmLabel="Create"
                onConfirm={createProductHandler}
            />
        </div>

        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}

        {error ? <Message variant='danger'>{getErrorMessage(error)}</Message> : !data ? <Loader /> : (
            <>
                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{product._id}</TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>${product.price.toFixed(2)}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.brand}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            <Button asChild variant="ghost" size="icon-sm">
                                                <Link to={`/admin/product/${product._id}/edit`} aria-label={`Edit ${product.name}`}>
                                                    <Pencil />
                                                </Link>
                                            </Button>
                                            <ConfirmDialog
                                                trigger={
                                                    <Button variant="destructive" size="icon-sm" aria-label={`Delete ${product.name}`}>
                                                        <Trash2 />
                                                    </Button>
                                                }
                                                title={`Delete ${product.name}?`}
                                                description="This permanently removes the product. It can't be undone."
                                                confirmLabel="Delete"
                                                destructive
                                                onConfirm={() => deleteHandler(product._id)}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Paginate
                    pages={data.pages}
                    page={data.page}
                    isAdmin={true}
                />
            </>
        )}
    </div>
  )
}
export default ProductListScreen
