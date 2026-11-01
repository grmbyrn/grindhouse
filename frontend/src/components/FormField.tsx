import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

const FormField = ({ id, label, children }: { id: string; label: string; children: ReactNode }) => {
    return (
        <div className='flex flex-col gap-2'>
            <Label htmlFor={id}>{label}</Label>
            {children}
        </div>
    )
}
export default FormField
