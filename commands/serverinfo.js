const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: 'Display info about the server.',
  permissions: [],
  async execute(client, message) {
    const guild = message.guild;

    const embed = new EmbedBuilder()
      .setTitle(`Server Info: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'ID', value: guild.id, inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Boost Level', value: `${guild.premiumTier}`, inline: true }
      )
      .setColor('#3498db')
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
