# 🎯 Шпаргалка для захисту Lab 7

---

## Що нового відносно Lab 6

| Lab 6 | Lab 7 |
|-------|-------|
| `useState` в кожній сторінці | `useContext` — один глобальний стан |
| дані губляться при F5 | `db.json` — зберігається через json-server |
| немає `context/` | є `src/context/TrafficLightsContext.jsx` |

---

## 3 головні нові речі

### 1. createContext + Provider
```jsx
// Створюємо контекст
const TrafficLightsContext = createContext(null)

// Provider обгортає весь додаток в main.jsx
<TrafficLightsProvider>
  <App />
</TrafficLightsProvider>
```
**Скажи:** *"Контекст — це глобальне сховище стану. Provider надає його всім компонентам всередині"*

---

### 2. useTrafficLights() — хук
```jsx
// В будь-якому компоненті:
const { lights, settings, addLight, clickColor } = useTrafficLights()
// Замість useState — беремо з контексту
```
**Скажи:** *"Замість useState в кожній сторінці — один хук і всі дані готові"*

---

### 3. json-server — збереження даних
```js
// Клік → оновлюємо db.json через PATCH
await fetch('/api/lights/1', {
  method: 'PATCH',
  body: JSON.stringify({ colors: updatedColors })
})
// F5 → GET /api/lights → дані підтягнулись
```
**Скажи:** *"json-server читає db.json і робить з нього REST API. При F5 робиться GET і дані відновлюються"*

---

## Де що знаходиться

| Що | Файл |
|----|------|
| Весь контекст | `src/context/TrafficLightsContext.jsx` |
| Обгортка Provider | `src/main.jsx` |
| База даних | `db.json` |
| Proxy налаштування | `vite.config.js` |
| Сторінки (без useState) | `src/Pages/Vertical/HorizontalTrafficLight.jsx` |

---

## Питання і відповіді

**"Що таке Context API?"**
→ Вбудований в React механізм глобального стану. Не треба передавати props через кілька рівнів — кладемо в контекст і беремо звідусіль

**"Що таке useReducer?"**
→ Як useState але для складного стану. Замість окремих setters — один dispatch з action типом

**"Що таке json-server?"**
→ Бібліотека яка читає db.json і автоматично робить REST API. Не треба писати backend

**"Які HTTP методи використовуєш?"**
→ GET (завантажити), POST (додати), PATCH (оновити кліки), DELETE (видалити)

**"Чому proxy в vite.config?"**
→ Щоб не було CORS — Vite і json-server на різних портах, proxy перенаправляє /api/* на :3001

**"Що змінилось відносно Lab 6?"**
→ Прибрав useState зі сторінок, додав Context + json-server. Анімації і маршрутизація — без змін