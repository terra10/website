/* istanbul ignore file */ 
import { APIGatewayProxyEvent } from 'aws-lambda'; 
 
function getRealPropertyName(object: {}, propertyName: string): string | undefined { 
    const propertyLookup = {}; 
    Object.keys(object).forEach(property => propertyLookup[property.toLowerCase()] = property); 
    return propertyLookup[propertyName.toLowerCase()]; 
} 
 
function getHeader(event: APIGatewayProxyEvent, header: string) { 
    const realHeaderName = getRealPropertyName(event.headers, header); 
    return realHeaderName && event.headers[realHeaderName]; 
} 
 
export function getCorsOriginHeader(event: APIGatewayProxyEvent): string { 
    const origin = getHeader(event, 'origin'); 
    if (origin && process.env.CORS_ORIGIN.split(',').map(allowedOrigin => allowedOrigin.toLowerCase()).includes(origin.toLowerCase())) { 
        return origin; 
    } else { 
        return ''; 
    } 
} 
 