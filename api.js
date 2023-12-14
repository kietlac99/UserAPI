import express from 'express';
import { connectDB } from './db/db.js';
import { adminRouter } from './routes/admin.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(morgan('short'))

connectDB();

app.use('/admin', adminRouter);

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
        },
        servers: [
            {
                url:"http://localhost:8000",
            },
        ],
        securityDefinitions: {
            BearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                description: 'Enter your bearer token in the format **<token>**',
                scheme: 'bearer',
            }
        },
        security: [{ BearerAuth: [] }]
    },
    apis: ["./controllers/adminController.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
