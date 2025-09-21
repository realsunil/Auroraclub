const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Get the avatar URL of a user.',
  permissions: [],
  async execute(client, message, args) {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setColor('#00ffff');

    message.channel.send({ embeds: [embed] });
  },
};
