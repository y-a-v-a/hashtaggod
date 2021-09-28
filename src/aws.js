/**
 * Wrapper around the aws-sdk
 * Initiated connections will be cached
 */
const AWS = require('aws-sdk');
const debug = require('debug')('hashtaggod:aws');

AWS.config.update({
  region: 'eu-central-1',
});

let dynamoDBClient;

module.exports.getDynamoDBClient = function () {
  debug('DynamoDB connection requested');

  if (!dynamoDBClient) {
    debug('DynamoDB connection initiated');
    dynamoDBClient = new AWS.DynamoDB({
      apiVersion: '2012-08-10',
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  return dynamoDBClient;
};
