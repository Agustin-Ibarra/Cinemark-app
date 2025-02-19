import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import { config } from '../config/config.js';

const _dirname = path.resolve();

/**
 * envia por mail el archivos con errores en la aplicacion
 * @returns {SentMessageInfo}
 */
const sendErrorLogs = async function():Promise<SentMessageInfo> {
  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:config.DELIVERY,
      pass:config.CODES
    }
  });
  
  const mailOptions = {
    from:config.DELIVERY,
    to:config.RECEIVER,
    subject:'Application error notification',
    text:'file with error logs',
    attachments:[
      {
        filename:'errorLogs.csv',
        path:path.join(_dirname,'app/dist/routes/errorLogs.csv')
      },
      {
        filename:'access.csv',
        path:path.join(_dirname,'app/dist/routes/access.csv')
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
  const file = fs.readFileSync(path.join(_dirname,'app/dist/monitoring/access.csv'),'utf-8'); // lee el archivo de logs
  const rows:string[] = file.split('\n'); // crea un array que representan las filas
  const columns: string[][] = []; //crea un array que representan las columnas
  const errorLogs:string[][] = []
  rows.forEach(element => {columns.push(element.split(';'));});
  columns.forEach(column => {
    if(column[0]){
      if(Number(column[3]) >= 400 && Number(column[3]) !== 401){ // si encuentra peticiones fallidas las agreg a la lista
        errorLogs.push(column);
      }
    }
  });
  if(errorLogs.length > 0){ // verifica que la lista de errores tenga contenido
    const errorLogsFile = fs.createWriteStream(path.join(_dirname,'app/dist/routes/errorLogs.csv'),{flags:'a'});
    errorLogsFile.write('date;method;url;status_code;content-length;response_time;remote_addres\n');
    errorLogs.forEach(logs => {
      errorLogsFile.write(`${logs[0]};${logs[1]};${logs[2]};${logs[3]};${logs[4]};${logs[5]};${logs[6]}\n`);
    });
    sendErrorLogs()
    .then((result)=>{
      // borra la informacion del archivo para evitar datos duplicados
      fs.writeFileSync(path.join(_dirname,'app/dist/monitoring/errorLogs.csv'),'');
    })
    .catch((error)=>{console.log(error);});
  }
  // borra la informacion del archivo porque fue procesado
  fs.writeFileSync(path.join(_dirname,'app/dist/monitoring/access.csv'),'');
});

export default cron;