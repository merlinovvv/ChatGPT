const http = require('http');
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});
server.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port ${process.env.PORT || 5000}`);
});

const TelegramBot = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.GPT_API,
});
const openai = new OpenAIApi(configuration);
const bot = new TelegramBot(process.env.TELEGA_API, { polling: true });
const chatId_1 = Number(process.env.CHAT_ID_1);
const chatId_2 = Number(process.env.CHAT_ID_2);
bot.on('message', async (msg) => {
    const text = msg.text.trim();
    // проверяем, что идентификатор чата соответствует допустимому значению
    if (msg.chat.id === chatId_1 || msg.chat.id === chatId_2) {
        if (text) {
            bot.sendChatAction(msg.chat.id, 'typing');
            try {
                const response = await openai.createChatCompletion({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: text }],
                });

                if (response.data.choices && response.data.choices.length > 0) {
                    bot.sendMessage(msg.chat.id, response.data.choices[0].message.content);
                } else {
                    bot.sendMessage(msg.chat.id, 'Не удалось получить ответ от OpenAI API');
                }
            } catch (error) {
                console.log(error);
                bot.sendMessage(msg.chat.id, 'Произошла ошибка при выполнении запроса к OpenAI API');
            }
        }
    } else {
        bot.sendMessage(msg.chat.id, 'Вы не можете отправлять сообщения в этот чат');
    }
});

    // if (msg.chat.id === chatId_1 || msg.chat.id === chatId_2) {

    // } else {
    //     bot.sendMessage(msg.chat.id, msg.chat.first_name + ', тебе сюда нельзя.')
    // }