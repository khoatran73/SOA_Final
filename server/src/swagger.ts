import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import log from './logger';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'REST API Docs',
            version: '1.0.0',
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // apis: ['./Controllers/index.ts', './Controllers/*/*.ts', './types/*/*.ts', './Models/*.ts'],
    apis: [
        './src/Controllers/index.ts',
        './src/Controllers/*/*.ts',
        //
        './src/common/*.ts', 
        './src/types/*/*.ts',
        './src/Models/*.ts',
        './src/Services/*/*.ts'
    ],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
    // Swagger page
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get('/swagger.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    log.info(`Swagger available at http://localhost:${port}/swagger`);
}

export default swaggerDocs;
