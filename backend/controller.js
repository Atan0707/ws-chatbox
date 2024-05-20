const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const express = require("express")
const cors = require("cors")
let qrScanned = false;

const port = 8081;
const media = MessageMedia.fromFilePath('\amigos.jpg')
const app = express();
app.use(cors());
app.use(express.json());

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
});

client.on("authenticated", () => {
    console.log("Client is authenticated!")
    qrScanned = true
})

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

app.post('/send-message', (req, res) => {
    const {chatId, message} = req.body;
    // let chatIdWithoutSuffix = chatId.slice(0, -5);
    // client.sendMessage(chatId, `Salam madani ${chatIdWithoutSuffix} dari bot madani`);
    client.sendMessage(chatId, message);
    res.json({ status: 'Message sent' });
})

app.get("/qr", (req, res) => {
    if (qrScanned) {
        res.send({ status: "Authenticated" })
    } else {
        new Promise((resolve) => {
            client.once("qr", resolve);
        })
            .then((qrData) => {
                res.send({ qrData })
            })
    }
});

app.listen(port, () => {
    console.log(`listen on port ${port} ...`);
})