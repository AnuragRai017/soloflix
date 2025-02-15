import React, { useEffect, useState } from 'react';
import { Copyright } from 'lucide-react';
import {
  getTrendingMovies,
  getPopularMovies,
  getTrendingShows,
  getPopularShows,
  searchMovies,
  searchShows,
} from '../services/api';
import { Movie } from '../types/movie';
import { Show } from '../types/show';
import MovieGrid from '../components/MovieGrid';
import ShowGrid from '../components/ShowGrid';
import VideoPlayer from '../components/VideoPlayer';

const Home: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingShows, setTrendingShows] = useState<Show[]>([]);
  const [popularShows, setPopularShows] = useState<Show[]>([]);
  const [searchResults, setSearchResults] = useState<{
    movies: Movie[];
    shows: Show[];
  }>({ movies: [], shows: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const [trendingMoviesData, popularMoviesData, trendingShowsData, popularShowsData] =
          await Promise.all([
            getTrendingMovies(),
            getPopularMovies(),
            getTrendingShows(),
            getPopularShows(),
          ]);
        
        if (trendingMoviesData?.results) setTrendingMovies(trendingMoviesData.results);
        if (popularMoviesData?.results) setPopularMovies(popularMoviesData.results);
        if (trendingShowsData?.results) setTrendingShows(trendingShowsData.results);
        if (popularShowsData?.results) setPopularShows(popularShowsData.results);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setIsSearching(false);
        setSearchResults({ movies: [], shows: [] });
        return;
      }

      try {
        setIsSearching(true);
        setIsLoading(true);
        const [movieResults, showResults] = await Promise.all([
          searchMovies(searchQuery),
          searchShows(searchQuery),
        ]);
        
        setSearchResults({
          movies: movieResults?.results || [],
          shows: showResults?.results || [],
        });
      } catch (error) {
        console.error('Error searching content:', error);
        setSearchResults({ movies: [], shows: [] });
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [searchQuery]);

  const handlePlayMovie = (movieId: number) => {
    setVideoUrl(`https://vidapi.site/embed/movie/?id=${movieId}`);
  };

  const handlePlayShow = (showId: number) => {
    setVideoUrl(`https://vidapi.site/embed/tv/?id=${showId}&season=1&episode=1`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative pb-20">
      <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
        {isSearching ? (
          <>
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              Search Results
            </h2>
            {searchResults.movies?.length > 0 && (
              <section className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 text-gray-100">Movies</h3>
                <MovieGrid movies={searchResults.movies} onPlayMovie={handlePlayMovie} />
              </section>
            )}
            {searchResults.shows?.length > 0 && (
              <section className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 text-gray-100">TV Shows</h3>
                <ShowGrid shows={searchResults.shows} onPlayShow={handlePlayShow} />
              </section>
            )}
            {(!searchResults.movies?.length && !searchResults.shows?.length) && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No results found. Try a different search term.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {trendingMovies?.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                    Trending Movies
                  </span>
                </h2>
                <MovieGrid movies={trendingMovies} onPlayMovie={handlePlayMovie} />
              </section>
            )}

            {popularMovies?.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                    Popular Movies
                  </span>
                </h2>
                <MovieGrid movies={popularMovies} onPlayMovie={handlePlayMovie} />
              </section>
            )}

            {trendingShows?.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                    Trending TV Shows
                  </span>
                </h2>
                <ShowGrid shows={trendingShows} onPlayShow={handlePlayShow} />
              </section>
            )}

            {popularShows?.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                    Popular TV Shows
                  </span>
                </h2>
                <ShowGrid shows={popularShows} onPlayShow={handlePlayShow} />
              </section>
            )}
          </>
        )}
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center text-sm text-gray-400">
            <Copyright className="w-4 h-4 mr-2" />
            <p>This content is protected by copyright. All rights reserved. Data provided by TMDB.</p>
          </div>
        </div>
      </div>

      {videoUrl && <VideoPlayer url={videoUrl} onClose={() => setVideoUrl(null)} />}
    </div>
  );
};

export default Home;