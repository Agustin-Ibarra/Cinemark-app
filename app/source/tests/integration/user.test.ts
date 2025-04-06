import dotenv from 'dotenv';
import {app,server} from '../../index.js';
import request from 'supertest';
import { cronJob } from '../../monitoring/routes.monitorings.js';
import { describe } from 'node:test';

dotenv.config();

describe('POST /login/user',()=>{
  test('deberia responder con un estado 200',async()=>{
    const response = await request(app).post('/login/api').send({
      username:process.env.USER_TEST,
      password:process.env.PASSWORD_TEST
    });
    expect(response.status).toBe(200);
  });

  test('deberia responder con estado 401',async()=>{
    const response = await request(app).post('/login/api').send({username:'fake_username',password:'fakepassword'});
    expect(response.status).toBe(401);
  });

  test('deberia responder con un estado 400',async()=>{
    const response = await request(app).post('/login/api').send({usernae:'',password:''});
    expect(response.status).toBe(400);
  });
  
  afterAll(async()=>{
    await server.close();
    await cronJob.stop();
  });
});