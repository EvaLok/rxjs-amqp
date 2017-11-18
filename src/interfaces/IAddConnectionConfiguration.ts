export interface IAddConnectionConfiguration {
    protocol: string,
    hostname: string,
    port ?: number,
    username ?: string,
    password ?: string,
    locale ?: string,
    frameMax ?: number,
    heartbeat ?: number,
    vhost ?: string,
}
