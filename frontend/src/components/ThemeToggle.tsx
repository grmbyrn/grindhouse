import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTheme, type Theme } from './ThemeProvider'

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
]

const ThemeToggle = () => {
    const { theme, resolvedTheme, setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' aria-label='Change theme'>
                    {resolvedTheme === 'dark' ? <Moon /> : <Sun />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-36'>
                {options.map(({ value, label, icon: Icon }) => (
                    <DropdownMenuItem key={value} onSelect={() => setTheme(value)}>
                        <Icon />
                        {label}
                        {theme === value && <Check className='ml-auto' />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default ThemeToggle
