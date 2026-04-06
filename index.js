const { Client, GatewayIntentBits, Events } = require('discord.js');
const mineflayer = require('mineflayer');

// ================= AYARLAR =================
const DISCORD_TOKEN = 'MY_TOCKEN'; // Efsanevi sızdırılmış token!
const MC_HOST = 'eu.stray.gg'; 
const MC_EMAIL = 'straytag@mail.xyz'; 
const MC_VERSION = '1.21'; 

// --- YETKİ VE COOLDOWN AYARLARI ---
const ADMIN_ID = 'SENIN_DISCORD_ID_NUMARAN'; // Buraya kendi ID'ni yaz (Sınırsız yetki)
const SPECIAL_USERS = ['ID_1', 'ID_2']; // 2 Dakika cooldown alacak kişilerin ID listesi
let isBotActive = true; // Botun genel çalışma durumu
const cooldowns = new Map(); 
// ===========================================

const discordClient = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

let mcBot = null;
let isBotReady = false; 

function connectMcBot() {
    // Eğer bot kapalı moddaysa bağlanmaya çalışma
    if (!isBotActive) return;

    console.log('Minecraft botu sunucuya bağlanıyor...');
    isBotReady = false;
    
    mcBot = mineflayer.createBot({
        host: MC_HOST, 
        username: MC_EMAIL, 
        auth: 'microsoft', 
        version: MC_VERSION, 
        hideErrors: true 
    });

    mcBot.once('spawn', () => {
        setTimeout(() => {
            if (!isBotActive) return; // Geçiş sırasında kapatıldıysa iptal et
            mcBot.chat('/server NethPot');
            console.log('NethPot komutu atıldı. Bot hazır!');
            isBotReady = true; 
        }, 10000);
    });

    mcBot.on('error', (err) => {
        console.log('Minecraft Hatası:', err);
    });
    
    mcBot.on('end', () => {
        isBotReady = false;
        
        // Sadece bot aktif moddaysa (bağlantı kazara koptuysa) geri bağlan
        if (isBotActive) {
            console.log('Bağlantı koptu. 15 saniye sonra sunucuya tekrar bağlanılacak...');
            setTimeout(connectMcBot, 15000); 
        } else {
            console.log('Bot oyundan başarıyla çıkış yaptı ve uyku modunda.');
        }
    });
}

discordClient.once(Events.ClientReady, () => {
    console.log(`Discord botu ${discordClient.user.tag} olarak aktif!`);
    connectMcBot(); 
});

discordClient.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const userId = message.author.id;

    // --- ADMIN KOMUTLARI: !AÇ VE !KAPAT ---
    if (userId === ADMIN_ID) {
        if (message.content === '!kapat') {
            if (!isBotActive) return message.reply('Bot zaten uyuyor patron, adamı darlayıp durma!');
            
            isBotActive = false;
            isBotReady = false;
            
            if (mcBot) {
                mcBot.quit(); // Minecraft'tan çıkış yap
            }
            
            return message.reply('Sistem kapatıldı patron! Bot oyundan çıktı ve fişi çekildi.');
        }
        
        if (message.content === '!aç') {
            if (isBotActive) return message.reply('Bot zaten çalışıyor patron!');
            
            isBotActive = true;
            connectMcBot(); // Minecraft'a sıfırdan bağlan
            return message.reply('Sistem tekrar aktif! Bot sunucuya giriş yapıyor, alihlar ekibi hazırlansın.');
        }
    }

    // --- DAVET KOMUTU VE COOLDOWN MANTIĞI ---
    if (message.content.startsWith('!davet ')) {
        if (!isBotActive) {
            return message.reply('Bot şu an kapalı Dodi, patronun açmasını bekle!');
        }

        if (!isBotReady) return message.reply('Bot henüz sunucuya tam bağlanmadı, sakin ol.');

        // Admin değilse Cooldown kontrolü yap
        if (userId !== ADMIN_ID) {
            const now = Date.now();
            const lastUsed = cooldowns.get(userId) || 0;
            
            const cooldownAmount = SPECIAL_USERS.includes(userId) ? 120 * 1000 : 30 * 1000;
            const expirationTime = lastUsed + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
                return message.reply(`Hop! Çok hızlısın. Tekrar yazabilmek için **${timeLeft}** saniye beklemen lazım.`);
            }

            cooldowns.set(userId, now);
        }

        const targetUser = message.content.split(' ')[1];
        if (!targetUser) return message.reply('Kimi davet edeceğiz? İsim yazmayı unuttun.');

        mcBot.chat(`/ca invite ${targetUser}`);
        message.channel.send(`\`${targetUser}\` kişisine davet gönderildi. Emriniz olur patron!`);
    }

    // !yaz komutu yetkisi (Sadece admin)
    if (message.content.startsWith('!yaz ') && userId === ADMIN_ID) {
        const msg = message.content.replace('!yaz ', '');
        if (!isBotReady || !mcBot) return message.reply('Bot şu an sunucuda değil!');
        
        mcBot.chat(msg);
        message.reply(`Sunucuya gönderildi: \`${msg}\``);
    }
});

discordClient.login(DISCORD_TOKEN);
