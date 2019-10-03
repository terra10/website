import { APIGatewayProxyEvent } from 'aws-lambda'; 
import { getWordpressFeed } from './getWordpressFeed'; 
 
/* 
    Function for development testing through ts-node 
      node_modules/.bin/ts-node src/getWordpressFeed.local.ts 
 */ 
 
process.env.DYNAMODBBLOG = 'terra10-website-dev'; 
 
const event: APIGatewayProxyEvent = { 
    body: '', 
    headers: {}, 
    httpMethod: 'GET', 
    isBase64Encoded: false, 
    multiValueHeaders: {}, 
    multiValueQueryStringParameters: {}, 
    path: '', 
    pathParameters: {}, 
    queryStringParameters: {}, 
    stageVariables: {}, 
    requestContext: undefined, 
    resource: '' 
}; 
 
getWordpressFeed( event) 
    .then(res => console.log(res)) 
    .catch(err => console.error(err)); 