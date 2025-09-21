module.exports = {
  name: "prefix",
  description: "Change the bot prefix for this server",
  usage: "prefix <new_prefix>",
  permissions: ["ManageGuild"],

  execute: async (client, message, args, prefixes) => {
    if (!args[0]) return message.reply("Please provide a new prefix.");

    const newPrefix = args[0];
    if (newPrefix.length > 5) return message.reply("Prefix cannot be longer than 5 characters.");

    prefixes.set(message.guild.id, newPrefix);

    return message.channel.send(`Prefix successfully changed to \`${newPrefix}\``);
  },
};
