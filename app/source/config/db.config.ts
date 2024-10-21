import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Clasification, Format, Movie, Supplier } from '../models/movies.models.js';
import { Hall, Ticket } from '../models/tickets.models.js';
import { PurchaseDetails, PurchaseOrder } from '../models/purchase.models.js';
import { User } from '../models/users.models.js';

dotenv.config();

const sequlize = new Sequelize({
  host: process.env.DB_HOST,
  dialect: 'mysql',
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  models: [Movie,Format,Supplier,Clasification,Ticket,Hall,PurchaseOrder,User,PurchaseDetails]
});

export default sequlize