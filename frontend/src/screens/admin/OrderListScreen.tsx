import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import StatusBadge from "../../components/StatusBadge"
import { useGetOrdersQuery } from "../../slices/ordersApiSlice"
import { getErrorMessage } from '../../utils/getErrorMessage'
import { formatDate } from '../../utils/formatDate'

const OrderListScreen = () => {
  const {data: orders, error} = useGetOrdersQuery()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Orders</h1>
      {error ? (
        <Message variant='danger'>{getErrorMessage(error)}</Message>
      ) : !orders ? (
        <Loader />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{order._id}</TableCell>
                  <TableCell>{order.user && order.user.name}</TableCell>
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
  )
}
export default OrderListScreen
