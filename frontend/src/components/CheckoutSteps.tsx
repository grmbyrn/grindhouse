import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface CheckoutStepsProps {
    step1?: boolean
    step2?: boolean
    step3?: boolean
    step4?: boolean
}

const CheckoutSteps = ({step1, step2, step3, step4}: CheckoutStepsProps) => {
  const steps = [
    { label: 'Sign In', to: '/login', enabled: step1 },
    { label: 'Shipping', to: '/shipping', enabled: step2 },
    { label: 'Payment', to: '/payment', enabled: step3 },
    { label: 'Place Order', to: '/placeorder', enabled: step4 },
  ]
  const current = steps.findLastIndex(s => s.enabled)

  return (
    <nav aria-label='Checkout progress' className='mb-8'>
        <ol className='m-0 flex items-center justify-center gap-2 p-0 text-sm'>
            {steps.map((step, i) => {
                const marker = (
                    <span className={cn(
                        'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
                        i === current && 'border-primary bg-primary text-primary-foreground',
                        i < current && 'border-primary text-foreground',
                    )}>
                        {i + 1}
                    </span>
                )
                return (
                    <li key={step.label} className='flex items-center gap-2'>
                        {i > 0 && <span className={cn('h-px w-4 sm:w-8', i <= current ? 'bg-primary' : 'bg-border')} />}
                        {step.enabled ? (
                            <Link
                                to={step.to}
                                aria-current={i === current ? 'step' : undefined}
                                className='flex items-center gap-2 rounded-md font-medium text-foreground no-underline outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
                            >
                                {marker}
                                <span className='hidden sm:inline'>{step.label}</span>
                            </Link>
                        ) : (
                            <span className='flex items-center gap-2 text-muted-foreground'>
                                {marker}
                                <span className='hidden sm:inline'>{step.label}</span>
                            </span>
                        )}
                    </li>
                )
            })}
        </ol>
    </nav>
  )
}
export default CheckoutSteps
