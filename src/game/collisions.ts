import { GameEntities, CollisionResult, Player, Nutrient, ImmuneCell } from './types'

// Check if two entities are colliding using circle collision detection
function checkCollision(entity1: { x: number; y: number; width: number; height: number }, 
                        entity2: { x: number; y: number; width: number; height: number }): boolean {
  const radius1 = Math.max(entity1.width, entity1.height) / 2
  const radius2 = Math.max(entity2.width, entity2.height) / 2
  
  const dx = entity1.x - entity2.x
  const dy = entity1.y - entity2.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  return distance < radius1 + radius2
}

// Handle all collisions between game entities
export function handleCollisions(entities: GameEntities): CollisionResult {
  const result: CollisionResult = {
    nutrientsEaten: 0,
    immuneDamage: 0,
  }
  
  const { player, nutrients, immuneCells } = entities
  
  if (!player) return result
  
  // Create a copy of the nutrients array to avoid modification during iteration
  const nutrientsToRemove: Nutrient[] = []
  
  // Check player collision with nutrients
  for (const nutrient of nutrients) {
    if (checkCollision(player, nutrient)) {
      // Add to the list of nutrients to remove instead of modifying during iteration
      nutrientsToRemove.push(nutrient)
      result.nutrientsEaten++
    }
  }
  
  // Mark nutrients for removal after iteration is complete
  nutrientsToRemove.forEach(nutrient => {
    nutrient.markedForRemoval = true
  })
  
  // Check player collision with immune cells
  for (const immuneCell of immuneCells) {
    if (checkCollision(player, immuneCell)) {
      result.immuneDamage += immuneCell.damage * 0.1 // Apply damage over time
    }
  }
  
  return result
} 