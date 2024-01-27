# Discord EC2 BOT
Using discord to control a EC2 server.

## Requirement
Node.js version 16.18.0 or higher.

## Usage and Deploy
1. Copy config.sample.json to config.json, edit it.
```json
{
	"accessKeyId": "Access Key for AWS",
	"secretAccessKey": "Access Key Secret for AWS",
	"instanceId": "EC2 instance ID",
	"region": "ap-east-1",
        "discordBotToken": "Discord Bot Token",
        "discordClientId": "Discord Bot Client ID"
}
```
2. Install PM2 (Advanced process manager) for keep running it:
```bash
npm install pm2 -g
pm2 start discord_bot.js
pm2 save
```
