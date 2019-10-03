"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const https = require("https");
const util_header_1 = require("./util/util-header");
const documentClient = new AWS.DynamoDB.DocumentClient({
    httpOptions: {
        agent: new https.Agent({
            keepAlive: true
        })
    }
});
// Handler for AWS Lambda 
/* istanbul ignore next */
async function handler(event, _context, callback) {
    try {
        callback(undefined, await getBlog(event));
    }
    catch (err) {
        callback(err);
    }
}
exports.handler = handler;
// Main function logic used by handler, test and local development 
async function getBlog(event) {
    console.debug('getBlog event:' + JSON.stringify(event));
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Access-Control-Allow-Origin': util_header_1.getCorsOriginHeader(event)
    };
    try {
        // console.debug('getBlog organisatie:' + organisatie); 
        // Als we query parameters meekrijgen doen we een query op Dynamo, anders een scan voor alle records 
        const params = {
            TableName: process.env.DYNAMODBBLOG
        };
        const response = await documentClient.scan(params).promise();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.Items)
        };
    }
    catch (err) {
        console.error(`Unexpected 500 | ${err.message} | ${err.detail}`);
        return {
            statusCode: 500,
            headers,
            body: undefined
        };
    }
}
exports.getBlog = getBlog;
