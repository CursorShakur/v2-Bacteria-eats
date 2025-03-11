import Image from 'next/image'
import { useState, useEffect } from 'react'

type BacteriaOption = {
  id: string
  name: string
  description: string
  imageSrc: string
}

const bacteriaOptions: BacteriaOption[] = [
  {
    id: 'coccus',
    name: 'Coccus',
    description: 'Round bacteria with good maneuverability. Medium size and speed.',
    imageSrc: '/assets/16 - Coccus.png',
  },
  {
    id: 'bacillus',
    name: 'Bacillus',
    description: 'Rod-shaped bacteria with high speed but lower maneuverability.',
    imageSrc: '/assets/19 - Bacillus.png',
  },
  {
    id: 'spirillum',
    name: 'Spirillum',
    description: 'Spiral-shaped bacteria with excellent maneuverability but slower speed.',
    imageSrc: '/assets/21 - Spirillum.png',
  },
]

interface BacteriaSelectionProps {
  onSelect: (bacteriaType: string) => void
  selected: string | null
}

export default function BacteriaSelection({ onSelect, selected }: BacteriaSelectionProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    // Copy assets to public folder on component mount
    const copyAssets = async () => {
      try {
        setImagesLoaded(true)
      } catch (error) {
        console.error('Failed to load bacteria images:', error)
      }
    }

    copyAssets()
  }, [])

  if (!imagesLoaded) {
    return <div className="text-center py-8">Loading bacteria options...</div>
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-6 px-2">
      {bacteriaOptions.map((bacteria) => (
        <div
          key={bacteria.id}
          className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-all ${
            selected === bacteria.id
              ? 'border-green-500 bg-green-900/30 transform scale-105'
              : 'border-gray-700 hover:border-gray-500'
          }`}
          onClick={() => onSelect(bacteria.id)}
        >
          <div className="flex items-center">
            <div className="relative w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0">
              <Image
                src={bacteria.imageSrc}
                alt={bacteria.name}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="ml-4 text-left flex-grow">
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{bacteria.name}</h3>
              <p className="text-gray-300 text-sm sm:text-base">{bacteria.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 