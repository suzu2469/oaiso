export class InvalidArgsError extends Error {
    constructor(cause: string | undefined = '') {
        super(`Invalid Args ${cause}`)
    }
}
