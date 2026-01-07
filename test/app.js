const http = require('http');

const PORT = 3000;

// 임시 유저 리스트
const users = [
  { id: 1, name: '홍길동' },
  { id: 2, name: '김철수' },
  { id: 3, name: '이영희' }
];

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

  // URL 분기 처리
  if (req.url === '/') {
    res.end('Node 서버가 정상적으로 실행 중입니다!');
  }
  else if (req.url === '/user') {
    let result = '유저 리스트\n\n';

    users.forEach(user => {
      result += `ID: ${user.id}, 이름: ${user.name}\n`;
    });

    res.end(result);
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`서버 실행 중 👉 http://localhost:${PORT}`);
});
