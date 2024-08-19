import { publicProcedure, router } from '../trpc'
import { AuthCredentialsValidator } from '../../../lib/accountcredvallidator'
import { getPayloadClient } from '../../getpayload'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const authRouter = router({
    createPayloadUser: publicProcedure
        .input(AuthCredentialsValidator)
        .mutation(async ({ input }) => {
            const { email, password } = input
            const payload = await getPayloadClient()

            const { docs: users } = await payload.find({
                collection: 'users',
                where: {
                    email: {
                        equals: email,
                    },
                },
            })

            if (users.length !== 0) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'User already exists',
                })
            }

            await payload.create({
                collection: 'users',
                data: {
                    email,
                    password,
                    role: 'user',
                },
            })

            return { success: true, sentToEmail: email }
        }),
    verify: publicProcedure
        .input(z.object({ token: z.string() }))
        .query(async ({ input }) => {
            const { token } = input
            const payload = await getPayloadClient()
            const isVerified = await payload.verifyEmail({
                collection: 'users',
                token: token,
            })
            if (!isVerified) {
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            }
            return { success: true }
        }),
    login: publicProcedure
        .input(AuthCredentialsValidator)
        .mutation(async ({ input, ctx }) => {
            const { res } = ctx
            const { email, password } = input
            const payload = await getPayloadClient()
            try {
                await payload.login({
                    collection: 'users',
                    data: {
                        email,
                        password,
                    },
                    res,
                })
                return { success: true }
            } catch (err) {
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            }
        }),
})
