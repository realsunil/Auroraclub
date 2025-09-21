// commands/ticketpanel.js
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  name: "ticketpanel",
  permissions: [PermissionsBitField.Flags.ManageMessages],
  async execute(client, message) {
    const embed = new EmbedBuilder()
      .setTitle("🎫 AURORA CLUB TICKET SUPPORT")
      .setDescription("Need help? Click the button below to create a support ticket.\n\nCreated by: Aurora Club Bot")
      .setColor("#5865F2")
      .setFooter({ text: "Aurora Club Support" })
      .setTimestamp();

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("create_ticket")
        .setLabel("🎟️ Create Ticket")
        .setStyle(ButtonStyle.Primary)
    );

    await message.channel.send({ embeds: [embed], components: [button] });
  },
};
