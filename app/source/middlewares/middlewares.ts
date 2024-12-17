import {NextFunction, Request, Response} from 'express';
import { body, param, ValidationChain, validationResult } from 'express-validator';

export const fullnameRules: ValidationChain[] = [
  body("fullname").notEmpty().withMessage('the fullname is required!'),
  body("fullname").isLength({min:3,max:20}).withMessage('el nombre completo debe tener entre 4 a 20 caracteres!'),
  body("fullname").matches(/^[a-zA-Z\s]+$/).withMessage('el nombre de usuario solo debe contener letras numeros y guiones bajos!'),
  body("fullname").trim(),
  body("fullname").escape()
];

export const emailRules: ValidationChain[] = [
  body("email").notEmpty().withMessage('the email is required!'),
  body("email").isEmail().withMessage('no es una mail valido!'),
  body("email").escape()
];

export const usernameRules: ValidationChain[] = [
  body("username").notEmpty().withMessage('the username is required!'),
  body("username").isLength({min:4,max:20}).withMessage('el nombre de usuario debe tener entre 4 a 20 caracteres!'),
  body("username").matches(/^[a-zA-Z0-9_-]+$/).withMessage('el nombre de usuario solo debe contener letras numeros y guiones bajos!'),
  body("username").escape()
];

export const passwordRules: ValidationChain[] = [
  body("password").notEmpty().withMessage('the password is required!'),
  body("password").isLength({min:8,max:20}).withMessage('la contraseña no debe ser menor a 8 caracteres'),
  body("password").matches(/^[a-zA-Z0-9_-]+$/).withMessage('la contraseña solo debe contener letras numeros y guiones bajos!'),
  body("password").escape()
];

export const paramIdMovieRules : ValidationChain[] = [
  param("id").notEmpty().withMessage('the id is required!'),
  param("id").isInt().withMessage('the id must be a integer!'),
  param("id").trim(),
  param("id").escape(),
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
 * verifica que las peticiones contengan una cookie generada por el servidor
 * @param {Request} req
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {void}
 */
export const isAuth = function(req:Request,res:Response,next:NextFunction):void{
  let pass:boolean = false;
  if(req.headers.cookie){
    const cookies = req.headers.cookie.split(';');
    cookies.forEach(cookie => {
      if(cookie.replace(' ','').startsWith('cmjwt=') === true){
        pass = true;
      }
    });
  }
  if(pass === false){
    if(req.method === 'GET'){
      res.status(401).redirect('/login');
    }
    else if(req.method === 'PATCH'){
      res.status(401).send('unathourized')
    }
  }
  else{
    next();
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
  if(error.parent.errno === -4078){
    res.status(503).send('Content not avaliable!');
  }
  else{
    next();
  }
}