const fs = require('node:fs');
const path = require('node:path');
const Canvas = require('@napi-rs/canvas');
const dotenv = require('dotenv');
const blacklisted = require('./blacklist.json');
//const mcping = require('mcping-js')
//const server = new mcping.MinecraftServer('', 25565)
const { Client, Collection, Events, GatewayIntentBits, ActivityType, AuditLogEvent, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, embedLength, EmbedBuilder, ButtonBuilder, ButtonStyle, Message, StringSelectMenuBuilder, AttachmentBuilder, MessageSelectMenu } = require('discord.js');
const { colors, yellow } = require('colors');
const { channel } = require('node:diagnostics_channel');
const { Console } = require('node:console');
const { MessageChannel } = require('node:worker_threads');
const { rolmaster, rollautaco, rolnate, rolghost, roljava, rolbedrock, roldiscord, us, mx, gt, hn, sv, ni, cr, pa, co, ve, ec, pe, bo, py, uy, cl, ar, es,  r1m, r2m, r3m, r4m } = require('./roles.json');
const { url } = require('node:inspector');
dotenv.config();
require('./');


//=======================================
//     DEBUG MODE, 0 OR 1
//=======================================

const debuglog = 0

//============================================================
// Esto se encargará de crear una nueva instancia para el bot
//===========================================================
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,

	],
})




//=====================================
//Carga los / desde la carpeta comandos
//=====================================
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'comandos');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log('[', '!'.yellow, ']', `Al comando ${filePath} le faltan las propiedades DATA y EXECUTE.`);
		//const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
		//log.send('[ ! ] ' + `Al comando ${filePath} le faltan las propiedades DATA y EXECUTE.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	console.log('[', '!'.green, ']', 'El usuario', interaction.user.username, 'ejecutó exitosamente el comando:', interaction.commandName)
	const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
	log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' ejecutó exitosamente el comando: ' + interaction.commandName);

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Hubo un error tratando de ejecutar ese comando.', ephemeral: true });
	}
});

//=======================================
//     Sistema de Bienvenidas 1.0
//=======================================

client.on("guildMemberAdd", (member) => {

	const bienvenida = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Bienvenido/a')
	.setDescription(`Hola! ${member.user} espero que disfrutes de tu estadia en el servidor.`)
	.setImage('https://media.giphy.com/media/a9dGnkMNSSwDeR8Xii/giphy.gif')
	.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });

	const channel = client.channels.cache.find(channel => channel.id === "1058954445171462216")
	const memberRole = '1058921411965616210';       
	channel.send( { embeds: [bienvenida] } )
	member.roles.add(memberRole)
	const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
	log.send('[ ! ] ' + `El usuario ${member.user} se ha unido al discord`);
	console.log('[', '!'.green, ']', `El usuario ${member.user} se ha unido al discord`);

});

client.on("guildMemberRemove", (member) => {

	const despedida = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Adios!')
	.setDescription(`Fue un gusto tenerte aqui ${member.user}.`)
	.setImage('https://media.giphy.com/media/QuCG1LqQ4PKpvxEvSP/giphy.gif')
	.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });

	const channel = client.channels.cache.find(channel => channel.id === "1058954447113441310")    
	channel.send( { embeds: [despedida] } )
	const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
	log.send('[ ! ] ' + `El usuario ${member.user} se ha ido del discord`);
	console.log('[', '!'.green, ']', `El usuario ${member.user} se ha ido del discord`);

});

//=======================================
//     Sistema de Moderación V1.2
//=======================================

client.on('messageCreate', (message) => {
	const Aviso = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Aviso')
		.setDescription('Su mensaje se eliminó debido a que incluia lenguaje o temas que no están permitidos en este servidor, ayudanos a mantener un ambiente agradable.' + '\n' + 'Para más información o consultas puedes ir a <#1060254670892834856>')
		.setImage('https://media.giphy.com/media/7VbE2HvYu1QUmoVQlt/giphy.gif')
		.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });

	let check = false
	for (var palabra in blacklisted) {
		if (!message.author.bot) {
			const arrword = message.content.split(/\s+/)

			const lowerword = arrword.map(element => {
				return element.toLowerCase();
			});
			if (lowerword.includes(blacklisted[palabra])) check = true
		}
	}
	if (check) {
		console.log('[', '!'.green, ']', 'Se eliminó un mensaje del usuario', message.author.username, 'el cual contenia:', message.content)
		const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
		log.send('[ ! ] ' + 'Se eliminó un mensaje del usuario ' + message.author.username + ' el cual contenia: ' + message.content);
		setTimeout(() => message.delete(), 1);
		message.author.send({ embeds: [Aviso] }).catch(console.error)
	};
}),

	//===================================
	// Saludo del bot al ser mencionado
	//===================================
	//	client.on("messageCreate", message => {
	//
	//		if (/\bkarmabot\b/i.test(message.content)) {
	//			if (!message.author.bot) {
	//				message.react('👀');
	//				console.log('[', '!'.green, ']', 'El bot fue mencionado por', message.author.username)
	//				const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
	//				log.send('[ ! ] ' + 'El bot fue mencionado por ' + message.author.username);
	//			}
	//		}
	//
	//	})
	//
	//client.on("messageCreate", message => {
	//
	//	if (/<@1064599332734652536>/i.test(message.content)) {
	//		if (!message.author.bot) {
	//			message.react('👀');
	//			console.log('[', '!'.green, ']', 'El bot fue mencionado por', message.author.username)
	//			const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
	//			log.send('[ ! ] ' + 'El bot fue mencionado por ' + message.author.username);
	//		}
	//	}
	//
	//})

	//=================================
	//        ANUNCIOS 1.2
	//=================================

	client.on("messageCreate", message => {

		const Anuncio = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Beta Publica')
			.setDescription('Hola Karmafans! \n Hemos estado trabajando en mejorar la seguridad del servidor y parchear muchos errores que tenia la beta publica anterior, se ha agregado una verificacion Antibots (Junto con un captcha), tambien se han fixeado varias vulnerabalidades que hacian que nos pudieran tirar el servidor en la beta anterior y miles de cosas que acá no puedo comentar por temas de seguridad y pues tambien que quedaria muy largo el mensaje, pero bueno, cuando entren deberan acomodar la imagen para ver el codigo y luego escribirlo en el chat, seguido de esto ya podran ingresar al servidor con normalidad. \n \n La IP para acceder al servidor de testeo es la siguente: \n \n ```mc.karmafans.xyz``` \n \n Notas: \n \n 1- Recuerden Borrar la carpeta config que está en .minecraft \n 2- Fabecio está aun terminando el mod de funkos \n 3- Jeft está terminando el menú de Autoroles de Karmabot \n 4- Elmr está terminando el mod para el menú del juego \n 4- RECUERDEN, Esto es una beta publica, no va a ser el mundo final.')
			.setImage('https://media.giphy.com/media/hG0FcGG9rVjDBr2545/giphy.gif')
			.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });
		const Anuncioboton = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Descargar')
					.setURL("https://www.mediafire.com/file/ike6w9js188e408/mods_y_nada_mas_que_mod.rar/file")
					.setStyle(ButtonStyle.Link),
			)
		if (/7346sdqasdasdcaefaksasdsbggedaiub52536/i.test(message.content)) {
			const channel = client.channels.cache.find(channel => channel.id === "1058921412632518748")
			const channeltest = client.channels.cache.find(channel => channel.id === "1065028049877348382")
			channel.send({ embeds: [Anuncio] });
			channel.send('@everyone');
			//channeltest.send({ embeds: [Anuncio], components: [Anuncioboton] });
			message.delete()
			console.log('[', '!'.green, ']', 'Anuncio enviado exitosamente por', message.author.username)
			const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
			log.send('[ ! ] ' + 'Anuncio enviado exitosamente por ' + message.author.username);

		}
	})



	//=================================
	//            ANUNCIOS
	//=================================

	client.on("messageCreate", message => {

		const Anuncio = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Anuncio')
			.setURL('https://www.youtube.com/watch?v=JiAa5v4zjOc')
			.setImage('https://media.giphy.com/media/L00auhhVx68CI/giphy.gif')
			.setDescription('Hola Karmafans!, \n \n Se ha publicado un video explicando como realizar una instalación limpia que 100% seguro les va a funcionar para entrar al servidor, esto porque hemos estado teniendo problemas con usuarios que utilizan TLauncher, esperamos les sea útil. \n \n \n https://www.youtube.com/watch?v=JiAa5v4zjOc')
			.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });
		const Anuncioboton = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Descargar')
					.setURL("https://www.mediafire.com/file/ike6w9js188e408/mods_y_nada_mas_que_mod.rar/file")
					.setStyle(ButtonStyle.Link),
			)
		if (/7346sdaksasdsbggedaiub52536/i.test(message.content)) {
			const channel = client.channels.cache.find(channel => channel.id === "1058921412632518748")
			const channeltest = client.channels.cache.find(channel => channel.id === "1065028049877348382")
			channel.send({ embeds: [Anuncio] });
			channel.send('@everyone');
			//channeltest.send({ embeds: [Anuncio], components: [Anuncioboton] });
			message.delete()
			console.log('[', '!'.green, ']', 'Anuncio enviado exitosamente por', message.author.username)
			const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
			log.send('[ ! ] ' + 'Anuncio enviado exitosamente por ' + message.author.username);

		}
	})


	/////////////////////////////////////////


	client.on("messageCreate", message => {

		const Anuncio = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('IP y Modpack Java 1.16.5')
			.setDescription('```mc.karmafans.xyz```')
		const Anuncioboton = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Descargar')
					.setURL("https://www.mediafire.com/file/ike6w9js188e408/mods_y_nada_mas_que_mod.rar/file")
					.setStyle(ButtonStyle.Link),
			)
		if (/assddaszxxxxdddcvzxxnopiqn3d45f/i.test(message.content)) {
			const channel = client.channels.cache.find(channel => channel.id === "1074320286079533188")
			const channeltest = client.channels.cache.find(channel => channel.id === "1065028049877348382")
			channel.send({ embeds: [Anuncio], components: [Anuncioboton] });
			message.delete()
			console.log('[', '!'.green, ']', 'Anuncio enviado exitosamente por', message.author.username)
			const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
			log.send('[ ! ] ' + 'Anuncio enviado exitosamente por ' + message.author.username);

		}
	})

//=================================
//            Bloqueo canales
//==================================
client.on("messageCreate", message => {

	const Cerrado = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Aviso')
		.setDescription('Se ha cerrado los canales temporalmente debido a la actitud de algunos usuarios, en un rato volverá a estar abierto al publico.')
		.setImage('https://media.tenor.com/eZOZrY0myDcAAAAd/pato-girando.gif')
		.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });
	if (/asdxczb6452ce51/i.test(message.content)) {
		const channel = client.channels.cache.find(channel => channel.id === "1058921412632518754")
		channel.send({ embeds: [Cerrado] });
		//message.author.send({ embeds: [Anuncio] }).catch(console.error)
		message.delete()
		console.log('[', '!'.green, ']', 'Anuncio enviado exitosamente por', message.author.username)
		const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
		log.send('[ ! ] ' + 'Anuncio enviado exitosamente por ' + message.author.username);
	}
})
//=================================
//            REGLAS
//==================================
client.on("messageCreate", message => {

	const Titulo = new EmbedBuilder()
		.setColor(5763719)
		.setTitle('Reglas Survival medieval MC KarmaFans')
	const R1 = new EmbedBuilder()
		.setColor(3447003)
		.setTitle('Rendimiento')
		.setDescription('**1- Granjas automáticas (Máquina o mecánicas)** \n \n Prohibido el uso de cualquier tipo de granja automática, el uso de artefacto que cause lag, afecta el rendimiento del servidor. \n \n **2- Bugs y glitches** \n \n No está permitido el uso de bug o glitches si encuentra con uno, por favor reportarlo lo más rápido y será premiado.')
		.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });
	const R2 = new EmbedBuilder()
		.setColor(10181046)
		.setTitle('Survival General')
		.setDescription('**1- Roleo general** \n \n Todo lo que tenga que ver con rol y parte del rol como insultos, etc estará permitido siempre cuando no sobrepase fuera del rol, la amenazas, racismo, xenofobia, sexista y más será vetado temporal o permanente dependiendo de la gravedad. \n \n **2- Saqueos** \n \n Está permitido el saqueo entre reinos siempre cuando el otro reino tenga la misma cantidad de gente. \n \n **3- PVP** \n \n El pvp estará permitido para todos, pero con igualdad de gente, siempre cuando haga un rol. No estará permitido atacar por atacar, para activar un rol tiene que haber cambios de palabras o actos. \n \n **4- TPA kill / Spawn kill** \n \n Prohibido el uso de comando para hacer una kill y desaparecer, al hacerlo se llevará un baneo temporal sin aviso alguno. \n \n **5 - Respeto a los líderes** \n \n La falta de respeto a los líderes no está permitido, la primera se llevará una llamada de atención. Si no se lleva bien con sus líderes y quieren separarse, crear un ticket y el motivo.  \n \n **6- Traiciones** \n \n Las traiciones estarán permitidos, pero se llevará un castigo. El reino con más fidelidad será premiado por semanas. \n \n **7- stream sniping** \n \n No está permitido el stream sniping las pruebas se hace mediante rol o captura si quieren acusar a alguien, pero si es prueba con la regla número 1 es válido. \n \n **8- X-Ray** \n \n El uso de X-Ray será sancionado fuertemente se aplica para todos.')
		.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });
	const R3 = new EmbedBuilder()
		.setColor(15844367)
		.setTitle('Jugar en Solitario')
		.setDescription('El servidor está basado en un tema medieval, por lo tanto, las reglas de arriba también se le aplica a ustedes. \n \n **1- Impuestos** \n \n Para que puedan jugar en armonía y encajar entre todo se deberá pagar un impuesto a los 4 reinos para que no pueda ser atacado. Los impuestos van de minerales (hierro, oro, etc) o alimentos, dependiendo de la exigencia. El pago será cada 4 días. \n \n **2- Provocaciones** \n \n  Las provocaciones a los reinos es una falta de respeto para ellos, así que cuida sus actos para que no sean atacados. \n \n **3- Posible reinos** \n \n Si la cantidad de jugadores es mayor a los reinos se pensará un reino dependiendo de los jugadores. (La idea no está todo clara, aún se está pensando) ')
		.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });
	const info = new EmbedBuilder()
		.setColor(15548997)
		.setDescription('Se agradecería respetar las reglas, los ítems de armadura y armas y una que otra cosa está bloqueado temporalmente. Cada cierto tiempo se desbloqueará, se hace para equilibrar a los jugadores. \n \n Habrá eventos y torneos, espero poder verlos!  \n \n Se acepta sugerencia para las reglas y donaciones (xd).')
		.setImage('https://media.giphy.com/media/6Ri6Pj0sgJMlTwrr7p/giphy.gif')
		.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });
	if (/asdxczxnj0k063413s/i.test(message.content)) {
		const channel = client.channels.cache.find(channel => channel.id === "1070535523980038225")
		channel.send({ embeds: [Titulo, R1, R2, R3, info] });
		channel.send('@everyone');
		//message.author.send({ embeds: [Titulo, R1, R2, R3, info] }).catch(console.error)
		message.delete()
		console.log('[', '!'.green, ']', 'Reglas enviadas exitosamente por', message.author.username)
		const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
		log.send('[ ! ] ' + 'Reglas enviadas exitosamente por ' + message.author.username);

	}
})

//=================================
//            AUTOROLES
//==================================
client.on("messageCreate", message => {

	const Anuncio = new EmbedBuilder()
		.setColor(15844367)
		.setTitle('¡Autoroles!')
		.setDescription('Selecciona una categoria de Autoroles!')
		.setImage('https://cdn.discordapp.com/attachments/1065028049877348382/1072349024704806932/rgb.gif')
	const roles = new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('roles')
				.setPlaceholder('-> Click aqui <-')
				.addOptions(
					{
						label: 'Notificaciones',
						value: 'notify_option',
						emoji: {
							name: '📢',
						},
					},
					{
						label: 'Pais',
						value: 'pais_option',
						emoji: {
							name: '🌎',
						},
					},
				),
		);
	if (/gwegwwawd12edaW5y325wdgh54/i.test(message.content)) {
		const channel = client.channels.cache.find(channel => channel.id === "1072303969768046652")
		channel.send({ embeds: [Anuncio], components: [roles] });
		message.delete()
		console.log('[', '!'.green, ']', 'Menu enviado exitosamente por', message.author.username)
		const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
		log.send('[ ! ] ' + 'Menu enviado exitosamente por ' + message.author.username);
	}
})
client.on(Events.InteractionCreate, async interaction => {

	if (!interaction.isStringSelectMenu()) return;
	if (interaction.customId === 'roles') {
		let choice = interaction.values[0]
		const member = interaction.member

		if (choice == 'notify_option') {

			const Anuncio = new EmbedBuilder()
				.setColor(5763719)
				.setTitle('¡Notificaciones!')
				.setDescription('Selecciona las notificaciones que quieras recibir')
				.setImage('https://cdn.discordapp.com/attachments/1065028049877348382/1072349024704806932/rgb.gif')
			const pings = new ActionRowBuilder()
				.addComponents(
					new StringSelectMenuBuilder()
						.setCustomId('pings')
						.setPlaceholder('-> Click aqui <-')
						.addOptions(
							{
								label: 'Minecraft Java',
								description: 'Pings sobre el srv de MC Java',
								value: 'mcnotify_option',
								emoji: {
									name: 'java',
									id: '1075610263098773524'
								},
							},
							{
								label: 'Minecraft Bedrock',
								value: 'bdnotify_option',
								description: 'Pings sobre el srv de MC Bedrock',
								emoji: {
									name: 'bedrock',
									id: '1075610220987941004'
								},
							},
							{
								label: 'Discord',
								value: 'dcnotify_option',
								description: 'Pings sobre este Discord y Karmabot',
								emoji: {
									name: 'discord',
									id: '1075610298473517167'
								},
							},
						),
				);
			client.on(Events.InteractionCreate, async interaction => {
				if (!interaction.isStringSelectMenu()) return;
				if (interaction.customId === 'pings') {
					let choice = interaction.values[0]
					const member = interaction.member

					if (choice == 'mcnotify_option') {
						if (member.roles.cache.some(role => role.id == roljava)) {
							member.roles.remove(roljava)
							interaction.reply({ content: "Ya no recibirás notificaciones relacionadas con Minecraft Java.❌", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' eliminó su rol de Minecraft Java')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' eliminó su rol de Minecraft Java')
						}
						else {
							member.roles.add(roljava)
							interaction.reply({ content: "Ahora recibirás notificaciones relacionadas con Minecraft Java.✅", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió el rol de Minecraft Java')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió el rol de Minecraft Java');
						}
					}

					else if (choice == 'bdnotify_option') {
						if (member.roles.cache.some(role => role.id == rolbedrock)) {
							member.roles.remove(rolbedrock)
							interaction.reply({ content: "Ya no recibirás notificaciones relacionadas con Minecraft Bedrock.❌", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' eliminó su rol de Minecraft Bedrock')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' eliminó su rol de Minecraft Bedrock')
						}
						else {
							member.roles.add(rolbedrock)
							interaction.reply({ content: "Ahora recibirás notificaciones relacionadas con Minecraft Bedrock.✅", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió el rol de Minecraft Bedrock')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió el rol de Minecraft Bedrock');
						}
					}

					else if (choice == 'dcnotify_option') {
						if (member.roles.cache.some(role => role.id == roldiscord)) {
							member.roles.remove(roldiscord)
							interaction.reply({ content: "Ya no recibirás notificaciones relacionadas con Discord.❌", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' eliminó su rol de Discord')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' eliminó su rol de Discord')
						}
						else {
							member.roles.add(roldiscord)
							interaction.reply({ content: "Ahora recibirás notificaciones relacionadas con Discord.✅", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió el rol de Discord')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió el rol de Discord');
						}
					}

				}
			})


			await interaction.reply({ embeds: [Anuncio], components: [pings], ephemeral: true })
			console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' ejecutó el menu de roles de notificacion')
			const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
			log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' ejecutó el menu de roles de notificacion');
		}

		else if (choice == 'pais_option') {

			const Anuncio = new EmbedBuilder()
				.setColor(5763719)
				.setTitle('¡Países!')
				.setDescription('Selecciona tu pais para recibir el rol')
				.setImage('https://cdn.discordapp.com/attachments/1065028049877348382/1072349024704806932/rgb.gif')
			const paises = new ActionRowBuilder()
				.addComponents(
					new StringSelectMenuBuilder()
						.setCustomId('paises')
						.setPlaceholder('-> Click aqui <-')
						.addOptions(
							{
								label: 'Estados unidos',
								value: 'us_option',
								emoji: {
									name: '🇺🇸'
								},
							},
							{
								label: 'México',
								value: 'mx_option',
								emoji: {
									name: '🇲🇽'
								},
							},
							{
								label: 'Guatemala',
								value: 'gt_option',
								emoji: {
									name: '🇬🇹'
								},
							},
							{
								label: 'Honduras',
								value: 'hn_option',
								emoji: {
									name: '🇭🇳'
								},
							},
							{
								label: 'El Salvador',
								value: 'sv_option',
								emoji: {
									name: '🇸🇻'
								},
							},
							{
								label: 'Nicaragua',
								value: 'ni_option',
								emoji: {
									name: '🇳🇮'
								},
							},
							{
								label: 'Costa Rica',
								value: 'cr_option',
								emoji: {
									name: '🇨🇷'
								},
							},
							{
								label: 'Panamá',
								value: 'pa_option',
								emoji: {
									name: '🇵🇦'
								},
							},
							{
								label: 'Colombia',
								value: 'co_option',
								emoji: {
									name: '🇨🇴'
								},
							},
							{
								label: 'Venezuela',
								value: 've_option',
								emoji: {
									name: '🇻🇪'
								},
							},
							{
								label: 'Ecuador',
								value: 'ec_option',
								emoji: {
									name: '🇪🇨'
								},
							},
							{
								label: 'Perú',
								value: 'pe_option',
								emoji: {
									name: '🇵🇪'
								},
							},
							{
								label: 'Bolivia',
								value: 'bo_option',
								emoji: {
									name: '🇧🇴'
								},
							},
							{
								label: 'Paraguay',
								value: 'py_option',
								emoji: {
									name: '🇵🇾'
								},
							},
							{
								label: 'Uruguay',
								value: 'uy_option',
								emoji: {
									name: '🇺🇾'
								},
							},
							{
								label: 'Chile',
								value: 'cl_option',
								emoji: {
									name: '🇨🇱'
								},
							},
							{
								label: 'Argentina',
								value: 'ar_option',
								emoji: {
									name: '🇦🇷'
								},
							},
							{
								label: 'España',
								value: 'es_option',
								emoji: {
									name: '🇪🇸'
								},
							},
						),
				);
			client.on(Events.InteractionCreate, async interaction => {
				if (!interaction.isStringSelectMenu()) return;
				if (interaction.customId === 'paises') {
					let choice = interaction.values[0]
					const member = interaction.member

					if (choice == 'us_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(us)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Estados Unidos')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Estados Unidos');
						}
						else {
							member.roles.add(us)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Estados Unidos')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Estados Unidos');
						}
					}

					else if (choice == 'mx_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(mx)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais México')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais México');
						}
						else {
							member.roles.add(mx)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais México')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais México');
						}
					}
					else if (choice == 'gt_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(gt)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Guatemala')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Guatemala');
						}
						else {
							member.roles.add(gt)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Guatemala')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Guatemala');
						}
					}
					else if (choice == 'hn_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(hn)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Honduras')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Honduras');
						}
						else {
							member.roles.add(hn)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Honduras')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Honduras');
						}
					}
					else if (choice == 'sv_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(sv)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais El salvador')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais El salvador');
						}
						else {
							member.roles.add(sv)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais El salvador')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais El salvador');
						}
					}
					else if (choice == 'ni_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(ni)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Nicaragua')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Nicaragua');
						}
						else {
							member.roles.add(ni)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Nicaragua')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Nicaragua');
						}
					}
					else if (choice == 'cr_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(cr)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Costa Rica')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Costa Rica');
						}
						else {
							member.roles.add(cr)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Costa Rica')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Costa Rica');
						}
					}	
					else if (choice == 'pa_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}
							
							member.roles.add(pa)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Panama')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Panama');
						}
						else {
							member.roles.add(pa)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Panama')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Panama');
						}
					}
					else if (choice == 'co_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(co)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Colombia')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Colombia');
						}
						else {
							member.roles.add(co)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Colombia')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Colombia');
						}
					}
					else if (choice == 've_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(ve)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Venezuela')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Venezuela');
						}
						else {
							member.roles.add(ve)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Venezuela')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Venezuela');
						}
					}
					else if (choice == 'ec_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(ec)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Ecuador')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Ecuador');
						}
						else {
							member.roles.add(ec)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Ecuador')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Ecuador');
						}
					}
					else if (choice == 'pe_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(pe)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Peru')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Peru');
						}
						else {
							member.roles.add(pe)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Peru')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Peru');
						}
					}
					else if (choice == 'bo_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(bo)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Bolivia')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Bolivia');
						}
						else {
							member.roles.add(bo)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Bolivia')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Bolivia');
						}
					}
					else if (choice == 'py_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(py)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Paraguay')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Paraguay');
						}
						else {
							member.roles.add(py)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Paraguay')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Paraguay');
						}
					}
					else if (choice == 'uy_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(uy)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Uruguay')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Uruguay');
						}
						else {
							member.roles.add(uy)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Uruguay')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Uruguay');
						}
					}
					else if (choice == 'cl_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(cl)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Chile')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Chile');
						}
						else {
							member.roles.add(cl)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Chile')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Chile');
						}
					}
					else if (choice == 'ar_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(ar)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Argentina')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Argentina');
						}
						else {
							member.roles.add(ar)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais Argentina')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais Argentina');
						}
					}
					else if (choice == 'es_option') {
						if (member.roles.cache.some(role => role.id == us || role.id == mx || role.id == gt || role.id == hn || role.id == sv || role.id == ni || role.id == cr || role.id == pa || role.id == co || role.id == ve || role.id == ec || role.id == pe || role.id == bo || role.id == py || role.id == uy || role.id == cl || role.id == ar|| role.id == es)) {
							if (member.roles.cache.some(role => role.id == us)) {
								member.roles.remove(us)
							}
							if (member.roles.cache.some(role => role.id == mx)) {
								member.roles.remove(mx)
								console.log('a')
							}
							if (member.roles.cache.some(role => role.id == gt)) {
								member.roles.remove(gt)
							}
							if (member.roles.cache.some(role => role.id == hn)) {
								member.roles.remove(hn)
							}
							if (member.roles.cache.some(role => role.id == sv)) {
								member.roles.remove(sv)
							}
							if (member.roles.cache.some(role => role.id == ni)) {
								member.roles.remove(ni)
							}
							if (member.roles.cache.some(role => role.id == cr)) {
								member.roles.remove(cr)
							}
							if (member.roles.cache.some(role => role.id == pa)) {
								member.roles.remove(pa)
							}
							if (member.roles.cache.some(role => role.id == co)) {
								member.roles.remove(co)
							}
							if (member.roles.cache.some(role => role.id == ve)) {
								member.roles.remove(ve)
							}
							if (member.roles.cache.some(role => role.id == ec)) {
								member.roles.remove(ec)
							}
							if (member.roles.cache.some(role => role.id == pe)) {
								member.roles.remove(pe)
							}
							if (member.roles.cache.some(role => role.id == bo)) {
								member.roles.remove(bo)
							}
							if (member.roles.cache.some(role => role.id == py)) {
								member.roles.remove(py)
							}
							if (member.roles.cache.some(role => role.id == uy)) {
								member.roles.remove(uy)
							}
							if (member.roles.cache.some(role => role.id == cl)) {
								member.roles.remove(cl)
							}
							if (member.roles.cache.some(role => role.id == ar)) {
								member.roles.remove(ar)
							}
							if (member.roles.cache.some(role => role.id == es)) {
								member.roles.remove(es)
							}

							member.roles.add(es)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais España')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais España');
						}
						else {
							member.roles.add(es)
							interaction.reply({ content: "Recibiste el rol correctamente!", ephemeral: true })
							console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' recibió correctamente un rol de pais España')
							const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
							log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' recibió correctamente un rol de pais España');
						}
					}				
				}
			})


			await interaction.reply({ embeds: [Anuncio], components: [paises], ephemeral: true })
			console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' ejecutó el menu de roles de pais')
			const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
			log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' ejecutó el menu de roles de pais');
		}
	}
})

//=================================
//            AUTOROL CLAN
//==================================
client.on("messageCreate", message => {

	const Anuncio = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Unete a un Reino!')
		.setDescription('Al formar parte de un reino podrás estar dentro de una guerra de clanes, colaborar en equipo y ser parte de muchas aventuras!!')
		.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });
	const clanes = new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('clanes')
				.setPlaceholder('-> Click aqui para unirse <-')
				.addOptions(
					{
						label: 'El reino de Lautaco',
						value: 'first_option',
						emoji: {
							name: '🟨',
						},
					},
					{
						label: 'El reino de Master',
						value: 'second_option',
						emoji: {
							name: '🟦',
						},
					},
					{
						label: 'El reino de ZyderNate',
						value: 'third_option',
						emoji: {
							name: '🟥',
						},
					},
				),
		);
	if (/zceg24g5y634g43t24/i.test(message.content)) {
		const channel = client.channels.cache.find(channel => channel.id === "1069880990484402196")
		channel.send({ embeds: [Anuncio], components: [clanes] });
		message.delete()
		console.log('[', '!'.green, ']', 'Menu enviado exitosamente por', message.author.username)
		const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
		log.send('[ ! ] ' + 'Menu enviado exitosamente por ' + message.author.username);
	}
})

client.on(Events.InteractionCreate, async interaction => {

	const nick = new ModalBuilder()
		.setCustomId('nick')
		.setTitle('Reinos de Karmafans');
	const nickmc = new TextInputBuilder()
		.setCustomId('nickmc')
		.setLabel("Cuál es tu nombre en Minecraft?")
		.setStyle(TextInputStyle.Short);
	const firstActionRow = new ActionRowBuilder().addComponents(nickmc);
	nick.addComponents(firstActionRow);


	if (!interaction.isStringSelectMenu()) return;
	if (interaction.customId === 'clanes') {
		let choice = interaction.values[0]
		const member = interaction.member

		if (choice == 'first_option') {
			if (member.roles.cache.some(role => role.id == rollautaco || role.id == rolnate || role.id == rolghost || role.id == rolmaster)) {
				interaction.reply({ content: "No puedes unirte a un reino si ya perteneces a otro.", ephemeral: true })
				console.log('[', '!'.yellow, ']', 'El usuario ', interaction.user.username, ' intento entrar a un reino pero ya pertenecia a otro')
				const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
				log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' intento entrar a un reino pero ya pertenecia a otro');
			}
			else {
				member.roles.add(rollautaco)
				console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' entró a un reino y recibió su rol correctamente')
				const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
				log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' entró a un reino y recibió su rol correctamente');
				await interaction.showModal(nick);
			}
		}

		else if (choice == 'second_option') {
			if (member.roles.cache.some(role => role.id == rollautaco || role.id == rolnate || role.id == rolghost || role.id == rolmaster)) {
				interaction.reply({ content: "No puedes unirte a un reino si ya perteneces a otro.", ephemeral: true })
				console.log('[', '!'.yellow, ']', 'El usuario ', interaction.user.username, ' intento entrar a un reino pero ya pertenecia a otro')
				const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
				log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' intento entrar a un reino pero ya pertenecia a otro');
			}
			else {
				member.roles.add(rolmaster)
				console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' entró a un reino y recibió su rol correctamente')
				const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
				log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' entró a un reino y recibió su rol correctamente');
				await interaction.showModal(nick);
			}
		}

		else if (choice == 'third_option') {
			if (member.roles.cache.some(role => role.id == rollautaco || role.id == rolnate || role.id == rolghost || role.id == rolmaster)) {
				interaction.reply({ content: "No puedes unirte a un reino si ya perteneces a otro.", ephemeral: true })
				console.log('[', '!'.yellow, ']', 'El usuario ', interaction.user.username, ' intento entrar a un reino pero ya pertenecia a otro')
				const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
				log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' intento entrar a un reino pero ya pertenecia a otro');
			}
			else {
				member.roles.add(rolnate)
				console.log('[', '!'.green, ']', 'El usuario ', interaction.user.username, ' entró a un reino y recibió su rol correctamente')
				const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
				log.send('[ ! ] ' + 'El usuario ' + interaction.user.username + ' entró a un reino y recibió su rol correctamente');
				await interaction.showModal(nick);
			}
		}
	}
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'nick') {
		await interaction.reply({ content: 'Felicidades, ya formas parte de un reino!⚔️.', ephemeral: true });

		const nick = interaction.fields.getTextInputValue('nickmc');
		const channel = client.channels.cache.find(channel => channel.id === "1065792815419887766")
		const usuariodc = '<@' + interaction.user.id + '>'
		const usuarioclan = new EmbedBuilder()
			.setColor(0x0099FF)
			.setDescription('El usuario ' + usuariodc + ' se unió a un reino y su nick de mc es: ' + nick)
		channel.send({ embeds: [usuarioclan] });
		console.log('[', '!'.green, ']', 'El usuario ' + usuariodc + ' se unió a un reino y su nick de mc es: ' + nick)
		const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
		log.send('[ ! ] ' + 'El usuario ' + usuariodc + ' se unió a un reino y su nick de mc es: ' + nick);

	}
});

//========================================================
// Esto avisará cuando el bot esté iniciado correctamente.
//========================================================
client.once(Events.ClientReady, c => {
	console.log('[', '!'.green, ']', `Listo!, Bot logeado como ${c.user.tag}`);
	const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
	log.send('[ ! ] ' + `Listo!, Bot logeado como ${c.user.tag}`);
	// Aquí se establece la actividad del bot y su estado (Online, Ausente, no molestar)	
	client.user.setPresence({
		activities: [{ name: `MC 1.16.5 👀`, type: ActivityType.Playing }],
		status: 'idle',
	});
});


const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
client.on("error", (e) => console.error('[', '!'.red, ']', e));
client.on("warn", (e) => console.warn('[', '!'.yellow, ']', e));
if (debuglog === 1) {
	client.on("debug", (e) => console.info('[', '!'.blue, ']', e));
}

//===========================================
//Esto se encarga de construir el formulario
//===========================================

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	if (interaction.commandName === 'lore') {
		const modal = new ModalBuilder()
			.setCustomId('Lore')
			.setTitle('Crea el lore de tu personaje');


		const nombreinput = new TextInputBuilder()
			.setCustomId('nombreinput')
			.setLabel("¿Cuál es el nombre de tu personaje?")
			.setStyle(TextInputStyle.Short)
			.setMaxLength(20);

		const edadinput = new TextInputBuilder()
			.setCustomId('edadinput')
			.setLabel("¿Que edad tiene tu personaje?")
			.setMaxLength(5)
			.setStyle(TextInputStyle.Short);

		const loreinput = new TextInputBuilder()
			.setCustomId('loreinput')
			.setLabel("Cuentanos tu historia.")
			.setMaxLength(3500)
			.setStyle(TextInputStyle.Paragraph);


		const firstActionRow = new ActionRowBuilder().addComponents(nombreinput);
		const secondActionRow = new ActionRowBuilder().addComponents(edadinput);
		const thirdActionRow = new ActionRowBuilder().addComponents(loreinput);



		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);


		await interaction.showModal(modal);
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'Lore') {
		await interaction.reply({ content: 'Su lore se envió correctamente', ephemeral: true });


		//=============================
		//Embed para el canal de Lore
		//=============================

		const user = '<@' + interaction.user.id + '>';
		const nombre = interaction.fields.getTextInputValue('nombreinput') + ' / ' + user
		const edad = interaction.fields.getTextInputValue('edadinput')
		const lore = interaction.fields.getTextInputValue('loreinput')


		const Lore = new EmbedBuilder()
			.setColor(0x0099FF)
			.setDescription("**---> Nombre <---**" + "\n" + nombre + "\n**---> Edad <---**" + "\n" + edad + '\n**---> Lore <---**' + "\n" + lore)
			.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });


		//		.addFields(
		//			{ name: '---> Nombre <---', value: interaction.fields.getTextInputValue('nombreinput') + ' / ' + user, inline: false },
		//			{ name: '---> Edad <---', value: interaction.fields.getTextInputValue('edadinput'), inline: false },
		//			{ name: '---> Lore <---', value: interaction.fields.getTextInputValue('loreinput'), inline: false }
		//		)

		//==============================
		// Embed que se envia al usuario
		// una vez recibido el formulario
		//==============================
		const LoreUsuario = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('KarmaFans')
			.setDescription('Su lore fue enviado exitosamente')
			.setImage('https://media.giphy.com/media/JNySPj69tVEEaaqoa9/giphy.gif')



		//======================================
		//Envia el embed al usuario y al canal
		//======================================

		const channel = client.channels.cache.find(channel => channel.id === "1065709218012876830")
		channel.send({ embeds: [Lore] });
		await interaction.user.send({ embeds: [LoreUsuario] }).catch(console.error)
		const log = client.channels.cache.find(channel => channel.id === "1069336879968813158")
		log.send('[ ! ] ' + 'El usuario ' + '<@' + interaction.user.id + '>' + 'Envió exitosamente su lore');
	}
});



//=============================================
// Esto tomará el token desde el archivo .env
//=============================================
client.login(process.env.TOKEN);