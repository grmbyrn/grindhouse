import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

type Variant = 'info' | 'success' | 'danger'

const styles: Record<Variant, string> = {
    info: 'border-brand/20 bg-brand/5 text-brand',
    success: 'border-emerald-600/20 bg-emerald-600/5 text-emerald-700 dark:text-emerald-400',
    danger: 'border-destructive/20 bg-destructive/5 text-destructive',
}

const icons: Record<Variant, typeof Info> = {
    info: Info,
    success: CircleCheck,
    danger: CircleAlert,
}

const Message = ({ variant = 'info', children }: { variant?: Variant; children: ReactNode }) => {
    const Icon = icons[variant]
    return (
        <Alert className={cn('my-3', styles[variant])}>
            <Icon />
            <AlertDescription className='text-current/90'>{children}</AlertDescription>
        </Alert>
    )
}

export default Message
