// commands/greet.js
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../data/greetConfigs.json');

module.exports = {
  name: 'greet',
  description: 'Manage greet settings',
  permissions: ['Administrator'],
  async execute(client, message, args) {
    if (!args[0]) {
      return message.reply('Usage:\n`=greet apply <name> #channel <deleteTimeInSeconds>`\n`=greet remove <name>`');
    }

    const subcommand = args[0].toLowerCase();

    // Load config
    let data = {};
    if (fs.existsSync(configPath)) {
      data = JSON.parse(fs.readFileSync(configPath));
    }

    if (!data[message.guild.id]) {
      data[message.guild.id] = {};
    }

    if (subcommand === 'apply') {
      const greetName = args[1];
      const channel = message.mentions.channels.first();
      const deleteTime = parseInt(args[3]);

      if (!greetName || !channel || isNaN(deleteTime)) {
        return message.reply('Usage: `=greet apply <name> #channel <deleteTimeInSeconds>`');
      }

      // Save config
      data[message.guild.id][greetName] = {
        channelId: channel.id,
        deleteTime: deleteTime
      };

      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
      message.reply(`✅ Greet \`${greetName}\` set to ${channel} with delete time of ${deleteTime}s.`);
    
    } else if (subcommand === 'remove') {
      const greetName = args[1];
      if (!greetName) {
        return message.reply('Usage: `=greet remove <name>`');
      }

      if (!data[message.guild.id][greetName]) {
        return message.reply(`❌ No greet named \`${greetName}\` found.`);
      }

      delete data[message.guild.id][greetName];
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
      message.reply(`✅ Greet \`${greetName}\` has been removed.`);
    
    } else {
      message.reply('Unknown subcommand. Use `=greet apply` or `=greet remove`.');
    }
  },
};
