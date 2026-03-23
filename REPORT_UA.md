# Звіт з лабораторної роботи №6

**Студент:** Влонга Андрій  
**Група:** 42-КН  
**Дата:** 16/03/2026

---

## Мета роботи

Навчитися працювати з анімацією в React за допомогою бібліотеки `framer-motion`. Реалізувати ефект «моргання» при кліку на колір світлофора, зміну яскравості та кількості морганнь. Дана робота є продовженням лабораторної роботи №5.

---

## Хід виконання роботи

---

### 1. Створення нового проєкту

Створено новий React-проєкт з назвою `traffic-lights-6` на основі попередньої лабораторної:

```bash
pnpm create vite@latest traffic-lights-6 -- --template react
cd traffic-lights-6
pnpm install
pnpm install framer-motion
pnpm install react-router-dom
```


---

### 2. Встановлення бібліотеки framer-motion

Встановлено бібліотеку `framer-motion` для реалізації анімацій:

```bash
pnpm install framer-motion
```

**Опис:**
- `framer-motion` — бібліотека анімацій для React
- Надає компоненту `motion` для анімації DOM-елементів
- Функція `animate()` використовується для програмної анімації через ref

---

### 3. Структура проєкту

**Структура файлів:**

**Скріншот:**  
<div align="center">
  <figure>
    <img src="Images/project_structure.png" width="60%" alt="Project Structure"/>
    <br/>
    <sub><b>Рис. 1:</b> Структура проєкту traffic-lights-6</sub>
  </figure>
</div>

---

### 4. Реалізація ефекту моргання з framer-motion

**Основний функціонал Lab 6 — анімація моргання при кліку.**

Використано `useRef` для посилання на DOM-елемент лампи та функцію `animate()` з framer-motion.


**Опис:**
- `useRef` — посилається напряму на DOM-елемент, без пошуку по документу
- `animate(el, { opacity: frames })` — програмна анімація через framer-motion
- Keyframes будуються динамічно залежно від `blinkCount`
- `whileHover` та `whileTap` — мікроанімації наведення та кліку

**Скріншот:**  
<div align="center">
  <figure>
    <img src="Images/blink_animation.png" width="80%" alt="Blink Animation"/>
    <br/>
    <sub><b>Рис. 2:</b> Ефект моргання при кліку на лампу</sub>
  </figure>
</div>

---

### 5. Реалізація слайдерів керування

**Додаткове завдання — зміна яскравості та кількості морганнь.**

На кожній сторінці світлофора реалізовано панель керування з двома слайдерами.

**Код: `src/Pages/VerticalTrafficLight.jsx` (фрагмент)**

```jsx
const VerticalTrafficLight = () => {
  const [lights, setLights]         = useState([makeLight(1)])
  const [blinkCount, setBlinkCount] = useState(3)
  const [brightness, setBrightness] = useState(1.0)

  return (
    <div className="tl-page">
      <aside className="tl-sidebar">
        <label className="ctrl-group">
          <span className="ctrl-label">Кількість морганнь</span>
          <input type="range" min="1" max="10" step="1"
            value={blinkCount}
            onChange={e => setBlinkCount(Number(e.target.value))} />
          <span className="ctrl-val">{blinkCount}x</span>
        </label>

        <label className="ctrl-group">
          <span className="ctrl-label">Яскравість</span>
          <input type="range" min="0.15" max="1" step="0.05"
            value={brightness}
            onChange={e => setBrightness(parseFloat(e.target.value))} />
          <span className="ctrl-val">{Math.round(brightness * 100)}%</span>
        </label>

        <button className="ctrl-add" onClick={addLight}>
          + Додати світлофор
        </button>
      </aside>
      {/* ... */}
    </div>
  )
}
```

**Опис:**
- Слайдер **кількості морганнь** — від 1 до 10, впливає на кількість циклів анімації
- Слайдер **яскравості** — від 15% до 100%, змінює opacity та filter лампи
- Кольорова смужка під слайдером яскравості — візуальний індикатор
- Стан незалежний для кожної сторінки

**Скріншот:**  
<div align="center">
  <figure>
    <img src="Images/controls_panel.png" width="80%" alt="Controls Panel"/>
    <br/>
    <sub><b>Рис. 3:</b> Панель керування з слайдерами</sub>
  </figure>
</div>

---

### 6. Додавання декількох світлофорів

**Додаткове завдання — можливість додавати кілька світлофорів.**

Реалізовано кнопку "+ Додати світлофор" яка додає нову картку з власним станом кліків.

```jsx
const makeLight = (id) => ({
  id,
  name: id === 1 ? 'Світлофор #1' : `Світлофор #${id}`,
  clicks: { red: 0, yellow: 0, green: 0 },
})

const [lights, setLights] = useState([makeLight(1)])

const addLight    = () => setLights(p => [...p, makeLight(Date.now())])
const removeLight = (id) => setLights(p => p.filter(l => l.id !== id))
```

**Важливо:** Кожен світлофор має унікальний `id` (через `Date.now()`), що забезпечує правильну анімацію — клік на третій світлофор мигає тільки його лампи, а не першого.

**Скріншот:**  
<div align="center">
  <figure>
    <img src="Images/multiple_lights.png" width="80%" alt="Multiple Traffic Lights"/>
    <br/>
    <sub><b>Рис. 4:</b> Декілька світлофорів з незалежними лічильниками</sub>
  </figure>
</div>

---

### 7. Анімоване з'явлення (додаткове завдання)

**Анімоване з'явлення при переході на сторінку та при додаванні картки.**

```jsx
// Поява сторінки
<motion.div
  className="traffic-light-page"
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: 'easeOut' }}
>

// Поява нової картки
<motion.div
  key={light.id}
  initial={{ opacity: 0, y: 32, scale: 0.92 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, scale: 0.85, y: -16 }}
  layout
  transition={{ type: 'spring', stiffness: 280, damping: 24 }}
>
```

---

### 8. Сторінки вертикального та горизонтального світлофора

**Скріншоти:**

<div align="center">

  <img src="Images/vertical_page.png" width="400" />
  <p><b>Рисунок 5.</b> Сторінка вертикального світлофора</p>
  <br/>

  <img src="Images/horizontal_page.png" width="500" />
  <p><b>Рисунок 6.</b> Сторінка горизонтального світлофора</p>

</div>

---

### 9. Головна сторінка

**Скріншот:**  
<div align="center">
  <figure>
    <img src="Images/home_page.png" width="80%" alt="Home Page"/>
    <br/>
    <sub><b>Рис. 7:</b> Головна сторінка з описом лабораторної роботи №6</sub>
  </figure>
</div>

---

### 10. Сторінка помилок

**Скріншот:**  
<div align="center">
  <figure>
    <img src="Images/error_page.png" width="80%" alt="Error Page"/>
    <br/>
    <sub><b>Рис. 8:</b> Сторінка помилки 404</sub>
  </figure>
</div>

---

### 11. Запуск проєкту

```bash
cd traffic-lights-6
pnpm run dev
```

**Скріншот:**  
<div align="center">
  <figure>
    <img src="Images/run_dev.png" width="80%" alt="Running App"/>
    <br/>
    <sub><b>Рис. 9:</b> Результат виконання команди <code>pnpm run dev</code></sub>
  </figure>
</div>

---

## Результати роботи

### Реалізовані функції:

1. **Анімація моргання (framer-motion):**
   - Клік на лампу → ефект моргання через `animate()` з framer-motion
   - Використання `useRef` для прямого посилання на DOM-елемент
   - Динамічні keyframes залежно від кількості морганнь
   - Мікроанімації `whileHover` та `whileTap`

2. **Керування яскравістю:**
   - Слайдер від 15% до 100%
   - Зміна `opacity` та `filter: brightness()` лампи в реальному часі
   - Кольорова смужка-індикатор яскравості

3. **Керування кількістю морганнь:**
   - Слайдер від 1 до 10
   - Впливає на кількість циклів анімації та тривалість

4. **Множинні світлофори:**
   - Кнопка "+ Додати світлофор"
   - Кожен світлофор має власний лічильник кліків
   - Кнопка видалення для кожної картки
   - Анімоване з'явлення та зникнення через `AnimatePresence`

5. **Анімоване з'явлення (додаткове завдання):**
   - Spring-анімація появи карток
   - Плавний перехід при завантаженні сторінки

6. **Маршрутизація (з Lab 5):**
   - Збережена структура React Router
   - Header з NavLink навігацією
   - ErrorPage для неіснуючих маршрутів

### Технічні деталі:

- **framer-motion:** `motion`, `animate()`, `AnimatePresence`, `useRef`
- **React Router v6:** `createBrowserRouter`, `NavLink`, `Outlet`, `useRouteError`
- **Анімація:** keyframes через масив значень opacity
- **useRef vs getElementById:** прямий доступ до DOM без глобального пошуку
- **State Management:** локальний useState для кожної сторінки
- **CSS:** backdrop-filter, radial-gradient для реалістичних ламп

---

## Висновки

У ході виконання лабораторної роботи було успішно:
- Освоєно роботу з бібліотекою `framer-motion`
- Реалізовано ефект «моргання» через програмну анімацію `animate()`
- Реалізовано зміну яскравості та кількості морганнь через слайдери
- Реалізовано додавання та видалення декількох світлофорів
- Реалізовано анімоване з'явлення компонентів (додаткове завдання)
- Збережено та розширено структуру проєкту з попередньої лабораторної
- Використано `useRef` для надійного посилання на DOM-елементи

---

## Посилання

- Репозиторій GitHub: [посилання](https://github.com/AndriyVlonha/Lab6_WEB)
- Документація framer-motion: https://www.framer.com/motion/
- animate() API: https://www.framer.com/motion/animate/
- useRef (React): https://react.dev/reference/react/useRef
- React Router v6: https://reactrouter.com/en/main

---