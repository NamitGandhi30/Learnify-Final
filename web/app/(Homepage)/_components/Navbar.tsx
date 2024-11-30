import Link from 'next/link'
import { NavItems } from './NavbarItems'
import { MobileNavbar } from './MobileNavbar'

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Learnify</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavItems />
            </div>
          </div>
          <MobileNavbar />
        </div>
      </div>
    </nav>
  )
}