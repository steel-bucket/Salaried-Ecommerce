import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useAuth = () => {
    const router = useRouter()
    const signOut = async () => {
        try {
            const res = await fetch(
                `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/users/logout`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            if (!res.ok) {
                throw new Error('Failed to sign out')
            }
            toast.success('Signed out successfully')
            router.push('/')
            router.refresh()
        } catch {
            toast.error('Failed to sign out')
        }
    }
    return { signOut }
}
