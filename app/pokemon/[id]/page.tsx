"use client"
import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Shield, Zap, Star, Swords, Activity } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Pokemon } from '@/app/types/pokemontyps';

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShiny, setShowShiny] = useState(false);
  const pokemonId = params.id as string;

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!res.ok) throw new Error('Pokemon not found');
        const data = await res.json();
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pokemonId) {
      fetchPokemon();
    }
  }, [pokemonId]);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      fire: 'from-red-400 to-orange-500',
      water: 'from-blue-400 to-cyan-500',
      grass: 'from-green-400 to-emerald-500',
      electric: 'from-yellow-400 to-amber-500',
      psychic: 'from-pink-400 to-purple-500',
      ice: 'from-cyan-300 to-blue-400',
      dragon: 'from-purple-600 to-indigo-700',
      fairy: 'from-pink-300 to-rose-400',
      fighting: 'from-red-600 to-orange-600',
      poison: 'from-purple-500 to-pink-600',
      ground: 'from-yellow-600 to-orange-700',
      flying: 'from-indigo-400 to-purple-500',
      bug: 'from-green-500 to-lime-600',
      rock: 'from-yellow-800 to-orange-900',
      ghost: 'from-purple-700 to-indigo-800',
      steel: 'from-gray-400 to-slate-500',
      dark: 'from-gray-800 to-black',
      normal: 'from-gray-400 to-gray-500',
    };
    return colors[type] || 'from-gray-400 to-gray-500';
  };

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case 'hp': return <Heart className="w-4 h-4" />;
      case 'attack': return <Swords className="w-4 h-4" />;
      case 'defense': return <Shield className="w-4 h-4" />;
      case 'special-attack': return <Zap className="w-4 h-4" />;
      case 'special-defense': return <Shield className="w-4 h-4" />;
      case 'speed': return <Activity className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const goHome = () => {
    router.push('/');
  };

  const navigateToPokemon = (newId: number) => {
    router.push(`/pokemon/${newId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading Pokemon Details...
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">
          Pokemon not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          {[...Array(20)].map((_, i) => (
            <rect
              key={i}
              x={Math.random() * 1000}
              y={Math.random() * 1000}
              width="30"
              height="30"
              fill="white"
              opacity="0.2"
              rx="6"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        
        <div className="mb-8">
          <button
            onClick={goHome}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <div className="text-center">
              <div className="mb-6">
                <span className="bg-white/30 text-white px-4 py-2 rounded-full text-sm font-mono">
                  #{String(pokemon.id).padStart(3, '0')}
                </span>
              </div>
              
              <h1 className="text-5xl font-bold text-white mb-6 capitalize">
                {pokemon.name}
              </h1>
              
              <div className="relative mb-6">
                <div className="bg-white/30 rounded-2xl p-6 inline-block">
                  <img
                    src={showShiny ? pokemon.sprites.front_shiny : pokemon.sprites.other['official-artwork'].front_default}
                    alt={pokemon.name}
                    className="w-48 h-48 object-contain"
                  />
                </div>
                
                <button
                  onClick={() => setShowShiny(!showShiny)}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                >
                  {showShiny ? 'Normal' : 'Shiny'} ✨
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-white/80 text-sm">Height</div>
                  <div className="text-white text-2xl font-bold">{pokemon.height / 10}m</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-white/80 text-sm">Weight</div>
                  <div className="text-white text-2xl font-bold">{pokemon.weight / 10}kg</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Types</h2>
                <div className="flex justify-center gap-3">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${getTypeColor(type.type.name)} shadow-lg capitalize`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Base Stats
              </h2>
              <div className="space-y-3">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 capitalize flex items-center gap-2">
                        {getStatIcon(stat.stat.name)}
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span className="text-white font-bold">{stat.base_stat}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(stat.base_stat, 255) / 255 * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Abilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className="bg-white/20 rounded-xl p-3 text-center"
                  >
                    <span className="text-white font-semibold capitalize">
                      {ability.ability.name.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Swords className="w-6 h-6" />
                Signature Moves
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pokemon.moves.slice(0, 8).map((move) => (
                  <div
                    key={move.move.name}
                    className="bg-white/20 rounded-lg p-2 text-center"
                  >
                    <span className="text-white/90 text-sm capitalize">
                      {move.move.name.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => navigateToPokemon(Math.max(1, pokemon.id - 1))}
              disabled={pokemon.id === 1}
              className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Pokemon
            </button>
            <button
              onClick={() => navigateToPokemon(pokemon.id + 1)}
              className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300"
            >
              Next Pokemon
            </button>
          </div>
         
        </div>
      </div>
    </div>
  );
}