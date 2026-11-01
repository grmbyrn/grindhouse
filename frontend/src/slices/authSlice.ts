import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserInfo } from '../types'

interface AuthState {
    userInfo: UserInfo | null
}

const storedUserInfo = localStorage.getItem('userInfo')

const initialState: AuthState = {
    userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        logout: (state) => {
            state.userInfo = null
            localStorage.clear()
        },
    },
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
