import React from 'react';
import { Play, Star } from 'lucide-react';
import { Movie } from '../types/movie';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
  onPlay: (id: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlay }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="relative group cursor-pointer">
      <div className="transition-all duration-500 hover:shadow-[0_30px_60px_rgba(239,68,68,0.4)] hover:-translate-y-2 rounded-lg overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover transition-all duration-500 group-hover:scale-[1.05]"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-500 rounded-lg flex items-center justify-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            onPlay(movie.id);
          }}
          title="Play Movie"
          aria-label="Play Movie"
          className="bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 hover:bg-red-700"
        >
          <Play className="w-6 h-6" />
          <span className="sr-only">Play Movie</span>
        </button>
      </div>
      <div className="mt-2">
        <h3 className="font-semibold text-lg truncate">{movie.title}</h3>
        <div className="flex items-center text-sm text-gray-400">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          {movie.vote_average.toFixed(1)}
          <span className="mx-2">•</span>
          {new Date(movie.release_date).getFullYear()}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;