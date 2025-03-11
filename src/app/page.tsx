'use client'

import { useState } from 'react'
import GameCanvas from '@/components/GameCanvas'
import BacteriaSelection from '@/components/BacteriaSelection'

export default function Home() {
  const [selectedBacteria, setSelectedBacteria] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)

  const handleBacteriaSelect = (bacteriaType: string) => {
    setSelectedBacteria(bacteriaType)
  }

  const startGame = () => {
    if (selectedBacteria) {
      setGameStarted(true)
    }
  }

  const returnToStart = () => {
    setGameStarted(false)
    setSelectedBacteria(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4">
      {!gameStarted ? (
        <div className="w-full max-w-4xl bg-black/70 rounded-lg p-3 sm:p-6 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-6">Bacteria Eats</h1>
          <p className="mb-4 sm:mb-8 text-base sm:text-lg px-2">
            Select your bacteria and survive in the bloodstream! Eat nutrients to grow while avoiding the immune system.
          </p>
          
          <BacteriaSelection 
            onSelect={handleBacteriaSelect} 
            selected={selectedBacteria}
          />
          
          <button
            onClick={startGame}
            disabled={!selectedBacteria}
            className={`mt-4 sm:mt-8 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-lg sm:text-xl font-bold transition-colors ${
              selectedBacteria 
                ? 'bg-green-600 hover:bg-green-700 cursor-pointer' 
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            Start Game
          </button>
        </div>
      ) : (
        <GameCanvas 
          bacteriaType={selectedBacteria!} 
          onReturnToStart={returnToStart}
        />
      )}
    </main>
  )
} 