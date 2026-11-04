const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'idken-s-server-64f1bb.play.shulkerboxes.com', // minecraft server ip
  username: 'Bot', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'offline', // for offline mode servers, you can set this to 'offline'
  port: 25565,              // set if you need a port that isn't 25565
  // version: false,           // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
})

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  bot.chat(message)
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
/*bot.once('spawn', () => {
  console.log("Bowt spawned");
  mineflayerViewer(bot, { port: 25565, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
})*/
bot.on('windowOpen', (window) => {
    console.log('GUI Title:', window.title);

    window.slots.forEach((item, slot) => {
        if (item) {
            console.log(
                `Slot ${slot}: ${item.name}`,
                item.customName
            );
        }
    });
});

bot.once('spawn', () => {
  console.log("849494");
    bot.chat('/register YOUR_PASSWORD YOUR_PASSWORD');
});
