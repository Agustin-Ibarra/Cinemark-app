import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import router from './controllers/routes_controller.js';
import swaggerUI from 'swagger-ui-express';
import swaggerSetup from './docs/swagger.js';
import cron from './monitoring/routes_monitorings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = 3001;
const app = express();

app.use(router);
app.use(express.static(path.join(__dirname,'../public/styles')));
app.use(express.static(path.join(__dirname,'../public/posters')));
app.use(express.static(path.join(__dirname,'../public/scripts')));
app.use('/docs',swaggerUI.serve,swaggerUI.setup(swaggerSetup));

app.listen(port,()=>{
  console.clear();
  console.log('server on port',port);
  cron;
});

export default app;