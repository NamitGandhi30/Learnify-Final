'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navRoutes } from './NavbarRoutes'

export function NavItems() {
  const pathname = usePathname()

  return (
    <>
      {navRoutes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
            pathname === route.href
              ? 'border-indigo-500 text-gray-900'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          {route.label}
        </Link>
      ))}
    </>
  )
}