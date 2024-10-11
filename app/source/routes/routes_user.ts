import { NextFunction, Request, Response } from 'express'
import dotenv  from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import jsonWebToken from 'jsonwebtoken';
import { User } from '../models/users_models.js';

dotenv.config();
const _driname = path.resolve();

interface JwtPayload{
  iduser:number,
  levelAccess:number
}
interface user {
  id_user:number,
  user_password:string,
}

/**
 * verifica un token de autorizacion de una peticion
 * @param req interface Request
 * @returns {JwtPayload} token extraido de la cookie que incluye la peticion
 */
export const getPayload = function(req:Request):JwtPayload{
  const cookies = req.headers.cookie?.split(';') as string[];
  const token = cookies.find((cookie)=>cookie.startsWith(' cmjwt='))?.replace(' cmjwt=','') as string;
  const payload = jsonWebToken.verify(token,process.env.SECRET as string) as JwtPayload;
  return payload;
}

export const getAccount = function(req:Request,res:Response){
  res.sendFile(path.join(_driname,'app/source/views/user_UI/account.html'));
}

export const getLogin = function (req: Request, res: Response) {
  res.sendFile(path.join(_driname, 'app/source/views/user_UI/login.html'));
}

/**
 * procesa la peticion cuando el usario inicia sesion
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const postLogin = function (req:Request, res: Response, next:NextFunction):void {
  type userData = {
    username:string,
    password:string
  }
  const {username,password}:userData = req.body;
  User.findAll({
    where:{
      username:username
    },
    attributes:['user_password','id_user']
  })
  .then(async(result)=>{
    if(result.length < 1){
      res.status(401).send({error:'The username or password are incorrect!'});
    }
    else{
      const userData = result[0].dataValues as user
      const isEqual = await bcrypt.compare(password,userData.user_password);
      if(isEqual === true){
        const payload: Object = { iduser: userData.id_user, levelAccess: 1 }
        const secret: string = process.env.SECRET as string;
        const expires: string = process.env.EXPIRES as string;
        const token: string = jsonWebToken.sign(payload, secret, { expiresIn: expires });
        const sessionLimit: object = new Date(Date.now() + 1000 * 60 * 60 * 24); // tiempo de duracion del token
        const cookieOptions: object = { expires: sessionLimit };
        res.cookie('cmjwt', token, cookieOptions).send('succes');
      }
      else{
        res.status(401).send({error:'The username or password are incorrect!'});
      }
    }
  })
  .catch((error)=>{
    next(error)
  });
}

export const getRegister = function (req: Request, res: Response) {
  res.sendFile(path.join(_driname, 'app/source/views/user_UI/singup.html'));
}

/**
 * procesa la peticion para crear un nuevo usuario en la base de datos
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const postRegister = async function (req: Request, res: Response):Promise<void>{
  type userData = {
    fullname:string,
    email:string,
    username:string,
    password:string
  }
  const {fullname,email,username,password}: userData = req.body
  const salt = await bcrypt.genSalt(5);
  const hash: String = await bcrypt.hash(password, salt);
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

/**
 * obtiene informacion del perfil del usuario
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const profile = function(req:Request,res:Response):void{
  console.log('profile');
  const payload = getPayload(req);
  res.send();
  // if(payload !== undefined){
  //   User.findAll({
  //     where:{
  //       id_user:payload.iduser
  //     },
  //     attributes:['fullname','email','username']
  //   })
  //   .then((result)=>{
  //     res.json(result);
  //   })
  //   .catch((error)=>{
  //     console.log(error);
  //   });  
  // }
  // else{
  //   res.status(401).send();
  // }
}

/**
 * actualiza el nombre de usuario
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const updateFullname = function(req:Request,res:Response):void{
  type userData = {
    newFullname:string
  }
  const payload = getPayload(req);
  const {newFullname}: userData = req.body;
  User.update(
    {fullname:newFullname},
    {where:{
        id_user:payload.iduser
    }}
  )
  .then((result)=>{
    res.status(201).send('update fullname');
  })
  .catch((error)=>{
    console.log(error);
  })
}

/**
 * actualiza el email del usuario
 * @param req interface Request
 * @param res interface Response
 */
export const updateEmail = function(req:Request,res:Response){
  type userData = {
    newEmail:string
  }
  const payload = getPayload(req);
  const {newEmail}:userData = req.body;
  User.update(
    {email:newEmail},
    {where:{
      id_user:payload.iduser
    }}
  )
  .then((result)=>{
    res.status(201).send('update email');
  })
  .catch((error)=>{
    console.log(error);
  });
}

/**
 * actualiza la contraseña del usuario
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const updateUsername = function(req:Request,res:Response):void{
  type userData = {
    newUsername:string
  }
  const payload = getPayload(req);
  const {newUsername}:userData = req.body;
  User.update(
    {username:newUsername},
    {where:{
      id_user:payload.iduser
    }}
  )
  .then((result)=>{
    res.status(201).send('update username');
  })
  .catch((error)=>{
    console.log(error);
  });
}

/**
 * actualiza la contraseña de un usuario
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const updatePassword = function(req:Request,res:Response):void{
  type UserData = {
    newPassword:string,
    oldPassword:string
  }
  type userPasword = {
    user_password:string
  }
  const {newPassword,oldPassword}:UserData = req.body;
  const payload = getPayload(req);
  User.findAll({
    where:{
      id_user:payload.iduser
    },
    attributes:['user_password']
  })
  .then(async(resutl)=>{
    const data = resutl[0].dataValues as userPasword
    const isEqual = await bcrypt.compare(oldPassword,data.user_password);
    if(isEqual === true){
      const salt = await bcrypt.genSalt(5);
      const hash = await bcrypt.hash(newPassword,salt);
      User.update(
        {user_password:hash},
        {where:{
          id_user:payload.iduser
        }}
      )
      .then((result)=>{
        res.status(201).send('update password');
      })
      .catch((error)=>{
        console.log(error);
      });
    }
    else{
      res.status(400).json({error:'the password are incorrect'});
    }
  })
}

/**
 * elimina un usuario del registro de base de datos
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const deleteAccount = function(req:Request,res:Response):void{
  const payload = getPayload(req);
  User.destroy({
    where:{
      id_user:payload.iduser
    }
  })
  .then((result)=>{
    res.send('delete');
  })
  .catch((error)=>{
    console.log(error);
  });
}