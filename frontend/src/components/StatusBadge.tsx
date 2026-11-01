import { Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '../utils/formatDate'

// Green badge with the date when done (paid, delivered...), red badge with `pendingLabel` otherwise
const StatusBadge = ({done, date, pendingLabel}: {done: boolean, date?: string, pendingLabel: string}) => {
  return done ? (
    <Badge variant='secondary' className='bg-emerald-600/10 text-emerald-700 dark:text-emerald-400'>
        <Check />{formatDate(date)}
    </Badge>
  ) : (
    <Badge variant='destructive'>
        <X />{pendingLabel}
    </Badge>
  )
}
export default StatusBadge
