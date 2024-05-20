const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const express = require("express")

const port = 8081;
const media = MessageMedia.fromFilePath('\amigos.jpg')
const app = express();

const client = new Client({
    webVersionCache: {
        type: "remote",
        remotePath:
            "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    authStrategy: new LocalAuth({
        dataPath: ".wwebjs_auth"
    }),
});


client.on('ready', () => {
    console.log('Client is ready!');
    const chatId = '60132615040@c.us';
    let chatIdWithoutSuffix = chatId.slice(0, -5);
    client.sendMessage(chatId, `Salam madani ${chatIdWithoutSuffix} dari bot madani`);
    // client.sendMessage(chatId, `Salam madani ${chatId} dari bot madani`);
    client.sendMessage(chatId, media);
});

client.on('message', async message => {
    // console.log('Received message:', message.body);
    console.log(message.from);
    const content = message.body;
    

    if(content === "salam"){
        client.sendMessage(message.from, "wasalam");
        // client.sendMessage(message.from, media);
        // console.log(message.from);
        // console.log("msg sent")
    }
})

client.on('qr', qr => {
    qrcodeTerminal.generate(qr, {small: true});
});

client.initialize();

app.listen(port, () => {
    console.log(`listen on port ${port} ...`);
})