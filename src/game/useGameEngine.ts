import { useCallback, useRef, useEffect } from 'react'
import { createGameEntities } from './entities'
import { handleCollisions } from './collisions'
import { renderGame } from './renderer'
import { Nutrient, ImmuneCell, RedBloodCell, Player } from './types'

interface GameEngineProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  bacteriaType: string
  onScoreChange: (score: number) => void
  onHealthChange: (health: number) => void
  onGameOver: () => void
}

export function useGameEngine({
  canvasRef,
  bacteriaType,
  onScoreChange,
  onHealthChange,
  onGameOver,
}: GameEngineProps) {
  // Use a ref to store game state to prevent re-renders
  const gameStateRef = useRef({
    isRunning: false,
    score: 0,
    health: 100,
    entities: {
      player: null as Player | null,
      nutrients: [] as Nutrient[],
      immuneCells: [] as ImmuneCell[],
      redBloodCells: [] as RedBloodCell[],
    },
    lastFrameTime: 0,
  })
  
  const animationFrameRef = useRef<number | null>(null)
  
  // Flag to prevent multiple game loop instances
  const isGameLoopRunningRef = useRef(false)
  
  const gameLoop = useCallback((timestamp: number) => {
    const { isRunning, lastFrameTime } = gameStateRef.current
    
    if (!isRunning) {
      isGameLoopRunningRef.current = false
      return
    }
    
    const canvas = canvasRef.current
    if (!canvas) {
      isGameLoopRunningRef.current = false
      return
    }
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      isGameLoopRunningRef.current = false
      return
    }
    
    // Calculate delta time (time since last frame)
    const deltaTime = lastFrameTime ? (timestamp - lastFrameTime) / 1000 : 0.016
    gameStateRef.current.lastFrameTime = timestamp
    
    // Update game state
    const gameState = gameStateRef.current
    
    // Update player position based on input
    if (gameState.entities.player) {
      gameState.entities.player.update(deltaTime)
    }
    
    // Update all other entities
    gameState.entities.nutrients.forEach((nutrient: Nutrient) => nutrient.update(deltaTime))
    gameState.entities.immuneCells.forEach((cell: ImmuneCell) => cell.update(deltaTime, gameState.entities.player))
    gameState.entities.redBloodCells.forEach((cell: RedBloodCell) => cell.update(deltaTime))
    
    // Spawn new entities if needed
    if (Math.random() < 0.02) {
      // Spawn new nutrient
      const { createNutrient } = createGameEntities(canvas.width, canvas.height)
      gameState.entities.nutrients.push(createNutrient())
    }
    
    if (Math.random() < 0.01) {
      // Spawn new immune cell
      const { createImmuneCell } = createGameEntities(canvas.width, canvas.height)
      gameState.entities.immuneCells.push(createImmuneCell())
    }
    
    // Handle collisions
    const collisionResult = handleCollisions(gameState.entities)
    
    // Update score and health
    if (collisionResult.nutrientsEaten > 0) {
      gameState.score += collisionResult.nutrientsEaten * 10
      // Use the callback to update the score in the UI
      onScoreChange(gameState.score)
      
      // Grow player
      if (gameState.entities.player) {
        gameState.entities.player.grow(collisionResult.nutrientsEaten * 0.05)
      }
    }
    
    if (collisionResult.immuneDamage > 0) {
      gameState.health -= collisionResult.immuneDamage
      onHealthChange(gameState.health)
      
      if (gameState.health <= 0) {
        gameState.isRunning = false
        onGameOver()
        isGameLoopRunningRef.current = false
        return
      }
    }
    
    // Clean up entities that are out of bounds or marked for removal
    gameState.entities.nutrients = gameState.entities.nutrients.filter((n: Nutrient) => !n.markedForRemoval)
    gameState.entities.immuneCells = gameState.entities.immuneCells.filter((c: ImmuneCell) => !c.markedForRemoval)
    
    // Render the game
    renderGame(ctx, canvas.width, canvas.height, gameState.entities)
    
    // Continue the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }, [canvasRef, onScoreChange, onHealthChange, onGameOver])
  
  const startGame = useCallback(() => {
    // Cancel any existing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    
    // Create game entities
    const { createPlayer, createRedBloodCell } = createGameEntities(canvas.width, canvas.height)
    
    // Initialize game state
    const gameState = gameStateRef.current
    gameState.isRunning = true
    gameState.score = 0
    gameState.health = 100
    gameState.entities.player = createPlayer(bacteriaType)
    gameState.entities.nutrients = []
    gameState.entities.immuneCells = []
    
    // Create background red blood cells
    gameState.entities.redBloodCells = Array.from({ length: 40 }, () => createRedBloodCell())
    
    // Only start a new game loop if one isn't already running
    if (!isGameLoopRunningRef.current) {
      isGameLoopRunningRef.current = true
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }
    
    // Update UI
    onScoreChange(0)
    onHealthChange(100)
  }, [canvasRef, bacteriaType, gameLoop, onScoreChange, onHealthChange])
  
  const stopGame = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    gameStateRef.current.isRunning = false
    isGameLoopRunningRef.current = false
  }, [])
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [canvasRef])
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopGame()
    }
  }, [stopGame])
  
  return {
    startGame,
    stopGame,
  }
} 