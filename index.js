const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const blacklisted = require('./blacklist.json');
//const mcping = require('mcping-js')
//const server = new mcping.MinecraftServer('', 25565)
const { Client, Collection, Events, GatewayIntentBits, ActivityType, AuditLogEvent, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, embedLength, EmbedBuilder, ButtonBuilder, ButtonStyle, Message, StringSelectMenuBuilder  } = require('discord.js');
const { colors, yellow } = require('colors');
const { channel } = require('node:diagnostics_channel');
const { Console } = require('node:console');
const { MessageChannel } = require('node:worker_threads');

dotenv.config();
require('./');

//============================================================
// Esto se encargará de crear una nueva instancia para el bot
//===========================================================
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,

	],
})


//====================================
//Inicializa la base de datos
//==================================== 

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const Tags = sequelize.define('tags', {
	palabras: {
		type: Sequelize.STRING,
		unique: true,
	}
});


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
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	console.log('[', '!'.green, ']', 'El usuario', interaction.user.username, 'ejecutó exitosamente el comando:', interaction.commandName)

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Hubo un error tratando de ejecutar ese comando.', ephemeral: true });
	}
});






//=======================================
//Sistema de Moderación  Work In Progress
//=======================================

client.on('messageCreate', (message) => {

	const Aviso = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Aviso')
		.setDescription('Su mensaje se eliminó debido a que incluia lenguaje o hablaba sobre temas inadecuados o que no están permitidos este servidor, ayudanos a mantener un ambiente agradable. Para más información o consultas puedes abrir un ticket')
		.setImage('https://media.giphy.com/media/7VbE2HvYu1QUmoVQlt/giphy.gif')
		.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });

//	Sequelize.all('SELECT palabras FROM tags').then(rows => {
//		var palabras = '';
//		rows.forEach(function (row) {
//		descr += `${palabras}`
//		})
//
//	if (`${palabras}`.test(message.content)) {
//		console.log('[', '!'.green, ']', 'Se eliminó un mensaje del usuario', message.author.username, 'el cual contenia:', message.content)
//		setTimeout(() => message.delete(), 1);
//		message.author.send({ embeds: [Aviso] }).catch(console.error)
//	}


	let check = false
	for (var palabra in blacklisted) {
		if (message.content.toLowerCase().includes(blacklisted[palabra].toLowerCase())) check = true
	}
	if (check) {
		console.log('[', '!'.green, ']', 'Se eliminó un mensaje del usuario', message.author.username, 'el cual contenia:', message.content)
		setTimeout(() => message.delete(), 1);
		message.author.send({ embeds: [Aviso] }).catch(console.error)
	};


}),



	//  client.on('messageCreate', (message) => {
	//	if (/\bServidor\b/i.test(message.content)) {
	//	  message.react('👀');
	//	  const Servidor = new EmbedBuilder()
	//	  	.setColor(0x0099FF)
	//	  	.setTitle('KarmaFans')
	//	  	.setDescription('El servidor official se encuentra en mantenimiento, abriremos pronto')	
	//	  	.setImage('https://media.giphy.com/media/ojKMgAPZeerk21Allh/giphy.gif')
	//    message.reply({ embeds: [Servidor] });
	//	  console.log('[','!'.green,']','Se aviso al usuario', message.author.username, 'sobre el estado del servidor')
	//	}
	//  })



	//===================================
	// Saludo del bot al ser mencionado
	//===================================
	client.on("messageCreate", message => {

		if (/\bkarmabot\b/i.test(message.content)) {
			message.react('👀');
			console.log('[', '!'.green, ']', 'El bot fue mencionado por', message.author.username)
		}

	})

	client.on("messageCreate", message => {

		if (/<@1064599332734652536>/i.test(message.content)) {
			message.react('👀');
			console.log('[', '!'.green, ']', 'El bot fue mencionado por', message.author.username)
		}

	})	
//=================================
//            ANUNCIOS
//==================================
client.on("messageCreate", message => {

	const Anuncio = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Evento PVP 1.8')
		.setDescription('Se está organizando un evento de PVP en Minecraft, tendrán disponible un sitio para ver los resultados de los enfrentamientos y el orden de los proximos combates.')
		.setImage('https://media.giphy.com/media/Qa4KtB03ixJrmHw7Ti/giphy.gif')
		.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });
	const Anuncioboton = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setLabel('Ver pagina')
				.setURL("https://challonge.com/es/karmafans_TO_Oficial")
				.setStyle(ButtonStyle.Link),
		)
	if (/7346sdaksasdsbggedaiub52536/i.test(message.content)) {
		const channel = client.channels.cache.find(channel => channel.id === "1068696259206058037")
		channel.send({ embeds: [Anuncio], components: [Anuncioboton] });
		channel.send('@everyone');	
		//message.author.send({ embeds: [Anuncio] }).catch(console.error)
		message.delete()
		console.log('[', '!'.green, ']', 'Anuncio enviado exitosamente por', message.author.username)
		
	}
})

//=================================
//            AUTOROL
//==================================

client.on("messageCreate", message => {

	const Ping = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Rol')
		.setDescription('Hola karmadiences!, El usuario <@447447852818628629> está organizando un podcast en el canal de eventos, en este mismo se estará hablando sobre algunas teorias, ideas y parte del lore del servidor, acompañalo en: <#1065753215045476352>')
		.setImage('https://media.giphy.com/media/xgBVs4YDslyVNEIl9p/giphy.gif')
		.setFooter({ text: 'Karmafans', iconURL: 'https://cdn.discordapp.com/attachments/1065028049877348382/1065717118974316615/karmaland.png' });


	if (/73465dsfsdfs2536/i.test(message.content)) {
		const channel = client.channels.cache.find(channel => channel.id === "1058921412632518748")
		console.log('[', '!'.green, ']', 'Anuncio enviado exitosamente por', message.author.username)
		interaction.user.send({ embeds: [Ping] }).catch(console.error)
	}

})

//========================================================
// Esto avisará cuando el bot esté iniciado correctamente.
//========================================================
client.once(Events.ClientReady, c => {
	Tags.sync();
	console.log('[', '!'.green, ']', `Listo!, Bot logeado como ${c.user.tag}`);
	// Aquí se establece la actividad del bot y su estado (Online, Ausente, no molestar)	
	client.user.setPresence({
		activities: [{ name: `IA en Mantenimiento⚡🔧`, type: ActivityType.Watching }],
		status: 'idle',
	});
});

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
		.setDescription("**---> Nombre <---**" + "\n" + nombre + "\n**---> Edad <---**" + "\n" + edad + '\n**---> Lore <---**' + "\n" + lore )
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
});

//=============================================
// Esto tomará el token desde el archivo .env
//=============================================
client.login(process.env.TOKEN);