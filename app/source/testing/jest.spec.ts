import dotenv from 'dotenv';
import {app,server} from '../index.js';
import request from 'supertest';
import { cronJob } from '../monitoring/routes.monitorings.js';
import { describe } from 'node:test';

dotenv.config();

describe('GET /home/premiers',()=>{
  test('el estado de la peticion deberia ser 200',async()=>{
    const response = await request(app).get('/home/premiers').send();
    expect(response.statusCode).toBe(200);
  });
  test('la cabecera de la peticion deberia ser application/json',async()=>{
    const response = await request(app).get('/home/premiers').send();
    expect(response.header['content-type']).toEqual(expect.stringContaining("application/json"));
  });
  test('el cuerpo de la peticion debe ser del tipo array',async()=>{
    const response = await request(app).get('/home/premiers').send();
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('GET /home/movies_3D',()=>{
  test('el estado de la peticion deberia ser 200',async()=>{
    const response = await request(app).get('/home/movies_3D').send();
    expect(response.statusCode).toBe(200);
  });
  test('la cabecera de la peticion deberia ser application/json',async()=>{
    const response = await request(app).get('/home/movies_3D').send();
    expect(response.header['content-type']).toEqual(expect.stringContaining("application/json"));
  });
  test('el cuerpo de la peticion debe ser del tipo array',async()=>{
    const response = await request(app).get('/home/movies_3D').send();
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('GET /home/movies_2D',()=>{
  test('el estado de la peticion deberia ser 200',async()=>{
    const response = await request(app).get('/home/movies_2D').send();
    expect(response.statusCode).toBe(200);
  });
  test('la cabecera de la peticion deberia ser application/json',async()=>{
    const response = await request(app).get('/home/movies_2D').send();
    expect(response.header['content-type']).toEqual(expect.stringContaining("application/json"));
  });
  test('el cuerpo de la peticion debe ser del tipo array',async()=>{
    const response = await request(app).get('/home/movies_2D').send();
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('POST /home/movie_page/payments',()=>{
  test('el estado de la peticion deberia ser 200',async()=>{
    const response = await request(app).post('/home/movie_page/payments').send({
      movie:1,
      amount:2,
      total:6
    });
    expect(response.status).toBe(200);
  });
  test('debria tener el valor url',async()=>{
    const response = await request(app).post('/home/movie_page/payments').send({
      movie:1,
      amount:2,
      total:6
    });
    expect(response.body.url).toBeDefined();
  })
})

describe('PUT /movie/reserve_tickets',()=>{
  const ticket = {
    idTicket:1,
    amount:2
  }
  test('el estado de la peticion deberia ser 201',async()=>{
    const response = await request(app).put('/movie/reserve_tickets').send(ticket);
    expect(response.status).toBe(201);
  });
  test('el cuerpo de la peticion debe contener el valor "code"',async()=>{
    const response = await request(app).put('/movie/reserve_tickets').send(ticket);
    expect(response.body.code).toBeDefined();
  });
});

describe('PUT /movie/reserve_tickets',()=>{
  const ticketEmpty = {
    idTicket:2,
    amount:2
  }
  test('el estado de la peticion deberia ser 400',async()=>{
    const response = await request(app).put('/movie/reserve_tickets').send(ticketEmpty);
    expect(response.status).toBe(400);
  });
  test('el contenido de la peticion debe tener el valor "empty" indicando que el error es por stock insuficiente',async()=>{
    const response = await request(app).put('/movie/reserve_tickets').send(ticketEmpty);
    expect(response.body.error).toBeDefined();
  });
});

describe('POST /login/user',()=>{
  describe('cuando las credenciales son correctas',()=>{
    test('deberia responder con un estado 200',async()=>{
      const response = await request(app).post('/login/user').send({
        username:process.env.USER_TEST,
        password:process.env.PASSWORD_TEST
      });
      expect(response.status).toBe(200);
    });
  });
  describe('cuando las credenciales son incorrectas',()=>{
    test('deberia responder con estado 404',async()=>{
      const response = await request(app).post('/login/user').send({username:'username',password:'password'});
      expect(response.status).toBe(404);
    });
  });
  describe('cuando las credenciales estan vacias',()=>{
    test('deberia responder con un estado 400',async()=>{
      const response = await request(app).post('/login/user').send({usernae:'',password:''});
      expect(response.status).toBe(400);
    })
  });
});

afterAll(()=>{
  server.close();
  cronJob.stop();
});

export {};