import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer, { SentMessageInfo } from 'nodemailer';

const _dirname = path.resolve();
dotenv.config();

/**
 * envia por mail el archivos con errores en la aplicacion
 * @returns {SentMessageInfo}
 */
const sendErrorLogs = async function():Promise<SentMessageInfo> {
  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:process.env.DELIVERY,
      pass:process.env.CODES
    }
  });
  
  const mailOptions = {
    from:process.env.DELIVERY,
    to:process.env.RECEIVER,
    subject:'Application error notification',
    text:'file with error logs',
    attachments:[
      {
        fillname:'errorLogs.csv',
        path:path.join(_dirname,'app/dist/controllers/errorLogs.csv')
      }
    ]
  }
  try{
    const info = await transporter.sendMail(mailOptions);
    return info;
  }
  catch(error){throw error;}
}

// establece un horario para procesar y preparar los archivo para notificar el monitoreo del sistema
export const cronJob = cron.schedule('0 6 * * *',()=>{ 
  // examina el archivo que contiene informacion sobre la actividad de las rutas 
  const file = fs.readFileSync(path.join(_dirname,'app/dist/controllers/access.csv'),'utf-8');
  const rows:string[] = file.split('\n'); // crea un array que representan las filas
  const columns: string[][] = []; //crea un array que representan las columnas
  const errorLogs:object[] = [];
  interface dataLogs {
    date:string,
    method:string,
    url:string,
    statusCode:string,
    contentLength:string
    reponseTime:string,
    remoteAddres:string
  }
  rows.forEach(element => {columns.push(element.split(';'));});
  columns.forEach(col => {
    if(col.length > 1 && col[0] !== 'date'){
      // en cada iteracion de las columnas filtra las rutas que no son relevantes
      if(col[2].includes('css') === false && col[2].includes('js') === false && col.includes('html') === false && col[2].includes('jpg') === false && col[2].includes('/login') === false){
        // filtra por peticiones que tuviron no tuvieron errores
        if(col[3] !== '200' && col[3] !== '304' && col[3] !== '401'){
          const data:object = {
            date:col[0],
            method:col[1],
            url:col[2],
            statusCode:col[3],
            contentLength:col[4],
            reponseTime:col[5],
            remoteAddres:col[6]
          } as dataLogs
          errorLogs.push(data); 
        }
      }
    }
  });
  if(errorLogs.length > 0){
    // si la lista de errorLogs tiene longitud superior a 0
    // quiere decir ocurrion error en algunas peticiones
    // por ende prepara el archivo para ser enviado y notificar los errores
    const errorLogsFile = fs.createWriteStream(path.join(_dirname,'app/dist/controllers/errorLogs.csv'),{flags:'a'});
    errorLogsFile.write('date;method;url;status_code;content-length;response_time;remote_addres\n');
    errorLogs.forEach(logs => {
      const data = logs as dataLogs;
      errorLogsFile.write(`${data.date};${data.method};${data.url};${data.statusCode};${data.contentLength};${data.reponseTime};${data.remoteAddres}\n`);
    });
    sendErrorLogs()
    .then((result)=>{
      // borra la informacion del archivo para evitar duplpicado de datos
      fs.writeFileSync(path.join(_dirname,'app/dist/controllers/errorLogs.csv'),'');
    })
    .catch((error)=>{console.log(error);});
  }
  // borra la informacion del archivo porque ya fue procesada
  fs.writeFileSync(path.join(_dirname,'app/dist/controllers/access.csv'),'');
});

export default cron;