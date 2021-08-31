require('dotenv').config();

const fs = require('fs/promises');
const Twitter = require('twitter');

const tweets = './tweets.json';
const pidFile = './pid';

async function main() {
  const tweetListAsJSON = await fs.readFile(tweets, { encoding: 'utf8' });
  const tweetList = JSON.parse(tweetListAsJSON);

  let pid = 1 * (await fs.readFile(pidFile, { encoding: 'utf8' })).trim();
  let new_pid;

  function createIntervalValue() {
    return 4 * (40 + Math.floor(60 * Math.random())) * 60 * 1000; // tweet about every 5 hours.
  }

  let interval = createIntervalValue();

  let client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  });

  function tweetFromList() {
    let tweet = tweetList[pid];

    client.post(
      'statuses/update',
      { status: tweet },
      async (error, tweet, response) => {
        if (error) {
          console.log('Tweet error for ' + pid);
          console.log(error);
          interval = createIntervalValue();
          setTimeout(tweetFromList, interval);
          return;
        }
        new_pid = pid + 1;
        console.log('Tweeted tweet ' + new_pid);

        try {
          await fs.writeFile(pidFile, `${new_pid}`);
          pid = new_pid;
          interval = createIntervalValue();
          setTimeout(tweetFromList, interval);
        } catch (e) {
          console.log('Could not write pid?');
          console.log(e.message);
        }
      }
    );
  }

  setTimeout(tweetFromList, interval);
  tweetFromList();
}

main();
