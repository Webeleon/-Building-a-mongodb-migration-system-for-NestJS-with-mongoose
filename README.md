![banner](images/banner.png)

# Building a mongodb migration system for NestJS with mongoose

This tutorial is assuming:
- You have a working NestJS project
- You are using MongoDB and mongoose

In a recent past, I had a urge to do a bit of refactoring on my discord game. 
Still a work in progress, but i couldn't stand anymore the fact thar houses were named homes...
I already can ear you, 'just change labels displayed no one care!'. 

![FAUX](https://media.giphy.com/media/4ObtlO6BjidKE/giphy.gif)

I do care about consistency of naming in my code bases. If homes are houses then next thing you know is:
Canons will become wooden swords and wolves are dogs...

I spent a some time online looking for solutions and I finally built something I like.
Let me present you the result of my work.

I chose to use the [`migrate`](https://www.npmjs.com/package/migrate) library since it is database agnostic, offer and easy up/down logic and can store the migration status in any form.

Enough speaking about me, let me guide you through this journey.

## Install [`migrate`](https://www.npmjs.com/package/migrate)

Go on install the bad guy!
```bash
npm i --save migrate
```

## Create a folder to store you migrations!

You will new two folders:
```bash
mkdir src/migrations
mkdir src/migrations-utils
```

The first one will store the update scripts and the seconds will store some utilities.
Let's look into the seconds.

## Some litlle helpers

In the introduction, I told you that migrate is database agnostic. 
Therefore you need to write a little mongodb connector:
```typescript
import { MongoClient } from 'mongodb';
import { configs } from '../config/configuration';

const MONGO_URL = configs.mongoUrl;

export const getDb = async () => {
  const client: any = await MongoClient.connect(MONGO_URL, { useUnifiedTopology: true });
  return client.db();
};
```

Nice! let's keep going.

![antilope break](https://media.giphy.com/media/Zd1BUb0qs6nwjeMUBu/giphy.gif)

Migrate is a tool made in javascript. 
And we use typescript, the best thing to do is have a little template with the database already connected.
```typescript
import { getDb } from '../migrations-utils/db';

export const up = async () => {
  const db = await getDb();
  /*
      Code your update script here!
   */
};

export const down = async () => {
  const db = await getDb();
  /*
      Code you downgrade script here!
   */
};
```

I had some troubles with `ts-node/register` in migrate command line. 
This little helper solved my transpilation errors!
Do the same! now! do it!
```js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsNode = require('ts-node');
module.exports = tsNode.register;
```

## Update `package.json`

it's time for you to update the `package.json` of your project in order to have easy to use scripts for the future!

### A script to generate migration files

Add this sweet line in the `package.json`, in the script section!
```
"migrate:create": "migrate create --template-file ./src/migrations-utils/template.ts --migrations-dir=\"./src/migrations\" --compiler=\"ts:./src/migrations-utils/ts-compiler.js\"",
```

`--template-file ./src/migrations-utils/template.ts` provide a template file, it's a necessary thing since we are in a typescript repo. 
It also provide you an easy way to bootstrap migration just the way you like it!

`--migrations-dir=\"./src/migrations\"` Tell migrate where your migration scripts are stored. 
By default, it's at the project root. 

`--compiler=\"ts:./src/migrations-utils/ts-compiler.js\"` Explain to migrate how to handle typescript files.

Now, you just need to run this command to create and empty typescript migration file in the correct folder!

```
npm run migrate:create -- <migration name>
```

### A script for upgrades and a script for downgrades

AAAAAAnd two more line in the `package.json`, again in the scripts section!
```
"migrate:up": "migrate --migrations-dir=\"./src/migrations\" --compiler=\"ts:./src/migrations-utils/ts-compiler.js\" up",
"migrate:down": "migrate --migrations-dir=\"./src/migrations\" --compiler=\"ts:./src/migrations-utils/ts-compiler.js\" down"
```

No new options here, I already explained them but refeshing is nice.

`--migrations-dir=\"./src/migrations\"` Tells migrate where to find your migrations!

`--compiler=\"ts:./src/migrations-utils/ts-compiler.js\"` Tells migrate how to handle typescript...

You can now run update script: `npm run migrate:up` or downgrade script `npm run migrate:down`

## What will happen when you run a migration?

Migrate will store your migration state in a file at the project root.
This file is called `migrate.json`.
It look like this: 
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

**DO NOT COMMIT `migrate.json`**


## Questions?

![questions](https://media.giphy.com/media/5XRB3Ay93FZw4/giphy.gif)

I'll be glad to answers questions in the comments.

If you liked my discord consider joining my coding lair!
:phone:[Webeleon coding lair on discord](https://discord.gg/h7HzYzD82p)

You can also email me and offer me a contract :moneybag:
:envelope:[Email me!](julien@webeleon.dev)

And since I'm a nice guy, here, take this sample repo containing a working codebase!
:gift:[Get the code of the tuto from github](https://github.com/Webeleon/-Building-a-mongodb-migration-system-for-NestJS-with-mongoose.git)

## Documentation

![documentation](https://media.giphy.com/media/3o6ozkeXSb0Cm25CzS/giphy.gif)

- [NestJS](https://nestjs.com/)
- [Install mongoose with nest](https://docs.nestjs.com/techniques/mongodb)
- [Migrate](https://github.com/tj/node-migrate#readme)


