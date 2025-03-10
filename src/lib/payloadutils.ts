import { NextRequest } from 'next/server'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { User } from '@/config/payload-types'

export const getServerSideUser = async (
    cookies: NextRequest['cookies'] | ReadonlyRequestCookies
) => {
    const token = cookies.get('payload-token')?.value

    const meRes = await fetch(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/users/me`,
        {
            headers: {
                Authorization: `JWT ${token}`,
            },
        }
    )
    const { user } = (await meRes.json()) as { user: User | null }

    return { user }
}
