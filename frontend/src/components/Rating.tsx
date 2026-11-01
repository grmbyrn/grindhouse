import { Star } from 'lucide-react'

const Rating = ({ value, text }: { value: number; text?: string }) => {
    return (
        <div className='flex items-center gap-1.5'>
            <div className='flex' role='img' aria-label={`Rated ${value} out of 5`}>
                {[0, 1, 2, 3, 4].map((i) => {
                    // Fill each star fully, half or not at all, rounding to the nearest half
                    const fill = Math.min(Math.max(Math.round((value - i) * 2) / 2, 0), 1)
                    return (
                        <span key={i} className='relative size-4'>
                            <Star className='size-4 text-rating' aria-hidden />
                            <span className='absolute inset-0 overflow-hidden' style={{ width: `${fill * 100}%` }}>
                                <Star className='size-4 fill-rating text-rating' aria-hidden />
                            </span>
                        </span>
                    )
                })}
            </div>
            {text && <span className='text-xs font-medium text-muted-foreground'>{text}</span>}
        </div>
    )
}
export default Rating
