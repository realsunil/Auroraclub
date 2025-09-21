const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'greroll',
  description: 'Reroll the winners of a giveaway by message ID.',
  permissions: ['ManageMessages'],
  async execute(client, message, args) {
    const giveawayMessageId = args[0];
    if (!giveawayMessageId) return message.reply('Please provide the message ID of the giveaway.');

    try {
      const giveawayMessage = await message.channel.messages.fetch(giveawayMessageId);
      const reaction = giveawayMessage.reactions.cache.get('🎉');
      if (!reaction) return message.reply('No 🎉 reaction found on the giveaway message.');

      const users = (await reaction.users.fetch()).filter(u => !u.bot).map(u => u.id);
      if (users.length === 0) return message.reply('No valid participants to reroll.');

      // For simplicity, pick one winner (you can extend for multiple winners)
      const winnerId = users[Math.floor(Math.random() * users.length)];

      message.channel.send(`🎉 New winner is <@${winnerId}>! Congratulations!`);
    } catch (error) {
      console.error(error);
      message.reply('Failed to find the giveaway message or reroll winners.');
    }
  },
};
