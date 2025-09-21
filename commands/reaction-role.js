const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "reaction-role",
  description: "Setup a reaction role message",
  usage: "reaction-role <#channel> <messageID> <emoji> <@role>",
  permissions: [PermissionsBitField.Flags.ManageRoles],
  execute: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply("You need Manage Roles permission to use this command.");
    }
    if (args.length < 4) {
      return message.reply("Usage: reaction-role <#channel> <messageID> <emoji> <@role>");
    }

    const channel = message.mentions.channels.first();
    if (!channel) return message.reply("Please mention a valid channel.");

    const messageId = args[1];
    const emoji = args[2];
    const role = message.mentions.roles.first();
    if (!role) return message.reply("Please mention a valid role.");

    try {
      const reactionMessage = await channel.messages.fetch(messageId);
      await reactionMessage.react(emoji);

      // Store this reaction-role setup somewhere (database or in-memory)
      // For now, just confirm success

      const embed = new EmbedBuilder()
        .setTitle("Reaction Role Setup")
        .setDescription(`React to [this message](${reactionMessage.url}) with ${emoji} to get the role ${role.name}`)
        .setColor("Blue");

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      message.reply("Could not find the message or react. Make sure the message ID is correct and the bot has permission.");
    }
  },
};
