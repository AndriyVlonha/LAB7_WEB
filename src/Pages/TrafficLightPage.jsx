import { useState } from 'react'
import { motion } from 'framer-motion'
import TrafficLights from '../components/TrafficLights'
import StatsBar from '../components/StatsBar'
import './TrafficLightPage.css'

const VerticalTrafficLight = () => {
    const [clicks, setClicks] = useState({ red: 0, yellow: 0, green: 0 })
    const [blinkCount, setBlinkCount] = useState(3)
    const [brightness, setBrightness] = useState(1.0)

    const handleClick = (color) =>
        setClicks(prev => ({ ...prev, [color]: prev[color] + 1 }))

    return (
        <motion.div
            className="traffic-light-page"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
        >
            <h1 className="page-title">Вертикальний світлофор</h1>

            <StatsBar
                clicks={clicks}
                blinkCount={blinkCount}
                brightness={brightness}
                onBlinkChange={setBlinkCount}
                onBrightnessChange={setBrightness}
            />

            <div className="traffic-light-wrapper">
                <TrafficLights
                    orientation="vertical"
                    onLightClick={handleClick}
                    blinkCount={blinkCount}
                    brightness={brightness}
                />
            </div>
        </motion.div>
    )
}

export default VerticalTrafficLight