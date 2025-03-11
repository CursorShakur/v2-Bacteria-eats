'use client'

import { useEffect, useRef, useState } from 'react'

interface TouchControlsProps {
  onDirectionChange: (directions: { up: boolean; down: boolean; left: boolean; right: boolean }) => void
}

export default function TouchControls({ onDirectionChange }: TouchControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const [touching, setTouching] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const touchStartRef = useRef({ x: 0, y: 0 })
  
  useEffect(() => {
    const joystick = joystickRef.current
    const knob = knobRef.current
    
    if (!joystick || !knob) return
    
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      setTouching(true)
      
      const touch = e.touches[0]
      
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY
      }
      
      setPosition({ x: 0, y: 0 })
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!touching) return
      e.preventDefault()
      
      const touch = e.touches[0]
      const joystickRect = joystick.getBoundingClientRect()
      
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      
      const radius = joystickRect.width / 2
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const angle = Math.atan2(deltaY, deltaX)
      
      const limitedDistance = Math.min(distance, radius)
      const x = limitedDistance * Math.cos(angle)
      const y = limitedDistance * Math.sin(angle)
      
      setPosition({ x, y })
      
      const threshold = radius * 0.3
      const directions = {
        up: y < -threshold,
        down: y > threshold,
        left: x < -threshold,
        right: x > threshold
      }
      
      onDirectionChange(directions)
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      setTouching(false)
      setPosition({ x: 0, y: 0 })
      
      onDirectionChange({ up: false, down: false, left: false, right: false })
    }
    
    joystick.addEventListener('touchstart', handleTouchStart)
    joystick.addEventListener('touchmove', handleTouchMove)
    joystick.addEventListener('touchend', handleTouchEnd)
    joystick.addEventListener('touchcancel', handleTouchEnd)
    
    return () => {
      joystick.removeEventListener('touchstart', handleTouchStart)
      joystick.removeEventListener('touchmove', handleTouchMove)
      joystick.removeEventListener('touchend', handleTouchEnd)
      joystick.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [touching, onDirectionChange])
  
  return (
    <div className="fixed bottom-8 left-8 z-20 touch-none">
      <div 
        ref={joystickRef}
        className="w-32 h-32 rounded-full bg-black/50 border-2 border-white/30 relative"
      >
        <div 
          ref={knobRef}
          className="w-16 h-16 rounded-full bg-white/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{ 
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))` 
          }}
        />
      </div>
    </div>
  )
}
