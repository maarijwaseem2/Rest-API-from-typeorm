import * as http from 'http';
import app from './index';

const port: number | string = process.env.PORT || 3000;

const server: http.Server = http.createServer(app);

server.listen(port, () => {
    console.log("Server is running..."+port);
});