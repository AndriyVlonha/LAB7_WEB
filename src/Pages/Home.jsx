import './Home.css'

const Home = () => (
    <div className="home-container">
        <div className="home-content">
            <h1 className="home-title">Лабораторна робота №7</h1>

            <section className="task-section">
                <h2>Мета роботи</h2>
                <p>
                    Навчитися працювати з React Context API. Відрефакторити попередню
                    лабораторну роботу використовуючи контекст. Встановити та інтегрувати
                    бібліотеку <code>json-server</code> для збереження даних.
                    Дана робота є продовженням лабораторної роботи №6.
                </p>
            </section>

            <section className="task-section">
                <h2>Завдання</h2>
                <ol className="task-list">
                    <li>Відрефакторити лабораторну з використанням <code>React Context API</code></li>
                    <li>Створити <code>TrafficLightsProvider</code> з глобальним станом</li>
                    <li>Встановити бібліотеку <code>json-server</code></li>
                    <li>Реалізувати структуру <code>db.json</code> для збереження даних світлофора</li>
                    <li>Реалізувати роботу з <code>db.json</code> у <code>TrafficLightsProvider</code></li>
                </ol>
            </section>

            <section className="task-section">
                <h2>Функціонал</h2>
                <ul className="features-list">
                    <li>Глобальний стан через <code>TrafficLightsContext</code></li>
                    <li>Хук <code>useTrafficLights()</code> для доступу до контексту</li>
                    <li>Збереження кліків, яскравості, морганнь у <code>db.json</code></li>
                    <li>REST API через json-server (GET, POST, PATCH, DELETE)</li>
                    <li>Дані зберігаються між перезапусками через json-server</li>
                    <li>Анімації з framer-motion збережені з Lab 6</li>
                </ul>
            </section>

            <section className="navigation-hint">
                <p>Використовуйте меню вгорі для переходу між сторінками</p>
            </section>
        </div>
    </div>
)

export default Home