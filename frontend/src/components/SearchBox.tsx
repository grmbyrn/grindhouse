import { useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const SearchBox = ({ onSearch }: { onSearch?: () => void }) => {
    const navigate = useNavigate()
    const { keyword: urlKeyword } = useParams()
    const [keyword, setKeyword] = useState(urlKeyword || '')

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (keyword.trim()) {
            setKeyword('')
            navigate(`/search/${keyword}`)
        } else {
            navigate('/')
        }
        onSearch?.()
    }

    return (
        <search className='block w-full'>
            <form onSubmit={submitHandler} className='relative w-full'>
                <Search className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                    type='search'
                    name='q'
                    aria-label='Search products'
                    onChange={(e) => setKeyword(e.target.value)}
                    value={keyword}
                    placeholder='Search products...'
                    className='pl-8'
                />
            </form>
        </search>
    )
}
export default SearchBox
