import { App } from './app'
import { type IRequest, Router } from 'itty-router'
import { verifyKey } from 'discord-interactions'
import { ScheduledController, EventContext } from '@cloudflare/workers-types'

export interface Env {
    DISCORD_TOKEN: string
    DISCORD_APP_ID: string
    DISCORD_PUBLIC_KEY: string
    DATABASE_HOST: string
    DATABASE_USERNAME: string
    DATABASE_PASSWORD: string
}

const requireAuth = (env: Env, wReq: Request) => async (_: IRequest) => {
    const signature = wReq.headers.get('x-signature-ed25519')
    const timestamp = wReq.headers.get('x-signature-timestamp')
    const body = await wReq.clone().arrayBuffer()

    if (!signature || !timestamp)
        return new Response('Bad request signature', { status: 401 })

    const isValidRequest = verifyKey(
        body,
        signature,
        timestamp,
        env.DISCORD_PUBLIC_KEY,
    )
    if (!isValidRequest) {
        return new Response('Bad request signature', { status: 401 })
    }
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const app = new App(env)
        const router = Router()
        router.get('/', async () => {
            return new Response('ok', { status: 200 })
        })
        router.get('/register-command', async () => {
            return await app.registerCommands()
        })
        router.post('/interactions', requireAuth(env, request), async () => {
            return await app.receiveInteractions(await request.json())
        })

        return router.handle(request).catch(console.error)
    },
    async scheduled(
        event: ScheduledController,
        env: Env,
        ctx: EventContext<any, any, any>,
    ): Promise<void> {
        const app = new App(env)
        ctx.waitUntil(app.sendRemind())
    },
}
