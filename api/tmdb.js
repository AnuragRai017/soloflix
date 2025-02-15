const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NmI1ZmE5Nzk1YWUyY2FkOTVkMWVkMmQwYzNiYWU1OSIsIm5iZiI6MTczOTUwNzI0Ny40NjEsInN1YiI6IjY3YWVjNjJmZjI2OGFiNTc4ZWJhZTQ1MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fIBpc21sXxhMMolmWMmhsfdVdpbSoaOalw5yY0_hYms';
const BASE_URL = 'https://api.themoviedb.org/3';

export const config = {
  runtime: 'edge',
};

async function fetchTMDB(path, searchParams = new URLSearchParams()) {
  const url = `${BASE_URL}${path}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  console.log('Fetching TMDB URL:', url);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TMDB_TOKEN}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`TMDB API Error: ${response.status} ${text}`);
  }

  return response.json();
}

const ENDPOINTS = {
  '/api/trending/movie/week': () => fetchTMDB('/trending/movie/week'),
  '/api/movie/popular': () => fetchTMDB('/movie/popular'),
  '/api/trending/tv/week': () => fetchTMDB('/trending/tv/week'),
  '/api/tv/popular': () => fetchTMDB('/tv/popular'),
  '/api/search/movie': (params) => fetchTMDB('/search/movie', params),
  '/api/search/tv': (params) => fetchTMDB('/search/tv', params),
  '/api/movie/:id': (_, pathname) => {
    const id = pathname.split('/').pop();
    return fetchTMDB(`/movie/${id}`);
  },
  '/api/movie/:id/similar': (_, pathname) => {
    const id = pathname.split('/')[3];
    return fetchTMDB(`/movie/${id}/similar`);
  },
  '/api/tv/:id': (_, pathname) => {
    const id = pathname.split('/').pop();
    return fetchTMDB(`/tv/${id}`);
  },
  '/api/tv/:id/similar': (_, pathname) => {
    const id = pathname.split('/')[3];
    return fetchTMDB(`/tv/${id}/similar`);
  },
  '/api/tv/:id/season/:seasonNumber': (_, pathname) => {
    const parts = pathname.split('/');
    const showId = parts[3];
    const seasonNumber = parts[5];
    return fetchTMDB(`/tv/${showId}/season/${seasonNumber}`);
  }
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    
    // Special handling for season endpoints
    if (pathname.includes('/season/')) {
      const pattern = pathname.replace(/\/\d+\/season\/\d+/, '/:id/season/:seasonNumber');
      const endpoint = ENDPOINTS[pattern];
      if (endpoint) {
        const data = await endpoint(null, pathname);
        return new Response(JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, s-maxage=60',
          },
        });
      }
    }

    // Regular endpoint handling
    const pattern = pathname.replace(/\/\d+(?=\/|$)/g, '/:id');
    const endpoint = ENDPOINTS[pattern];

    if (!endpoint) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid endpoint',
          requestedPath: pathname,
          pattern: pattern,
          availableEndpoints: Object.keys(ENDPOINTS),
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const searchParams = new URLSearchParams(url.search);
    const data = await endpoint(searchParams, pathname);

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60',
        },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}