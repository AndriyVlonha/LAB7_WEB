import { useCallback, useRef, useState } from 'react'
import { motion, animate } from 'framer-motion'
import './TrafficLights.css'

// ── Lamp — без змін з Lab 6, тільки useRef ───────────────────────────────────
const Lamp = ({ color, blinkCount, brightness, onClick }) => {
    const [blinking, setBlinking] = useState(false)
    const lampRef = useRef(null)

    const handleClick = useCallback(async () => {
        if (blinking) return
        onClick(color.id)          // передаємо colorId в контекст
        setBlinking(true)

        const el = lampRef.current
        if (!el) { setBlinking(false); return }

        const frames = [brightness]
        for (let i = 0; i < blinkCount; i++) {
            frames.push(0.06, brightness)
        }

        await animate(el, { opacity: frames }, {
            duration: blinkCount * 0.4,
            ease: 'easeInOut',
        })
        setBlinking(false)
    }, [blinking, blinkCount, brightness, color.id, onClick])

    return (
        <motion.div
            className="lamp-wrap"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleClick}
            style={{ cursor: blinking ? 'not-allowed' : 'pointer' }}
            title={`${color.label} — кліків: ${color.clicks}`}
        >
            <div className="lamp-socket" />
            <div
                ref={lampRef}
                className="lamp"
                style={{
                    '--color': color.hex,
                    opacity: brightness,
                    filter: brightness < 0.85
                        ? `brightness(${0.55 + brightness * 0.5})`
                        : 'none',
                }}
            />
        </motion.div>
    )
}

// ── TrafficLights — тепер отримує colors з контексту ─────────────────────────
const TrafficLights = ({
    colors = [],          // ← приходить з контексту через пропси сторінки
    orientation = 'vertical',
    onLightClick,
    blinkCount = 3,
    brightness = 1,
}) => (
    <div className="traffic-lights">
        <motion.div
            className={`tl-housing tl-housing--${orientation}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
            {colors.map(color => (
                <Lamp
                    key={color.id}
                    color={color}
                    blinkCount={blinkCount}
                    brightness={brightness}
                    onClick={onLightClick}
                />
            ))}
        </motion.div>
    </div>
)

export default TrafficLights