import { NextFunction, Request, Response } from 'express'
import path from 'path';
import bcrypt from 'bcryptjs';
import jsonWebToken from 'jsonwebtoken';
import { User } from '../models/users.models.js';
import { config } from '../config/config.js';

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
 * verifica un token de autenticacion de una peticion
 * @param req interface Request
 * @returns {JwtPayload} token extraido de la cookie que incluye la peticion
 */
export const getPayload = function(req:Request):JwtPayload{
  const cookies = req.headers.cookie?.split(';') as string[];
  const token:string = String(cookies.find(cookie => cookie.replace(' ','').startsWith('cmjwt='))?.replace('cmjwt=','').replace(' ',''));
  const payload = jsonWebToken.verify(token,config.SECRET) as JwtPayload;
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
  type requestType = {
    username:string,
    password:string
  }
  const {username,password}:requestType = req.body;
  User.findAll({
    where:{
      username:username
    },
    attributes:['user_password','id_user']
  })
  .then(async(result)=>{
    if(result.length === 0){
      res.status(401).send({error:'The username or password are incorrect!'});
    }
    else{
      const userData = result[0].dataValues as user
      const isEqual = await bcrypt.compare(password,userData.user_password);
      if(isEqual === true){
        const payload: Object = { iduser: userData.id_user, levelAccess: 1 }
        const token:string = jsonWebToken.sign(payload, config.SECRET, { expiresIn: config.EXPIRES });
        const sessionLimit:object = new Date(Date.now() + 1000 * 60 * 60 * 24);
        const cookieOptions:object = {expires:sessionLimit};
        res.cookie('cmjwt', token, cookieOptions).send('authorized');
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
  res.sendFile(path.join(_driname, 'app/source/views/user_UI/signup.html'));
}

/**
 * procesa la peticion para crear un nuevo usuario en la base de datos
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const postRegister = async function (req: Request, res: Response,next: NextFunction):Promise<void>{
  type requestType = {
    fullname:string,
    email:string,
    username:string,
    password:string
  }
  const {fullname,email,username,password}: requestType = req.body
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
      next(error);
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
  const payload = getPayload(req);
  if(payload !== undefined){
    User.findAll({
      where:{
        id_user:payload.iduser
      },
      attributes:['fullname','email','username']
    })
    .then((result)=>{
      res.json(result);
    })
    .catch((error)=>{
      console.log(error);
    });  
  }
  else{
    res.status(401).send();
  }
}

/**
 * actualiza el nombre de usuario
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const updateFullname = function(req:Request,res:Response):void{
  type requestType = {
    newValue:string
  }
  const payload = getPayload(req);
  const {newValue}: requestType = req.body;
  User.update(
    {fullname:newValue},
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
  type requestType = {
    newValue:string
  }
  const payload = getPayload(req);
  const {newValue}:requestType = req.body;
  User.update(
    {email:newValue},
    {where:{
      id_user:payload.iduser
    }}
  )
  .then((result)=>{
    res.status(201).send('update email');
  })
  .catch((error)=>{
    if(error.parent.errno === 1062){
      res.status(400).json({error:'This email is already in use!'});
    }
  });
}

/**
 * actualiza la contraseña del usuario
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const updateUsername = function(req:Request,res:Response):void{
  type requestType = {
    newValue:string
  }
  const payload = getPayload(req);
  const {newValue}:requestType = req.body;
  User.update(
    {username:newValue},
    {where:{
      id_user:payload.iduser
    }}
  )
  .then((result)=>{
    res.status(201).send('update username');
  })
  .catch((error)=>{
    if(error.parent.errno === 1062){
      res.status(400).json({error:'This username is already in use!'});
    }
  });
}

/**
 * actualiza la contraseña de un usuario
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */

export const updatePassword = async function(req:Request,res:Response):Promise<void>{
  type requestType = {
    newValue:string,
  }
  const payload = getPayload(req);
  const {newValue}:requestType = req.body;
  const salt = await bcrypt.genSalt(5);
  const hash = await bcrypt.hash(newValue,salt);
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