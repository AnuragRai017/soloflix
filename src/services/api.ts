import axios from 'axios';
import { MovieResponse, Movie } from '../types/movie';
import { ShowResponse, Season, Episode, Show } from '../types/show';

// Create axios instance with security headers
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  // Ensure URLs are properly encoded
  paramsSerializer: params => {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Successful response from:', response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Error response:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('Request failed:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getTrendingMovies = async (): Promise<MovieResponse> => {
  try {
    const response = await api.get('/trending/movie/week');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trending movies:', error);
    return { results: [], total_pages: 0, page: 1 };
  }
};

export const getPopularMovies = async (): Promise<MovieResponse> => {
  try {
    const response = await api.get('/movie/popular');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch popular movies:', error);
    return { results: [], total_pages: 0, page: 1 };
  }
};

export const getTrendingShows = async (): Promise<ShowResponse> => {
  try {
    const response = await api.get('/trending/tv/week');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trending shows:', error);
    return { results: [], total_pages: 0, page: 1 };
  }
};

export const getPopularShows = async (): Promise<ShowResponse> => {
  try {
    const response = await api.get('/tv/popular');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch popular shows:', error);
    return { results: [], total_pages: 0, page: 1 };
  }
};

export const searchMovies = async (query: string): Promise<MovieResponse> => {
  try {
    const response = await api.get('/search/movie', { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Failed to search movies:', error);
    return { results: [], total_pages: 0, page: 1 };
  }
};

export const searchShows = async (query: string): Promise<ShowResponse> => {
  try {
    const response = await api.get('/search/tv', { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Failed to search shows:', error);
    return { results: [], total_pages: 0, page: 1 };
  }
};

export const getMovieDetails = async (movieId: number): Promise<Movie | null> => {
  try {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch movie details:', error);
    return null;
  }
};

export const getSimilarMovies = async (movieId: number): Promise<MovieResponse> => {
  try {
    const response = await api.get(`/movie/${movieId}/similar`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch similar movies:', error);
    return { results: [], total_pages: 0, page: 1 };
  }
};

export const getShowDetails = async (showId: number): Promise<Show | null> => {
  try {
    const response = await api.get(`/tv/${showId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch show details:', error);
    return null;
  }
};

export const getShowSeasons = async (showId: number): Promise<Season[]> => {
  try {
    const response = await api.get(`/tv/${showId}`);
    return response.data.seasons || [];
  } catch (error) {
    console.error('Failed to fetch show seasons:', error);
    return [];
  }
};

export const getSeasonEpisodes = async (showId: number, seasonNumber: number): Promise<Episode[]> => {
  try {
    const response = await api.get(`/tv/${showId}/season/${seasonNumber}`);
    return response.data.episodes || [];
  } catch (error) {
    console.error('Failed to fetch season episodes:', error);
    return [];
  }
};