import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import FormContainer from "../../components/FormContainer"
import FormField from "../../components/FormField"
import {toast} from 'react-toastify'
import {
    useUpdateProductMutation,
    useGetProductDetailsQuery,
    useUploadProductImageMutation
} from "../../slices/productsApiSlice"
import { getErrorMessage } from '../../utils/getErrorMessage'

const ProductEditScreen = () => {
    const {id: productId} = useParams() as {id: string}

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')

    const {data: product, isLoading, error} = useGetProductDetailsQuery(productId)

    const [updateProduct, {isLoading: loadingUpdate}] = useUpdateProductMutation()

    const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation()

    const navigate = useNavigate()

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const updatedProduct = {
            productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }

        const result = await updateProduct(updatedProduct)
        if(result.error){
            toast.error(getErrorMessage(result.error))
        } else {
            toast.success('Product updated')
            navigate('/admin/productlist')
        }
    }

    useEffect(() => {
        if(product){
            setName(product.name)
            setPrice(product.price)
            setImage(product.image)
            setBrand(product.brand)
            setCategory(product.category)
            setCountInStock(product.countInStock)
            setDescription(product.description)
        }
    }, [product])

    const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData()
        const file = e.target.files?.[0]
        if(!file) return
        formData.append('image', file)
        try{
            const res = await uploadProductImage(formData).unwrap()
            toast.success(res.message)
            setImage(res.image)
        } catch(error){
            toast.error(getErrorMessage(error))
        }
    }

  return (
    <div>
        <Button asChild variant='ghost' className='mb-4 -ml-2.5'>
            <Link to='/admin/productlist'><ArrowLeft />Go Back</Link>
        </Button>

        <FormContainer>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Edit Product</CardTitle>
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

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField id="price" label="Price">
                                    <Input
                                        id="price"
                                        type='number'
                                        min={0}
                                        step="0.01"
                                        placeholder="Enter price"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                    />
                                </FormField>

                                <FormField id="countInStock" label="Count In Stock">
                                    <Input
                                        id="countInStock"
                                        type='number'
                                        min={0}
                                        placeholder="Enter count in stock"
                                        value={countInStock}
                                        onChange={(e) => setCountInStock(Number(e.target.value))}
                                    />
                                </FormField>
                            </div>

                            <FormField id="image" label="Image">
                                <div className="flex items-start gap-3">
                                    {image && (
                                        <img src={image} alt="" className="size-16 shrink-0 rounded-md bg-muted object-cover" />
                                    )}
                                    <div className="flex flex-1 flex-col gap-2">
                                        <Input
                                            id="image"
                                            type='text'
                                            placeholder="Enter image url"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                        />
                                        <Input
                                            type='file'
                                            accept="image/*"
                                            aria-label="Upload image"
                                            onChange={uploadFileHandler}
                                        />
                                    </div>
                                </div>
                            </FormField>
                            {loadingUpload && <Loader />}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField id="brand" label="Brand">
                                    <Input
                                        id="brand"
                                        type='text'
                                        placeholder="Enter brand"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                    />
                                </FormField>

                                <FormField id="category" label="Category">
                                    <Input
                                        id="category"
                                        type='text'
                                        placeholder="Enter category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                </FormField>
                            </div>

                            <FormField id="description" label="Description">
                                <Textarea
                                    id="description"
                                    rows={4}
                                    placeholder="Enter description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </FormField>

                            <Button
                                type='submit'
                                size="lg"
                                className="mt-2 w-full"
                                disabled={loadingUpdate || loadingUpload}
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
export default ProductEditScreen
