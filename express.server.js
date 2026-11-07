const express = require('express');

module.exports = function startChatServer(bot) {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // In-memory message storage
  const messages = [];
  const MAX_MESSAGES = 300;

  // Store incoming Minecraft messages
  bot.on('message', (message) => {
    const text = message.toString();
    if(text.includes("start Keep Alive Request Received")){
      return;
    }
    const entry = {
      id: Date.now() + Math.random(),
      text,
      time: new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    };

    messages.push(entry);

    // Keep only the latest 300 messages
    if (messages.length > MAX_MESSAGES) {
      messages.shift();
    }

    console.log('[CHAT]', text);
  });

  // Web chat page
  app.get('/chat', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bot Chat</title>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #111318;
  color: #e5e7eb;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.chat-container {
  width: 100%;
  max-width: 850px;
  height: 90vh;
  background: #1b1d24;
  border: 1px solid #30333d;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 18px;
  background: #232630;
  border-bottom: 1px solid #30333d;
}

.header h2 {
  margin: 0;
  font-size: 18px;
}

.status {
  color: #22c55e;
  font-size: 12px;
  margin-top: 5px;
}

#messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message {
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #252832;
  border-radius: 8px;
  word-break: break-word;
}

.time {
  color: #8b91a0;
  font-size: 11px;
  margin-right: 8px;
}

.input-area {
  padding: 12px;
  display: flex;
  gap: 8px;
  background: #232630;
  border-top: 1px solid #30333d;
}

input {
  flex: 1;
  min-width: 0;
  padding: 12px;
  border: 1px solid #393d49;
  border-radius: 8px;
  outline: none;
  background: #15171d;
  color: white;
}

button {
  border: none;
  border-radius: 8px;
  background: #5865f2;
  color: white;
  padding: 0 20px;
  cursor: pointer;
}

button:hover {
  background: #4752c4;
}
.vitals {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.vital {
  flex: 1;
  min-width: 0;
}

.vital-title {
  font-size: 13px;
  margin-bottom: 6px;
}

.vital-bar {
  height: 10px;
  background: #333640;
  border-radius: 5px;
  overflow: hidden;
}

.vital-fill {
  height: 100%;
  width: 0%;
  transition: width 0.3s ease;
}

.health-fill {
  background: #ef4444;
}

.food-fill {
  background: #f59e0b;
}

@media (max-width: 450px) {
  .vitals {
    flex-direction: column;
  }
}

</style>
</head>

<body>

<div class="chat-container">
  <div class="header">
    <h2>🤖 Minecraft Bot Chat</h2>
    <div class="status">● Connected to dashboard</div>
  </div>


<div id="serverStatus" style="
  padding: 14px;
  background: #191b22;
  border-bottom: 1px solid #30333d;
">
  Loading server status...
</div>


  <div id="messages"></div>

  <form class="input-area" id="chatForm">
    <input
      id="messageInput"
      type="text"
      placeholder="Enter message or command..."
      autocomplete="off"
      maxlength="256"
      required
    >
    <button type="submit">Send</button>
  </form>
</div>

<script>
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('messageInput');
const form = document.getElementById('chatForm');

let lastId = null;

async function loadMessages() {
  try {
    const response = await fetch('/api/chat/messages');
    const data = await response.json();

    if (data.length === 0) return;

    // Re-render when message list changes
    const latestId = data[data.length - 1].id;

    if (latestId === lastId && messagesDiv.children.length === data.length) {
      return;
    }

    lastId = latestId;

    messagesDiv.replaceChildren();

    data.forEach(message => {
      const div = document.createElement('div');
      div.className = 'message';

      const time = document.createElement('span');
      time.className = 'time';
      time.textContent = '[' + message.time + ']';

      const text = document.createElement('span');
      text.textContent = message.text;

      div.append(time, text);
      messagesDiv.appendChild(div);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;

  } catch (error) {
    console.error(error);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = input.value.trim();

  if (!message) return;

  input.disabled = true;

  try {
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || 'Failed to send message');
      return;
    }

    input.value = '';
    await loadMessages();

  } catch (error) {
    alert('Could not connect to the server');
  } finally {
    input.disabled = false;
    input.focus();
  }
});

loadMessages();
setInterval(loadMessages, 1000);

/*async function loadStatus() {
  const statusDiv = document.getElementById('serverStatus');

  try {
    const response = await fetch('/api/chat/status');
    const data = await response.json();

    statusDiv.replaceChildren();

    const title = document.createElement('div');
    title.textContent = data.online
      ? '🟢 Server Online'
      : '🔴 Bot Disconnected';

    title.style.fontWeight = 'bold';
    title.style.marginBottom = '8px';

    const info = document.createElement('div');

    info.textContent =
  \`Bot: \${data.username} | Version: \${data.version} | Ping: \${data.ping ?? 'N/A'} ms\`;

    const players = document.createElement('div');

    players.style.marginTop = '8px';

    players.textContent =
      \`Players (\${data.playersOnline}): \` +
      data.players.join(', ');

    statusDiv.append(title, info, players);

  } catch (error) {
    statusDiv.textContent = '🔴 Status unavailable';
  }
}*/


async function loadStatus() {
  const statusDiv = document.getElementById('serverStatus');

  try {
    const response = await fetch('/api/chat/status');
    const data = await response.json();

    statusDiv.replaceChildren();

    // Server status
    const title = document.createElement('div');

    title.textContent = data.online
      ? '🟢 Server Online'
      : '🔴 Bot Disconnected';

    title.style.fontWeight = 'bold';
    title.style.marginBottom = '8px';

    // Bot information
    const info = document.createElement('div');

    info.textContent =
      \`Bot: \${data.username} | Version: \${data.version} | Ping: \${data.ping ?? 'N/A'} ms\`;

    // Health and Hunger
    const vitals = document.createElement('div');
    vitals.className = 'vitals';

    function createVital(label, value, fillClass) {
      const vital = document.createElement('div');
      vital.className = 'vital';

      const vitalTitle = document.createElement('div');
      vitalTitle.className = 'vital-title';

      const currentValue = value ?? 'N/A';

      vitalTitle.textContent = \`\${label}: \${currentValue}/20\`;

      const bar = document.createElement('div');
      bar.className = 'vital-bar';

      const fill = document.createElement('div');
      fill.className = \`vital-fill \${fillClass}\`;

      fill.style.width =
        value !== null && value !== undefined
          ? \`\${Math.max(0, Math.min(100, (value / 20) * 100))}%\`
          : '0%';

      bar.appendChild(fill);
      vital.append(vitalTitle, bar);

      return vital;
    }

    vitals.append(
      createVital('❤️ Health', data.health, 'health-fill'),
      createVital('🍖 Hunger', data.food, 'food-fill')
    );

    // Players
    const players = document.createElement('div');

    players.style.marginTop = '8px';

    players.textContent =
      \`Players (\${data.playersOnline}): \` +
      data.players.join(', ');

    statusDiv.append(title, info, vitals, players);

  } catch (error) {
    statusDiv.textContent = '🔴 Status unavailable';
  }
}

loadStatus();
setInterval(loadStatus, 5000);
    

loadStatus();
setInterval(loadStatus, 5000);
    
</script>

</body>
</html>
    `);
  });

  // Get stored messages
  app.get('/api/chat/messages', (req, res) => {
    res.json(messages);
  });

  // Send message to Minecraft bot
  app.post('/api/chat/send', (req, res) => {
    const message = req.body.message;

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: 'Message cannot be empty'
      });
    }

    if (message.length > 256) {
      return res.status(400).json({
        error: 'Message is too long'
      });
    }

    if (!bot.player) {
      return res.status(503).json({
        error: 'Bot is not connected'
      });
    }

    let finalMsg = message.trim();
    if(finalMsg.startsWith("!")){
      if(finalMsg.startsWith("!pass")){
        bot.chat(`/password ${process.env.mc_pass}`);
        res.json({
      success: true,
      message: 'command sent'
    });
        return;
      }else if(finalMsg.startsWith("!sit true")){
        bot.setControlState('sneak', true);
      }else if(finalMsg.startsWith("!sit false")){
        bot.setControlState('sneak', false);
      }
      res.json({
      success: true,
      message: 'sent'
    });
      return;
    }
    bot.chat(finalMsg);

    res.json({
      success: true,
      message: 'Message sent'
    });
  });


  
app.get('/', (req, res) => {
  if(seend){
    seend();
  };
  res.send('Hello World!');
});

app.get('/health', (req, res) => {
  res.status(200).send('Bot service is running');
});

  
app.get('/api/chat/status', (req, res) => {
  const connected = bot.player !== null && bot.entity !== null;

  // Player names visible to Mineflayer
  const players = Object.keys(bot.players || {});

  res.json({
    online: connected,
    username: bot.username,
    version: bot.version || 'Unknown',

    // Mineflayer connection latency (milliseconds)
    ping: bot._client?.latency ?? null,
    health: bot.health ?? null,
    food: bot.food ?? null,

    // Players visible to the bot
    playersOnline: players.length,
    players: players,

    position: bot.entity
      ? {
          x: Math.round(bot.entity.position.x),
          y: Math.round(bot.entity.position.y),
          z: Math.round(bot.entity.position.z)
        }
      : null,

    dimension: bot.game?.dimension || 'Unknown'
  });
});
  
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chat dashboard running on port ${PORT}`);
  });
};
             
