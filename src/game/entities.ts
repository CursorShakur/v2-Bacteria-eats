import { Entity, Player, Nutrient, ImmuneCell, RedBloodCell } from './types'

// Input state for player control
export const inputState = {
  up: false,
  down: false,
  left: false,
  right: false,
}

// Set up keyboard event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        inputState.up = true
        break
      case 'ArrowDown':
      case 's':
        inputState.down = true
        break
      case 'ArrowLeft':
      case 'a':
        inputState.left = true
        break
      case 'ArrowRight':
      case 'd':
        inputState.right = true
        break
    }
  })

  window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        inputState.up = false
        break
      case 'ArrowDown':
      case 's':
        inputState.down = false
        break
      case 'ArrowLeft':
      case 'a':
        inputState.left = false
        break
      case 'ArrowRight':
      case 'd':
        inputState.right = false
        break
    }
  })
}

// Helper function to get random position within canvas
const getRandomPosition = (width: number, height: number) => {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
  }
}

// Helper function to get random velocity
const getRandomVelocity = (speed: number) => {
  const angle = Math.random() * Math.PI * 2
  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  }
}

// Helper function to get velocity in a consistent direction (for blood flow)
const getBloodFlowVelocity = (speed: number) => {
  // Base direction is right-to-left (180 degrees or π radians)
  const baseAngle = Math.PI;
  // Allow some variation (±30 degrees or ±π/6 radians)
  const variation = (Math.random() * Math.PI / 3) - (Math.PI / 6);
  const angle = baseAngle + variation;
  
  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  }
}

// Factory function to create game entities
export function createGameEntities(canvasWidth: number, canvasHeight: number) {
  // Create player based on bacteria type
  const createPlayer = (bacteriaType: string): Player => {
    const baseSpeed = 200
    const baseSize = 30
    
    let speed: number
    let size: number
    let imageSrc: string
    
    switch (bacteriaType) {
      case 'coccus':
        speed = baseSpeed
        size = baseSize
        imageSrc = '/assets/16 - Coccus.png'
        break
      case 'bacillus':
        speed = baseSpeed * 1.2
        size = baseSize * 0.8
        imageSrc = '/assets/19 - Bacillus.png'
        break
      case 'spirillum':
        speed = baseSpeed * 0.8
        size = baseSize * 0.9
        imageSrc = '/assets/21 - Spirillum.png'
        break
      default:
        speed = baseSpeed
        size = baseSize
        imageSrc = '/assets/16 - Coccus.png'
    }
    
    return {
      type: 'player',
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      width: size,
      height: size,
      velocity: { x: 0, y: 0 },
      speed,
      size,
      bacteriaType,
      imageSrc,
      markedForRemoval: false,
      
      update(deltaTime: number) {
        // Update velocity based on input
        this.velocity.x = 0
        this.velocity.y = 0
        
        if (inputState.up) this.velocity.y = -this.speed
        if (inputState.down) this.velocity.y = this.speed
        if (inputState.left) this.velocity.x = -this.speed
        if (inputState.right) this.velocity.x = this.speed
        
        // Normalize diagonal movement
        if (this.velocity.x !== 0 && this.velocity.y !== 0) {
          const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y)
          this.velocity.x = (this.velocity.x / magnitude) * this.speed
          this.velocity.y = (this.velocity.y / magnitude) * this.speed
        }
        
        // Update position
        this.x += this.velocity.x * deltaTime
        this.y += this.velocity.y * deltaTime
        
        // Keep player within bounds
        this.x = Math.max(this.width / 2, Math.min(canvasWidth - this.width / 2, this.x))
        this.y = Math.max(this.height / 2, Math.min(canvasHeight - this.height / 2, this.y))
      },
      
      grow(amount: number) {
        this.size += amount
        this.width = this.size
        this.height = this.size
      }
    }
  }
  
  // Create nutrient (proteins, lipids, carbohydrates)
  const createNutrient = (): Nutrient => {
    const nutrientTypes = ['protein', 'lipid', 'carbohydrate'] as const
    const type = nutrientTypes[Math.floor(Math.random() * nutrientTypes.length)]
    
    let imageSrc: string
    switch (type) {
      case 'protein':
        imageSrc = '/assets/15 - Proteins.png'
        break
      case 'lipid':
        imageSrc = '/assets/14 - Lipids.png'
        break
      case 'carbohydrate':
        imageSrc = '/assets/13 - Carbohydrates.png'
        break
      default:
        imageSrc = '/assets/15 - Proteins.png'
    }
    
    const size = 15 + Math.random() * 10
    const position = getRandomPosition(canvasWidth, canvasHeight)
    const velocity = getRandomVelocity(20)
    
    return {
      type: 'nutrient',
      x: position.x,
      y: position.y,
      width: size,
      height: size,
      velocity,
      nutrientType: type,
      imageSrc,
      markedForRemoval: false,
      
      update(deltaTime: number) {
        // Drift slowly
        this.x += this.velocity.x * deltaTime
        this.y += this.velocity.y * deltaTime
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvasWidth) {
          this.velocity.x *= -1
        }
        
        if (this.y < 0 || this.y > canvasHeight) {
          this.velocity.y *= -1
        }
      }
    }
  }
  
  // Create immune cell (neutrophils, macrophages, etc.)
  const createImmuneCell = (): ImmuneCell => {
    const immuneTypes = ['neutrophil', 'macrophage', 'nkCell', 'tCell', 'bCell'] as const
    const type = immuneTypes[Math.floor(Math.random() * immuneTypes.length)]
    
    let imageSrc: string
    let size: number
    let speed: number
    let damage: number
    
    switch (type) {
      case 'neutrophil':
        imageSrc = '/assets/1 - Neutrophils.png'
        size = 40
        speed = 80
        damage = 5
        break
      case 'macrophage':
        imageSrc = '/assets/4 - Macrophages.png'
        size = 50
        speed = 60
        damage = 10
        break
      case 'nkCell':
        imageSrc = '/assets/9 - Natural Killer Cells.png'
        size = 45
        speed = 100
        damage = 15
        break
      case 'tCell':
        imageSrc = '/assets/10 - T-Cells.png'
        size = 35
        speed = 90
        damage = 8
        break
      case 'bCell':
        imageSrc = '/assets/11 - B-Cells.png'
        size = 30
        speed = 70
        damage = 3
        break
      default:
        imageSrc = '/assets/1 - Neutrophils.png'
        size = 40
        speed = 80
        damage = 5
    }
    
    // Spawn at edge of screen
    let x: number, y: number
    if (Math.random() < 0.5) {
      // Spawn on left or right edge
      x = Math.random() < 0.5 ? 0 : canvasWidth
      y = Math.random() * canvasHeight
    } else {
      // Spawn on top or bottom edge
      x = Math.random() * canvasWidth
      y = Math.random() < 0.5 ? 0 : canvasHeight
    }
    
    return {
      type: 'immuneCell',
      x,
      y,
      width: size,
      height: size,
      velocity: { x: 0, y: 0 },
      speed,
      immuneType: type,
      damage,
      imageSrc,
      markedForRemoval: false,
      
      update(deltaTime: number, player: Player | null) {
        if (player) {
          // Move towards player
          const dx = player.x - this.x
          const dy = player.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance > 0) {
            this.velocity.x = (dx / distance) * this.speed
            this.velocity.y = (dy / distance) * this.speed
          }
        } else {
          // Random movement if no player
          if (Math.random() < 0.02) {
            const velocity = getRandomVelocity(this.speed)
            this.velocity = velocity
          }
        }
        
        // Update position
        this.x += this.velocity.x * deltaTime
        this.y += this.velocity.y * deltaTime
        
        // Remove if out of bounds
        if (
          this.x < -this.width ||
          this.x > canvasWidth + this.width ||
          this.y < -this.height ||
          this.y > canvasHeight + this.height
        ) {
          this.markedForRemoval = true
        }
      }
    }
  }
  
  // Create red blood cell (background element)
  const createRedBloodCell = (): RedBloodCell => {
    const size = 60 + Math.random() * 20
    const position = getRandomPosition(canvasWidth, canvasHeight)
    const velocity = getBloodFlowVelocity(30)
    
    return {
      type: 'redBloodCell',
      x: position.x,
      y: position.y,
      width: size,
      height: size * 0.5, // Elliptical shape
      velocity,
      markedForRemoval: false,
      
      update(deltaTime: number) {
        // Drift slowly
        this.x += this.velocity.x * deltaTime
        this.y += this.velocity.y * deltaTime
        
        // Wrap around edges
        if (this.x < -this.width) this.x = canvasWidth + this.width
        if (this.x > canvasWidth + this.width) this.x = -this.width
        if (this.y < -this.height) this.y = canvasHeight + this.height
        if (this.y > canvasHeight + this.height) this.y = -this.height
      }
    }
  }
  
  return {
    createPlayer,
    createNutrient,
    createImmuneCell,
    createRedBloodCell,
  }
} 