'use client'

import React from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut, Settings } from 'lucide-react'

export function AdminConfigView() {
    const router = useRouter()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Settings size={24} className="text-gray-400" />
                Configurações
            </h2>

            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-1">Conta</h3>
                    <p className="text-sm text-gray-500 mb-4">Gerencie as configurações da sua conta e sessão.</p>
                    
                    <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                    >
                        <LogOut size={16} />
                        Sair da Conta
                    </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 opacity-60">
                    <h3 className="font-semibold text-gray-700 mb-1">Impressoras</h3>
                    <p className="text-sm text-gray-500">Configuração de impressão térmica (Em breve)</p>
                </div>
            </div>
        </div>
    )
}
