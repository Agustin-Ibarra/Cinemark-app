import swaggerJsDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc';
import path from 'path';
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerDefinition: OAS3Definition = {
  openapi:"3.0.0",
  info:{
    title:'Documentacion de apis',
    version:'1.0.0'
  },
  servers:[{url:'http//localhost:3001'}],
  components:{
    securitySchemes:{
      bearerAuth:{
        type: 'http',
        scheme: 'bearer'
      }
    }
  }
}

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis:[path.join(__dirname,'../../source/docs/routes_docs.ts')]
}

export default swaggerJsDoc(swaggerOptions);