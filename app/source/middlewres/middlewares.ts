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
  if(!req.body || !req.body.username || !req.body.password){
    res.status(400).send({error:'All fields must be complete!'})
  }
  else{
    const username:String = req.body.username;
    const password:String = req.body.password;
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
  const fullname:String = req.body.fullname;
  const email:String = req.body.email;
  const username:String = req.body.username;
  const password:String = req.body.password;
  if(!fullname || !email || !username || !password){
    res.status(400).send({error:'All fields must be complete!'})
  }
  else{
    const resultFullNAme:Boolean = verifyString(fullname);
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


/**
 * verifica que las peticiones contengan una cookie generada por el servidor
 * @param {Request} req
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {void}
 */
export const isAuth = function(req:Request,res:Response,next:NextFunction):void{
  if(!req.headers.cookie){
    if(req.method === 'GET'){
      res.status(401).redirect('/login');
    }
    else{
      res.status(401).send('unauthorized');
    }
  }
  else{
    const cookies = req.headers.cookie.split(';')
    const token = cookies.find((token)=> token.startsWith('cmjwt='));
    if(!token){
      if(req.method === 'GET'){
        res.status(401).redirect('/login');
      }
      else{
        res.status(401).send('unauthorized');
      }
    }
    else{
      next();
    }
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