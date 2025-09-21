// commands/invite.js
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Get the invite link for the bot",
  async execute(client, message) {
    const permissions = 8; // Administrator permission for example (change if needed)
    const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
      .setTitle("Invite Me!")
      .setDescription(`[Click here to invite the bot to your server](${inviteURL})`)
      .setColor("Blue")
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
