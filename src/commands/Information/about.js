const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'about',
  category: 'Information',
  aliases: ['botinfo'],
  description: 'See description about this project',
  args: false,
  usage: '',
  userPrams: [],
  botPrams: ['EMBED_LINKS'],
  owner: false,
  execute: async (message, args, client, prefix) => {
    const mainPage = new MessageEmbed()
      .setColor('#303236')
      .setDescription('Made by Reo.');

    return message.reply({ embeds: [mainPage] });
  },
};