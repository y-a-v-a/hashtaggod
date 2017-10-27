const fs = require('fs');
const Twitter = require('twitter');
const config = require('./config');

const tweets = './tweets.json';
const pidFile = './pid';

const tweetListAsJSON = fs.readFileSync(tweets, { encoding:'utf8' });
const tweetList = JSON.parse(tweetListAsJSON);

let pid = 1 * fs.readFileSync(pidFile, { encoding: 'utf8' }).trim();
let new_pid;

function createIntervalValue() {
  return 4 * (40 + Math.floor(60 * Math.random())) * 60 * 1000; // tweet about every 5 hours.
}

let interval = createIntervalValue();

let client = new Twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
});

function tweetFromList() {
  let tweet = tweetList[pid];

  client.post('statuses/update', { status: tweet },  (error, tweet, response) => {
    if (error) {
      console.log('Tweet error for ' + pid);
      interval = createIntervalValue();
      setTimeout(tweetFromList, interval);
      return;
    }
    new_pid = pid + 1;
    console.log('Tweeted tweet ' + new_pid);

    fs.writeFile(pidFile, new_pid, (error) => {
      if (error) {
        console.log('Could not write pid?');
        throw error;
      } else {
        pid = new_pid;
        interval = createIntervalValue();
        setTimeout(tweetFromList, interval);
      }
    });
  });
}

setTimeout(tweetFromList, interval);
