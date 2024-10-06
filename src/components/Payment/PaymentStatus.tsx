'use client'

import { trpc } from '@/server/trpc/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface PaymentStatusProps {
    orderEmail: string
    orderId: string
    isPaid: boolean
}

const PaymentStatus = ({
                           orderEmail,
                           orderId,
                           isPaid,
                       }: PaymentStatusProps) => {
    const router = useRouter()

    const { data } = trpc.payment.pollOrderStatus.useQuery(
        { orderId },
        {
            enabled: isPaid === false,
            refetchInterval: (data) =>
                data?.isPaid ? false : 1000,
        }
    )

    useEffect(() => {
        if (data?.isPaid) router.refresh()
    }, [data?.isPaid, router])

    return (
        <div className='mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600 dark:text-gray-200'>
            <div>
                <p className='font-medium text-gray-900 dark:text-gray-100'>
                    Shipping To
                </p>
                <p>{orderEmail}</p>
            </div>

            <div>
                <p className='font-medium text-gray-900 dark:text-gray-100'>
                    Order Status
                </p>
                <p>
                    {isPaid
                        ? 'Payment successful'
                        : 'Pending payment'}
                </p>
            </div>
        </div>
    )
}

export default PaymentStatus
