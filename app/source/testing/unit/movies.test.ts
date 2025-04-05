import { describe, jest } from '@jest/globals';
import { Request, response, Response } from 'express';

jest.mock('../../models/movies.models',()=>({
  Movie:{
    findAll:jest.fn(),
    update:jest.fn()
  }
}));

jest.mock('../../models/tickets.models',()=>({
  Ticket:{
    findAll:jest.fn(),
    update:jest.fn()
  }
}));

import { Movie } from '../../models/movies.models';
import { getMoviesByFormat, reserveTickets } from '../../controller/controllers.cinemark';
import { Ticket } from '../../models/tickets.models';

describe("GET /home/list",()=>{
  const req = {
    query:{format:"2D"}
  } as unknown as Request;
  const res = {
    status:jest.fn().mockReturnThis(),
    send:jest.fn()
  } as unknown as Response;
  const next = jest.fn();

  jest.spyOn(Movie,"findAll").mockImplementation(()=>Promise.resolve([]));

  test('el codigo deberia ser 200',async()=>{
    await getMoviesByFormat(req,res,next);
    expect(res.status).toHaveBeenCalledWith(200)
  });

  test('deberia realizar una consulta a la base de datos',async()=>{
    await getMoviesByFormat(req,res,next);
    expect(Movie.findAll).toHaveBeenCalled();
  });
});

describe("PATCH /home/movie/reserve_tickets",()=>{
  const req = {
    body:{
      idTicket:1,
      amount:1
    }
  } as unknown as Request;
  const res = {
    status:jest.fn().mockReturnThis(),
    json:jest.fn().mockReturnThis()
  } as unknown as Response;

  jest.spyOn(Ticket,"update").mockImplementation(()=>Promise.resolve([1]));

  test('el estado deberia ser 201',async()=>{
    await reserveTickets(req,res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('deberia relaizar na consulta a la base de datos',async()=>{
    await reserveTickets(req,res);
    expect(Ticket.update).toHaveBeenCalled();
  }); 

});