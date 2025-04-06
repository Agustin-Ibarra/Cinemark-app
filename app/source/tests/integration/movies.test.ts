import {app,server} from '../../index.js';
import request from 'supertest';
import dotenv from 'dotenv';
import { cronJob } from '../../monitoring/routes.monitorings.js';

dotenv.config();

describe('GET /home/movie/api',()=>{
  test('el estado de la peticion deberia ser 200',async()=>{
    const response = await request(app).get('/home/movie/api').send();
    expect(response.statusCode).toBe(200);
  });

  test('el cuerpo de la peticion debe ser del tipo array',async()=>{
    const response = await request(app).get('/home/premiers').send();
    expect(response.body).toBeInstanceOf(Object);
  });

  afterAll(async()=>{
    await server.close();
    await cronJob.stop();
  });
});
