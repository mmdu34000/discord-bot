# Export des membres Discord

## 📋 Fonctionnalité

Le bot peut exporter tous les membres d'un serveur Discord avec leurs informations dans un fichier CSV.

## 🚀 Utilisation

### Commande Discord

Dans Discord, utilisez la commande slash :

```
/export-members
```

### Permissions requises

⚠️ **Administrateur uniquement** : Seuls les administrateurs du serveur peuvent utiliser cette commande.

## 📊 Contenu de l'export

Le fichier CSV contient les colonnes suivantes :

1. **Pseudo** : Le pseudo Discord global de l'utilisateur
2. **Nickname** : Le surnom sur le serveur (vide si non défini)
3. **Rôles** : Liste des rôles séparés par `;` (exclut @everyone, triés par importance)
4. **ID Utilisateur** : L'ID unique Discord de l'utilisateur (entre guillemets pour Excel)
5. **Date d'arrivée** : Date à laquelle l'utilisateur a rejoint le serveur (format YYYY-MM-DD)
6. **Discriminator** : L'ancien discriminator Discord (N/A pour les nouveaux comptes)
7. **Compte créé le** : Date de création du compte Discord (format YYYY-MM-DD)

### Exemple de fichier CSV

```csv
Pseudo,Nickname,Rôles,ID Utilisateur,Date d'arrivée,Discriminator,Compte créé le
john_doe,John,Admin; Modérateur,"123456789012345678",2024-01-15,1234,2020-05-10
jane_smith,Jane,Membre,"987654321098765432",2024-02-20,5678,2021-03-15
bob_wilson,,Aucun rôle,"456789012345678901",2024-03-10,N/A,2022-01-20
```

**Note importante** : 
- L'ID utilisateur est entre guillemets pour éviter qu'Excel l'affiche en notation scientifique
- Si un utilisateur n'a pas de rôles, "Aucun rôle" sera affiché
- Les rôles sont triés par ordre d'importance (du plus haut au plus bas)

## 📁 Emplacement des fichiers

Les fichiers sont sauvegardés dans le dossier `exports/` à la racine du projet bot.

**Chemin par défaut** : `/var/www/discord-bot/exports/`

**Nom du fichier** : `export-members-[NomServeur]-[Date]-[Heure].csv`

Exemple : `export-members-Mon_Serveur-2024-11-08_18-30-45.csv`

## ⚙️ Configuration

### Changer le dossier d'export

Vous pouvez modifier le dossier d'export en ajoutant dans le fichier `.env` :

```
EXPORT_DIR=/chemin/vers/votre/dossier
```

Par défaut, le dossier est `exports/` à la racine du projet.

## 🔒 Sécurité

- Les fichiers CSV sont sauvegardés localement sur le serveur
- Le dossier `exports/` est dans `.gitignore` et ne sera pas commité
- Seuls les administrateurs peuvent déclencher l'export

## 🐛 Dépannage

### La commande n'apparaît pas

1. Attendez quelques minutes (les commandes globales peuvent prendre jusqu'à 1 heure)
2. Redémarrez Discord
3. Vérifiez que le bot a les permissions nécessaires

### Erreur "Vous devez être administrateur"

Seuls les administrateurs du serveur peuvent utiliser cette commande. Vérifiez vos permissions Discord.

### Le fichier n'est pas créé

1. Vérifiez les permissions d'écriture sur le serveur :
```bash
cd /var/www/discord-bot
ls -la exports/
```

2. Vérifiez les logs du bot :
```bash
pm2 logs discord-bot
```

3. Vérifiez que le dossier existe :
```bash
ls -la /var/www/discord-bot/exports/
```

## 📝 Notes

- Les bots sont exclus de l'export
- Les rôles sont triés par ordre d'importance (du plus haut au plus bas)
- Le rôle @everyone est toujours exclu
- Les dates sont au format ISO (YYYY-MM-DD)

