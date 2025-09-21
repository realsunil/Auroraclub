// events/interaction.js
const {
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    if (interaction.customId === "create_ticket") {
      // Check for existing ticket
      const existingChannel = interaction.guild.channels.cache.find(
        (c) => c.name === `ticket-${interaction.user.id}`
      );

      if (existingChannel) {
        return interaction.reply({
          content: `❗ You already have an open ticket: <#${existingChannel.id}>`,
          ephemeral: true,
        });
      }

      // Find Ticket Manager role
      const ticketManagerRole = interaction.guild.roles.cache.find(
        (r) => r.name.toLowerCase() === "ticket manager"
      );

      const permissionOverwrites = [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.AttachFiles,
          ],
        },
      ];

      if (ticketManagerRole) {
        permissionOverwrites.push({
          id: ticketManagerRole.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        });
      }

      // Create ticket channel
      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites,
      });

      // Close button
      const closeButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close_ticket")
          .setLabel("🔒 Close Ticket")
          .setStyle(ButtonStyle.Danger)
      );

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🎟️ Aurora Club Support")
        .setDescription(`<@${interaction.user.id}> Welcome! A staff member will assist you shortly.`)
        .setFooter({ text: "Aurora Club" })
        .setTimestamp();

      await channel.send({
        content: `${interaction.user} ${ticketManagerRole ? `<@&${ticketManagerRole.id}>` : ""}`,
        embeds: [embed],
        components: [closeButton],
      });

      await interaction.reply({
        content: `✅ Ticket created: <#${channel.id}>`,
        ephemeral: true,
      });
    }

    if (interaction.customId === "close_ticket") {
      const channel = interaction.channel;
      await interaction.reply({
        content: "🔒 Ticket will be closed in 5 seconds...",
        ephemeral: true,
      });
      setTimeout(() => {
        channel.delete().catch(() => {});
      }, 5000);
    }
  },
};
