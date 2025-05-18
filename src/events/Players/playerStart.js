const { MessageAttachment, Client } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
const { trackStartEventHandler } = require("../../utils/functions");
const db = require("../../schema/setup");

const { Canvas } = require('canvas-constructor');
const canvas = require('canvas');
const { registerFont } = require('canvas');
registerFont("./fonts/Open Sans.ttf", { family: 'Open Sans' });
registerFont("./fonts/Montserrat.ttf", { family: 'Ope' });

module.exports = {
	name: "playerStart",
	/**
	 * @param {Client} client 
	 * @param {*} player 
	 * @param {*} track 
	 */
	run: async (client, player, track) => {
		const guild = client.guilds.cache.get(player.guild);
		if (!guild) return;

		let channel = guild.channels.cache.get(player.text) || await guild.channels.fetch(player.text).catch(() => null);
		if (!channel || !channel.isTextBased?.()) return;

		const data = await db.findOne({ Guild: guild.id });

		if (data && data.Channel) {
			const textChannel = guild.channels.cache.get(data.Channel) || await guild.channels.fetch(data.Channel).catch(() => null);
			const id = data.Message;
			if (textChannel?.isTextBased?.()) {
				await trackStartEventHandler(id, textChannel, player, track, client);
			}
		}

		const emojiplay = client.emoji.play;

		const nail = player.current.thumbnail || `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`;
		const title = player.current.title;
		const shortTitle = title.toString().split(' ').slice(0, 5).join(' ');

		const imge = await canvas.loadImage('./musicplayer.png');
		const imgge = await canvas.loadImage(nail);

		const imagee = new Canvas(680, 220)
			.printImage(imge, 0, 0, 680, 220)
			.setColor("#FFFFFF")
			.setTextFont('20px Open Sans')
			.setTextAlign("center")
			.printWrappedText(shortTitle, 470, 55)
			.setTextFont('14px Ope')
			.printWrappedText(player.current.author, 470, 85)
			.printImage(imgge, 71, 20, 218, 120)
			.setTextFont('14px Ope')
			.printWrappedText(`${player.current.isStream ? 'LIVE' : convertTime(player.current.length)}`, 613, 180)
			.toBuffer();

		const file = new MessageAttachment(imagee, 'spotify.png');

		const sentMessage = await channel.send({ files: [file] }).catch(console.error);
		if (sentMessage) {
			player.data.set("message", sentMessage);
		}

		await player.data.set("autoplaySystem", player.current.identifier);
	}
};
