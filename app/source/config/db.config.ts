import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Clasification, Format, Movie, Supplier } from '../models/movies.models.js';
import { Hall, Ticket } from '../models/tickets.models.js';
import { PurchaseDetails, PurchaseOrder } from '../models/purchase.models.js';
import { User } from '../models/users.models.js';
import { config } from './config.js';

dotenv.config();

const sequlize = new Sequelize({
  host: config.DB_HOST,
  dialect: 'mysql',
  database: config.DB_NAME,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
  models: [Movie,Format,Supplier,Clasification,Ticket,Hall,PurchaseOrder,User,PurchaseDetails]
});

export default sequlize