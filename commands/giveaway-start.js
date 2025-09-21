const ms = require('ms');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'gstart',
  description: 'Start a giveaway: !gstart <duration> <winners> <prize>',
  permissions: ['ManageMessages'],
  async execute(client, message, args) {
    if (args.length < 3) return message.reply('Usage: !gstart <duration> <winners> <prize>');

    const duration = ms(args[0]);
    if (!duration) return message.reply('Invalid duration! Use formats like 1m, 1h, 1d');

    const winnersCount = parseInt(args[1]);
    if (isNaN(winnersCount) || winnersCount < 1) return message.reply('Invalid number of winners.');

    const prize = args.slice(2).join(' ');
    if (!prize) return message.reply('Please specify a prize.');

    // Delete the command message
    await message.delete();

    const embed = new EmbedBuilder()
      .setTitle(`🎉 Giveaway: ${prize}`)
      .setDescription(`React with 🎉 to enter!\n**Duration:** ${args[0]}\n**Winners:** ${winnersCount}`)
      .setFooter({ text: `Giveaway started by ${message.author.tag}` })
      .setTimestamp(Date.now() + duration)
      .setColor('Green');

    const giveawayMessage = await message.channel.send({ embeds: [embed] });
    await giveawayMessage.react('🎉');

    setTimeout(async () => {
      const reaction = giveawayMessage.reactions.cache.get('🎉');
      if (!reaction) return message.channel.send('Giveaway ended: no reactions found.');

      const users = (await reaction.users.fetch()).filter(u => !u.bot).map(u => u.id);
      if (users.length === 0) {
        const cancelledEmbed = EmbedBuilder.from(embed)
          .setColor('Red')
          .setTitle(`❌ Giveaway Cancelled: ${prize}`)
          .setDescription('No valid participants entered the giveaway.')
          .setTimestamp();

        return giveawayMessage.edit({ embeds: [cancelledEmbed] });
      }

      const winners = [];
      for (let i = 0; i < winnersCount && users.length > 0; i++) {
        const index = Math.floor(Math.random() * users.length);
        winners.push(users.splice(index, 1)[0]);
      }

      const winnerMentions = winners.map(id => `<@${id}>`).join(', ');

      const endedEmbed = EmbedBuilder.from(embed)
        .setColor('Blue')
        .setTitle(`🏁 Giveaway Ended: ${prize}`)
        .setDescription(`🎉 Winner${winners.length > 1 ? 's' : ''}: ${winnerMentions}`)
        .setTimestamp();

      await giveawayMessage.edit({ embeds: [endedEmbed] });

      await message.channel.send(`🎉 Congratulations ${winnerMentions}! You won **${prize}**!`);

      // ✅ Ticket instructions message
      await message.channel.send(
        '📩 Create a ticket in <#1357178669281316916> after completing the requirement.'
      );
    }, duration);
  },
};
