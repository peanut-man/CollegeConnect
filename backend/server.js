const http = require('http');
const app = require('./app');
const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port, ()=>{
    console.log(`Server is listening on ${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  } else {
    console.error(err);
  }
});