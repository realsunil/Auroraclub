const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  name: 'whitelistpanel',
  description: 'Sends the whitelist panel with start button.',
  permissions: ['Administrator'],
  async execute(client, message) {
    const embed = new EmbedBuilder()
      .setTitle('🧾 Whitelist Panel')
      .setDescription(
        `Click the button below to enter your Minecraft username and request to be whitelisted on our SMP server!\n\n` +
        `✅ **Rules to Follow:**\n` +
        `• No griefing or stealing\n` +
        `• No hacking or cheating\n` +
        `• Respect all players\n` +
        `• Use common sense and have fun!\n\n` +
        `⚠️ **Ensure your Minecraft username is correct.**`
      )
      .setColor('#00FF00');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('start_whitelist')
        .setLabel('Start Whitelisting')
        .setStyle(ButtonStyle.Success)
    );

    try {
      await message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error('Failed to send whitelist panel:', error);
      message.reply('❌ I was unable to send the whitelist panel. Check my permissions!');
    }
  }
};
