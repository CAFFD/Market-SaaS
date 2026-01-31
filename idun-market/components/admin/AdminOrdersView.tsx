'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getOrders, updateOrderStatus } from '@/lib/orderService'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronDown, ChevronUp, Clock, Package, Phone } from 'lucide-react'
import { toast } from 'sonner'

export interface Order {
    id: string
    created_at: string
    customer_name: string
    customer_phone: string
    total_amount: number
    status: string
    items?: any[] // Loaded optionally or assumes fetch returns them
}

const STATUS_FILTERS = [
    { label: 'Pendentes', value: 'pending', countColor: 'bg-yellow-100 text-yellow-800' },
    { label: 'Preparando', value: 'preparing', countColor: 'bg-blue-100 text-blue-800' },
    { label: 'Entrega', value: 'sent', countColor: 'bg-indigo-100 text-indigo-800' }
]

const STATUS_OPTIONS: Record<string, { label: string, color: string }> = {
    'pending': { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    'preparing': { label: 'Preparando', color: 'bg-blue-100 text-blue-800' },
    'sent': { label: 'Enviado', color: 'bg-indigo-100 text-indigo-800' },
    'delivered': { label: 'Entregue', color: 'bg-green-100 text-green-800' },
    'problem': { label: 'Problema', color: 'bg-red-100 text-red-800' },
    'canceled': { label: 'Cancelado', color: 'bg-gray-100 text-gray-800' },
}

export function AdminOrdersView() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState('pending')

    useEffect(() => {
        loadOrders()
        // Optional: Realtime subscription could go here
    }, [])

    const loadOrders = async () => {
        try {
            // Note: Ensure getOrders fetches items too if they are needed for the expanded view
            // If getOrders doesn't return items, we might need a better query or separate fetch
            const data = await getOrders() 
            if (data) setOrders(data)
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error)
            toast.error('Erro ao carregar pedidos')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        // Optimistic UI Update
        const oldOrders = [...orders]
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))

        try {
            await updateOrderStatus(orderId, newStatus)
            toast.success('Status atualizado!')
        } catch (error) {
            console.error('Erro ao atualizar status:', error)
            toast.error('Erro ao atualizar status')
            setOrders(oldOrders) // Revert on error
        }
    }

    const filteredOrders = orders.filter(o => {
        if (activeFilter === 'sent') return ['sent', 'delivered'].includes(o.status)
        return o.status === activeFilter
    })

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto">
                {STATUS_FILTERS.map((filter) => {
                    const count = orders.filter(o => 
                        filter.value === 'sent' ? ['sent', 'delivered'].includes(o.status) : o.status === filter.value
                    ).length

                    return (
                        <button
                            key={filter.value}
                            onClick={() => setActiveFilter(filter.value)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                activeFilter === filter.value 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {filter.label}
                            {count > 0 && (
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter.countColor}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100 border-dashed">
                        <Package className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                        <p>Nenhum pedido nesta categoria.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onStatusChange={handleStatusChange} 
                        />
                    ))
                )}
            </div>
        </div>
    )
}

function OrderCard({ order, onStatusChange }: { order: Order, onStatusChange: (id: string, s: string) => void }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const statusInfo = STATUS_OPTIONS[order.status] || STATUS_OPTIONS['pending']
    
    // Parse order items safely
    const items = order.items || [] 

    // Calculate time elapsed
    const timeElapsed = formatDistanceToNow(new Date(order.created_at), { locale: ptBR, addSuffix: false })
        .replace('cerca de ', '')
    
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            {/* Header / Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: ID, Badge, Name */}
                <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-mono text-gray-400 font-bold">#{order.id.slice(0, 4)}</span>
                             <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${statusInfo.color}`}>
                                {statusInfo.label}
                             </span>
                        </div>
                        <h3 className="font-bold text-gray-900 leading-tight">{order.customer_name}</h3>
                    </div>
                </div>

                {/* Right: Controls & Info */}
                <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 mt-2 md:mt-0 w-full md:w-auto">
                     {/* Time */}
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium" title={new Date(order.created_at).toLocaleString()}>
                        <Clock size={14} />
                        <span>{timeElapsed}</span>
                    </div>

                    {/* Status Dropdown */}
                    <select 
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-1.5 outline-none cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {Object.entries(STATUS_OPTIONS).map(([key, opt]) => (
                            <option key={key} value={key}>{opt.label}</option>
                        ))}
                    </select>

                    {/* Total Price */}
                    <span className="font-bold text-emerald-600 text-sm whitespace-nowrap">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount)}
                    </span>

                    {/* Expand Toggle */}
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {/* Expanded Content: Items */}
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-2 mb-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Itens do Pedido</h4>
                        {items.length > 0 ? (
                            items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-start text-sm">
                                    <div className="flex gap-2">
                                        <span className="font-bold text-gray-900">{item.quantity}x</span>
                                        <span className="text-gray-700">{item.name}</span>
                                    </div>
                                    <span className="text-gray-500 font-medium">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">Detalhes dos itens não disponíveis.</p>
                        )}
                    </div>

                    {/* Actions Footer */}
                    <div className="flex justify-end pt-2">
                         {order.customer_phone && (
                            <button
                                onClick={() => {
                                    const msg = `Olá ${order.customer_name}, referente ao seu pedido #${order.id.slice(0, 4)}...`
                                    window.open(`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
                                }}
                                className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium px-3 py-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                                <Phone size={16} />
                                Contatar Cliente via WhatsApp
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
