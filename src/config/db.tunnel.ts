import { createTunnel } from "tunnel-ssh";
import { env } from "./env";

export function shouldStartTunnel() {
	return Boolean(env.PASSWORD && env.DB_ADDRESS && env.DB_PORT);
}

const SSH_options = {
    host: "ssh.pythonanywhere.com",
    port: 22,
    username: env.USERNAME,
    password: env.PASSWORD
}

const tunnelOptions = {
    autoClose: false,
    reconnectOnError: true
}

const serverOptions = {
    host: env.HOST,
    port: 5433
}

const forwardOptions = {
    dstAddr: env.DB_ADDRESS,
    dstPort: env.DB_PORT
}

export async function startTunnel(){
    return await createTunnel(
        tunnelOptions,
        serverOptions,
        SSH_options,
        forwardOptions
    )
}
