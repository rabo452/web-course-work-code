import { Movie } from '@domain/Movie';
import { User } from '@domain/User';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config } from 'src/config/Config';

class AdminRequestHelper {
  private apiClient: AxiosInstance

  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }

  public async getUsers(): Promise<User[]> {
    return this.apiClient.get('/api/get-users')
      .then((res) => res.data)
  }

  public async updateUser(id: string, username: string, email: string, role: string): Promise<void> {
    return this.apiClient.put(`/api/user/update`, {user_id: id, username, email, role}, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  }

  public async deleteUser(id: string): Promise<void> {
    return this.apiClient.delete(`/api/user/delete/${id}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  }

  public async getMovies(): Promise<Movie[]> {
    return this.apiClient.get('/api/get-movies')
      .then(res => res.data as Movie[])
  }

  public async createMovie(movie: Movie): Promise<string> {
    return this.apiClient.post('/api/movie/create-movie', movie)
  }

  public async deleteMovie(id: string): Promise<void> {
    return this.apiClient.delete(`/api/movie/delete/${id}`)
  }

  public async updateMovie(movie: Movie): Promise<void> {
    return this.apiClient.put(`/api/movie/${movie.id}`, movie)
  }
}

// generates api client for making admin requests
function AdminRequestHelperFactory(JWT_TOKEN: string): AdminRequestHelper {
  const apiClient = axios.create({
    baseURL: `http://${Config.ADMIN_SERVICE_HOST}`,
    timeout: 1000, 
    headers: {
      'Accept': 'application/json',       // Ensures the server returns JSON
      'Content-Type': 'application/json' // Ensures the request body is sent as JSON
    },
  });
  // for every request there should be JWT token which determines a user

  if (!JWT_TOKEN) {
    throw new Error("unable to create request helper due to unauthorized user access")
  }

  // Add JWT token 
  apiClient.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${JWT_TOKEN}`;
    return config;
  })

  // Add a response interceptor
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response?.status === 401) {
        throw new Error("unauthorized user access")
      }
      return error;
    }
  );

  return new AdminRequestHelper(apiClient);
}

export {AdminRequestHelperFactory}