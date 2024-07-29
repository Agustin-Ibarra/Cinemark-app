import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const logRouts = async function(logs:object[]){
  setTimeout(() => {
    const file = fs.readFileSync(path.join(__dirname,'../controllers/access.csv')).toString();
    const rows:string[] = file.split('\n');
    const columns:string[][] = [];
    const logsData:object[] = [];
    rows.forEach(row => {
      columns.push(row.split(';'));
    });
    columns.forEach(column => {
      if(column.length > 1){
        if(column[0] !== 'date' && column[2].includes('jpg') === false && column[2].includes('css') === false && column[2].includes('js') === false){
          const dateFormat = new Date(column[0])
          const data:object = {
            date:dateFormat.toLocaleString(),
            method:column[1],
            url:column[2],
            status:column[3],
            conetntLength:column[4],
            responseTime:column[5],
            ipAddres:column[6]
          }
          logsData.push(data);  
        }
      }
    });
    console.log(logsData);
    fs.writeFileSync(path.join(__dirname,'../controllers/access.csv'),'');
  }, 1500);
}

export const differenceInHours = function(date1:string,date2:string){

  const [datePart1,timePArt1] = date1.split(',');
  const [year1,month1,day1] = datePart1.split('/');
  const [hours1,minutes1,seconds1] = timePArt1.split(':')

  const [datePart2,timePart2] = date2.split(',');
  const [year2,month2,day2] = datePart2.split('/');
  const [hours2,minutes2,seconds2] = timePart2.split(':')
  let hours;
  if(day1 !== day2){
    hours = Math.round((24 + Number(hours2)) - Number(hours1));
  }
  else{
    hours = Number(hours2) - Number(hours1);
  }
  console.log(hours);
  return hours;
}