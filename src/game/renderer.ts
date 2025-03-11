import { GameEntities, Entity } from './types'

// Cache for loaded images
const imageCache: Record<string, HTMLImageElement> = {}

// Load image and cache it
function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache[src]) {
    return Promise.resolve(imageCache[src])
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      imageCache[src] = img
      resolve(img)
    }
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

// Draw an entity on the canvas
async function drawEntity(ctx: CanvasRenderingContext2D, entity: Entity & { imageSrc?: string }) {
  // Save context state
  ctx.save()
  
  // Draw entity
  if (entity.imageSrc) {
    try {
      const img = await loadImage(entity.imageSrc)
      ctx.drawImage(img, entity.x - entity.width / 2, entity.y - entity.height / 2, entity.width, entity.height)
    } catch (error) {
      console.error('Failed to draw entity image:', error)
      
      // Fallback to colored rectangle
      ctx.fillStyle = getEntityColor(entity.type)
      ctx.fillRect(entity.x - entity.width / 2, entity.y - entity.height / 2, entity.width, entity.height)
    }
  } else {
    // Draw colored shape if no image
    ctx.fillStyle = getEntityColor(entity.type)
    
    if (entity.type === 'redBloodCell') {
      // Draw ellipse for red blood cells
      ctx.beginPath()
      ctx.ellipse(entity.x, entity.y, entity.width / 2, entity.height / 2, 0, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Draw circle for other entities
      ctx.beginPath()
      ctx.arc(entity.x, entity.y, entity.width / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  
  // Restore context state
  ctx.restore()
}

// Get color based on entity type
function getEntityColor(type: string): string {
  switch (type) {
    case 'player':
      return '#00AA00' // Green
    case 'nutrient':
      return '#FFDD00' // Yellow
    case 'immuneCell':
      return '#0055AA' // Blue
    case 'redBloodCell':
      return '#FF5555' // Light red
    default:
      return '#FFFFFF' // White
  }
}

// Draw the bloodstream background
function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Fill background with blood red color
  ctx.fillStyle = '#8B0000' // Dark red
  ctx.fillRect(0, 0, width, height)
  
  // Draw some blood vessel texture
  ctx.save()
  ctx.globalAlpha = 0.1
  
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const radius = 50 + Math.random() * 100
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, '#FF0000')
    gradient.addColorStop(1, 'transparent')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  
  ctx.restore()
}

// Main render function
export function renderGame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  entities: GameEntities
) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  // Draw background
  drawBackground(ctx, width, height)
  
  // Draw red blood cells (background)
  entities.redBloodCells.forEach(cell => drawEntity(ctx, cell))
  
  // Draw nutrients
  entities.nutrients.forEach(nutrient => drawEntity(ctx, nutrient))
  
  // Draw immune cells
  entities.immuneCells.forEach(cell => drawEntity(ctx, cell))
  
  // Draw player
  if (entities.player) {
    drawEntity(ctx, entities.player)
  }
} 