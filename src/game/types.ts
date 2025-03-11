// Base entity interface
export interface Entity {
  type: string
  x: number
  y: number
  width: number
  height: number
  velocity: {
    x: number
    y: number
  }
  markedForRemoval: boolean
  update: (deltaTime: number, ...args: any[]) => void
}

// Player entity
export interface Player extends Entity {
  type: 'player'
  speed: number
  size: number
  bacteriaType: string
  imageSrc: string
  grow: (amount: number) => void
}

// Nutrient entity
export interface Nutrient extends Entity {
  type: 'nutrient'
  nutrientType: 'protein' | 'lipid' | 'carbohydrate'
  imageSrc: string
}

// Immune cell entity
export interface ImmuneCell extends Entity {
  type: 'immuneCell'
  immuneType: 'neutrophil' | 'macrophage' | 'nkCell' | 'tCell' | 'bCell'
  speed: number
  damage: number
  imageSrc: string
  update: (deltaTime: number, player: Player | null) => void
}

// Red blood cell entity (background)
export interface RedBloodCell extends Entity {
  type: 'redBloodCell'
}

// Game entities collection
export interface GameEntities {
  player: Player | null
  nutrients: Nutrient[]
  immuneCells: ImmuneCell[]
  redBloodCells: RedBloodCell[]
}

// Collision result
export interface CollisionResult {
  nutrientsEaten: number
  immuneDamage: number
} 