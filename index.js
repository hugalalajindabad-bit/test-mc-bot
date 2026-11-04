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
/*
setInterval(() => {
    if (!bot.entity) {
        console.log('Bot is not spawned yet!');
        return;
    }

    const pos = bot.entity.position;
    const vel = bot.entity.velocity;

    console.clear();

    console.log('========== BOT STATUS ==========');

    console.log('Username:', bot.username);
    console.log('Online:', bot.player !== null);

    console.log('\n--- Coordinates ---');
    console.log('X:', pos.x.toFixed(2));
    console.log('Y:', pos.y.toFixed(2));
    console.log('Z:', pos.z.toFixed(2));

    console.log('\n--- Player Stats ---');
    console.log('Health:', bot.health);
    console.log('Food:', bot.food);
    console.log('Game Mode:', bot.game.gameMode);

    console.log('\n--- Movement ---');
    console.log('Velocity X:', vel.x.toFixed(2));
    console.log('Velocity Y:', vel.y.toFixed(2));
    console.log('Velocity Z:', vel.z.toFixed(2));

    console.log('\n--- Other ---');
    console.log('Dimension:', bot.game.dimension);
    console.log('On Ground:', bot.entity.onGround);
    console.log('Entity ID:', bot.entity.id);

    console.log('================================');
}, 1000);*/


bot.on('windowOpen', (window) => {
    console.log('========== WINDOW OPEN ==========');

    console.log('Title:', window.title);
    console.log('Type:', window.type);
    console.log('Slots:', window.slots.length);

    window.slots.forEach((item, slot) => {
        if (item) {
            console.log(`Slot ${slot}: ${item.name}`);
        }
    });
});

bot.on('windowClose', (window) => {
    console.log('Window closed:', window.title);
});


bot.on('message', (message) => {
    console.log('[SERVER MESSAGE]', message.toString());
});


bot.on('title', (title, type) => {
    console.log('[TITLE]', type, title.toString());
});

bot.on('kicked', (reason) => {
    console.log('[KICKED]', reason);
});

bot.on('end', (reason) => {
    console.log('[DISCONNECTED]', reason);
});

// Raw incoming packets
bot._client.on('packet', (data, meta) => {
    if (
        meta.name.includes('window') ||
        meta.name.includes('form') ||
        meta.name.includes('plugin')
    ) {
        console.log('[PACKET]', meta.name, data);
    }
});
