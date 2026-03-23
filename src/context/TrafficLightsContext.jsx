import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'

// ─── API helpers ──────────────────────────────────────────────────────────────
const API = '/api'

const api = {
    getLights: () => fetch(`${API}/lights`).then(r => r.json()),
    getSettings: () => fetch(`${API}/settings/1`).then(r => r.json()),
    updateLight: (id, data) => fetch(`${API}/lights/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(r => r.json()),
    createLight: (data) => fetch(`${API}/lights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(r => r.json()),
    deleteLight: (id) => fetch(`${API}/lights/${id}`, { method: 'DELETE' }),
    updateSettings: (data) => fetch(`${API}/settings/1`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(r => r.json()),
}

// ─── Default state (якщо json-server не запущений) ───────────────────────────
const DEFAULT_LIGHTS = [{
    id: 1,
    name: 'Світлофор #1',
    colors: [
        { id: 'red', label: 'Червоний', hex: '#ff3b3b', clicks: 0 },
        { id: 'yellow', label: 'Жовтий', hex: '#ffc107', clicks: 0 },
        { id: 'green', label: 'Зелений', hex: '#00e676', clicks: 0 },
    ],
}]

const DEFAULT_SETTINGS = { blinkCount: 3, brightness: 1.0 }

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
    switch (action.type) {

        case 'INIT':
            return { ...state, lights: action.lights, settings: action.settings, loading: false }

        case 'ADD_LIGHT':
            return { ...state, lights: [...state.lights, action.light] }

        case 'REMOVE_LIGHT':
            return { ...state, lights: state.lights.filter(l => l.id !== action.id) }

        case 'CLICK_COLOR': {
            const lights = state.lights.map(l => {
                if (l.id !== action.lightId) return l
                const colors = l.colors.map(c =>
                    c.id === action.colorId ? { ...c, clicks: c.clicks + 1 } : c
                )
                return { ...l, colors }
            })
            return { ...state, lights }
        }

        case 'UPDATE_SETTINGS':
            return { ...state, settings: { ...state.settings, ...action.data } }

        default:
            return state
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const TrafficLightsContext = createContext(null)

export function TrafficLightsProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        lights: [],
        settings: DEFAULT_SETTINGS,
        loading: true,
    })

    // Завантаження даних з json-server при монтуванні
    useEffect(() => {
        Promise.all([api.getLights(), api.getSettings()])
            .then(([lights, settings]) => {
                dispatch({ type: 'INIT', lights, settings })
            })
            .catch(() => {
                // json-server не запущений — використовуємо дефолтні дані
                dispatch({ type: 'INIT', lights: DEFAULT_LIGHTS, settings: DEFAULT_SETTINGS })
            })
    }, [])

    // ── Дії ───────────────────────────────────────────────────────────────────

    const addLight = useCallback(async () => {
        const newLight = {
            name: `Світлофор #${Date.now()}`,
            colors: [
                { id: 'red', label: 'Червоний', hex: '#ff3b3b', clicks: 0 },
                { id: 'yellow', label: 'Жовтий', hex: '#ffc107', clicks: 0 },
                { id: 'green', label: 'Зелений', hex: '#00e676', clicks: 0 },
            ],
        }
        try {
            const saved = await api.createLight(newLight)
            dispatch({ type: 'ADD_LIGHT', light: saved })
        } catch {
            dispatch({ type: 'ADD_LIGHT', light: { ...newLight, id: Date.now() } })
        }
    }, [])

    const removeLight = useCallback(async (id) => {
        dispatch({ type: 'REMOVE_LIGHT', id })
        try { await api.deleteLight(id) } catch { /* offline */ }
    }, [])

    const clickColor = useCallback(async (lightId, colorId) => {
        dispatch({ type: 'CLICK_COLOR', lightId, colorId })

        // Зберігаємо оновлені кліки в json-server
        const light = state.lights.find(l => l.id === lightId)
        if (!light) return
        const colors = light.colors.map(c =>
            c.id === colorId ? { ...c, clicks: c.clicks + 1 } : c
        )
        try { await api.updateLight(lightId, { colors }) } catch { /* offline */ }
    }, [state.lights])

    const updateSettings = useCallback(async (data) => {
        dispatch({ type: 'UPDATE_SETTINGS', data })
        try { await api.updateSettings(data) } catch { /* offline */ }
    }, [])

    return (
        <TrafficLightsContext.Provider value={{
            lights: state.lights,
            settings: state.settings,
            loading: state.loading,
            addLight,
            removeLight,
            clickColor,
            updateSettings,
        }}>
            {children}
        </TrafficLightsContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTrafficLights() {
    const ctx = useContext(TrafficLightsContext)
    if (!ctx) throw new Error('useTrafficLights must be inside TrafficLightsProvider')
    return ctx
}