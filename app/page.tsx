"use client"
import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface PokemonListItem {
  name: string;
  url: string;
}

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-orange-400 via-yellow-500 to-green-500 bg-clip-text animate-pulse">
          Loading Pokemon...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          {[...Array(25)].map((_, i) => (
            <rect
              key={i}
              x={Math.random() * 1000}
              y={Math.random() * 1000}
              width="2"
              height="2"
              fill="#F59E0B"
              opacity="0.8"
              rx="1"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.2}s`, animationDuration: '3s' }}
            />
          ))}
          
          {[...Array(15)].map((_, i) => (
            <rect
              key={`glow-${i}`}
              x={Math.random() * 1000}
              y={Math.random() * 1000}
              width="1"
              height="1"
              fill="#EF4444"
              opacity="0.6"
              rx="0.5"
              className="animate-ping"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
          
          {[...Array(8)].map((_, i) => (
            <rect
              key={`line-${i}`}
              x={Math.random() * 1000}
              y={Math.random() * 1000}
              width="1"
              height="8"
              fill="#22D3EE"
              opacity="0.4"
              rx="0.5"
              className="animate-bounce"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">

        <div className="text-center mb-6">
          <h1 className="text-7xl font-black mb-4 tracking-tight">
            <span className="text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text drop-shadow-lg">
              Pokemon
            </span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-500 bg-clip-text drop-shadow-lg">
              Explorer
            </span>
          </h1>
          <p className="text-xl text-gray-400 font-medium tracking-wide">
            Discover the ultimate Pokemon universe
          </p>
        </div>

        <div className="mb-6 relative max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Pokemon..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-800 bg-gray-900/50 backdrop-blur-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-gray-900/70 transition-all duration-300 font-medium"
            />
          </div>
          {query && (
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 font-medium">
              {filtered.length} results found
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((pokemon, idx) => {
            const pokemonId = getPokemonIdFromUrl(pokemon.url);
            return (
              <Link href={`pokemon/${pokemonId}`}
                key={pokemon.name}
                className="group relative bg-gray-900/40 backdrop-blur-md rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-gray-800/60 hover:shadow-2xl hover:shadow-orange-500/20 animate-fade-in-up border border-gray-800/50 hover:border-orange-500/50"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="absolute top-3 right-3 text-xs text-gray-500 font-mono bg-gray-800/70 px-2 py-1 rounded-lg">
                  #{String(pokemonId).padStart(3, '0')}
                </div>
                
                <div className="w-full h-20 mb-4 bg-gradient-to-br from-green-600 to-green-900 rounded-xl flex items-center justify-center group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300 shadow-lg">
                  <Zap className="w-8 h-8 text-white animate-pulse" />
                </div>

                <h3 className="text-center text-gray-200 font-bold capitalize text-sm group-hover:text-white transition-colors duration-300 tracking-wide">
                  {pokemon.name}
                </h3>
                
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-300 text-xl font-medium">
              No Pokemon found matching "{query}"
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Try searching for a different name
            </p>
          </div>
        )}

        <div className="flex justify-center items-center mt-16 gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 backdrop-blur-md rounded-xl text-gray-300 font-medium transition-all duration-300 hover:bg-gray-700/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-gray-700/50"
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
                  className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/60 hover:text-white border border-gray-700/50'
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
            className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 backdrop-blur-md rounded-xl text-gray-300 font-medium transition-all duration-300 hover:bg-gray-700/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-gray-700/50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center mt-10 text-gray-500">
          <p className="text-sm font-medium">
            Page {currentPage} of {totalPages} • {totalCount} Pokemon available
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