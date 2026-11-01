import { PRODUCTS_URL, UPLOAD_URL } from '../constants'
import { apiSlice } from './apiSlice'
import type { PaginatedProducts, Product } from '../types'

export interface UpdateProductRequest {
    productId: string
    name: string
    price: number
    image: string
    brand: string
    category: string
    countInStock: number
    description: string
}

export interface CreateReviewRequest {
    productId: string
    rating: number
    comment: string
}

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<PaginatedProducts, { keyword?: string; pageNumber?: string }>({
            query: ({ keyword, pageNumber }) => ({
                url: PRODUCTS_URL,
                params: {
                    keyword,
                    pageNumber,
                },
            }),
            providesTags: ['Products'],
            keepUnusedDataFor: 5,
        }),
        getProductDetails: builder.query<Product, string>({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation<Product, void>({
            query: () => ({
                url: `${PRODUCTS_URL}`,
                method: 'POST',
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation<Product, UpdateProductRequest>({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        uploadProductImage: builder.mutation<{ message: string; image: string }, FormData>({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        deleteProduct: builder.mutation<{ message: string }, string>({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }),
        }),
        createReview: builder.mutation<{ message: string }, CreateReviewRequest>({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        getTopProducts: builder.query<Product[], void>({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
} = productsApiSlice
