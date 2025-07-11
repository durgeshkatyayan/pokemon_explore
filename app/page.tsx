"use client"
import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { PokemonListItem } from './types/pokemontyps';
import Link from 'next/link';

export default function PokemonExplorer() {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`);
        const data = await res.json();
        setPokemons(data.results);
        setTotalCount(data.count);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [currentPage]);

  const filtered = pokemons.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setQuery('');
    }
  };

  const getPokemonIdFromUrl = (url: string) => {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1]) : 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading Pokemon...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          {[...Array(12)].map((_, i) => (
            <rect
              key={i}
              x={50 + i * 80}
              y={50 + (i % 3) * 150}
              width="40"
              height="40"
              fill="white"
              opacity="0.3"
              rx="8"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.4}s`, animationDuration: '2s' }}
            />
          ))}
          
          {[...Array(8)].map((_, i) => (
            <rect
              key={`diamond-${i}`}
              x={150 + i * 100}
              y={200 + (i % 2) * 200}
              width="20"
              height="20"
              fill="white"
              opacity="0.4"
              rx="4"
              transform={`rotate(45 ${160 + i * 100} ${210 + (i % 2) * 200})`}
              className="animate-bounce"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
          
          {[...Array(15)].map((_, i) => (
            <rect
              key={`line-${i}`}
              x={Math.random() * 1000}
              y={Math.random() * 1000}
              width="3"
              height="15"
              fill="white"
              opacity="0.3"
              rx="2"
              className="animate-ping"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">

        <div className="text-center mb-5">
          <h1 className="text-6xl font-bold text-white mb-2 animate-fade-in">
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Pokemon
            </span>
            <br />
            <span className="text-white">Explorer</span>
          </h1>
          <p className="text-xl text-white/80 animate-fade-in-delay">
            Discover the world of Pokemon
          </p>
        </div>

        <div className="mb-8 relative max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your favorite Pokemon..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-0 bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 focus:bg-white/30"
            />
          </div>
          {query && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-white/80">
              Found {filtered.length} Pokemon
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((pokemon, idx) => {
            const pokemonId = getPokemonIdFromUrl(pokemon.url);
            return (
              <Link href={`/pokemon/${pokemonId}`}
                key={pokemon.name}
                className="group relative bg-white/20 backdrop-blur-md rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-2xl hover:shadow-white/20 animate-fade-in-up border border-white/10"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="absolute top-2 right-2 text-xs text-white/60 font-mono bg-black/20 px-2 py-1 rounded">
                  #{String(pokemonId).padStart(3, '0')}
                </div>
                
                <div className="w-full h-20 mb-4 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-lg flex items-center justify-center group-hover:from-yellow-400 group-hover:to-orange-500 transition-all duration-300">
                  <Zap className="w-8 h-8 text-white animate-pulse" />
                </div>

                <h3 className="text-center text-white font-semibold capitalize text-sm group-hover:text-yellow-200 transition-colors duration-300">
                  {pokemon.name}
                </h3>
                
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && query && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-white/80 text-xl">
              No Pokemon found matching "{query}"
            </p>
            <p className="text-white/60 text-sm mt-2">
              Try searching for a different name
            </p>
          </div>
        )}

        <div className="flex justify-center items-center mt-12 gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white font-medium transition-all duration-300 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                    currentPage === pageNum
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white font-medium transition-all duration-300 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center mt-8 text-white/60">
          <p className="text-sm">
             • Page {currentPage} of {totalPages} • {totalCount} Pokemon available
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}