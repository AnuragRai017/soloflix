export const config = {
  runtime: 'edge',
};

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NmI1ZmE5Nzk1YWUyY2FkOTVkMWVkMmQwYzNiYWU1OSIsIm5iZiI6MTczOTUwNzI0Ny40NjEsInN1YiI6IjY3YWVjNjJmZjI2OGFiNTc4ZWJhZTQ1MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fIBpc21sXxhMMolmWMmhsfdVdpbSoaOalw5yY0_hYms';
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchTMDB(path) {
  const url = `${BASE_URL}${path}`;
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

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  try {
    const url = new URL(req.url);
    const paths = url.pathname.split('/');
    const showId = paths[3];
    const seasonNumber = paths[5];

    if (!showId || !seasonNumber) {
      throw new Error('Missing required parameters');
    }

    const data = await fetchTMDB(`/tv/${showId}/season/${seasonNumber}`);

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
    console.error('TV Show API Error:', error);
    
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