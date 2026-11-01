import { Outlet, Navigate } from 'react-router'
import { useAppSelector } from '../hooks'

const AdminRoute = () => {
    const { userInfo } = useAppSelector((state) => state.auth)

    return userInfo?.isAdmin ? <Outlet /> : <Navigate to='/login' replace />
}
export default AdminRoute
