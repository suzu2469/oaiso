import type { Session } from '@auth0/nextjs-auth0'

export function getDiscordIdFromSession(session: Session): string | null {
    return session.user.discord_id ?? null
}
