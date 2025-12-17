/**
 * @file app.js
 * @description Entry Point
 * 251217 v1.0.0 jae
 */
import express from  'express';
import './configs/env.config';

const app = express();

app.get('/', (req, res, next) => {
  res.status(200).send('테스트'); 
});

// 해당 port로 express 실행
app.listen(3000);