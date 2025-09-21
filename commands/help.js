const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "📘 Display all commands with pagination",
  usage: "help",
  execute: async (client, message) => {
    const commands = [...client.commands.values()];
    if (!commands.length) return message.channel.send("❌ No commands available.");

    const itemsPerPage = 5;
    const totalPages = Math.ceil(commands.length / itemsPerPage);
    let currentPage = 0;

    // Generate Embed for a page
    const generateEmbed = (page) => {
      const start = page * itemsPerPage;
      const currentCommands = commands.slice(start, start + itemsPerPage);

      const embed = new EmbedBuilder()
        .setTitle("📖 Help Menu")
        .setDescription("Here's a list of available commands:\n\u200B")
        .setColor("#5865F2")
        .setFooter({
          text: `Page ${page + 1} of ${totalPages} • Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setTimestamp();

      currentCommands.forEach((cmd) => {
        embed.addFields({
          name: `🔹 \`${cmd.name}\``,
          value: `${cmd.description || "*No description provided.*"}\n📌 Usage: \`${cmd.usage || "No usage info"}\``,
          inline: false,
        });
      });

      return embed;
    };

    // Create Buttons
    const backButton = new ButtonBuilder()
      .setCustomId("help_back")
      .setLabel("⬅ Previous")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const nextButton = new ButtonBuilder()
      .setCustomId("help_next")
      .setLabel("Next ➡")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(totalPages === 1);

    const row = new ActionRowBuilder().addComponents(backButton, nextButton);

    // Send Initial Embed
    const helpMessage = await message.channel.send({
      embeds: [generateEmbed(currentPage)],
      components: [row],
    });

    // Button Collector
    const collector = helpMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120000,
      filter: (i) => i.user.id === message.author.id,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "help_back") currentPage--;
      if (interaction.customId === "help_next") currentPage++;

      backButton.setDisabled(currentPage === 0);
      nextButton.setDisabled(currentPage === totalPages - 1);

      await interaction.update({
        embeds: [generateEmbed(currentPage)],
        components: [new ActionRowBuilder().addComponents(backButton, nextButton)],
      });
    });

    collector.on("end", () => {
      backButton.setDisabled(true);
      nextButton.setDisabled(true);
      helpMessage.edit({
        components: [new ActionRowBuilder().addComponents(backButton, nextButton)],
      });
    });
  },
};
