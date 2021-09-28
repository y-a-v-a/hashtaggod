require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');
const { getDynamoDBClient } = require('./src/aws');
const debug = require('debug')('hashtaggod:koa');
const initializeTweeter = require('./src/tweeter');

const app = new Koa();
const router = new Router();

let tweets;
try {
  tweets = JSON.parse(fs.readFileSync('./src/tweets.json', 'utf8'));
} catch (error) {
  debug(error.message);
}

const params = {
  TableName: 'hashtaggod',
  Key: {
    id: { S: process.env.HASHTAGGOD_KEY },
  },
};

router.get('/', async (ctx, next) => {
  const client = getDynamoDBClient();
  await next();
  debug('Process request');
  try {
    const item = await client.getItem(params).promise();
    const pid = item?.Item?.pid?.N;
    const tweet = (pid && tweets[pid]) || 'not found';
    const lastTweet = (pid && tweets[pid - 1]) || 'not found';

    ctx.body = JSON.stringify({ pid, tweet, lastTweet });
  } catch (error) {
    debug(error.message);
    ctx.status = 500;
    ctx.body = 'Internal server error';
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT);
debug(`Koa running on port ${process.env.PORT}`);

debug('Initialize tweeter');
initializeTweeter(tweets);
