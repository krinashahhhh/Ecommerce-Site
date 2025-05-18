const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Walmart Product Listing API',
      version: '1.0.0',
      description: 'API documentation for Product Listing Assignment',
    },
    servers: [
      {
        url: 'http://localhost:5050',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
