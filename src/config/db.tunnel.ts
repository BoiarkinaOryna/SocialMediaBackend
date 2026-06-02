import { createTunnel } from "tunnel-ssh";

const sshOptions = {
    host: "ssh.pythonanywhere.com",
    port: 22,
    username: "WorldITSocialNetwork",
    password: process.env.USER_PASSWORD
}
const tunnelOptions = {
    autoClose: false,
    reconnectOnError: true
}
const serverOptions = {
    host: "127.0.0.1",
    port: 5433
}
const forwardOptions = {
    dstAddr: process.env.DB_ADDRESS,
    dstPort: 15274
}
export async function startTunnel(){
    return await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
}
