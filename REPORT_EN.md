# Laboratory Report No. 6

**Student:** Andriy Vlonha  
**Group:** 42-CS  
**Date:** 16/03/2026

---

## Objective

To learn how to work with animations in React using the `framer-motion` library. Implement a "blinking" effect when clicking on a traffic light color, along with brightness and blink count controls. This work is a continuation of Laboratory Work No. 5.

---

## Procedure

---

### 1. Creating a New Project

Created a new React project named `traffic-lights-6` based on the previous lab:

```bash
pnpm create vite@latest traffic-lights-6 -- --template react
cd traffic-lights-6
pnpm install
pnpm install framer-motion
pnpm install react-router-dom
```


---

### 2. Installing framer-motion

Installed the `framer-motion` library for animations:

```bash
pnpm install framer-motion
```

**Description:**
- `framer-motion` — animation library for React
- Provides the `motion` component for animating DOM elements
- The `animate()` function is used for programmatic animation via ref

---

### 3. Project Structure

**File structure:**

**Screenshot:**  
<div align="center">
  <figure>
    <img src="Images/project_structure.png" width="60%" alt="Project Structure"/>
    <br/>
    <sub><b>Fig. 1:</b> Project structure for traffic-lights-6</sub>
  </figure>
</div>

---

### 4. Implementing the Blink Effect with framer-motion

**Core Lab 6 feature — blink animation on click.**

Used `useRef` to reference the lamp DOM element directly, and the `animate()` function from framer-motion.

**Description:**
- `useRef` — directly references the DOM element without searching the entire document
- `animate(el, { opacity: frames })` — programmatic animation via framer-motion
- Keyframes are built dynamically based on `blinkCount`
- `whileHover` and `whileTap` — hover and click micro-animations

**Screenshot:**  
<div align="center">
  <figure>
    <img src="Images/blink_animation.png" width="80%" alt="Blink Animation"/>
    <br/>
    <sub><b>Fig. 2:</b> Blink effect on lamp click</sub>
  </figure>
</div>

---

### 5. Implementing Control Sliders

**Additional task — brightness and blink count controls.**

Each traffic light page features a sidebar with two sliders.

**Code: `src/Pages/VerticalTrafficLight.jsx` (excerpt)**

```jsx
const VerticalTrafficLight = () => {
  const [lights, setLights]         = useState([makeLight(1)])
  const [blinkCount, setBlinkCount] = useState(3)
  const [brightness, setBrightness] = useState(1.0)

  return (
    <div className="tl-page">
      <aside className="tl-sidebar">
        <label className="ctrl-group">
          <span className="ctrl-label">Blink count</span>
          <input type="range" min="1" max="10" step="1"
            value={blinkCount}
            onChange={e => setBlinkCount(Number(e.target.value))} />
          <span className="ctrl-val">{blinkCount}x</span>
        </label>

        <label className="ctrl-group">
          <span className="ctrl-label">Brightness</span>
          <input type="range" min="0.15" max="1" step="0.05"
            value={brightness}
            onChange={e => setBrightness(parseFloat(e.target.value))} />
          <span className="ctrl-val">{Math.round(brightness * 100)}%</span>
        </label>

        <button className="ctrl-add" onClick={addLight}>
          + Add traffic light
        </button>
      </aside>
      {/* ... */}
    </div>
  )
}
```

**Description:**
- **Blink count slider** — range 1–10, affects number of animation cycles
- **Brightness slider** — range 15–100%, changes lamp opacity and filter in real time
- Color strip below brightness slider — visual indicator
- State is independent for each page

**Screenshot:**  
<div align="center">
  <figure>
    <img src="Images/controls_panel.png" width="80%" alt="Controls Panel"/>
    <br/>
    <sub><b>Fig. 3:</b> Control panel with sliders</sub>
  </figure>
</div>

---

### 6. Multiple Traffic Lights

**Additional feature — ability to add multiple traffic lights.**

Implemented an "+ Add traffic light" button that creates a new card with its own click state.

```jsx
const makeLight = (id) => ({
  id,
  name: id === 1 ? 'Traffic Light #1' : `Traffic Light #${id}`,
  clicks: { red: 0, yellow: 0, green: 0 },
})

const [lights, setLights] = useState([makeLight(1)])

const addLight    = () => setLights(p => [...p, makeLight(Date.now())])
const removeLight = (id) => setLights(p => p.filter(l => l.id !== id))
```

**Important:** Each traffic light has a unique `id` (via `Date.now()`), which ensures correct animation — clicking the third traffic light only blinks its own lamps, not the first one's. This is achieved using `useRef` which directly references the specific DOM element.

**Screenshot:**  
<div align="center">
  <figure>
    <img src="Images/multiple_lights.png" width="80%" alt="Multiple Traffic Lights"/>
    <br/>
    <sub><b>Fig. 4:</b> Multiple traffic lights with independent counters</sub>
  </figure>
</div>

---

### 7. Animated Appearance (Additional Task)

**Animated entrance on page load and when adding a new card.**

```jsx
// Page entrance animation
<motion.div
  className="traffic-light-page"
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: 'easeOut' }}
>

// New card entrance animation
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

### 8. Vertical and Horizontal Traffic Light Pages

**Screenshots:**

<div align="center">

  <img src="Images/vertical_page.png" width="400" />
  <p><b>Figure 5.</b> Vertical traffic light page</p>
  <br/>

  <img src="Images/horizontal_page.png" width="500" />
  <p><b>Figure 6.</b> Horizontal traffic light page</p>

</div>

---

### 9. Home Page

**Screenshot:**  
<div align="center">
  <figure>
    <img src="Images/home_page.png" width="80%" alt="Home Page"/>
    <br/>
    <sub><b>Fig. 7:</b> Home page with Lab 6 description</sub>
  </figure>
</div>

---

### 10. Error Page

**Screenshot:**  
<div align="center">
  <figure>
    <img src="Images/error_page.png" width="80%" alt="Error Page"/>
    <br/>
    <sub><b>Fig. 8:</b> 404 Error page</sub>
  </figure>
</div>

---

### 11. Running the Project

```bash
cd traffic-lights-6
pnpm run dev
```

**Screenshot:**  
<div align="center">
  <figure>
    <img src="Images/run_dev.png" width="80%" alt="Running App"/>
    <br/>
    <sub><b>Fig. 9:</b> Result of executing <code>pnpm run dev</code></sub>
  </figure>
</div>

---

## Results

### Implemented Features:

1. **Blink animation (framer-motion):**
   - Click on lamp → blink effect via `animate()` from framer-motion
   - `useRef` for direct DOM element reference without global document search
   - Dynamically built keyframes based on blink count
   - `whileHover` and `whileTap` micro-animations

2. **Brightness control:**
   - Slider from 15% to 100%
   - Changes lamp `opacity` and `filter: brightness()` in real time
   - Color strip as brightness visual indicator

3. **Blink count control:**
   - Slider from 1 to 10
   - Affects number of animation cycles and total duration

4. **Multiple traffic lights:**
   - "+ Add traffic light" button
   - Each traffic light has its own click counters per color
   - Delete button on each card
   - Animated appearance and removal via `AnimatePresence`

5. **Animated appearance (additional task):**
   - Spring animation for card entrance
   - Smooth page transition on load

6. **Routing (from Lab 5):**
   - Preserved React Router structure
   - Header with NavLink navigation
   - ErrorPage for non-existent routes

### Technical Details:

- **framer-motion:** `motion`, `animate()`, `AnimatePresence`, `useRef`
- **React Router v6:** `createBrowserRouter`, `NavLink`, `Outlet`, `useRouteError`
- **Animation:** keyframes via opacity value array
- **useRef vs getElementById:** direct DOM access without global search
- **State Management:** local `useState` for each page
- **CSS:** `backdrop-filter`, `radial-gradient` for realistic lamp rendering

---

## Conclusion

During this laboratory work, I successfully:
- Mastered working with the `framer-motion` library
- Implemented the "blinking" effect via programmatic `animate()` animation
- Implemented brightness and blink count control via sliders
- Implemented adding and removing multiple traffic lights
- Implemented animated component entrance (additional task)
- Preserved and extended the project structure from the previous lab
- Used `useRef` for reliable direct DOM element references

---

## References

- GitHub Repository: [link](https://github.com/AndriyVlonha/Lab6_WEB)
- framer-motion Documentation: https://www.framer.com/motion/
- animate() API: https://www.framer.com/motion/animate/
- useRef (React): https://react.dev/reference/react/useRef
- React Router v6: https://reactrouter.com/en/main

---