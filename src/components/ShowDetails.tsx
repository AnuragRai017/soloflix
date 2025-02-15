import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Star, Calendar, Clock, Copyright, Loader } from 'lucide-react';
import { Show, Season, Episode } from '../types/show';
import { getShowDetails, getShowSeasons, getSeasonEpisodes } from '../services/api';
import VideoPlayer from './VideoPlayer';
import { sanitizeContent, validateInput, sanitizeUrl } from '../utils/security';

const ShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEpisodesLoading, setIsEpisodesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      if (!id || !validateInput.isValidId(id)) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const [showData, seasonsData] = await Promise.all([
          getShowDetails(parseInt(id)),
          getShowSeasons(parseInt(id))
        ]);
        
        if (!showData) throw new Error('Failed to fetch show details');
        
        setShow(showData);
        setSeasons(seasonsData);
        
        if (seasonsData.length > 0) {
          setSelectedSeason(seasonsData[0].season_number);
          await fetchEpisodes(parseInt(id), seasonsData[0].season_number);
        }
      } catch (error) {
        console.error('Error fetching show details:', error);
        setError('Failed to load show details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowDetails();
  }, [id, navigate]);

  const fetchEpisodes = async (showId: number, seasonNum: number) => {
    try {
      setIsEpisodesLoading(true);
      setError(null);
      const episodesData = await getSeasonEpisodes(showId, seasonNum);
      setEpisodes(episodesData);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      setError('Failed to load episodes. Please try again later.');
    } finally {
      setIsEpisodesLoading(false);
    }
  };

  const handleSeasonChange = async (seasonNumber: number) => {
    if (!id || !validateInput.isValidId(id)) return;
    setSelectedSeason(seasonNumber);
    await fetchEpisodes(parseInt(id), seasonNumber);
  };

  const handlePlayEpisode = (episode: Episode) => {
    if (!id || !validateInput.isValidId(id)) {
      console.error('Invalid show ID');
      return;
    }

    try {
      const showId = parseInt(id);
      const seasonNumber = selectedSeason;
      const episodeNumber = episode.episode_number;

      if (isNaN(seasonNumber) || isNaN(episodeNumber) || seasonNumber < 1 || episodeNumber < 1) {
        console.error('Invalid season/episode numbers');
        return;
      }

      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const videoUrl = sanitizeUrl(
        `https://vidapi.site/embed/tv/?id=${showId}&season=${seasonNumber}&episode=${episodeNumber}&_t=${timestamp}`
      );
      
      console.log('Generated video URL:', videoUrl);
      setVideoUrl(videoUrl);
    } catch (error) {
      console.error('Error constructing video URL:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-red-600 animate-spin" />
          <p className="mt-4 text-white">Loading show details...</p>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">{error || 'Something went wrong'}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-600 px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20 relative">
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${show?.backdrop_path ? sanitizeUrl(`https://image.tmdb.org/t/p/original${show.backdrop_path}`) : ''})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(17,24,39,1)]"></div>
        <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">
            {show && sanitizeContent(show.name)}
          </h1>
          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              {show.vote_average.toFixed(1)}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(show.first_air_date).getFullYear()}
            </div>
          </div>
          <p className="text-gray-300">
            {show && sanitizeContent(show.overview)}
          </p>
        </div>
      </div>

      {/* Season Selection */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <label htmlFor="seasonSelect" className="block text-sm font-medium text-gray-700 sr-only">
            Select Season
          </label>
          <select
            id="seasonSelect"
            value={selectedSeason}
            onChange={(e) => handleSeasonChange(Number(e.target.value))}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            disabled={isEpisodesLoading}
          >
            {seasons.map((season) => (
              <option key={season.id} value={season.season_number}>
                Season {season.season_number}
              </option>
            ))}
          </select>
        </div>

        {/* Episodes Grid */}
        {isEpisodesLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <div className="relative">
                  <img
                    src={episode.still_path ? 
                      `https://image.tmdb.org/t/p/w500${episode.still_path}` :
                      'https://via.placeholder.com/500x281?text=No+Preview'
                    }
                    alt={episode.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handlePlayEpisode(episode)}
                    title={`Play Episode ${episode.episode_number}: ${episode.name}`}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  >
                    <Play className="w-12 h-12 text-red-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {episode.episode_number}. {sanitizeContent(episode.name)}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {sanitizeContent(episode.overview)}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(episode.air_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {videoUrl && (
        <VideoPlayer url={videoUrl} onClose={() => setVideoUrl(null)} />
      )}
    </div>
  );
};

export default ShowDetails;