import { describe, jest, test } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';

jest.mock('../../models/users.models',()=>({
  User:{
    findAll:jest.fn()
  }
}));

import { User } from '../../models/users.models';
import { postLogin } from '../../controller/controllers.user';

describe("POST /login/api",()=>{
  const req = {
    body:{
      username:"username",
      password:"password"
    }
  } as unknown as Request;
  const res = {
    status:jest.fn(),
    send:jest.fn(),
    cookie:jest.fn()
  } as unknown as Response;
  const next = jest.fn() as unknown as NextFunction;
  
  jest.spyOn(User,"findAll").mockImplementation(()=>Promise.resolve([]));

  test('el codigo deberia ser 200',async()=>{
    await postLogin(req,res,next);
    expect(res.status(200));
  });

  test('la respuesta deberia incluir una cookie con el token',async()=>{
    await postLogin(req,res,next);
    expect(res.cookie).toBeDefined();
  });

  test('el codigo deberia ser 401 al fallar la autenticacion',async()=>{
    await postLogin(req,res,next);
    expect(res.status).toHaveBeenCalledWith(401)
  });

  test('deberia realizar una consulta a la base de datos',async()=>{
    await postLogin(req,res,next);
    expect(User.findAll).toHaveBeenCalled();
  });
});


