import {NextFunction, Request, Response} from 'express';

/**
 * evalua si un string contiene caracteres no validos
 * @param {string} value string a evaluar
 * @returns {boolean} true en caso de exito false en caso de error
 */
const verifyString =  function(value:String):boolean{
  if(value.includes('=') || value.includes(';') || value.includes('"')){
    return false;
  }
  else{
    return true;
  }
}

/**
 * analiza los datos del cuerpo de la peticion al iniciar sesion, si los valores no son validos el codigo de estado sera 400
 * @param {object} req
 * @param {object} res 
 * @param {NextFunction} next 
 * @returns {void}
 */
export const checkLogin = function(req:Request,res:Response,next:NextFunction): void{
  const username:String = req.body.username;
  const password:String = req.body.password;
  if(!username || !password){
    res.status(400).send({error:'All fields must be complete!'})
  }
  else{
    const resultUsername:Boolean = verifyString(username);
    const resultPassword:Boolean = verifyString(password);
    if(resultUsername === false || resultPassword === false){
      res.status(400).send({error:'Invalid format!'});
    }
    else{
      next();
    }
  }
}

/**
 * analiza los datos del cuerpo de la peticion al registrarse, sin los datos no son validos el codigo de estado sera 400
 * @param {object} req 
 * @param {object} res 
 * @param {NextFunction} next
 * @returns {void} 
 */
export const checkSingUp = function(req:Request,res:Response,next:NextFunction):void{
  const fullName:String = req.body.fullName;
  const email:String = req.body.email;
  const username:String = req.body.username;
  const password:String = req.body.password;
  if(!fullName || !email || !username || !password){
    res.status(400).send({error:'All fields must be complete!'})
  }
  else{
    const resultFullNAme:Boolean = verifyString(fullName);
    const resultEmail:Boolean = verifyString(email);
    const resultUsername:Boolean = verifyString(username);
    const resultPassword:Boolean = verifyString(password);
    if(resultFullNAme === false || resultEmail === false || resultUsername === false || resultPassword === false){
      res.status(400).send({error:'invalid format'});
    }
    else{
      next();
    }
  }
}