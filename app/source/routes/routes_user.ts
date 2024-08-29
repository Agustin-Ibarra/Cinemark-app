import { Request, Response } from 'express'
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';
import jsonWebToken from 'jsonwebtoken';
import dotenv  from 'dotenv';
import { User } from '../models/users_models.js';

dotenv.config();
const __driname = path.dirname(fileURLToPath(import.meta.url));

interface JwtPayload{
  iduser:number,
  levelAccess:number
}


export const getPayload = function(req:Request):JwtPayload{
  const cookies = req.headers.cookie?.split(';') as string[]
  const token = cookies.find((cookie)=>cookie.startsWith('cmjwt='))?.replace('cmjwt=','') as string;
  const payload = jsonWebToken.verify(token,process.env.SECRET as string) as JwtPayload
  return payload;
}

export const getAccount = function(req:Request,res:Response){
  res.sendFile(path.join(__driname,'../../source/views/user_UI/account.html'));
}

export const getLogin = function (req: Request, res: Response) {
  res.sendFile(path.join(__driname, '../../source/views/user_UI/login.html'));
}

export const postLogin = function (req: Request, res: Response) {
  interface user {
    id_user:number,
    user_password:string,
  }
  const {username,password} = req.body;
  console.log(username,password);
  User.findAll({
    where:{
      username:username
    },
    attributes:['user_password','id_user']
  })
  .then((result)=>{
    if(result.length < 1){
      res.status(404).send({error:'The username or password are incorrect!'});
    }
    else{
      const userData = result[0].dataValues as user
      const isEqual = bcrypt.compareSync(password,userData.user_password);
      if(isEqual === true){
        const payload: Object = { iduser: userData.id_user, levelAccess: 1 }
        const secret: string = process.env.SECRET || '';
        const expires: string = process.env.EXPIRES || '';
        const token: string = jsonWebToken.sign(payload, secret, { expiresIn: expires }); // creacion del token
        const sessionLimit: object = new Date(Date.now() + 1000 * 60 * 60 * 24); // duracion del token
        const cookieOptions: object = { expires: sessionLimit };
        res.cookie('cmjwt', token, cookieOptions).send('succes');
      }
      else{
        res.status(400).send({error:'The username or password are incorrect!'});
      }
    }
  })
  .catch((error)=>{
    console.log(error);
  });
}

export const getRegister = function (req: Request, res: Response) {
  res.sendFile(path.join(__driname, '../../source/views/user_UI/singup.html'));
}

export const postRegister = function (req: Request, res: Response) {
  type user = {
    fullname:string,
    email:string,
    username:string,
    password:string
  }
  const {fullname,email,username,password}: user = req.body
  const salt = bcrypt.genSaltSync(5);
  const hash: String = bcrypt.hashSync(password, salt);
  const userData = {
    fullname:fullname,
    email:email,
    username:username,
    user_password:hash,
    user_role:1
  }
  User.create(userData)
  .then((result)=>{
    res.send('success');
  })  
  .catch((error)=>{
    if(error.parent.errno === 1062){
      res.status(400).json({error:'This user already exist!'});
    }
    else{
      console.log(error);
    }
  });
}

// envia informacion del perfil del usuario
export const profile = function(req:Request,res:Response){
  const payload = getPayload(req)
  User.findAll({
    where:{
      id_user:payload.iduser
    },
    attributes:['fullname','email','username']
  })
  .then((result)=>{
    res.json(result)
  })
  .catch((error)=>{
    console.log(error);
  })  
}

// actualiza el nombre completo del usuario
export const updateFullname = function(req:Request,res:Response){
  // const newFullname:string = req.body.newFullname;
  // const payload = getPayload(req);
  // setFullName(payload.iduser,newFullname)
  // .then((result)=>{
  //   const statusQuery = result as ResultHeader;
  //   if(statusQuery.serverStatus === 2 && statusQuery.affectedRows === 1){
  //     res.status(201).send({result:'ok'});
  //   }
  //   else{
  //     res.status(400).send({error:'Failed to update full name, please try again later!'});
  //   }
  // })
  // .catch((error)=>{res.status(503).send('Content not available')});
}

// actualiza el email del usuario
export const updateEmail = function(req:Request,res:Response){
  // const payload = getPayload(req);
  // const newEmail = req.body.newEmail;
  // setEmail(payload.iduser,newEmail)
  // .then((result)=>{
  //   const statusQuery = result as ResultHeader;
  //   if(statusQuery.affectedRows === 1 && statusQuery.serverStatus === 2){
  //     res.status(201).send({result:'ok'});
  //   }
  //   else{
  //     res.status(400).send({error:'The email could not be updated, please try again later!'});
  //   }
  // })
  // .catch((error)=>{
  //   if(error.errno === 1062){
  //     res.status(400).send({error:'The email already exist!'});
  //   }
  // });
}

// actualiza el nombre de usuario
export const updateUsername = function(req:Request,res:Response){
  // const payload = getPayload(req)
  // const newUsername:String = req.body.newUsername;
  // setUsername(payload.iduser,newUsername)
  // .then((result)=>{
  //   console.log(result);
  //   const statusQuery = result as ResultHeader;
  //   if(statusQuery.affectedRows === 1 && statusQuery.serverStatus === 2){
  //     res.status(201).send({result:'ok'});
  //   }
  //   else{
  //     res.status(400).send({error:'Failed to update username please try again later!'});
  //   }
  // })
  // .catch((error)=>{
  //   if(error.errno === 1062){
  //     res.status(400).send({error:'The username already exists!'});
  //   }
  //   else{
  //     res.status(503).send('Content not available');
  //   }
  // });
}

// actualiza la contraseña del usuario
export const updatePassword = function(req:Request,res:Response){
  // const newPassword = req.body.newPassword;
  // const oldPassword = req.body.oldPassword;
  // console.log(newPassword,oldPassword);
  // const payload = getPayload(req);
  // getPassword(payload.iduser)
  // .then((result)=>{
  //   if(Array.isArray(result)){
  //     result.forEach((element:any) => {
  //       const comparePassword = bcrypt.compare(newPassword,element.user_password);
  //       comparePassword
  //       .then((isEqual)=>{
  //         if(isEqual === true){
  //           res.status(400).send({error:'The new password cannot be the same as the current password!'});
  //         }
  //         else{
  //           const salt = bcrypt.genSaltSync(5);
  //           const hash = bcrypt.hashSync(newPassword,salt);
  //           setPassword(payload.iduser,hash)
  //           .then((result)=>{
  //             const queryResult = result as ResultHeader;
  //             if(queryResult.affectedRows === 1 && queryResult.serverStatus === 2){
  //               res.status(201).send('success!');
  //             }
  //             else{
  //               res.status(400).send({error:'Failed to update password, please try again later!'});
  //             }
  //           })
  //         }
  //       })
  //       .catch((error)=>{res.status(503).send('Content not available');});
  //     });
  //   }
  // })
  // .catch((error)=>{res.status(503).send('Content not available');});
}

// elimina la cuenta del usuario
export const deleteAccount = function(req:Request,res:Response){
  // const payload = getPayload(req);
  // const idUser = payload.iduser;
  // deleteUserData(idUser)
  // .then((result)=>{
  //   const queryResult = result as ResultHeader
  //   if(queryResult.serverStatus === 2 && queryResult.affectedRows === 1){
  //     res.send({message:'delete'});
  //   }
  //   else{
  //     res.status(400).send('error');
  //   }
  // })
  // .catch((error)=>{res.status(503).send('Content not available');});
}