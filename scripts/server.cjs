const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// public/은 루트로 제공
app.use('/', express.static(path.join(__dirname, '../public')));

// 상위 dist/ 폴더를 가상 디렉토리로 제공
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// console.log('Serving dist from:', path.join(__dirname, '../dist'));

// 예: http://localhost:8080/dist/xxx.js 로 접근 가능
app.listen(port, () => {
  console.log(`🚀 서버 실행: http://localhost:${port}`);
});

// "serve": "npx http-server public -p 8080",