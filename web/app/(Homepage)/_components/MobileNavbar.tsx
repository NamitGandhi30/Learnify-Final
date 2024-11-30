'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { NavItems } from './NavbarItems'

export function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="sm:hidden">
      <button
        type="button"
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        aria-controls="mobile-menu"
        aria-expanded="false"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open main menu</span>
        <Menu className="block h-6 w-6" aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <NavItems />
          </div>
        </div>
      )}
    </div>
  )
}