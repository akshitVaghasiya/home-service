/*
 * @file: swagger-config.js
 * @description: It Contain swagger configrations.
 * @author: Sandip Vaghasiya
 */
import swaggerJsDocs from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "My Project Api's Documentations",
            version: '1.0',
            description: 'All api end points',
            contact: {
                name: 'Sandip Vaghasiya'
            },
            servers: ['http://localhost:3000']
        },
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'authorization',
                scheme: 'bearer',
                in: 'header',
            },
            cookieAuth: {
                type: 'apiKey',
                name: 'token',
                scheme: 'bearer',
                in: 'cookie',
            },
        },
        produces: ["application/json"]
    },
    apis: [
        "./api/v1/web/*/*.js"
    ]
};
export default swaggerJsDocs(swaggerOptions);