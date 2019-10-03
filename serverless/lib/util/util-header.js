"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRealPropertyName(object, propertyName) {
    const propertyLookup = {};
    Object.keys(object).forEach(property => propertyLookup[property.toLowerCase()] = property);
    return propertyLookup[propertyName.toLowerCase()];
}
function getHeader(event, header) {
    const realHeaderName = getRealPropertyName(event.headers, header);
    return realHeaderName && event.headers[realHeaderName];
}
function getCorsOriginHeader(event) {
    const origin = getHeader(event, 'origin');
    if (origin && process.env.CORS_ORIGIN.split(',').map(allowedOrigin => allowedOrigin.toLowerCase()).includes(origin.toLowerCase())) {
        return origin;
    }
    else {
        return '';
    }
}
exports.getCorsOriginHeader = getCorsOriginHeader;
