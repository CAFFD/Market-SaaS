'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { getStoreStatus } from '@/lib/storeService'
import { StoreStatusToggle } from '@/components/admin/StoreStatusToggle'
import { AdminOrdersView } from '@/components/admin/AdminOrdersView'
import { AdminProductsView } from '@/components/admin/AdminProductsView'
import { AdminConfigView } from '@/components/admin/AdminConfigView'
import { ClipboardList, Package, Settings, Store } from 'lucide-react'

type Tab = 'orders' | 'products' | 'config'

export default function AdminPage() {
    const [loading, setLoading] = useState(true)
    const [storeStatus, setStoreStatus] = useState<{ isOpen: boolean, storeId: string } | null>(null)
    const [activeTab, setActiveTab] = useState<Tab>('orders')
    const router = useRouter()

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/login')
            return
        }
        loadInitialData()
    }

    const loadInitialData = async () => {
        try {
            const status = await getStoreStatus()
            if (status.storeId) setStoreStatus({ isOpen: status.isOpen, storeId: status.storeId })
        } catch (error) {
            console.error('Erro ao carregar dados iniciais', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500 bg-gray-50">Carregando admin...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                        {/* Title & Brand */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                                <Store size={24} />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 text-xl leading-none">Idun Admin</h1>
                                <span className="text-xs text-gray-400">Gerenciamento</span>
                            </div>
                        </div>

                        {/* Store Status Toggle */}
                        {storeStatus && (
                            <div className="w-full md:w-auto flex justify-center bg-gray-100 md:bg-transparent p-2 md:p-0 rounded-xl">
                                <StoreStatusToggle initialStatus={storeStatus.isOpen} storeId={storeStatus.storeId} />
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex items-center gap-6 mt-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                                activeTab === 'orders' 
                                    ? 'border-emerald-500 text-emerald-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <ClipboardList size={18} />
                            Pedidos
                        </button>
                        <button 
                            onClick={() => setActiveTab('products')}
                            className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                                activeTab === 'products' 
                                    ? 'border-emerald-500 text-emerald-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Package size={18} />
                            Produtos
                        </button>
                        <button 
                            onClick={() => setActiveTab('config')}
                            className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                                activeTab === 'config' 
                                    ? 'border-emerald-500 text-emerald-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Settings size={18} />
                            Config
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                {activeTab === 'orders' && <AdminOrdersView />}
                {activeTab === 'products' && <AdminProductsView />}
                {activeTab === 'config' && <AdminConfigView />}
            </main>
        </div>
    )
}
