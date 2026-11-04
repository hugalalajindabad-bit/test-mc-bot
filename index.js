const mineflayer = require('mineflayer')

require("./express.server.js");
const bot = mineflayer.createBot({
  host: 'idken-s-server-64f1bb.play.shulkerboxes.com', // minecraft server ip
  username: 'Bot', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'offline', // for offline mode servers, you can set this to 'offline'
  port: 25565,              // set if you need a port that isn't 25565
  // version: false,           // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
})

const password = 'YOUR_PASSWORD';
let authAttempted = false;

bot.on('message', (message) => {
    const msg = message.toString();

    console.log('[SERVER MESSAGE]', msg);

    if (
        msg.includes('Waiting for your password') &&
        !authAttempted
    ) {
        authAttempted = true;

        console.log('[AUTH] Password prompt detected!');

        if (!password) {
            console.log('[AUTH ERROR] MC_PASSWORD is missing');
            return;
        }

        console.log('[AUTH] Sending password command...');

        bot.chat(`/password ${password}`);
    }
});

bot.on('kicked', (reason, loggedIn) => {
    console.log('[KICKED]', JSON.stringify(reason));
    console.log('[LOGGED IN]', loggedIn);
});

bot.on('error', (err) => {
    console.log('[ERROR]', err.code, err.message);
});

bot.on('end', (reason) => {
    console.log('[DISCONNECTED]', reason);
});

bot.on('spawn', () => {
    console.log('[SPAWN] Bot joined the world');
});

bot._client.on('packet', (data, meta) => {
    if (
        meta.name.includes('disconnect') ||
        meta.name.includes('kick')
    ) {
        console.log('[DISCONNECT PACKET]', meta.name);
        console.dir(data, { depth: null });
    }
});

bot._client.on('close', () => {
    console.log('[SOCKET CLOSED]');
});
