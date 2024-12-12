import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config } from 'src/config/Config';
import { Movie } from 'src/domain/Movie';

class MoviesRequestHelper {
  private apiClient: AxiosInstance;

  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }

  // Fetch favorite movies for the logged-in user
  public async getFavoriteMovies(): Promise<Movie[]> {
    const response = await this.apiClient.get('/liked-movies');
    return response.data as Movie[];
  }

  // Add a movie to the user's list of favorite movies
  public async addFavoriteMovie(movieId: string): Promise<void> {
    const params = new URLSearchParams();
    params.append('movieId', movieId);
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        } 
    } 

    return await this.apiClient.post('/add-liked-movie', params, config);
}

  public async getMainPageMovies(n: number): Promise<Movie[]> {
    return await this.apiClient.get('/main-page-movies', { params: {n} })
        .then(res => res.data)
  }

  // Make a call to the filter API to search for movies based on various filters
  public async filterMovies(
    searchText: string = ' ', 
    priceStart: number = 0, 
    priceEnd: number = 0, 
    yearStart: number = 0, 
    yearEnd: number = 0
  ): Promise<Movie[]> {
    const response = await this.apiClient.get('/filter', {
        params: {
          searchText,
          priceStart,
          priceEnd,
          yearStart,
          yearEnd
        }
      });
    return response.data as Movie[];
  }
}

// Generates the API client for making requests with JWT token for user authentication
function MoviesRequestHelperFactory(JWT_TOKEN: string): MoviesRequestHelper {
  // Axios client instance
  const apiClient = axios.create({
    baseURL: `http://${Config.MOVIE_HOST}`, // Base URL of your FastAPI app
    timeout: 1000,  // Set timeout for requests (1 second here)
    headers: {
      'Accept': 'application/json',  // Ensure the server returns JSON
      'Content-Type': 'application/json' // Ensure requests are sent as JSON
    }
  });

  // If JWT_TOKEN is not provided, throw an error
  if (!JWT_TOKEN) {
    throw new Error("Unable to create request helper due to unauthorized user access");
  }

  // Add JWT token to every request header
  apiClient.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${JWT_TOKEN}`;
    return config;
  });

  // Response interceptor to handle unauthorized errors (401)
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized user access");
      }
      return error;
    }
  );

  // Return an instance of MoviesRequestHelper to interact with the API
  return new MoviesRequestHelper(apiClient);
}

export { MoviesRequestHelperFactory }
