// commands/members.js
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "members",
  description: "Show member stats of the server",
  async execute(client, message) {
    if (!message.guild) return message.reply("This command can only be used in servers.");

    const totalMembers = message.guild.memberCount;
    const onlineMembers = message.guild.members.cache.filter(
      (m) => m.presence?.status === "online" || m.presence?.status === "dnd" || m.presence?.status === "idle"
    ).size;
    const offlineMembers = totalMembers - onlineMembers;

    const embed = new EmbedBuilder()
      .setTitle(`Members in ${message.guild.name}`)
      .addFields(
        { name: "Total Members", value: `${totalMembers}`, inline: true },
      )
      .setColor("Green")
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
