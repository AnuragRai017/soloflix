import React from 'react';
import ShowCard from './ShowCard';
import { Show } from '../types/show';

interface ShowGridProps {
  shows: Show[];
  onPlayShow: (id: number) => void;
}

const ShowGrid: React.FC<ShowGridProps> = ({ shows = [], onPlayShow }) => {
  if (!shows || shows.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} onPlay={onPlayShow} />
      ))}
    </div>
  );
};

export default ShowGrid;