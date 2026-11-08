
const webhookURL = process.env.DISCORD_WEBHOOK_URL;

const messageID = "YOUR_MESSAGE_ID";

async function updateServerStatus(data) {
  const {
    online = false,
    playerCount = 0,
    maxPlayers = 0,
    ping = 0,
    players = [],
    environment = {}
  } = data;

  const statusEmoji = online ? "`🟢`" : "`🔴`";
  const statusText = online ? "Online" : "Offline";

  const playerList = players.length
    ? players.map(name => `\`${name}\``).join(", ")
    : "`No players online`";

  const timeEmoji = environment.time === "day"
    ? "`☀️`"
    : "`🌙`";

  const weatherEmoji = {
    clear: "`☀️`",
    rain: "`🌧️`",
    thunder: "`⛈️`"
  };

  // Discord relative timestamp
  const lastUpdated = Math.floor(Date.now() / 1000);

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
        value: online ? `\`${ping}ms\`` : "`N/A`",
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

  const response = await fetch(
    `${webhookURL}/messages/${messageID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Webhook update failed: ${response.status} ${await response.text()}`
    );
  }

  return true;
}

module.exports = updateServerStatus;
