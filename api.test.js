import { describe, before, after, it } from 'node:test'
import { deepStrictEqual, ok, strictEqual } from 'assert';

const BASE_URL = "http://localhost:3000";

describe("Test Workflow", () => {
    let _server = {};

    before(async () => {
        _server = (await import("./api.js")).app;
        await new Promise(resolve => _server.once("listening", resolve));
    });

    after(done => _server.close(done));

    it("Should not allow login by user without valid credentials", async () => {
        const data = {
            username: 'johndoe',
            password: ''
        }

        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            body: JSON.stringify(data)
        });

        strictEqual(response.status, 401);

        const responseBody = await response.json();
        deepStrictEqual(responseBody, { error: 'user invalid!' });
    });

    it("Should return a valid token after user login", async () => {
        const data = {
            username: 'JohnDoe', // Usando as credenciais padrão definidas no servidor
            password: '123'
        }
    
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        strictEqual(response.status, 200, `Expected status 200 but received ${response.status}`);
    
        const responseBody = await response.json();
    
        ok(responseBody.token, "User successfully authenticated. Token received!");
    });
});
