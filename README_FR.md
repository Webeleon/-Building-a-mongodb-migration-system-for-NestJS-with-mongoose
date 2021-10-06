![banner](images/banner.png)

# Coder un systéme de migration pour NestJS avec mongoos

Prérequis:
- Un projet NestJS fonctionel
- Utiliser MongoDB et mongoose

Récemment, j'ai ressenti le besoin pressant de refactorer mon jeu discord.
C'est un projet en cours, loin d'être finis mais je supportais plus que les maisons soit appellé `homes` au lieu de `houses`.
Oh j'en entends déjà me dire que: 'Change les labels affiché, tout le monde c'est pareil!'.

![FAUX](https://media.giphy.com/media/4ObtlO6BjidKE/giphy.gif)

Je me soucis de la consistence du nommage dans mes projets! Si les maisons sont des appartements, "c'est la porte ouverte à toute les fenêtres".

Bref, j'enfile ma veste de chercheur et je me lance armé de mon meilleur google-fu.
Aujourd'hui, je vous présente le résultat de mon travail.


J'ai choisi d'utiliser la bibliothéque [`migrate`](https://www.npmjs.com/package/migrate). 
Un outils agnostique de toute base de données offrant une logique simple de script de migration et de retour en arrière.
En plus, le status des migrations peut être stocké sous n'importe quel support (en base, un fichier json, ???).

Assez parlé de moi, laissez moi vous guider.

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

Le premier contiendra nos script de migration et le second sera notre boite à outils.
Commencons par le second!

## Quelque outils

Dans l'intro, nous avons vue que l'outils `migrate` est agnostique vis-à-vis des bases de données.
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
      La migration vas ici.
   */
};

export const down = async () => {
  const db = await getDb();
  /*
      Et ici, c'est pour le retour en arrière.
   */
};
```

I had some trouble with `ts-node/register` in migrate command line. 
J'ai rencontré quelque soucis avec `ts-node/register` en utilisant `migrate` en ligne de commande.,,
Ce petit script m'a sauvé la mise!
Vas y! Maintenant! Ajoute le!
```js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsNode = require('ts-node');
module.exports = tsNode.register;
```

## Mise à jour du `package.json`

Il est temps de mettre à joue le `package.json` de notre projet afin d'avoir un jolie collection de script facile à utiliser!

### Un script pour générer les fichiers de migrations

Ajoutons cette ligne dans la section script du fichier `package.json`
```
"migrate:create": "migrate create --template-file ./src/migrations-utils/template.ts --migrations-dir=\"./src/migrations\" --compiler=\"ts:./src/migrations-utils/ts-compiler.js\"",
```

`--template-file ./src/migrations-utils/template.ts` fournis le template, simple et efficace pour notre projet en typescript.
Le template est une façon rapide de créer la base de nos script de migration!

`--migrations-dir=\"./src/migrations\"` Explique à `migrate` ou sont sensé être les scripts de migration.
Par défaut, c'est à la racine du projet...

`--compiler=\"ts:./src/migrations-utils/ts-compiler.js\"` Explique à `migrate` comment gérer les fichiers typescript.


Il suffit de lancer cette commande pour créer une migration vide en typescript dans le bon dossier!
```
npm run migrate:create -- <migration name>
```

### Un script pour les migratios et un script pour revenir en arrière!

EEEEEeeet deux lignes de plus dans le `package.json`, toujours dans la section script!
```
"migrate:up": "migrate --migrations-dir=\"./src/migrations\" --compiler=\"ts:./src/migrations-utils/ts-compiler.js\" up",
"migrate:down": "migrate --migrations-dir=\"./src/migrations\" --compiler=\"ts:./src/migrations-utils/ts-compiler.js\" down"
```

Pas de nouvelle option ici, tout est expliqué au dessu mais comme je suis sympa voila un petit rappel.

`--migrations-dir=\"./src/migrations\"` Explique à `migrate` ou sont nos scripts de migrations...

`--compiler=\"ts:./src/migrations-utils/ts-compiler.js\"` Explique à `migrate` comment gérer les fichiers typescript...

On peu maintenant éxecuter le script `npm run migrate:up` pour les migrations et le script `npm run migrate:down` pour revenir en arrière.

## Mais que ce passe-t-il quand nous executons une migration?

Migrate vas stocker l'état des migrations dans un fichier à la racine du projet.
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

Je serai heureux de répondre aux questions dans les commentaires.

Si cette article t'as plus, n'hésite pas à me rejoindre sur discord Webeleon!
:phone:[Webeleon coding lair on discord](https://discord.gg/h7HzYzD82p)

Tu peux aussi me contacter par mail si tu cherche un freelance sympa et efficace :moneybag:
:envelope:[Email me!](contact@webeleon.dev)

Et comme je suis sympa, tu trouvera les sources sur github!
:gift:[Get the code of the tuto from github](https://github.com/Webeleon/-Building-a-mongodb-migration-system-for-NestJS-with-mongoose.git)

## Documentation

![documentation](https://media.giphy.com/media/3o6ozkeXSb0Cm25CzS/giphy.gif)

- [NestJS](https://nestjs.com/)
- [Install mongoose with nest](https://docs.nestjs.com/techniques/mongodb)
- [Migrate](https://github.com/tj/node-migrate#readme)


