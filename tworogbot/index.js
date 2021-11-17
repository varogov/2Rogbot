const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '2108728076:AAEy3LfiodaKAljJyffx6TuetDbcGgcD5j8'

const bot = new TelegramApi(token, { polling: true })

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Отгадай цифру от 0 до 9')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Выбери число', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Приветствие' },
        { command: '/info', description: 'гей?' },
        { command: '/game', description: 'не дота' },

    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/df1/c60/df1c6094-c38b-4e9f-84a3-64bcdf6558ea/4.webp')
            return bot.sendMessage(chatId, `Давно тебя не было в Уличных Гонках! Заходи!`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} гей ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Иди нахуй мы сломались');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Ты огадал, лакерок ебучий ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Лох, правильное число ${chats[chatId]}`, againOptions)
        }
    })

}

start()