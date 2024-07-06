import app from '../index.js';
import request from 'supertest';

describe('',()=>{
  test('test',async()=>{
    const response = await request(app).get('/').send();
    expect(response.statusCode).toBe(200);
  })
})