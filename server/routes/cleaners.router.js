/**
 * @file routes/cleaners.router.js
 * @description cleaners 관련 라우터
 * 251229 v1.0.0 jh init
 */

import express from 'express';
import cleanersAccountController from '../app/controllers/cleaner/cleaner.account.controller.js';


const cleanersRouter = express.Router();

cleanersRouter.get('/userquotelistdetails/:id', (req, res, next) => {
  res.send('ttt');
});

cleanersRouter.get('/accountinfo', cleanersAccountController.createAccountInfo);
cleanersRouter.post('/accountinfo', cleanersAccountController.createAccountInfo);

export default cleanersRouter;