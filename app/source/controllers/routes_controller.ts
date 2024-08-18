import express, { request } from 'express';
import { Router } from 'express';
import { getHome, get3DMovies, getMoviePage, get2DMovies, getPremiersMovies, getMovieInfo, getMovieTicketData, getMovieTicketDataFromat2D, getMovieTicketDataFromat3D, reserveTickets, successfulPaymentPage, newPurchaseOrder, newPurchaseDetails, getDataPurchase, getUserPurchase, restoreTicket, serverError } from './routes/routes_cinemark.js'
import { deleteAccount, getAccount, getLogin, getRegister, postLogin, postRegister, profile, updateEmail, updateFullname, updatePassword, updateUsername } from './routes/routes_user.js';
import { checkLogin, checkSingUp } from '../middlewres/middlewares.js';
import { paymentSession } from './routes/routes_payments.js';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const accesToLogStream = fs.createWriteStream(path.join(__dirname,'access.csv'),{flags:'a'});
accesToLogStream.write('date;method;url;status_code;content-length;response_time;remote_addres\n');
const format = ':date;:method;:url;:status;:res[content-length];:response-time;:remote-addr';
const router = Router();

router.use(express.json());
router.use('/login/user',checkLogin);
router.use('/singup/user',checkSingUp);
router.use(morgan(format,{stream:accesToLogStream}));

router.get('/home',getHome);
router.get('/home/premiers',getPremiersMovies);
router.get('/home/movies_3D',get3DMovies);
router.get('/home/movies_2D',get2DMovies)
router.get('/home/server_error',serverError);
router.get('/home/movie_page',getMoviePage)
router.get('/home/movie_page/movie/id:id',getMovieInfo);
router.get('/home/movie_page/ticket/id:id',getMovieTicketData)
router.get('/home/movie_page/ticket2D/id:id',getMovieTicketDataFromat2D);
router.get('/home/movie_page/ticket3D/id:id',getMovieTicketDataFromat3D);
router.get('/home/movie_page/success_payment',successfulPaymentPage);
router.get('/home/movie_page/success_payment/data_purchase/code:code',getDataPurchase);
router.get('/home/account',getAccount);
router.get('/home/account/user_purchase',getUserPurchase);
router.get('/home/account/profile',profile);
router.get('/singup',getRegister);
router.get('/login',getLogin);

router.post('/login/user',postLogin);
router.post('/singup/user',postRegister);
router.post('/home/movie_page/success_payment/new_purchase',newPurchaseOrder);
router.post('/home/movie_page/success_payment/new_purchase_details',newPurchaseDetails);
router.post('/home/movie_page/payments',paymentSession);

router.put('/profile/update_fullname',updateFullname);
router.put('/profile/update_email',updateEmail);
router.put('/profile/update_username',updateUsername);
router.put('/profile/update_password',updatePassword);
router.put('/home/movie_page/reserve_tickets',reserveTickets);
router.put('/home/movie_page/restore_tickets',restoreTicket);

router.delete('/profile/delete_account',deleteAccount);

export default router