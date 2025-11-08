# Configuration Git pour le bot Discord

## 📋 Fichiers créés

- `.gitignore` : Ignore les fichiers sensibles (node_modules, .env, logs, etc.)
- `.env.example` : Exemple de fichier de configuration
- `.gitattributes` : Configuration Git pour les fins de ligne

## 🔐 Sécurité

⚠️ **IMPORTANT** : Le fichier `.env` contenant le token du bot est dans `.gitignore` et ne sera **JAMAIS** commité.

## 🚀 Utilisation

### 1. Créer votre fichier .env

Copiez `.env.example` en `.env` et remplissez les valeurs :

```bash
cp .env.example .env
```

Puis éditez `.env` :
```
BOT_TOKEN=VOTRE_TOKEN_BOT_DISCORD
API_URL=http://localhost:8000/api/discord/reaction
```

### 2. Initialiser Git (si pas déjà fait)

```bash
cd discord-bot
git init
```

### 3. Ajouter les fichiers

```bash
git add .gitignore .env.example .gitattributes bot.js package.json README.md
```

### 4. Premier commit

```bash
git commit -m "Initial commit: Bot Discord pour inscription automatique aux formations"
```

## 📝 Commandes Git utiles

```bash
# Voir l'état des fichiers
git status

# Ajouter tous les fichiers modifiés
git add .

# Faire un commit
git commit -m "Description des modifications"

# Voir l'historique
git log

# Voir les différences
git diff
```

## ⚠️ Rappel de sécurité

- ❌ **NE JAMAIS** commiter le fichier `.env`
- ❌ **NE JAMAIS** partager le token du bot publiquement
- ✅ Utilisez toujours `.env.example` comme modèle
- ✅ Vérifiez avec `git status` avant de commiter

