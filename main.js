const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Emoji thay thế
const emojiMap = {
    '<:rt:1225071926427254936>': '<:rt:1362372684272373970>',
    '<:BossRushTokens:1318304496404664431>': '<:BossRushTokens:1362372741856104489>',
    '<:alscandy:1300366683826814996>': '<:alscandy:1362372780267671613>',
    '<:emerald:1204766658397343805>': '<:emerald:1362372819685609586>',
    '<:Anniversary1Tokens:1338944371701317864>': '<:Anniversary1Tokens:1362372864313131190>',
    '<:rerolls:1216376860804382860>': '<:RerollShard:1362372963239723008>',
    '<:gold:1217525743408648253>': '<:gold:1362377322879258825>',
    '<:SkinTicket:1318304829172617306>': '<:SkinTicket:1362373149030875367>',
    '<:als_jewels:1265957290251522089>': '<:als_jewels:1362373203598512149>',
    '<:Anniversary1Tickets:1338944972015145070>': '<:Anniversary1Tickets:1362373278538141878>',
    '<:shells:1256934942475026455>': '<:shells:1362373314353299487>'
};

// Danh sách kênh nguồn và kênh đích tương ứng
const CHANNEL_MAP = {
    '1355567251750916139': '1362434643818975402', // ví dụ: kênh A → B
    '1362742344847327265': '1355600304800006304',
    '1363059866737967185': '1363060127439130794'
};

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// Thay emoji trong đoạn text
function replaceEmojis(text) {
    if (!text) return '';
    for (const [oldEmoji, newEmoji] of Object.entries(emojiMap)) {
        const escapedEmoji = oldEmoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedEmoji, 'g');
        text = text.replace(regex, newEmoji);
    }
    return text;
}

// Lắng nghe embed mới
client.on('messageCreate', async (message) => {
    if (!Object.keys(CHANNEL_MAP).includes(message.channel.id)) return;
    if (!message.embeds.length || !message.author.bot) return;

    try {
        const embed = message.embeds[0];
        const newEmbed = new EmbedBuilder()
            .setTitle(embed.title || 'Thông tin người chơi')
            .setDescription(replaceEmojis(embed.description))
            .setColor(embed.color || '#00ccff')
            .setTimestamp()
            .setFooter({
                text: 'Kazona Tracker | 2025',
                iconURL: 'https://cdn.discordapp.com/avatars/1355872468031504567/04b93e5bf9bb8a1b15b8688f162da16a.png?size=1024'
            })
            .setAuthor({
                name: '📦 Kazona Tracker',
                iconURL: 'https://cdn.discordapp.com/icons/710853370847559720/bf99999d95246be56948a07e277846ce.png?size=4096'
            })
            .setThumbnail('https://images-ext-1.discordapp.net/external/Z6YTaBT1GgauLIUKqUGBHy9fLml9jmFUYS5QQUVdTe4/%3Fsize%3D4096/https/cdn.discordapp.com/icons/1355527442311413832/38c9e0826fff5b3522e8b917186c0e48.png?format=webp&quality=lossless');

        if (embed.image?.url) newEmbed.setImage(embed.image.url);

        if (embed.fields?.length) {
            const newFields = embed.fields.map(field => ({
                name: replaceEmojis(field.name),
                value: replaceEmojis(field.value),
                inline: field.inline
            }));
            newEmbed.addFields(newFields);
        }

        const targetChannelId = CHANNEL_MAP[message.channel.id];
        const targetChannel = await client.channels.fetch(targetChannelId);
        if (targetChannel?.isTextBased()) {
            await targetChannel.send({ embeds: [newEmbed] });
            console.log(`✅ Đã gửi embed từ ${message.channel.id} sang ${targetChannelId}`);
        }
    } catch (err) {
        console.error('❌ Lỗi xử lý embed:', err);
    }
});

// Khi bot sẵn sàng
client.on('ready', () => {
    console.log(`🤖 Bot ${client.user.tag} đã hoạt động!`);
    client.user.setPresence({
        activities: [{ name: 'Roblox Tracker !', type: 3 }],
        status: 'online'
    });
});

// Đăng nhập bot bằng token trong .env
client.login(process.env.TOKEN);

