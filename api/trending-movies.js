export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': '*'
      }
    });
  }

  try {
    const response = await fetch('https://api.themoviedb.org/3/trending/movie/week', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NmI1ZmE5Nzk1YWUyY2FkOTVkMWVkMmQwYzNiYWU1OSIsIm5iZiI6MTczOTUwNzI0Ny40NjEsInN1YiI6IjY3YWVjNjJmZjI2OGFiNTc4ZWJhZTQ1MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fIBpc21sXxhMMolmWMmhsfdVdpbSoaOalw5yY0_hYms'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('TMDB API Error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch trending movies' }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}