'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Definição dos links de navegação
    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Desktop Sidebar (Fixo na esquerda) */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 h-screen">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-emerald-700">Idun Admin</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                         const isActive = pathname === item.href
                         return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isActive 
                                        ? 'bg-emerald-50 text-emerald-700' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                         )
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                    &copy; Project Idun
                </div>
            </aside>

            {/* Mobile Header (Apenas mobile) */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
                <span className="font-bold text-emerald-700 text-lg">Idun Admin</span>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown (Overlay) */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-20 bg-gray-900/50" onClick={() => setIsMobileMenuOpen(false)}>
                    <div 
                        className="absolute top-[60px] left-0 right-0 bg-white border-b border-gray-200 p-4 space-y-2 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {navItems.map((item) => {
                             const isActive = pathname === item.href
                             return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                                        isActive
                                            ? 'bg-emerald-50 text-emerald-700' 
                                            : 'text-gray-600'
                                    }`}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    )
}
