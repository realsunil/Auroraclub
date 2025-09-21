const {
  AutoModerationRuleTriggerType,
  AutoModerationActionType,
  PermissionsBitField
} = require('discord.js');

module.exports = {
  name: 'setupautomod',
  description: 'Create an AutoMod rule to block bad words',
  execute: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply("❌ You don't have permission to use this command.");
    }

    try {
      const rule = await message.guild.autoModerationRules.create({
        name: 'Block Bad Words',
        eventType: 1, // MESSAGE_SEND
        triggerType: AutoModerationRuleTriggerType.Keyword,
        triggerMetadata: {
          keywordFilter: ['gay', 'bkl', 'fuck']
        },
        actions: [{
          type: AutoModerationActionType.BlockMessage
        }],
        enabled: true,
        reason: 'AutoMod rule created by bot'
      });

      message.reply(`✅ AutoMod rule "${rule.name}" has been created!`);
    } catch (error) {
      console.error(error);
      message.reply(`❌ Failed to create AutoMod rule: ${error.message}`);
    }
  }
};
