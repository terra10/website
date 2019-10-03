import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda'; 
import * as AWS from 'aws-sdk'; 
import * as https from 'https'; 
import { getCorsOriginHeader } from './util/util-header'; 
 
const documentClient = new AWS.DynamoDB.DocumentClient({ 
    httpOptions: { 
        agent: new https.Agent({ 
            keepAlive: true 
        }) 
    } 
}); 
 
// Handler for AWS Lambda 
/* istanbul ignore next */ 
export async function handler(event: APIGatewayProxyEvent, _context: Context, callback: Callback) { 
    try { 
        callback(undefined, await getBlog(event)); 
    } catch (err) { 
        callback(err); 
    } 
} 
 
// Main function logic used by handler, test and local development 
export async function getBlog(event: APIGatewayProxyEvent) { 
 
    console.debug('getBlog event:' + JSON.stringify(event)); 
    const headers = { 
        'Content-Type': 'application/json', 
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate', 
        'Access-Control-Allow-Origin': getCorsOriginHeader(event) 
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
 