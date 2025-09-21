const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'dmall',
  description: 'Send a DM to all members in the server.',
  permissions: ['ManageGuild'],

  async execute(client, message, args) {
    const dmMessage = args.join(' ');
    if (!dmMessage) return message.reply('❌ Please provide a message to send.');

    const logChannelId = '1377865584850505758';
    const logChannel = message.guild.channels.cache.get(logChannelId);

    let sentCount = 0;
    let failedCount = 0;

    // Ensure full member list is cached
    await message.guild.members.fetch();

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (const member of message.guild.members.cache.values()) {
      if (!member.user.bot) {
        try {
          await member.send(dmMessage);
          sentCount++;

          if (logChannel) {
            const successEmbed = new EmbedBuilder()
              .setTitle('✅ DM Sent (dmall)')
              .addFields(
                { name: 'User', value: `${member.user.tag} (${member.user.id})` },
                { name: 'Sent By', value: `${message.author.tag} (${message.author.id})` },
                { name: 'Message', value: dmMessage.length > 1024 ? dmMessage.slice(0, 1021) + '...' : dmMessage }
              )
              .setColor('Green')
              .setTimestamp();

            await logChannel.send({ embeds: [successEmbed] });
          }
        } catch (error) {
          failedCount++;
          console.error(`Failed to DM ${member.user.tag}:`, error);

          if (logChannel) {
            const failEmbed = new EmbedBuilder()
              .setTitle('❌ DM Failed (dmall)')
              .addFields(
                { name: 'User', value: `${member.user.tag} (${member.user.id})` },
                { name: 'Sent By', value: `${message.author.tag} (${message.author.id})` },
                { name: 'Error', value: error.message || 'Unknown error' }
              )
              .setColor('Red')
              .setTimestamp();

            await logChannel.send({ embeds: [failEmbed] });
          }
        }

        // Prevent rate-limit — wait 1 second between DMs
        await delay(1000);
      }
    }

    message.channel.send(`📨 DM process complete.\n✅ Sent: ${sentCount}\n❌ Failed: ${failedCount}`);
  }
};
