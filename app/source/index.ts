import express from 'express';
import path from 'path';
import router from './routes/routes.js';
import swaggerUI from 'swagger-ui-express';
import swaggerSetup from './docs/swagger.js';
import { cronJob } from './monitoring/routes.monitorings.js';
import sequlize from './config/db.config.js';
import { config } from './config/config.js';

const _dirname = path.resolve();
const port = config.PORT;
const app = express();

app.use(router);
app.use(express.static(path.join(_dirname,'app/public/styles')));
app.use(express.static(path.join(_dirname,'app/public/posters')));
app.use(express.static(path.join(_dirname,'app/public/scripts')));
app.use(express.static(path.join(_dirname,'app/public/icon')));
app.use('/cinemark/documentation',swaggerUI.serve,swaggerUI.setup(swaggerSetup));
const server = app.listen(port,()=>{
  cronJob.start();
  console.log('server run on port',port);
  sequlize.authenticate()
  .then((result)=>{
    console.log('db connection success');
  })
  .catch((error)=>{
    console.log('no conection');
  })
});

export {app,server};