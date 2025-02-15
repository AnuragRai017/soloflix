import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Star, Calendar, ArrowLeft, Copyright } from 'lucide-react';
import { Movie } from '../types/movie';
import { getMovieDetails, getSimilarMovies } from '../services/api';
import VideoPlayer from './VideoPlayer';
import MovieGrid from './MovieGrid';
import { sanitizeContent, validateInput, sanitizeUrl } from '../utils/security';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id || !validateInput.isValidId(id)) {
        navigate('/');
        return;
      }

      try {
        const [movieData, similarData] = await Promise.all([
          getMovieDetails(parseInt(id)),
          getSimilarMovies(parseInt(id))
        ]);
        setMovie(movieData);
        setSimilarMovies(similarData.results);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        navigate('/');
      }
    };
    fetchMovieDetails();
  }, [id, navigate]);

  const handlePlayMovie = () => {
    if (id && validateInput.isValidId(id)) {
      const videoUrl = sanitizeUrl(`https://vidapi.site/embed/movie/?id=${id}`);
      if (videoUrl) {
        setVideoUrl(videoUrl);
      }
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20 relative">
      {/* Back Button */}
      <Link to="/" className="fixed top-20 left-4 z-50 flex items-center text-white/70 hover:text-white transition-colors">
        <ArrowLeft className="w-6 h-6 mr-2" />
        Back
      </Link>

      {/* Hero Section */}
      <div 
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(17,24,39,1)]"></div>
        <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">
            {movie && sanitizeContent(movie.title)}
          </h1>
          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              {movie.vote_average.toFixed(1)}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(movie.release_date).getFullYear()}
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            {movie && sanitizeContent(movie.overview)}
          </p>
          <button
            onClick={handlePlayMovie}
            className="mt-6 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors flex items-center"
          >
            <Play className="w-6 h-6 mr-2" />
            Watch Now
          </button>
        </div>
      </div>

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Similar Movies
          </h2>
          <MovieGrid movies={similarMovies} onPlayMovie={handlePlayMovie} />
        </div>
      )}

      {/* Copyright Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center text-sm text-gray-400">
            <Copyright className="w-4 h-4 mr-2" />
            <p>This content is protected by copyright. All rights reserved. Data provided by TMDB.</p>
          </div>
        </div>
      </div>

      {videoUrl && (
        <VideoPlayer url={videoUrl} onClose={() => setVideoUrl(null)} />
      )}
    </div>
  );
};

export default MovieDetails;
