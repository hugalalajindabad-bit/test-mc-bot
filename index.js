const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'majdurunion.play.shulkerboxes.com', // minecraft server ip
  username: 'bowt_0', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'offline', // for offline mode servers, you can set this to 'offline'
  port: 25565,              // set if you need a port that isn't 25565
  // version: false,           // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
})

require("./express.server.js")(bot);

const password = process.env.password || "03859492&jrir";
let authAttempted = false;
let lastAttempted = Date.now();
setTimeout(() => {
  authAttempted = true;
}, 1000*15);
function seend() {
  if(authAttempted){
    if(lastAttempted + 15000 < Date.now()){
    bot.chat(`/start Keep Alive Request Received!`);
    console.log("sent 0");
      lastAttempted = Date.now();
    }
  };
};

global.seend = seend;

/*bot.on('message', (message) => {
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
});*/

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
bot.once('spawn', () => {
    console.log('Bot spawned');
    console.log('Minecraft version:', bot.version);
    console.log('Protocol version:', bot._client.version);
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



bot.on('chat', (username, message) => {
  console.log(username);
  console.log(message);
  // Only allow your username
  //if (username.toLowerCase() !== 'sujoy8534') return;

  // Check command
 /* if (message.toLowerCase() === '!ping') {
    bot.chat('pong');
  }*/
});

const updateServerStatus = require("./webhook");

updateServerStatus({
  online: true,
  playerCount: 2,
  maxPlayers: 20,
  ping: 4,

  players: [
    "Steve",
    "Alex"
  ],

  environment: {
    time: "night",
    weather: "rain"
  }
});
