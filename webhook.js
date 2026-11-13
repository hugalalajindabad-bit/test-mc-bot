
const axios = require("axios");

const webhookURL = process.env.DISCORD_WEBHOOK_URL;
const messageID = "1568947127172862044";

async function updateServerStatus(data) {
  const {
    online = false,
    playerCount = 0,
    maxPlayers = 0,
    ping = 0,
    players = [],
    environment = {}
  } = data;

  // Server status
  const statusEmoji = online ? "`🟢`" : "`🔴`";
  const statusText = online ? "Online" : "Offline";

  // Player list
  const playerList = players.length
    ? players.map(name => `\`${name}\``).join(", ")
    : "`No players online`";

  // Time emoji
  const timeEmoji = environment.time === "day"
    ? "`☀️`"
    : environment.time === "night"
      ? "`🌙`"
      : "`❔`";

  // Weather emojis
  const weatherEmoji = {
    clear: "`☀️`",
    rain: "`🌧️`",
    thunder: "`⛈️`"
  };

  // Last updated timestamp
  const lastUpdated = Math.floor(Date.now() / 1000);

  // Embed
  const embed = {
    title: "`⛏️` Majdur Union | Server Status",

    color: online ? 0x00FF00 : 0xFF0000,

    fields: [
      {
        name: "`📡` Server Status",
        value: `${statusEmoji} ${statusText}`,
        inline: true
      },
      {
        name: "`👥` Players",
        value: `\`${playerCount}/${maxPlayers}\``,
        inline: true
      },
      {
        name: "`🏓` Ping",
        value: `[\`🔴\`] - Node-1 : \`-1 ms\` [Asia]
        [<:server:1570687895440724039>] - Node-2 : \`\${online ? '\`\${ping} ms\`' : "\`N/A\`"} ms\` [US-East]`",
        inline: true
      },
      {
        name: "`🎮` Player List",
        value: playerList,
        inline: false
      },
      {
        name: "`🌍` Environment",
        value: [
          `${timeEmoji} Time: \`${environment.time || "Unknown"}\``,
          `${weatherEmoji[environment.weather] || "`❔`"} Weather: \`${environment.weather || "Unknown"}\``
        ].join("\n"),
        inline: false
      },
      {
        name: "`🕒` Last Updated",
        value: `<t:${lastUpdated}:R>`,
        inline: false
      }
    ],

    footer: {
      text: "Majdur Union • Live Server Monitor"
    }
  };

  try {
    const response = await axios.patch(
      `${webhookURL}/messages/${messageID}`,
      {
        embeds: [embed]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error(
      "Discord Webhook Error:",
      error.response?.data || error.message
    );

    return false;
  }
}

module.exports = updateServerStatus;
