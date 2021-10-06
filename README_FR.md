![banner](images/banner.png)

# Coder un système de migration pour NestJS avec mongoos

Prérequis:
- Un projet NestJS fonctionel
- Utiliser MongoDB et mongoose

Récemment, j'ai ressenti le besoin pressant de refactorer mon jeu discord.
C'est un projet en cours, loin d'être fini mais je ne supportais plus que les maisons soient appelées `homes` au lieu de `houses`.
Oh j'en entends déjà me dire : 'Change les labels affichés, c'est pareil!'.

![FAUX](https://media.giphy.com/media/4ObtlO6BjidKE/giphy.gif)

Je me soucis de la consistance du nommage dans mes projets! Si les maisons sont des appartements, "c'est la porte ouverte à toutes les fenêtres".

Bref, j'enfile ma veste de chercheur et je me lance armé de mon meilleur google-fu.
Aujourd'hui, je vous présente le résultat de mon travail.


J'ai choisi d'utiliser la bibliothèque [`migrate`](https://www.npmjs.com/package/migrate). 
Un outil agnostique de tout type de base de données offrant une logique simple de script de migration et de retour en arrière.
De plus, le statut des migrations peut être stocké sous n'importe quel support (en base, un fichier json, ???).

Assez parlé de moi, laissez-moi vous guider.

## Installation [`migrate`](https://www.npmjs.com/package/migrate)

Installons ce coquin!
```bash
npm i --save migrate
```

## Crée un dossier pour stocker les scripts de migrations!

On aura besoin de deux dossiers:
```bash
mkdir src/migrations
mkdir src/migrations-utils
```

Le premier contiendra nos scripts de migration et le second sera notre boîte à outils.
Commencons par le second!

## Quelques outils

Dans l'intro, nous avons vu que l'outil `migrate` fait fi du type de nos bases de données.
Nous avons donc besoin d'un script pour nous connecter à mongodb:
```typescript
import { MongoClient } from 'mongodb';
import { configs } from '../config/configuration';

const MONGO_URL = configs.mongoUrl;

export const getDb = async () => {
  const client: any = await MongoClient.connect(MONGO_URL, { useUnifiedTopology: true });
  return client.db();
};
```

Cool! Continuons!

![antilope break](https://media.giphy.com/media/Zd1BUb0qs6nwjeMUBu/giphy.gif)

Migrate est un outil écrit en javascript.
Et comme nous utilisons Typescript, la meilleur chose à faire est de créer un template déjà connecté à notre mongo.
```typescript
import { getDb } from '../migrations-utils/db';

export const up = async () => {
  const db = await getDb();
  /*
      La migration va ici.
   */
};

export const down = async () => {
  const db = await getDb();
  /*
      Et ici, c'est pour le retour en arrière.
   */
};
```

 
J'ai rencontré quelques soucis avec `ts-node/register` en utilisant `migrate` en ligne de commande...
Ce petit script m'a sauvé la mise!
Vas-y! Maintenant! Ajoute-le!
```js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsNode = require('ts-node');
module.exports = tsNode.register;
```

## Mise à jour du `package.json`

Il est temps de mettre à jour le `package.json` de notre projet afin d'avoir une jolie collection de script facile à utiliser!

### Un script pour générer les fichiers de migration

Ajoutons cette ligne dans la section script du fichier `package.json`
```
"migrate:create": "migrate create --template-file ./src/migrations-utils/template.ts --migrations-dir=\"./src/migrations\" --compiler=\"ts:./src/migrations-utils/ts-compiler.js\"",
```

`--template-file ./src/migrations-utils/template.ts` fourni le template, simple et efficace pour notre projet en typescript.
Le template est une façon rapide de créer la base de nos script de migration!

`--migrations-dir=\"./src/migrations\"` Explique à `migrate` où sont sensés être les scripts de migration.
Par défaut, c'est à la racine du projet...

`--compiler=\"ts:./src/migrations-utils/ts-compiler.js\"` Explique à `migrate` comment gérer les fichiers typescript.


Il suffit de lancer cette commande pour créer une migration vide en typescript dans le bon dossier!
```
npm run migrate:create -- <migration name>
```

### Un script pour les migrations et un script pour revenir en arrière!

EEEEEeeet deux lignes de plus dans le `package.json`, toujours dans la section script!
```
"migrate:up": "migrate --migrations-dir=\"./src/migrations\" --compiler=\"ts:./src/migrations-utils/ts-compiler.js\" up",
"migrate:down": "migrate --migrations-dir=\"./src/migrations\" --compiler=\"ts:./src/migrations-utils/ts-compiler.js\" down"
```

Pas de nouvelle option ici, tout est expliqué au-dessus mais comme je suis sympa voila un petit rappel.

`--migrations-dir=\"./src/migrations\"` Explique à `migrate` où sont nos scripts de migration...

`--compiler=\"ts:./src/migrations-utils/ts-compiler.js\"` Explique à `migrate` comment gérer les fichiers typescript...

On peut maintenant exécuter le script `npm run migrate:up` pour les migrations et le script `npm run migrate:down` pour revenir en arrière.

## Mais que se passe-t-il quand nous exécutons une migration?

Migrate va stocker l'état des migrations dans un fichier à la racine du projet.
Ce fichier est: `migrate.json`.
Il ressemble à ça:
```json
{
  "lastRun": "1605197159478-test.ts",
  "migrations": [
    {
      "title": "1605197159478-test.ts",
      "timestamp": 1605197181474
    }
  ]
}
```

**NE PAS COMMITER `migrate.json`**


## Questions?

![questions](https://media.giphy.com/media/5XRB3Ay93FZw4/giphy.gif)

Je serais heureux de répondre aux questions en commentaires.

Si cette article t'as plu, n'hésite pas à me rejoindre sur le discord Webeleon!
:phone:[Webeleon coding lair on discord](https://discord.gg/h7HzYzD82p)

Tu peux aussi me contacter par mail si tu cherches un freelance sympa et efficace :moneybag:
:envelope:[Email me!](contact@webeleon.dev)

Et comme je suis partageur, tu trouveras les sources sur github!
:gift:[Get the code of the tuto from github](https://github.com/Webeleon/-Building-a-mongodb-migration-system-for-NestJS-with-mongoose.git)

<a href="https://www.buymeacoffee.com/webeleon" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Documentation

![documentation](https://media.giphy.com/media/3o6ozkeXSb0Cm25CzS/giphy.gif)

- [NestJS](https://nestjs.com/)
- [Install mongoose with nest](https://docs.nestjs.com/techniques/mongodb)
- [Migrate](https://github.com/tj/node-migrate#readme)


