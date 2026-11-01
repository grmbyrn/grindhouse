import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './slices/apiSlice'
import cartSliceReducer from './slices/cartSlice'
import authSliceReducer from './slices/authSlice'

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
})

export type RootState = ReturnType<typeof rootReducer>

// Tests build a fresh store per test, optionally starting from a given state
export const setupStore = (preloadedState?: Partial<RootState>) =>
    configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
        devTools: true,
    })

const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export default store
