import { Spinner } from '@/components/ui/spinner'

const Loader = () => {
  return (
    <div className='flex justify-center py-8'>
        <Spinner className='size-10 text-muted-foreground' />
    </div>
  )
}
export default Loader
