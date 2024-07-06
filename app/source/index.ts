import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import router from './controllers/routes_controller.js';
import http from 'http';

console.clear();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = 3001;
const app = express();

app.use(router);
app.use(express.static(path.join(__dirname,'../../public/styles')));
app.use(express.static(path.join(__dirname,'../../public/posters')));
app.use(express.static(path.join(__dirname,'../../public/scripts')));
app.listen(port,()=>{
  console.log('server on port',port);
});

export default app;