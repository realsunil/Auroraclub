const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'gend',
  description: 'End a giveaway early by message ID.',
  permissions: ['ManageMessages'],
  async execute(client, message, args) {
    const giveawayMessageId = args[0];
    if (!giveawayMessageId) return message.reply('Please provide the message ID of the giveaway.');

    try {
      const giveawayMessage = await message.channel.messages.fetch(giveawayMessageId);
      const reaction = giveawayMessage.reactions.cache.get('🎉');
      if (!reaction) return message.reply('No 🎉 reaction found on the giveaway message.');

      const users = (await reaction.users.fetch()).filter(u => !u.bot).map(u => u.id);
      if (users.length === 0) return message.reply('No valid participants.');

      // Pick one winner (extend for multiple winners if you want)
      const winnerId = users[Math.floor(Math.random() * users.length)];

      const embed = new EmbedBuilder()
        .setTitle('🎉 Giveaway Ended')
        .setDescription(`Winner: <@${winnerId}>`)
        .setColor('Green')
        .setTimestamp();

      await giveawayMessage.edit({ embeds: [embed] });
      message.channel.send(`Giveaway ended! Congratulations <@${winnerId}>!`);
    } catch (error) {
      console.error(error);
      message.reply('Failed to end the giveaway.');
    }
  },
};
