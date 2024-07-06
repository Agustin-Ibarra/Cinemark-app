import express from 'express';
import { Router } from 'express';
import { getHome, get3DMovies, getMoviePage, get2DMovies, getPremiersMovies, getMovieInfo, getMovieTicketData, getMovieTicketDataFromat2D, getMovieTicketDataFromat3D, reserveTickets, successfulPaymentPage, newPurchaseOrder, newPurchaseDetails, getDataPurchase, getUserPurchase, restoreTicket } from './routes/routes_cinemark.js'
import { getAccount, getLogin, getRegister, postLogin, postRegister, profile, updateEmail, updateFullname, updatePassword, updateUsername } from './routes/routes_user.js';
import { checkLogin, checkSingUp } from '../controllers/midlewares.js';
import { paymentSession } from './routes/routes_payments.js';

const router = Router();
router.use(express.json());
router.use('/login/user',checkLogin);
router.use('/singup/user',checkSingUp);

router.get('/',getHome);
router.get('/premiers',getPremiersMovies);
router.get('/movies_3D',get3DMovies);
router.get('/movies_2D',get2DMovies)
router.get('/movie_page',getMoviePage)
router.get('/movie/id:id',getMovieInfo);
router.get('/movie/ticket/id:id',getMovieTicketData)
router.get('/movie/ticket2D/id:id',getMovieTicketDataFromat2D);
router.get('/movie/ticet3D/id:id',getMovieTicketDataFromat3D);
router.get('/success_payment',successfulPaymentPage);
router.get('/account',getAccount);
router.get('/singup',getRegister);
router.get('/login',getLogin);
router.get('/data_purchase/code:code',getDataPurchase);
router.get('/account/user_purchase',getUserPurchase);
router.get('/profile',profile);

router.post('/login/user',postLogin);
router.post('/singup/user',postRegister);
router.post('/new_purchase',newPurchaseOrder);
router.post('/new_purchase_details',newPurchaseDetails);
router.post('/payments',paymentSession);

router.put('/profile/update_username',updateUsername);
router.put('/profile/update_fullname',updateFullname);
router.put('/profile/update_email',updateEmail);
router.put('/profile/update_password',updatePassword);
router.put('/movie/reserve_tickets',reserveTickets);
router.put('/movie/restore_tickets',restoreTicket);

export default router