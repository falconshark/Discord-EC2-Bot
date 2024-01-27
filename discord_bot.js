const fs = require('fs');
const path = require('path');
const AwsSdk = require("aws-sdk");

const Common = require('./lib/common');
const Aws = require('./lib/aws');

const configFile = fs.readFileSync(path.resolve(__dirname, './config.json'), 'utf8');
const config = JSON.parse(configFile);

const discordToken = config['discordBotToken'];
const discordClientId = config['discordClientId'];

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

AwsSdk.config.loadFromPath('./config.json');

const ec2 = new AwsSdk.EC2({ apiVersion: "2016-11-15" });

//設定Disocrd的Command，需要加新功能才改這裡
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

// 不用理會
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

// 不用理會
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

//偵測用戶輸入Command => Function
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
  const status = await Aws.checkStatus(ec2, config);
  let content = '遊戲伺服器目前狀態: ';

  if(!status){
		content += '尚未啟動或正在啟動（¯﹃¯）';
  }else{
    content += '正在運行✧◝(⁰▿⁰)◜✧';
  }
  await msg.reply(content);
}

async function _startServer(msg){
  const startResult = await Aws.startServer(ec2, config);
  let content = '遊戲伺服器正在啟動。需時大約2-3分鐘左右！';
  await msg.reply(content);
}

async function _stopServer(msg){
  const stopResult = await Aws.stopServer(ec2, config);
  let content = '遊戲伺服器正在關閉。晚安✧*｡٩(ˊᗜˋ*)و✧*｡ ';
  await msg.reply(content);
}
