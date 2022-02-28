/* 

    main script and shit
    you can change everything here
    main stuff as making a account, uploading the game and other stuff is handled by the "main.js" module

*/

// modules and shit
import { Client, Intents, MessageActionRow, MessageSelectMenu, MessageEmbed } from 'discord.js';
import { init, finish, beforeinit, selectName, getTokenData } from './modulardos/main.js';
import fs from 'fs';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import dotenv from 'dotenv';

// .env shit
if (!process.env.PORT) {
   dotenv.config();
}

// shit
const bot = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]});
const __dirname = path.resolve();
const webshit = express();
const token = process.env.TOKEN;
const puerto = process.env.PORT || 8000;
const maps = JSON.parse(fs.readFileSync("./general/maps.json", 'utf-8'));
const botConfigs = JSON.parse(fs.readFileSync("./bot-configs.json", 'utf-8'));
const savedShit = {};
const blacklistedServers = {}; // roblox-type arrays shit

// json shit
webshit.use(express.json()); 

// favicon shit
webshit.use(favicon(__dirname + "/favicon.ico")); 

// bot shit
bot.on("ready", () => {
    console.log(`loggeado en ${bot.user.tag}`)
    bot.user.setPresence({status: "idle", activities: [{name: "a gente fachera como vos", type: "WATCHING"}]});
});

bot.on("messageCreate", async (msg) => {
	if (msg.inGuild()==false) {return}
	let content = msg.content;
	let member = msg.member;
	if (content.includes("m?start") && (member.permissions.has("ADMINISTRATOR") || member.id == "842049122085240902" || member.id == "348954819345645568")) {
		let selectedChnl = msg.mentions.channels.first();
		if (!selectedChnl) {
			msg.reply("**No has mencionado un canal, estupid@.**")
			return;
		}
		let options = [];
		for (var mname in maps) {
			var s=maps[mname].discordShit
			s.value = mname;
			options.push(s)
		};
		let embed = new MessageEmbed()
			.setColor("#4dff7c")
			.setTitle("Condo Privado")
			.setDescription("Aquí mismo puedes crear tu propio condo privado!\n**Creditos adicionales:** `condogames.xyz (Estructura del proceso)`")
			.setFooter(botConfigs.embedFooter);
		let row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId("condo")
					.setPlaceholder("Ninguno seleccionado.")
					.addOptions(options)
			);
		selectedChnl.send({embeds: [embed], components: [row]})
		return;
	} else if (content.includes("m?update") && (member.permissions.has("ADMINISTRATOR") || member.id == "842049122085240902" || member.id == "348954819345645568")) {
		let msgId = content.split(" ")[1]
		let message; 
		try {
			message = await msg.channel.messages.fetch(msgId)
		} catch(err) {
			let reply = await msg.reply("**Mensaje invalido bozo**");
			setTimeout(()=>{reply.delete()},3000)
			return;
		}
		let options = [];
		for (var mname in maps) {
			var s=maps[mname].discordShit
			s.value = mname;
			options.push(s)
		};
		let embed = new MessageEmbed()
			.setColor("#4dff7c")
			.setTitle("Condo Privado")
			.setDescription("Aquí mismo puedes crear tu propio condo privado!\n**Creditos adicionales:** `condogames.xyz (Estructura del proceso)`")
			.setFooter(botConfigs.embedFooter);
		let row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId("condo")
					.setPlaceholder("Ninguno seleccionado.")
					.addOptions(options)
			);
		message.edit({embeds: [embed], components: [row]})
	} else if (content.includes("m?act") && (member.permissions.has("ADMINISTRATOR") || member.id == "842049122085240902" || member.id == "348954819345645568")) {
		let chnId = content.split(" ")[1]
		let msgId = content.split(" ")[2]
		let channel;
		let message;
		try {
			channel = await msg.guild.channels.fetch(chnId)
		} catch(err) {
			let reply = await msg.reply("**Canal invalido bozo**");
			setTimeout(()=>{reply.delete()},3000)
			return;
		}
		try {
			message = await channel.messages.fetch(msgId)
		} catch(err) {
			let reply = await msg.reply("**Mensaje invalido bozo**");
			setTimeout(()=>{reply.delete()},3000)
			return;
		}
		let options = [];
		for (var mname in maps) {
			var s=maps[mname].discordShit
			s.value = mname;
			options.push(s)
		};
		let embed = new MessageEmbed()
			.setColor("#4dff7c")
			.setTitle("Condo Privado")
			.setDescription("Aquí mismo puedes crear tu propio condo privado!\n**Creditos adicionales:** `condogames.xyz (Estructura del proceso)`")
			.setFooter(botConfigs.embedFooter);
		let row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId("condo")
					.setPlaceholder("Ninguno seleccionado.")
					.addOptions(options)
			);
		message.edit({embeds: [embed], components: [row]})
	}
})

bot.on("interactionCreate", async (interaction) => {
    if (interaction.isSelectMenu()) {
        if (interaction.customId == "condo") {
			await interaction.deferReply({ephemeral: true});
			if (blacklistedServers[interaction.guild.id]) {
				await interaction.editReply({content: "**Este servidor no esta en la lista blanca de usar el bot.\nPorfavor contacte a** `nekobasu#0100` **para mas información.**", ephemeral: true})
				return
			}
//		    if (true) {
//				await interaction.reply({content: "**El bot esta en mantenimiento, porfavor intentelo mas tarde y revise el canal de \"condo-bot-update\" en Party Time para mas información.**", ephemeral: true})
//				return;
//		    }
            let condoName = interaction.values[0];
            if (!maps[condoName]) {
                await interaction.editReply({content: `Error interno:\n\`\`\`No se encontro un mapa valido para "${condoName}"\`\`\``, ephemeral: true})
                return;
            }
			savedShit[interaction.id] = [condoName, interaction];
			selectName(interaction, maps[condoName].discordShit.label)
			setTimeout(()=>{
				if (savedShit[interaction.id]) {
					delete savedShit[interaction.id];
					interaction.editReply({content: "[⏰] Operación cancelada debido a inactividad.", embeds: [], components: [], ephemeral: true})
				}
			}, 60000)
		} else if (interaction.customId.includes("name")) {
			await interaction.deferUpdate();
			let oldInteractId = interaction.customId.split(";")[1];
			if (!savedShit[oldInteractId]) {
				await interaction.editReply({content: "**HUBO UN ERROR XD**", embeds: [], components: [], ephemeral: true});
			}
			let condoName = savedShit[oldInteractId][0];
			let interac = savedShit[oldInteractId][1];
			savedShit[oldInteractId].push(interaction.values[0])
			beforeinit(interac, maps[condoName].discordShit.label)
			setTimeout(()=>{
				if (savedShit[oldInteractId]) {
					delete savedShit[oldInteractId];
					interac.editReply({content: "[⏰] Operación cancelada debido a inactividad.", embeds: [], components: [], ephemeral: true})
				}
			}, 60000)
        } else if (interaction.customId.includes("players")) {
			await interaction.deferUpdate();
			let oldInteractId = interaction.customId.split(";")[1];
			if (!savedShit[oldInteractId]) {
				await interaction.editReply({content: "**HUBO UN ERROR XD**", embeds: [], components: [], ephemeral: true});
			}
			let condoName = savedShit[oldInteractId][0];
			let oldInterac = savedShit[oldInteractId][1];
			let selectedName = savedShit[oldInteractId][2]
			let selectedPlrAmount = interaction.values[0];	
			try {
				delete savedShit[oldInteractId]
			} catch(err){}
			init(oldInterac, condoName, selectedPlrAmount, maps[condoName].discordShit.label, selectedName);
		}
    }
})

bot.login(token)

// server shit
webshit.get("/", (req, res) => {
    res.sendFile('/pages/default-page.html', {root: __dirname})
})

webshit.get("/captcha/", async (req, res) => {
    if (!req.query.token) {
        res.sendFile('/pages/error-page.html', {root: __dirname});
        return;
    }
    let exists = await getTokenData(req.query.token);
    if (exists == undefined || exists.inUse == true) {
        res.sendFile('/pages/invalidT-page.html', {root: __dirname});
        return;
    }
    res.sendFile('/pages/captcha-page.html', {root: __dirname});
})

webshit.post("/getCaptchaInfo/", async (req, res) => {
    if (!req.query.token) {
        res.json({success: false, error: "the token is missing."});
        return;
    }
    let token = req.query.token;
    let data = await getTokenData(req.query.token);
    if (data == undefined || data.inUse == true) {
        res.json({success: false, error: "invalid token"})
        return;
    }
    res.json({success: true, blobData: data.blobData})
})

webshit.post("/captcha/", async (req, res) => {
    if (!req.query.token) {
        res.json({success: false, error: "the token is missing."});
        return;
    }
    let token = req.query.token;
    let data = await getTokenData(req.query.token);
    if (data == undefined || data.inUse == true) {
        res.json({success: false, error: "invalid token"})
        return;
    }
    let captchaToken = req.body.captchaToken;
    finish(token, captchaToken, maps[data.ctype].discordShit.label);
    res.json({success: true})
})

webshit.listen(puerto, () => {
    console.log(`corriendo en el puerto ${puerto}`)
})