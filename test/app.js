const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Node 서버가 정상적으로 실행 중입니다!');
});

server.listen(PORT, () => {
  console.log(`서버 실행 중 👉 http://localhost:${PORT}`);
});
