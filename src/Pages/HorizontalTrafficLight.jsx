import { motion, AnimatePresence } from 'framer-motion'
import { useTrafficLights } from '../context/TrafficLightsContext'
import TrafficLights from '../components/TrafficLights'
import './TrafficLightPage.css'

const HorizontalTrafficLight = () => {
    // ← Весь стан тепер з контексту, не з useState
    const { lights, settings, addLight, removeLight, clickColor, updateSettings } = useTrafficLights()

    const total = lights.reduce((s, l) =>
        s + l.colors.reduce((a, c) => a + c.clicks, 0), 0)

    return (
        <div className="tl-page">

            {/* ── Sidebar ── */}
            <aside className="tl-sidebar">
                <div className="tl-sidebar-header">
                    <p className="tl-sidebar-eyebrow">Горизонтальний</p>
                    <h2 className="tl-sidebar-title">Світлофор</h2>
                </div>

                <div className="tl-controls">

                    <label className="ctrl-group">
                        <span className="ctrl-label">Кількість морганнь</span>
                        <div className="ctrl-row">
                            <input type="range" min="1" max="10" step="1"
                                value={settings.blinkCount}
                                onChange={e => updateSettings({ blinkCount: Number(e.target.value) })}
                                className="ctrl-slider" />
                            <span className="ctrl-val">{settings.blinkCount}x</span>
                        </div>
                    </label>

                    <label className="ctrl-group">
                        <span className="ctrl-label">Яскравість</span>
                        <div className="ctrl-row">
                            <input type="range" min="0.15" max="1" step="0.05"
                                value={settings.brightness}
                                onChange={e => updateSettings({ brightness: parseFloat(e.target.value) })}
                                className="ctrl-slider" />
                            <span className="ctrl-val">{Math.round(settings.brightness * 100)}%</span>
                        </div>
                        <div className="brightness-strip" style={{ opacity: settings.brightness }} />
                    </label>

                    <hr className="ctrl-divider" />

                    <div className="tl-stats-mini">
                        <span className="tl-stats-label">Світлофорів</span>
                        <span className="tl-stats-num">{lights.length}</span>
                        <span className="tl-stats-sep" />
                        <span className="tl-stats-label">Кліків</span>
                        <span className="tl-stats-num accent">{total}</span>
                    </div>

                    <button className="ctrl-add" onClick={addLight}>
                        + Додати світлофор
                    </button>

                </div>
            </aside>

            {/* ── Stage ── */}
            <section className="tl-stage">
                <AnimatePresence mode="popLayout">
                    {lights.map(light => (
                        <motion.div key={light.id} className="tl-card tl-card--h"
                            initial={{ opacity: 0, y: 32, scale: 0.92 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85, y: -16 }}
                            layout
                            transition={{ type: 'spring', stiffness: 280, damping: 24 }}>

                            <div className="tl-card-header">
                                <span className="tl-card-name">{light.name}</span>
                                {lights.length > 1 && (
                                    <button className="tl-btn tl-btn-danger"
                                        onClick={() => removeLight(light.id)}>✕</button>
                                )}
                            </div>

                            <div className="tl-card-body">
                                <TrafficLights
                                    colors={light.colors}
                                    orientation="horizontal"
                                    onLightClick={colorId => clickColor(light.id, colorId)}
                                    blinkCount={settings.blinkCount}
                                    brightness={settings.brightness}
                                />
                            </div>

                            <div className="tl-card-stats">
                                {light.colors.map(c => (
                                    <div key={c.id} className="tl-stat">
                                        <span className="tl-stat-dot" style={{ background: c.hex }} />
                                        <span className="tl-stat-val">{c.clicks}</span>
                                    </div>
                                ))}
                            </div>

                        </motion.div>
                    ))}
                </AnimatePresence>
            </section>

        </div>
    )
}

export default HorizontalTrafficLight