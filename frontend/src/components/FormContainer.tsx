import type { ReactNode } from 'react'

const FormContainer = ({ children }: { children: ReactNode }) => {
    return <div className='mx-auto w-full max-w-md py-4'>{children}</div>
}
export default FormContainer
