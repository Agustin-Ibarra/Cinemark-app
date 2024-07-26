import app from '../index.js';
import request from 'supertest';

describe('GET /premiers',()=>{
  test('el estado de la peticion deberia ser 200',async()=>{
    const response = await request(app).get('/premiers').send();
    expect(response.statusCode).toBe(200);
  });
  test('la cabecera de la peticion deberia ser application/json',async()=>{
    const response = await request(app).get('/premiers').send();
    expect(response.header['content-type']).toEqual(expect.stringContaining("application/json"));
  });
  test('el cuerpo de la peticion debe ser del tipo array',async()=>{
    const response = await request(app).get('/premiers').send();
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('GET /movies_3D',()=>{
  test('el estado de la peticion deberia ser 200',async()=>{
    const response = await request(app).get('/movies_3D').send();
    expect(response.statusCode).toBe(200);
  });
  test('la cabecera de la peticion deberia ser application/json',async()=>{
    const response = await request(app).get('/movies_3D').send();
    expect(response.header['content-type']).toEqual(expect.stringContaining("application/json"));
  });
  test('el cuerpo de la peticion debe ser del tipo array',async()=>{
    const response = await request(app).get('/movies_3D').send();
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('GET /movies_2D',()=>{
  test('el estado de la peticion deberia ser 200',async()=>{
    const response = await request(app).get('/movies_2D').send();
    expect(response.statusCode).toBe(200);
  });
  test('la cabecera de la peticion deberia ser application/json',async()=>{
    const response = await request(app).get('/movies_2D').send();
    expect(response.header['content-type']).toEqual(expect.stringContaining("application/json"));
  });
  test('el cuerpo de la peticion debe ser del tipo array',async()=>{
    const response = await request(app).get('/movies_2D').send();
    expect(response.body).toBeInstanceOf(Array);
  });
});

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