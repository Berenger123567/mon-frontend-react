import { useState, useEffect } from 'react'

export default function TickerBar() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHidden(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`ticker-bar ${hidden ? 'hidden' : ''}`}>
      <div className="ticker-track">
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
        <span>✈ Imani Travel Planner</span>
      </div>
    </div>
  )
}
