require('dotenv').config();
const Twitter = require('twitter');
const debug = require('debug')('hashtaggod:tweeter');
const { getDynamoDBClient } = require('./aws');

/**
 * tweet about every 5 hours.
 * @returns {number}
 */
function createIntervalValue() {
  return 4 * (40 + Math.floor(60 * Math.random())) * 60 * 1000;
}

async function initialize(tweetList) {
  await tweetFromList(tweetList);
}

async function tweetFromList(tweetList) {
  debug('Reading pid');
  const dynamoDBClient = getDynamoDBClient();
  const params = {
    TableName: 'hashtaggod',
    Key: {
      id: { S: process.env.HASHTAGGOD_KEY },
    },
  };
  let new_pid;
  let pid;

  try {
    const item = await dynamoDBClient.getItem(params).promise();
    pid = 1 * item?.Item?.pid?.N;

    const client = new Twitter({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token_key: process.env.ACCESS_TOKEN_KEY,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    });

    let tweet = tweetList[pid];

    await new Promise((resolve, reject) => {
      client.post('statuses/update', { status: tweet }, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  } catch (error) {
    debug(`Tweet error for ${pid}`);
    debug(error);
    const interval = createIntervalValue();
    debug(`Next: ${new Date(Date.now() + interval).toGMTString()}`);
    setTimeout(tweetFromList, interval);
    return;
  }

  new_pid = pid + 1;
  debug(`Tweeted tweet ${new_pid}`);

  try {
    const params = {
      TableName: 'hashtaggod',
      Key: {
        id: { S: process.env.HASHTAGGOD_KEY },
      },
      UpdateExpression: 'set pid = :r',
      ExpressionAttributeValues: {
        ':r': { N: `${new_pid}` },
      },
    };
    await dynamoDBClient.updateItem(params).promise();
    debug('Written new pid in db');
  } catch (e) {
    debug('Could not write pid?');
    debug(e.message);
  }
  const interval = createIntervalValue();
  debug(`Next: ${new Date(Date.now() + interval).toGMTString()}`);
  setTimeout(tweetFromList, interval);
}

module.exports = initialize;
