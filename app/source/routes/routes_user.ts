import { Request, Response } from 'express'
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';
import jsonWebToken from 'jsonwebtoken';
import dotenv  from 'dotenv';
import { dataAutentication, deleteUserData, getPassword, newUSer, setEmail, setFullName, setPassword, setUsername, userProfile } from '../models/users_models.js'

dotenv.config();
const __driname = path.dirname(fileURLToPath(import.meta.url));

interface JwtPayload{
  iduser:number,
  levelAccess:number
}

interface ResultHeader{
  fieldCount:number,
  affectedRows:number,
  insertId:number,
  info:string,
  serverStatus:number,
  warningStatus:number,
  changedRows:number
}

export const getPayload = function(req:Request){
  const token = req.headers.cookie?.replace('cmjwt=','');
  try{
    const payload = jsonWebToken.verify(`${token}`,`${process.env.SECRET}`) as JwtPayload;
    return payload;
  }
  catch(error){
    throw error
  }
}

export const getAccount = function(req:Request,res:Response){
  res.sendFile(path.join(__driname,'../../source/views/user_UI/account.html'));
}

export const getLogin = function (req: Request, res: Response) {
  res.sendFile(path.join(__driname, '../../source/views/user_UI/login.html'));
}

export const postLogin = function (req: Request, res: Response) {
  const username:string = req.body.username;
  const password:string = req.body.password;
  dataAutentication(username)
  .then((result)=>{
    if(Array.isArray(result)){
      if(result.length === 0){
        res.status(404).send({error:'The username or password are incorrect!'});
      }
      else{
        result.forEach((userData: any) => {
          const hash:string = userData.user_password;
          const isEqual = bcrypt.compareSync(password,hash);
          if(isEqual === true){
            const payload:Object = {iduser:userData.id_user,levelAccess:userData.level_access}
            const secret:string = process.env.SECRET || '';
            const expires:string = process.env.EXPIRES || '';
            const token:string = jsonWebToken.sign(payload,secret,{expiresIn:expires});
            const sessionLimit:object = new Date(Date.now()+1000*60*60*24);
            const cookieOptions:object = {expires:sessionLimit};
            res.cookie('cmjwt',token,cookieOptions).send('succes');
          }
          else{
            res.status(400).send({error:"The username or password are incorrect!"});
          }
        });
      }
    }
  })
  .catch((error)=>{res.status(503).send('Content not available')});
}

export const getRegister = function (req: Request, res: Response) {
  res.sendFile(path.join(__driname, '../../../source/views/user_UI/singup.html'));
}

export const postRegister = function (req: Request, res: Response) {
  const fullName: String = req.body.fullName;
  const email: String = req.body.email;
  const username: String = req.body.username;
  const password: string = req.body.password;
  const salt = bcrypt.genSaltSync(5);
  const hash: String = bcrypt.hashSync(password, salt);
  newUSer(fullName, email, username, hash)
  .then((result) => {res.send('success');})
  .catch((error) => {
    if(error.errno === 1062){
      res.status(400).send({error:'The user already exists!'});
    }
    else{res.status(503).send('Content not available');}
  });
}

export const profile = function(req:Request,res:Response){
  const payload = getPayload(req)
  userProfile(payload.iduser)
  .then((result)=>{res.send({user:result});})
  .catch((error)=>{res.status(503).send('Content not available')});
}

export const updateUsername = function(req:Request,res:Response){
  const payload = getPayload(req)
  const newUsername:String = req.body.newUsername;
  setUsername(payload.iduser,newUsername)
  .then((result)=>{
    console.log(result);
    const statusQuery = result as ResultHeader;
    if(statusQuery.affectedRows === 1 && statusQuery.serverStatus === 2){
      res.status(201).send({result:'ok'});
    }
    else{
      res.status(400).send({error:'Failed to update username please try again later!'});
    }
  })
  .catch((error)=>{
    if(error.errno === 1062){
      res.status(400).send({error:'The username already exists!'});
    }
    else{
      res.status(503).send('Content not available');
    }
  });
}

export const updateEmail = function(req:Request,res:Response){
  const payload = getPayload(req);
  const newEmail = req.body.newEmail;
  setEmail(payload.iduser,newEmail)
  .then((result)=>{
    const statusQuery = result as ResultHeader;
    if(statusQuery.affectedRows === 1 && statusQuery.serverStatus === 2){
      res.status(201).send({result:'ok'});
    }
    else{
      res.status(400).send({error:'The email could not be updated, please try again later!'});
    }
  })
  .catch((error)=>{
    if(error.errno === 1062){
      res.status(400).send({error:'The email already exist!'});
    }
  });
}

export const updateFullname = function(req:Request,res:Response){
  const newFullname:string = req.body.newFullname;
  const payload = getPayload(req);
  setFullName(payload.iduser,newFullname)
  .then((result)=>{
    const statusQuery = result as ResultHeader;
    if(statusQuery.serverStatus === 2 && statusQuery.affectedRows === 1){
      res.status(201).send({result:'ok'});
    }
    else{
      res.status(400).send({error:'Failed to update full name, please try again later!'});
    }
  })
  .catch((error)=>{res.status(503).send('Content not available')});
}

export const updatePassword = function(req:Request,res:Response){
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  console.log(newPassword,oldPassword);
  const payload = getPayload(req);
  getPassword(payload.iduser)
  .then((result)=>{
    if(Array.isArray(result)){
      result.forEach((element:any) => {
        const comparePassword = bcrypt.compare(newPassword,element.user_password);
        comparePassword
        .then((isEqual)=>{
          if(isEqual === true){
            res.status(400).send({error:'The new password cannot be the same as the current password!'});
          }
          else{
            const salt = bcrypt.genSaltSync(5);
            const hash = bcrypt.hashSync(newPassword,salt);
            setPassword(payload.iduser,hash)
            .then((result)=>{
              const queryResult = result as ResultHeader;
              if(queryResult.affectedRows === 1 && queryResult.serverStatus === 2){
                res.status(201).send('success!');
              }
              else{
                res.status(400).send({error:'Failed to update password, please try again later!'});
              }
            })
          }
        })
        .catch((error)=>{res.status(503).send('Content not available');});
      });
    }
  })
  .catch((error)=>{res.status(503).send('Content not available');});
}

export const deleteAccount = function(req:Request,res:Response){
  const payload = getPayload(req);
  const idUser = payload.iduser;
  deleteUserData(idUser)
  .then((result)=>{
    const queryResult = result as ResultHeader
    if(queryResult.serverStatus === 2 && queryResult.affectedRows === 1){
      res.send({message:'delete'});
    }
    else{
      res.status(400).send('error');
    }
  })
  .catch((error)=>{res.status(503).send('Content not available');});
}