'use client'

import { useState } from 'react'
import { updateStoreStatus } from '@/lib/storeService'
import { toast } from 'sonner'
import { Store, Lock, Unlock, Loader2 } from 'lucide-react'

interface StoreStatusToggleProps {
    initialStatus: boolean
    storeId: string
}

export function StoreStatusToggle({ initialStatus, storeId }: StoreStatusToggleProps) {
    const [isOpen, setIsOpen] = useState(initialStatus)
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        const newState = !isOpen
        try {
            await updateStoreStatus(storeId, newState)
            setIsOpen(newState)
            if (newState) {
                toast.success('Loja ABERTA com sucesso! Clientes podem comprar.')
            } else {
                toast.success('Loja FECHADA. Compras bloqueadas.')
            }
        } catch (error) {
            console.error(error)
            toast.error('Erro ao atualizar status da loja.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full shadow-sm transition-colors border ${
            isOpen ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
        }`}>
            <span className={`text-sm font-bold ${isOpen ? 'text-emerald-700' : 'text-red-700'}`}>
                {isOpen ? 'LOJA ABERTA' : 'LOJA FECHADA'}
            </span>

            <button
                onClick={handleToggle}
                disabled={loading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    isOpen ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
            >
                <span
                    className={`${
                        isOpen ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
                />
            </button>
            {loading && <Loader2 className="animate-spin text-gray-400" size={16} />}
        </div>
    )
}
