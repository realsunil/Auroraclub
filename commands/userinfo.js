const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Display info about a user.',
  permissions: [],
  async execute(client, message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    const embed = new EmbedBuilder()
      .setTitle(`User Info: ${member.user.tag}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'ID', value: member.id, inline: true },
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Roles', value: member.roles.cache.map(r => r.name).join(', '), inline: false }
      )
      .setColor('#00ff00')
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
