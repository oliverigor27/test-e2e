import { once } from 'node:events';
import { createServer } from 'node:http';
import JWT from 'jsonwebtoken';

const DEFAULT_USER = {
    username: "JohnDoe",
    password: "123"
}

const JWT_KEY = 'asdjbajksbdjka66a5s1d'

async function loginRoute(request, response) {
    const { username, password } = JSON.parse(await once(request, 'data'));

    if(username !== DEFAULT_USER.username || password !== DEFAULT_USER.password) {
        response.writeHead(401);
        response.end(JSON.stringify({ error: 'user invalid!' }));
        return;
    }
    
    const token = JWT.sign({ username, message: "User Token!" }, JWT_KEY);

    response.end(JSON.stringify({ token }));
}

async function Handler(request, response) {
    if(request.url === '/login' && request.method === "POST") {
        return loginRoute(request, response)
    }

    response.end("Hello World!");
}

const app = createServer(Handler).listen(3000, () => console.log("Running at port 3000"));

export { app };