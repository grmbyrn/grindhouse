import { USERS_URL } from '../constants'
import { apiSlice } from './apiSlice'
import type { User, UserInfo } from '../types'

export interface UpdateUserRequest {
    userId: string
    name: string
    email: string
    isAdmin: boolean
}

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<UserInfo, { email: string; password: string }>({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation<UserInfo, { name: string; email: string; password: string }>({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        profile: builder.mutation<UserInfo, { _id: string; name: string; email: string; password: string }>({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),
        getUsers: builder.query<User[], void>({
            query: () => ({
                url: USERS_URL,
            }),
            providesTags: ['Users'],
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation<{ message: string }, string>({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE',
            }),
        }),
        getUserDetails: builder.query<User, string>({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
            }),
            keepUnusedDataFor: 5,
        }),
        updateUser: builder.mutation<UserInfo, UpdateUserRequest>({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} = usersApiSlice
