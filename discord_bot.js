const fs = require('fs');
const path = require('path');
const request = require('request');
const Common = require('./lib/common');
const Message = require('./lib/message');
const Aws = require('./lib/aws');

const configFile = fs.readFileSync(path.resolve(__dirname, './config.json'), 'utf8');
const config = JSON.parse(configFile);

//By default will check server had user each hour
const checkServerTime = config['checkServerTime'];
const discordToken = config['discordBotToken'];
const discordClientId = config['discordClientId'];

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Register
const commands = [
	{
		name: 'status',
		description: '檢查伺服器狀態',
	},
  {
    name: 'start',
    description: '啟動伺服器',
  },
  {
    name: 'stop',
    description: '停止伺服器',
  },
];

const rest = new REST({ version: '10' }).setToken(discordToken);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(Routes.applicationCommands(discordClientId), { body: commands });
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

setInterval(function () {
  _checkValheimStatus();
}, checkServerTime);

//Real part for bot action

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'status') {
    _checkStatus(interaction);
	}
  if (interaction.commandName === 'start') {
    _startServer(interaction);
  }
  if (interaction.commandName === 'stop') {
    _stopServer(interaction);
  }
});

client.login(discordToken);

async function _checkStatus(msg){
  const status = await Aws.checkStatus(request, config);

  let content = '遊戲伺服器目前狀態: ';

  if(status === 'running'){
    content += '正在運行✧◝(⁰▿⁰)◜✧';
  }else{
    content += '尚未啟動或正在啟動（¯﹃¯）';
  }
  await msg.reply(content);
}

async function _startServer(msg){
  const startResult = await Aws.startServer(request, config);
  let content = '遊戲伺服器正在啟動。需時大約5-7分鐘左右！（請耐心等侯，維京人就是啟動得比較慢）';
  await msg.reply(content);
}

async function _stopServer(msg){
  const stopResult = await Aws.stopServer(request, config);
  let content = '遊戲伺服器正在關閉。晚安✧*｡٩(ˊᗜˋ*)و✧*｡ ';
  await msg.reply(content);
}

async function _checkValheimStatus(){
  const statusUrl = config['valheimServerStatusUrl'];
  //If server do not had any player, stop the ec2 server
  const serverStatus = await Common.checkValheimStatus(request, statusUrl);
  if(serverStatus === 'non_playing'){
    console.log('Cannot detect any player. Stop Server...');
    await Aws.stopServer(request, config);
  }
}
