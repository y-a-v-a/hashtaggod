const fs = require('fs');
const Twitter = require('twitter');
const config = require('./config');

const tweets = './tweets.json';
const pidFile = './pid';

let pid = 1 * fs.readFileSync(pidFile, { encoding: 'utf8' }).trim();
let new_pid = pid + 1;


let client = new Twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
});

fs.readFile(tweets, { encoding:'utf8' }, (error, json) => {
  if (error) {
    throw error;
  }

  let tweetList = JSON.parse(json);
  let tweet = tweetList[pid];

  // do tweet
  client.post('statuses/update', { status: tweet },  (error, tweet, response) => {
    if (error) {
      throw error;
    }
    fs.writeFile(pidFile, new_pid, (error) => {
      if (error) {
        throw error;
      }
    });
  });
});
