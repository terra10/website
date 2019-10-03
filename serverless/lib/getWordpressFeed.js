"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const https = require("https");
const node_fetch_1 = require("node-fetch");
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-3',
    httpOptions: {
        agent: new https.Agent({
            keepAlive: true
        })
    }
});
// Handler for AWS Lambda 
async function handler(event, _context, callback) {
    try {
        callback(undefined, await getWordpressFeed(event));
    }
    catch (err) {
        callback(err);
    }
}
exports.handler = handler;
// Main function logic used by handler, test and local development 
async function getWordpressFeed(event) {
    // Let's build the headers for the response API call 
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
    };
    try {
        // Let's log whats in the API Gateway Event: 
        console.debug(`getWordpressFeed | event: ${JSON.stringify(event)}`);
        const response = await node_fetch_1.default('https://www.rubix.nl/category/terra10-blogs/feed/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // console.log('response.status = ' + response.status); 
        // console.log('response.statusText = ' + response.statusText); 
        const responseXml = await response.text();
        // console.log('response.xml = ' + responseXml); 
        var convert = require('xml-to-json-promise');
        const responseJson = await convert.xmlDataToJSON(responseXml);
        console.log('response.json = ' + JSON.stringify(responseJson));
        // responseJson.rss.channel[0].item[0] 
        Object.keys(responseJson.rss.channel[0].item).forEach(async (key) => {
            // console.log('item: ' + key); 
            const title = responseJson.rss.channel[0].item[key].title[0];
            const pubDate = responseJson.rss.channel[0].item[key].pubDate[0];
            const link = responseJson.rss.channel[0].item[key].link[0];
            const creator = responseJson.rss.channel[0].item[key]["dc:creator"][0];
            const uniqueId = responseJson.rss.channel[0].item[key].guid[0]._.split('?p=').pop();
            // console.log('title = ' + title); 
            // console.log('pubDate = ' + pubDate); 
            // console.log('link = ' + link); 
            // console.log('creator = ' + creator); 
            const params = {
                TableName: process.env.DYNAMODBBLOG,
                Key: {
                    identification: uniqueId
                },
                ExpressionAttributeValues: {
                    ':ttl': title,
                    ':aut': creator,
                    ':dat': pubDate,
                    ':url': link
                },
                UpdateExpression: 'set titel = :ttl, auteur = :aut, datum = :dat, link = :url'
            };
            // console.debug(JSON.stringify(params)); 
            await documentClient.update(params).promise();
        });
        return {
            statusCode: 201,
            headers,
            body: undefined
        };
    }
    catch (err) {
        console.error(`Unexpected 500 | ${err.message}`);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: err.message })
        };
    }
}
exports.getWordpressFeed = getWordpressFeed;
