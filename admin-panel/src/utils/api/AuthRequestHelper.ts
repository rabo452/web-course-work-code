import { User } from "@domain/User";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Config } from "src/config/Config";

class AuthRequestHelper {
    private apiClient: AxiosInstance

    constructor() {
        this.apiClient = axios.create({
            baseURL: `http://${Config.AUTH_SERVICE_HOST}`,
            timeout: 1000,
            headers: {
                'Accept': 'application/json',       // Ensures the server returns JSON
                'Content-Type': 'application/json' // Ensures the request body is sent as JSON
            },
        });
    }

    public async getUserJWT(username: string, password: string): Promise<string> {
        const data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);

        return this.apiClient.post('/login', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then((response) => response.data.JWT)
    }

    public async createUser(username: string, password: string, email: string): Promise<string> {
        return this.apiClient.post('/sign-in', {username, password, email}, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((res) => res.data.id)
    }
}

export {AuthRequestHelper}