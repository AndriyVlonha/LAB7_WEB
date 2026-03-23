# Звіт з лабораторної роботи №7

**Студент:** Влонга Андрій  
**Група:** 42-КН  
**Дата:** 21/03/2026

---

## Мета роботи

Навчитися працювати з React Context API. Відрефакторити лабораторну роботу №6 використовуючи контекст замість локального стану. Встановити та інтегрувати бібліотеку `json-server` для збереження даних між перезапусками.

---

## Хід виконання роботи

---

### 1. Створення проєкту на основі Lab 6

Скопійовано проєкт `traffic-lights-6` як основу та встановлено нові залежності:

```bash
npm install
npm install json-server concurrently
```

**Що додалось до `package.json`:**

```json
"scripts": {
  "server": "json-server --watch db.json --port 3001",
  "start": "concurrently \"npm run dev\" \"npm run server\""
},
"devDependencies": {
  "concurrently": "^8.2.2",
  "json-server": "^0.17.4"
}
```

---

### 2. Структура проєкту

**Скріншот:**
<div align="center">
  <figure>
    <img src="Images/project_structure.png" width="60%" alt="Project Structure"/>
    <br/>
    <sub><b>Рис. 1:</b> Структура проєкту traffic-lights-7</sub>
  </figure>
</div>

---

### 3. Створення db.json

Реалізовано структуру збереження даних для світлофора:

**Файл: `db.json`**

```json
{
  "lights": [
    {
      "id": 1,
      "name": "Світлофор #1",
      "colors": [
        { "id": "red",    "label": "Червоний", "hex": "#ff3b3b", "clicks": 0 },
        { "id": "yellow", "label": "Жовтий",   "hex": "#ffc107", "clicks": 0 },
        { "id": "green",  "label": "Зелений",  "hex": "#00e676", "clicks": 0 }
      ]
    }
  ],
  "settings": {
    "id": 1,
    "blinkCount": 3,
    "brightness": 1.0
  }
}
```

**Опис:**
- `lights` — масив світлофорів з кольорами та кількістю кліків
- `settings` — глобальні налаштування (моргання, яскравість)
- json-server автоматично створює REST API з цього файлу

**Скріншот:**
<div align="center">
  <figure>
    <img src="Images/db_json.png" width="80%" alt="db.json"/>
    <br/>
    <sub><b>Рис. 2:</b> Структура db.json після кількох кліків</sub>
  </figure>
</div>

---

### 4. Налаштування vite.config.js (proxy)

Щоб уникнути CORS помилок при запитах до json-server:

**Файл: `vite.config.js`**

```js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

**Опис:**
- Запити з `/api/lights` перенаправляються на `http://localhost:3001/lights`
- Vite і json-server працюють на різних портах (5173 і 3001)

---

### 5. Створення TrafficLightsContext (головне завдання)

**Файл: `src/context/TrafficLightsContext.jsx`**

```jsx
import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'

const TrafficLightsContext = createContext(null)

export function TrafficLightsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    lights: [], settings: { blinkCount: 3, brightness: 1.0 }, loading: true,
  })

  // Завантаження з json-server при монтуванні
  useEffect(() => {
    Promise.all([api.getLights(), api.getSettings()])
      .then(([lights, settings]) => {
        dispatch({ type: 'INIT', lights, settings })
      })
      .catch(() => {
        dispatch({ type: 'INIT', lights: DEFAULT_LIGHTS, settings: DEFAULT_SETTINGS })
      })
  }, [])

  const addLight = useCallback(async () => {
    const newLight = { name: `Світлофор #${Date.now()}`, colors: [...] }
    const saved = await api.createLight(newLight)   // POST /api/lights
    dispatch({ type: 'ADD_LIGHT', light: saved })
  }, [])

  const clickColor = useCallback(async (lightId, colorId) => {
    dispatch({ type: 'CLICK_COLOR', lightId, colorId })
    await api.updateLight(lightId, { colors: updatedColors }) // PATCH /api/lights/:id
  }, [state.lights])

  return (
    <TrafficLightsContext.Provider value={{
      lights, settings, loading, addLight, removeLight, clickColor, updateSettings
    }}>
      {children}
    </TrafficLightsContext.Provider>
  )
}

export function useTrafficLights() {
  return useContext(TrafficLightsContext)
}
```

**Опис:**
- `createContext()` — створює контейнер для глобального стану
- `TrafficLightsProvider` — обгортає додаток, надає стан всім дочірнім компонентам
- `useReducer` — керує складним станом через actions
- `useTrafficLights()` — хук для доступу до контексту з будь-якого компонента
- Кожна дія (клік, додавання) зберігається в `db.json` через json-server

**Скріншот:**
<div align="center">
  <figure>
    <img src="Images/context_file.png" width="80%" alt="Context File"/>
    <br/>
    <sub><b>Рис. 3:</b> Файл TrafficLightsContext.jsx</sub>
  </figure>
</div>

---

### 6. Обгортання додатку у Provider

**Файл: `src/main.jsx`**

```jsx
// Lab 6 було:
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Lab 7 стало:
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TrafficLightsProvider>
      <App />
    </TrafficLightsProvider>
  </StrictMode>
)
```

**Опис:**
- Provider обгортає весь додаток
- Тому будь-який компонент всередині може отримати стан через `useTrafficLights()`

---

### 7. Рефакторинг сторінок (useState → useContext)

**Файл: `src/Pages/VerticalTrafficLight.jsx`**

```jsx
// Lab 6 було:
const [lights, setLights]         = useState([makeLight(1)])
const [blinkCount, setBlinkCount] = useState(3)
const [brightness, setBrightness] = useState(1.0)
const addLight = () => setLights(p => [...p, makeLight(Date.now())])

// Lab 7 стало:
const { lights, settings, addLight, removeLight, clickColor, updateSettings }
  = useTrafficLights()
// useState повністю прибрано — стан береться з контексту
```

**Скріншот:**
<div align="center">
  <figure>
    <img src="Images/vertical_page.png" width="80%" alt="Vertical Page"/>
    <br/>
    <sub><b>Рис. 4:</b> Сторінка вертикального світлофора</sub>
  </figure>
</div>

---

### 8. REST API запити до json-server

```js
const api = {
  getLights:      ()         => fetch('/api/lights').then(r => r.json()),
  getSettings:    ()         => fetch('/api/settings/1').then(r => r.json()),
  createLight:    (data)     => fetch('/api/lights', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateLight:    (id, data) => fetch(`/api/lights/${id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteLight:    (id)       => fetch(`/api/lights/${id}`, { method: 'DELETE' }),
  updateSettings: (data)     => fetch('/api/settings/1', {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
}
```

---

### 9. Запуск проєкту

```bash
npm run start
```

Запускається одночасно:
- Vite dev server → `http://localhost:5173`
- json-server → `http://localhost:3001`

**Скріншот:**
<div align="center">
  <figure>
    <img src="Images/run_dev.png" width="80%" alt="Running App"/>
    <br/>
    <sub><b>Рис. 5:</b> Результат виконання команди <code>npm run start</code></sub>
  </figure>
</div>

---

### 10. Демонстрація збереження даних

**Скріншот:**
<div align="center">
  <figure>
    <img src="Images/horizontal_page.png" width="80%" alt="Horizontal Page"/>
    <br/>
    <sub><b>Рис. 6:</b> Сторінка горизонтального світлофора — дані зберігаються після F5</sub>
  </figure>
</div>

---

## Результати роботи

### Реалізовані функції:

1. **React Context API:**
   - Створено `TrafficLightsContext` з `createContext()`
   - Створено `TrafficLightsProvider` з `useReducer` для керування станом
   - Створено хук `useTrafficLights()` для доступу до контексту
   - Відрефакторено сторінки — прибрано `useState`, замінено на `useContext`

2. **json-server:**
   - Встановлено та налаштовано `json-server`
   - Реалізовано структуру `db.json` (світлофори, кольори, кліки, налаштування)
   - Реалізовано REST API запити: GET, POST, PATCH, DELETE
   - Дані зберігаються між перезапусками додатку

3. **useReducer:**
   - Єдиний reducer обробляє всі зміни стану через actions
   - Actions: `INIT`, `ADD_LIGHT`, `REMOVE_LIGHT`, `CLICK_COLOR`, `UPDATE_SETTINGS`

4. **proxy (vite.config.js):**
   - `/api/*` проксіюється на `http://localhost:3001`
   - Уникнення CORS помилок

5. **Збережено з Lab 6:**
   - Анімація моргання через `framer-motion`
   - Слайдери яскравості та морганнь
   - Маршрутизація React Router
   - Множинні світлофори

### Технічні деталі:

- **Context API:** `createContext`, `useContext`, `Provider`
- **useReducer:** actions-based state management
- **json-server:** mock REST API з db.json
- **concurrently:** паралельний запуск процесів
- **fetch API:** GET, POST, PATCH, DELETE запити
- **vite proxy:** перенаправлення запитів без CORS

---

## Висновки

У ході виконання лабораторної роботи було успішно:
- Освоєно роботу з React Context API
- Створено `TrafficLightsProvider` з глобальним станом
- Відрефакторено сторінки з `useState` на `useContext`
- Встановлено та інтегровано `json-server`
- Реалізовано збереження даних у `db.json`
- Реалізовано повноцінну роботу з REST API (GET, POST, PATCH, DELETE)
- Збережено та розширено функціонал попередньої лабораторної

---

## Посилання

- Репозиторій GitHub: [посилання](https://github.com/AndriyVlonha/Lab7_WEB)
- React Context API: https://react.dev/reference/react/createContext
- useReducer: https://react.dev/reference/react/useReducer
- json-server: https://www.npmjs.com/package/json-server
- React Router v7: https://reactrouter.com/en/main

---