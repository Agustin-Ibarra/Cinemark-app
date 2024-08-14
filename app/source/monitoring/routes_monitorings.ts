import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const sendErrorLogs = async function() {
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
        path:path.join(__dirname,'../controllers/errorLogs.csv')
      }
    ]
  }
  try{
    const info = await transporter.sendMail(mailOptions);
    return info;
  }
  catch(error){throw error;}
}

cron.schedule('0 6 * * *',()=>{  
  const file = fs.readFileSync(path.join(__dirname,'../controllers/access.csv'),'utf-8');
  const rows:string[] = file.split('\n');
  const columns: string[][] = [];
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
      if(col[2].includes('css') === false && col[2].includes('js') === false && col.includes('html') === false && col[2].includes('jpg') === false && col[2].includes('/login') === false){
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
    const errorLogsFile = fs.createWriteStream(path.join(__dirname,'../controllers/errorLogs.csv'),{flags:'a'});
    errorLogsFile.write('date;method;url;status_code;content-length;response_time;remote_addres\n');
    errorLogs.forEach(logs => {
      const data = logs as dataLogs;
      errorLogsFile.write(`${data.date};${data.method};${data.url};${data.statusCode};${data.contentLength};${data.reponseTime};${data.remoteAddres}\n`);
    });
    sendErrorLogs()
    .then((result)=>{
      fs.writeFileSync(path.join(__dirname,'../controllers/errorLogs.csv'),'');
    })
    .catch((error)=>{console.log(error);});
  }
  fs.writeFileSync(path.join(__dirname,'../controllers/access.csv'),'');
});

export default cron;