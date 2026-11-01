import { Link } from "react-router-dom"

const Footer = () => {
    const currentYear = new Date().getFullYear()
  return (
    <footer className="mt-16 border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
            <p>&copy; {currentYear} ProShop. All rights reserved.</p>
            <p>
                Crafted by{' '}
                <Link
                    to='https://github.com/grmbyrn'
                    target="_blank"
                    className="font-medium text-foreground hover:underline"
                >
                    Graeme Byrne
                </Link>
            </p>
        </div>
    </footer>
  )
}
export default Footer
