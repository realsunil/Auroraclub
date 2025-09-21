const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'dmuser',
  description: 'Send a direct message to a user.',
  permissions: ['ManageMessages'],
  async execute(client, message, args) {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) return message.reply('Please mention a user or provide their ID.');

    const dmMessage = args.slice(1).join(' ');
    if (!dmMessage) return message.reply('Please provide a message to send.');

    try {
      await user.send(dmMessage);
      message.channel.send(`✅ Message sent to ${user.tag}.`);

      // DM log channel ID — replace with your real channel ID
      const logChannelId = '1377865584850505758';
      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        const embed = new EmbedBuilder()
          .setTitle('DM Sent')
          .addFields(
            { name: 'User', value: `${user.tag} (${user.id})` },
            { name: 'Sent By', value: `${message.author.tag} (${message.author.id})` },
            { name: 'Message', value: dmMessage.length > 1024 ? dmMessage.slice(0, 1021) + '...' : dmMessage },
          )
          .setColor('Blue')
          .setTimestamp();

        logChannel.send({ embeds: [embed] });
      }

    } catch {
      message.reply("Couldn't send DM to the user. They might have DMs disabled.");
    }
  },
};
