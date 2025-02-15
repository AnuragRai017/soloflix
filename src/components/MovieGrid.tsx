import React from 'react';
import MovieCard from './MovieCard';
import { Movie } from '../types/movie';

interface MovieGridProps {
  movies: Movie[];
  onPlayMovie: (id: number) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies = [], onPlayMovie }) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          onPlay={onPlayMovie}
          movie={movie}
        />
      ))}
    </div>
  );
};

export default MovieGrid;