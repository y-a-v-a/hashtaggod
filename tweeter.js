const fs = require('fs');
const Twitter = require('twitter');

const tweets = './tweets.json';
const pidFile = './pid';

let pid = 1 * fs.readFileSync(pidFile, { encoding: 'utf8' }).trim();
let new_pid = pid + 1;

let client = new Twitter({
  consumer_key: 'x',
  consumer_secret: 'y',
  access_token_key: 'z',
  access_token_secret: 'a'
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
