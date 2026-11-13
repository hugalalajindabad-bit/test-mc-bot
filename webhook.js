//U1
const axios = require("axios");

const webhookURL = process.env.DISCORD_WEBHOOK_URL;
const messageID = "1568947127172862044";

async function getPeerPings(excludeNode) {
  try {
    const { data } = await axios.get(
      `${webhookURL}/messages/${messageID}`
    );

    const embed = data.embeds?.[0];

    const pingField = embed?.fields?.find(
      field => field.name.includes("Ping")
    );

    if (!pingField) return {};

    const result = {};

    // Example:
    // - Node-A1 : `5ms` [Asia]
    // - Node-U1 : `53ms` [US-East]

    const regex = /Node-([A-Z]\d+)\s*:\s*`(-?\d+(?:\.\d+)?)\s*ms`/g;

    let match;

    while ((match = regex.exec(pingField.value)) !== null) {
      console.log(match)
      console.log("^^^");
      const node = `Node-${match[1]}`;

      if (node === excludeNode) continue;

      result[node] = Number(match[2]);
      console.log("vvv")
      console.log(match);
    }

    console.log(result);
    return result;

  } catch (err) {
    console.error("Peer ping fetch error:", err.message);
    return {};
  }
}


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

  // other server'# ping
  let othersPing = await getPeerPings("Node-U1");
  
  // Embed
  const embed = {
    title: "`⛏️` Majdur Union | Server Status",

    color: online ? 0x00FF00 : 0xFF0000,

    fields: [
      {
        name: "• `📡` Server Status",
        value: `↳ ${statusEmoji} ${statusText} \n\u200B`,
        inline: true
      },
      {
        name: "• `👥` Players",
        value: `↳ \`${playerCount}/${maxPlayers}\` \n\u200B`,
        inline: true
      },
      {
        name: "• `🏓` Ping",
        value: `↳ [<:server:1570687895440724039>] - Node-A1 : \`${othersPing["Node-A1"]} ms\` [Asia]
↳ [<:server:1570687895440724039>] - Node-U1 : \`${online ? `${ping}` : "-1"} ms\` [US-East] \n\u200B`,
        inline: true
      },
      {
        name: "• `🎮` Player List",
        value: "↳ " + playerList + " \n\u200B",
        inline: false
      },
      {
        name: "• `🌍` Environment",
        value: [
          `↳ ${timeEmoji} Time: \`${environment.time || "Unknown"}\``,
          `↳ ${weatherEmoji[environment.weather] || "`❔`"} Weather: \`${environment.weather || "Unknown"}\``
        ].join("\n") + " \n\u200B",
        inline: false
      },
      {
        name: "• `🕒` Last Updated",
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
