// Configuration PM2 pour le bot Discord
// Installation: npm install -g pm2
// Démarrage: pm2 start ecosystem.config.js
// Sauvegarde: pm2 save
// Démarrage au boot: pm2 startup

module.exports = {
  apps: [{
    name: 'discord-bot',
    script: 'bot.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    time: true
  }]
};

