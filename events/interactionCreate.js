const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  MessageFlags
} = require('discord.js');

// ✅ Replace with your actual log channel ID
const WHITELIST_LOG_CHANNEL_ID = '1383345739404410921';

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // 💬 Handle button click
    if (interaction.isButton()) {
      if (interaction.customId === 'start_whitelist') {
        const modal = new ModalBuilder()
          .setCustomId('whitelist_modal')
          .setTitle('Minecraft Whitelist Request');

        const usernameInput = new TextInputBuilder()
          .setCustomId('mc_username')
          .setLabel('Enter your Minecraft username:')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setPlaceholder('e.g., Dream123');

        const row = new ActionRowBuilder().addComponents(usernameInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
      }
    }

    // 📝 Handle modal submission
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'whitelist_modal') {
        const username = interaction.fields.getTextInputValue('mc_username');

        const logEmbed = new EmbedBuilder()
          .setTitle('✅ Whitelist Request')
          .setDescription(`**User:** ${interaction.user.tag} (<@${interaction.user.id}>)\n**Minecraft Username:** \`${username}\``)
          .setColor('#00FF00')
          .setTimestamp();

        const logChannel = await client.channels.fetch(WHITELIST_LOG_CHANNEL_ID).catch(() => null);
        if (logChannel && logChannel.isTextBased()) {
          await logChannel.send({ embeds: [logEmbed] });
        }

        await interaction.reply({
          content: `✅ Your request to be whitelisted with the username \`${username}\` has been submitted.`,
          flags: MessageFlags.Ephemeral
        });
      }
    }
  }
};
