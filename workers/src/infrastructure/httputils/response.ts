export class JsonResponse extends Response {
    constructor(body: any, init?: ResponseInit) {
        super(
            JSON.stringify(body),
            init ?? {
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                },
            },
        )
    }
}
