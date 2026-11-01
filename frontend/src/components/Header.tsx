import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronDown, LogOut, Menu, ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useAppSelector, useAppDispatch } from '../hooks'
import { useLogoutMutation } from '../slices/usersApiSlice'
import {logout} from '../slices/authSlice'
import SearchBox from './SearchBox'
import ThemeToggle from './ThemeToggle'
import logo from '../assets/logo.png'
import { resetCart } from '../slices/cartSlice'

const adminLinks = [
    { to: '/admin/productlist', label: 'Products' },
    { to: '/admin/userlist', label: 'Users' },
    { to: '/admin/orderlist', label: 'Orders' },
]

const Header = () => {
    const {cartItems} = useAppSelector((state) => state.cart)
    const {userInfo} = useAppSelector((state) => state.auth)
    const [menuOpen, setMenuOpen] = useState(false)

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [logoutApiCall] = useLogoutMutation()

    const cartCount = cartItems.reduce((acc, c) => acc + c.qty, 0)
    const closeMenu = () => setMenuOpen(false)

    const logoutHandler = async () => {
        try{
            await logoutApiCall().unwrap()
            dispatch(logout())
            dispatch(resetCart())
            closeMenu()
            navigate('/login')
        } catch(error){
            console.log(error);
        }
    }

    const cartButton = (
        <Button asChild variant='ghost' className='relative'>
            <Link to='/cart' aria-label={`Cart, ${cartCount} items`}>
                <ShoppingCart />
                <span className='hidden md:inline'>Cart</span>
                {cartCount > 0 && (
                    <span className='absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-brand-foreground md:static md:h-5 md:min-w-5 md:text-xs'>
                        {cartCount}
                    </span>
                )}
            </Link>
        </Button>
    )

  return (
    <header className='sticky top-0 z-40 border-b bg-background/80 backdrop-blur'>
        <div className='mx-auto flex h-16 max-w-6xl items-center gap-4 px-4'>
            <Link to='/' className='flex shrink-0 items-center gap-2 rounded-md font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50'>
                <span className='flex size-8 items-center justify-center rounded-lg bg-neutral-900 dark:ring-1 dark:ring-white/15'>
                    <img src={logo} alt='' className='size-6' />
                </span>
                ProShop
            </Link>

            <div className='ml-auto hidden w-full max-w-xs md:block'>
                <SearchBox />
            </div>

            <nav className='ml-auto flex items-center gap-1 md:ml-0'>
                <ThemeToggle />
                {cartButton}

                <div className='hidden items-center gap-1 md:flex'>
                    {userInfo ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost'>
                                    <User />
                                    {userInfo.name}
                                    <ChevronDown className='text-muted-foreground' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-44'>
                                <DropdownMenuItem asChild>
                                    <Link to='/profile'><User />Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={logoutHandler}>
                                    <LogOut />Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild variant='ghost'>
                            <Link to='/login'><User />Sign In</Link>
                        </Button>
                    )}

                    {userInfo?.isAdmin && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost'>
                                    Admin
                                    <ChevronDown className='text-muted-foreground' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-40'>
                                {adminLinks.map(link => (
                                    <DropdownMenuItem key={link.to} asChild>
                                        <Link to={link.to}>{link.label}</Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant='ghost' size='icon' className='md:hidden' aria-label='Open menu'>
                            <Menu className='size-5' />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side='right' className='gap-0'>
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <div className='flex flex-col gap-1 px-4 pb-4'>
                            <SearchBox onSearch={closeMenu} />
                            <Separator className='my-3' />
                            {userInfo ? (
                                <>
                                    <p className='px-2.5 pb-1 text-xs font-medium text-muted-foreground'>{userInfo.name}</p>
                                    <Button asChild variant='ghost' className='justify-start'>
                                        <Link to='/profile' onClick={closeMenu}><User />Profile</Link>
                                    </Button>
                                    <Button variant='ghost' className='justify-start' onClick={logoutHandler}>
                                        <LogOut />Logout
                                    </Button>
                                </>
                            ) : (
                                <Button asChild variant='ghost' className='justify-start'>
                                    <Link to='/login' onClick={closeMenu}><User />Sign In</Link>
                                </Button>
                            )}
                            {userInfo?.isAdmin && (
                                <>
                                    <Separator className='my-3' />
                                    <p className='px-2.5 pb-1 text-xs font-medium text-muted-foreground'>Admin</p>
                                    {adminLinks.map(link => (
                                        <Button key={link.to} asChild variant='ghost' className='justify-start'>
                                            <Link to={link.to} onClick={closeMenu}>{link.label}</Link>
                                        </Button>
                                    ))}
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    </header>
  )
}
export default Header
