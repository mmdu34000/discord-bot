const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION - MODIFIEZ CES VALEURS
// ============================================
// Utilisation de variables d'environnement pour la sécurité
// Créez un fichier .env avec BOT_TOKEN et API_URL
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = process.env.API_URL || 'https://api.vps115454.serveur-vps.net/api/discord/reaction';
const EXPORT_DIR = process.env.EXPORT_DIR || path.join(__dirname, 'exports');

// ============================================
// CRÉATION DU CLIENT DISCORD
// ============================================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,  // Nécessaire pour lire les messages
        GatewayIntentBits.GuildMembers  // Nécessaire pour récupérer les nicknames
    ]
});

// ============================================
// ÉVÉNEMENT : Bot connecté
// ============================================
// Note: L'avertissement de dépréciation pour 'ready' peut être ignoré
// Il sera renommé en 'clientReady' dans discord.js v15, mais 'ready' fonctionne toujours en v14
client.once('ready', async () => {
    console.log('═══════════════════════════════════════');
    console.log(`✅ Bot connecté en tant que ${client.user.tag}!`);
    console.log(`📋 ID du bot: ${client.user.id}`);
    console.log(`🌐 Nombre de serveurs: ${client.guilds.cache.size}`);
    console.log('═══════════════════════════════════════');
    console.log('🤖 Bot prêt à écouter les réactions ✅');
    console.log('═══════════════════════════════════════');
    
    // Créer le dossier d'export s'il n'existe pas
    if (!fs.existsSync(EXPORT_DIR)) {
        fs.mkdirSync(EXPORT_DIR, { recursive: true });
        console.log(`📁 Dossier d'export créé: ${EXPORT_DIR}`);
    }
    
    // Enregistrer les commandes slash
    try {
        const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
        
        const commands = [
            new SlashCommandBuilder()
                .setName('export-members')
                .setDescription('Exporte tous les membres du serveur avec leur pseudo et rôles dans un fichier CSV')
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                .toJSON()
        ];
        
        console.log('🔄 Enregistrement des commandes slash...');
        
        // Enregistrer les commandes globalement (peut prendre jusqu'à 1 heure pour se propager)
        // Pour un déploiement plus rapide, on peut aussi les enregistrer par serveur
        const data = await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        
        console.log(`✅ ${data.length} commande(s) slash enregistrée(s)`);
    } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement des commandes:', error);
    }
});

// ============================================
// ÉVÉNEMENT : Réaction ajoutée
// ============================================
// Utilisation de l'événement 'raw' pour détecter les réactions même si le message n'est pas en cache
client.on('raw', async (packet) => {
    // Debug: Afficher tous les événements de réaction (commenté en production)
    // console.log('📦 Événement raw reçu:', packet.t);
    
    // Ne traiter que les événements de réaction
    if (packet.t !== 'MESSAGE_REACTION_ADD' && packet.t !== 'MESSAGE_REACTION_REMOVE') {
        return;
    }
    
    const { d: data } = packet;
    
    // Debug
    console.log(`🔍 Réaction détectée: ${packet.t}, Emoji: ${data.emoji.name}, User: ${data.user_id}`);
    
    // Ignorer les réactions du bot lui-même
    if (data.user_id === client.user.id) {
        console.log('   ⏭️  Ignoré: réaction du bot');
        return;
    }
    
    // Récupérer le nom de l'emoji
    const emojiName = data.emoji.name;
    
    // Vérifier si c'est l'emoji ✅ (white_check_mark)
    if (emojiName !== 'white_check_mark' && emojiName !== '✅') {
        console.log(`   ⏭️  Ignoré: emoji "${emojiName}" n'est pas ✅`);
        return;
    }
    
    try {
        // Récupérer l'utilisateur
        const user = await client.users.fetch(data.user_id);
        
        // Récupérer le canal
        const channel = await client.channels.fetch(data.channel_id);
        
        // Récupérer le membre du serveur pour obtenir le nickname (pseudo du serveur)
        let displayName = user.username; // Par défaut, utiliser le pseudo global
        try {
            const guild = channel.guild;
            if (guild) {
                const member = await guild.members.fetch(data.user_id);
                // Utiliser le nickname du serveur s'il existe, sinon le pseudo global
                displayName = member.displayName || member.nickname || user.username;
            }
        } catch (e) {
            // Si on ne peut pas récupérer le membre, utiliser le pseudo global
            console.log(`   ⚠️  Impossible de récupérer le membre, utilisation du pseudo global`);
        }
        
        // Vérifier si c'est un thread (les sessions de formation sont dans des threads)
        let threadId = data.message_id; // Par défaut, utiliser le message_id
        let messageInfo = '';
        
        try {
            // Si le canal est un thread, utiliser l'ID du thread
            if (channel.isThread()) {
                threadId = channel.id; // L'ID du thread est l'ID du canal pour les threads
                messageInfo = `📍 Thread: ${channel.name} (ID: ${channel.id})`;
            } else {
                // Sinon, c'est un message normal
                const message = await channel.messages.fetch(data.message_id);
                messageInfo = `📍 Canal: ${channel.name}`;
            }
        } catch (e) {
            messageInfo = `📍 Canal ID: ${data.channel_id}`;
            // Si on ne peut pas récupérer le canal, essayer quand même avec le message_id
        }
        
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            console.log(`\n📝 Réaction ✅ détectée:`);
            console.log(`   👤 Utilisateur: ${displayName} (Global: ${user.username}, ID: ${user.id})`);
            console.log(`   💬 Message ID: ${data.message_id}`);
            console.log(`   🧵 Thread ID: ${threadId}`);
            console.log(`   ${messageInfo}`);
            
            // Préparer les données à envoyer à l'API
            // Utiliser le thread_id si disponible, sinon le message_id
            const requestData = {
                message_id: threadId, // Utiliser le thread_id pour les threads
                user_id: data.user_id,
                username: displayName, // Utiliser le nickname du serveur
                emoji: {
                    name: data.emoji.name,
                    id: data.emoji.id
                },
                action: 'add'
            };
            
            // Envoyer la requête à l'API Symfony
            const response = await axios.post(API_URL, requestData, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                console.log(`   ✅ ${displayName} inscrit avec succès à la session`);
                console.log(`   📋 Message: ${response.data.message}`);
            } else {
                console.log(`   ❌ Erreur: ${response.data.message}`);
            }
        } else if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            // Récupérer le canal pour vérifier si c'est un thread
            const channel = await client.channels.fetch(data.channel_id);
            let threadId = data.message_id;
            
            // Récupérer le nickname du serveur
            let displayName = user.username;
            try {
                const guild = channel.guild;
                if (guild) {
                    const member = await guild.members.fetch(data.user_id);
                    displayName = member.displayName || member.nickname || user.username;
                }
            } catch (e) {
                // Utiliser le pseudo global si on ne peut pas récupérer le membre
            }
            
            if (channel.isThread()) {
                threadId = channel.id;
            }
            
            console.log(`\n📝 Réaction ✅ retirée:`);
            console.log(`   👤 Utilisateur: ${displayName} (Global: ${user.username}, ID: ${user.id})`);
            console.log(`   💬 Message ID: ${data.message_id}`);
            console.log(`   🧵 Thread ID: ${threadId}`);
            
            const requestData = {
                message_id: threadId, // Utiliser le thread_id pour les threads
                user_id: data.user_id,
                username: displayName, // Utiliser le nickname du serveur
                emoji: {
                    name: data.emoji.name,
                    id: data.emoji.id
                },
                action: 'remove'
            };
            
            const response = await axios.post(API_URL, requestData, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                console.log(`   ✅ ${displayName} désinscrit avec succès`);
                console.log(`   📋 Message: ${response.data.message}`);
            } else {
                console.log(`   ❌ Erreur: ${response.data.message}`);
            }
        }
        
    } catch (error) {
        if (error.response) {
            console.error(`   ❌ Erreur API (${error.response.status}):`, error.response.data.message || error.message);
        } else if (error.request) {
            console.error(`   ❌ Pas de réponse de l'API. Vérifiez que le serveur Symfony est démarré.`);
            console.error(`   📍 URL: ${API_URL}`);
        } else {
            console.error(`   ❌ Erreur:`, error.message);
        }
    }
});

// ============================================
// ÉVÉNEMENT : Commandes slash
// ============================================
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    if (interaction.commandName === 'export-members') {
        await interaction.deferReply({ ephemeral: true });
        
        try {
            const guild = interaction.guild;
            if (!guild) {
                await interaction.editReply('❌ Cette commande doit être utilisée dans un serveur.');
                return;
            }
            
            // Vérifier les permissions
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                await interaction.editReply('❌ Vous devez être administrateur pour utiliser cette commande.');
                return;
            }
            
            await interaction.editReply('⏳ Export en cours... Cela peut prendre quelques instants.');
            
            // Récupérer tous les membres du serveur
            await guild.members.fetch();
            const members = guild.members.cache.filter(member => !member.user.bot);
            
            // Préparer les données CSV
            const csvRows = [];
            csvRows.push('Pseudo,Nickname,Rôles,ID Utilisateur,Date d\'arrivée');
            
            for (const member of members.values()) {
                const pseudo = member.user.username;
                const nickname = member.nickname || '';
                const roles = member.roles.cache
                    .filter(role => role.name !== '@everyone')
                    .map(role => role.name)
                    .join('; ');
                const userId = member.user.id;
                const joinedAt = member.joinedAt ? member.joinedAt.toISOString().split('T')[0] : 'N/A';
                
                // Échapper les virgules et guillemets dans les valeurs CSV
                const escapeCsv = (value) => {
                    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                };
                
                csvRows.push([
                    escapeCsv(pseudo),
                    escapeCsv(nickname),
                    escapeCsv(roles),
                    userId,
                    joinedAt
                ].join(','));
            }
            
            // Générer le nom du fichier avec timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                            new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
            const filename = `export-members-${guild.name.replace(/[^a-z0-9]/gi, '_')}-${timestamp}.csv`;
            const filepath = path.join(EXPORT_DIR, filename);
            
            // Écrire le fichier CSV
            fs.writeFileSync(filepath, csvRows.join('\n'), 'utf8');
            
            const fileSize = (fs.statSync(filepath).size / 1024).toFixed(2);
            
            console.log(`📊 Export CSV créé: ${filepath}`);
            console.log(`   📋 ${members.size} membres exportés`);
            console.log(`   💾 Taille: ${fileSize} KB`);
            
            await interaction.editReply({
                content: `✅ Export terminé!\n\n` +
                        `📊 **${members.size}** membres exportés\n` +
                        `💾 Fichier: \`${filename}\`\n` +
                        `📁 Chemin: \`${filepath}\`\n` +
                        `📏 Taille: ${fileSize} KB`
            });
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'export:', error);
            await interaction.editReply({
                content: `❌ Erreur lors de l'export: ${error.message}`
            });
        }
    }
});

// Note: Les réactions sont maintenant gérées dans l'événement 'raw' ci-dessus
// Cela permet de détecter les réactions même si le message n'est pas en cache

// ============================================
// GESTION DES ERREURS
// ============================================
client.on('error', (error) => {
    console.error('❌ Erreur Discord:', error);
});

client.on('warn', (warning) => {
    console.warn('⚠️ Avertissement Discord:', warning);
});

// ============================================
// DÉMARRAGE DU BOT
// ============================================
console.log('🚀 Démarrage du bot Discord...');
console.log('═══════════════════════════════════════');

if (!BOT_TOKEN) {
    console.error('❌ ERREUR: Vous devez configurer BOT_TOKEN dans le fichier .env');
    console.error('   Créez un fichier .env avec: BOT_TOKEN=votre_token_ici');
    process.exit(1);
}

if (API_URL.includes('localhost')) {
    console.warn('⚠️ ATTENTION: API_URL est configurée sur localhost');
    console.warn('   Si votre API est ailleurs, modifiez API_URL dans le fichier .env');
}

client.login(BOT_TOKEN).catch((error) => {
    console.error('❌ Erreur de connexion au bot:', error.message);
    console.error('   Vérifiez que le token est correct');
    process.exit(1);
});

