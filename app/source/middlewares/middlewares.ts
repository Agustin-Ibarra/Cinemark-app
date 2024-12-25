import path from 'path';
import jsonWebToken from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import { body, check, param, ValidationChain, validationResult } from 'express-validator';
import { config } from '../config/config.js';

const dirname = path.resolve();

export const fullnameRules:ValidationChain[]=[
  body("fullname").notEmpty().withMessage('the fullname is required!'),
  body("fullname").isLength({min:3,max:20}).withMessage('el nombre completo debe tener entre 4 a 20 caracteres!'),
  body("fullname").matches(/^[a-zA-Z\s]+$/).withMessage('el nombre de usuario solo debe contener letras numeros y guiones bajos!'),
  body("fullname").trim(),
  body("fullname").escape()
];

export const emailRules:ValidationChain[]=[
  body("email").notEmpty().withMessage('the email is required!'),
  body("email").isEmail().withMessage('no es una mail valido!'),
  body("email").escape()
];

export const usernameRules:ValidationChain[]=[
  body("username").notEmpty().withMessage('the username is required!'),
  body("username").isLength({min:4,max:20}).withMessage('el nombre de usuario debe tener entre 4 a 20 caracteres!'),
  body("username").matches(/^[a-zA-Z0-9_-]+$/).withMessage('el nombre de usuario solo debe contener letras numeros y guiones bajos!'),
  body("username").escape()
];

export const passwordRules:ValidationChain[]=[
  body("password").notEmpty().withMessage('the password is required!'),
  body("password").isLength({min:8,max:20}).withMessage('la contraseña no debe ser menor a 8 caracteres'),
  body("password").matches(/^[a-zA-Z0-9_-]+$/).withMessage('la contraseña solo debe contener letras numeros y guiones bajos!'),
  body("password").escape()
];

export const paramIdMovieRules:ValidationChain[]=[
  param("id").notEmpty().withMessage('the id is required!'),
  param("id").isInt().withMessage('the id must be a integer!'),
  param("id").trim(),
  param("id").escape(),
]

export const idPurchaseRules:ValidationChain[]=[
  check("id_purchase").notEmpty().withMessage('the code is required!'),
  check("id_purchase").isUUID().withMessage('el fromato del codigo debe ser uuid'),
  check("id_purchase").trim(),
  check("id_purchase").escape(),
]

export const totalRules:ValidationChain[]=[
  body("total").notEmpty().withMessage('the total is required!'),
  body("total").isDecimal().withMessage('the total must be decimal!'),
  body("total").trim(),
  body("total").escape(),
]

export const formatIdRules:ValidationChain[]=[
  param("format").notEmpty().withMessage('the format is required!'),
  param("format").isAlphanumeric().withMessage('the format must be alphanumeric!'),
  param("format").trim(),
  param("format").escape()
]

export const ticketRules:ValidationChain[]=[
  body("idTicket").notEmpty().withMessage('the idTicket is required!'),
  body("idTicket").isInt().withMessage('the idTicket must be a integer!'),
  body("idTicket").trim(),
  body("idTicket").escape()
]

export const amountRules:ValidationChain[]=[
  body("amount").notEmpty().withMessage('the amount is required!'),
  body("amount").isInt().withMessage('the amount must be a integer'),
  body("amount").trim(),
  body("amount").escape()
]

/**
 * este middleware verifica si se interceptaron errores para responder con un estado 400
 * @param req 
 * @param res 
 * @param next 
 */
export const validateResult = (req:Request,res:Response,next:NextFunction)=>{
  const result = validationResult(req)
  if(!result.isEmpty()){
    res.status(400).send(result.mapped());
  }
  else{
    next();
  }
}   

/**
 * redirecciona a la pagina login para iniciar sesion
 * dependiendo el metodo http se utliza un metodo de respuesta
 * @param {Request} req 
 * @param {Response} res 
 * @returns {void}
 */
const redirectLogin = function(req:Request,res:Response):void{
  if(req.method === 'GET'){
    res.status(401).redirect('/login');
  }
  else{
    res.status(401).sendFile(path.join(dirname,'/app/source/views/user_UI/login.html'));
  }
}

/**
 * verifica que el usuario este autorizado si no esta autorizado se le niega el acceso
 * @param {Request} req
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {void}
 */
export const isAuth = function(req:Request,res:Response,next:NextFunction):void{
  if(req.headers.cookie){
    try {
      const token = req.headers.cookie?.replace('cmjwt=','');
      jsonWebToken.verify(token,config.SECRET);
      next();
    }
    catch(error){
      console.log(error);
      redirectLogin(req,res);
    }
  }
  else{
    redirectLogin(req,res);
  }
}

/**
 * envia una codigo de estado 503 cuando la base de datos esta caida
 * @param {error} error sequelize error
 * @param {Request} req objeto Request
 * @param {Response} res objeto Response
 * @param {NextFunction} next obejeto nextFunction
 * @returns {void}
 */
export const errorServer = function(error:any,req:Request,res:Response,next:NextFunction):void{
  if(error.parent){
    if(error.parent.errno === -4078){
      res.status(503).send('Content not avaliable!');
    }
    else{
      next();
    }
  }
  else{
    console.log(error);
  }
}