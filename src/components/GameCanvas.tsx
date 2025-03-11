'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useGameEngine } from '@/game/useGameEngine'

interface GameCanvasProps {
  bacteriaType: string
  onReturnToStart?: () => void
}

export default function GameCanvas({ bacteriaType, onReturnToStart }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(100)
  const [gameOver, setGameOver] = useState(false)
  
  // Use refs to track the latest state without causing re-renders
  const scoreRef = useRef(0)
  const healthRef = useRef(100)
  const gameOverRef = useRef(false)
  
  // Callback functions that update both the ref and state
  const handleScoreChange = useCallback((newScore: number) => {
    scoreRef.current = newScore
    setScore(newScore)
  }, [])
  
  const handleHealthChange = useCallback((newHealth: number) => {
    healthRef.current = newHealth
    setHealth(newHealth)
  }, [])
  
  const handleGameOver = useCallback(() => {
    gameOverRef.current = true
    setGameOver(true)
  }, [])
  
  const { startGame, stopGame } = useGameEngine({
    canvasRef,
    bacteriaType,
    onScoreChange: handleScoreChange,
    onHealthChange: handleHealthChange,
    onGameOver: handleGameOver,
  })
  
  useEffect(() => {
    if (canvasRef.current) {
      startGame()
    }
    
    return () => {
      stopGame()
    }
  }, [startGame, stopGame])
  
  const handleRestart = useCallback(() => {
    // Reset refs first
    scoreRef.current = 0
    healthRef.current = 100
    gameOverRef.current = false
    
    // Then update state
    setGameOver(false)
    setScore(0)
    setHealth(100)
    
    // Finally restart the game
    startGame()
  }, [startGame])
  
  return (
    <div className="relative w-full max-w-6xl">
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 rounded-lg">
          <div className="text-center p-8 bg-gray-900 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Game Over</h2>
            <p className="text-xl mb-6">Your score: {score}</p>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleRestart}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-full font-bold"
              >
                Play Again
              </button>
              <button 
                onClick={onReturnToStart}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-bold"
              >
                Return to Start
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-black/60 p-2 rounded-lg">
          <p className="font-bold">Score: {score}</p>
        </div>
        <div className="bg-black/60 p-2 rounded-lg">
          <div className="w-40 h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${health}%` }}
            />
          </div>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-[80vh] bg-blood-red rounded-lg"
      />
    </div>
  )
} 