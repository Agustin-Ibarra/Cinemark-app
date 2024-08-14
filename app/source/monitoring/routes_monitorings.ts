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
  catch(error){
    throw error;
  }
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
  const errorLogsFile = fs.createWriteStream(path.join(__dirname,'../controllers/errorLogs.csv'),{flags:'a'});
  errorLogsFile.write('date;method;url;status_code;content-length;response_time;remote_addres\n');
  columns.forEach(element => {
    if(element[0] !== 'date' && element.length>1){
      if(element[2].includes('css') === false && element[2].includes('js') === false && element.includes('html') === false && element[2].includes('jpg') === false){
        if(element[3] !== '200' && element[3] !== '304'){
          const data:object = {
            date:element[0],
            method:element[1],
            url:element[2],
            statusCode:element[3],
            contentLength:element[4],
            reponseTime:element[5],
            remoteAddres:element[6]
          } as dataLogs
          errorLogs.push(data); 
        }
      }
    }
  });
  if(errorLogs.length > 0){
    errorLogs.forEach(logs => {
      const data = logs as dataLogs;
      errorLogsFile.write(`${data.date};${data.method};${data.url};${data.statusCode};${data.contentLength};${data.reponseTime};${data.remoteAddres}\n`);
    });
    sendErrorLogs()
    .then((result)=>{
      fs.writeFileSync(path.join(__dirname,'../controllers/access.csv'),'');
      fs.writeFileSync(path.join(__dirname,'../controllers/errorLogs.csv'),'');
    })
    .catch((error)=>{console.log(error);});
  }
});

export default cron;