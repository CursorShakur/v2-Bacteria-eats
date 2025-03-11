import { handleCollisions } from '../collisions'
import { GameEntities, Player, Nutrient, ImmuneCell } from '../types'

describe('Collision Detection', () => {
  let mockPlayer: Player
  let mockNutrient: Nutrient
  let mockImmuneCell: ImmuneCell
  let mockEntities: GameEntities
  
  beforeEach(() => {
    // Create mock player
    mockPlayer = {
      type: 'player',
      x: 100,
      y: 100,
      width: 30,
      height: 30,
      velocity: { x: 0, y: 0 },
      speed: 200,
      size: 30,
      bacteriaType: 'coccus',
      imageSrc: '/assets/16 - Coccus.png',
      markedForRemoval: false,
      update: jest.fn(),
      grow: jest.fn()
    }
    
    // Create mock nutrient
    mockNutrient = {
      type: 'nutrient',
      x: 100,
      y: 100,
      width: 15,
      height: 15,
      velocity: { x: 0, y: 0 },
      nutrientType: 'protein',
      imageSrc: '/assets/15 - Proteins.png',
      markedForRemoval: false,
      update: jest.fn()
    }
    
    // Create mock immune cell
    mockImmuneCell = {
      type: 'immuneCell',
      x: 100,
      y: 100,
      width: 40,
      height: 40,
      velocity: { x: 0, y: 0 },
      speed: 80,
      immuneType: 'neutrophil',
      damage: 5,
      imageSrc: '/assets/1 - Neutrophils.png',
      markedForRemoval: false,
      update: jest.fn()
    }
    
    // Create mock entities
    mockEntities = {
      player: mockPlayer,
      nutrients: [mockNutrient],
      immuneCells: [mockImmuneCell],
      redBloodCells: []
    }
  })
  
  test('should detect collision with nutrient', () => {
    const result = handleCollisions(mockEntities)
    
    expect(result.nutrientsEaten).toBe(1)
    expect(mockNutrient.markedForRemoval).toBe(true)
  })
  
  test('should detect collision with immune cell', () => {
    const result = handleCollisions(mockEntities)
    
    expect(result.immuneDamage).toBeGreaterThan(0)
  })
  
  test('should return zero values when no player exists', () => {
    mockEntities.player = null
    
    const result = handleCollisions(mockEntities)
    
    expect(result.nutrientsEaten).toBe(0)
    expect(result.immuneDamage).toBe(0)
  })
  
  test('should not detect collision when entities are far apart', () => {
    mockNutrient.x = 500
    mockNutrient.y = 500
    mockImmuneCell.x = 500
    mockImmuneCell.y = 500
    
    const result = handleCollisions(mockEntities)
    
    expect(result.nutrientsEaten).toBe(0)
    expect(result.immuneDamage).toBe(0)
    expect(mockNutrient.markedForRemoval).toBe(false)
  })
}) 