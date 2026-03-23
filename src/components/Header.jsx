import { NavLink } from 'react-router-dom'
import './Header.css'

const Header = () => (
    <header className="header">
        <div className="header-inner">

            <div className="header-brand">
                <div className="header-icon">
                    <span style={{ background: '#ff3b3b' }} />
                    <span style={{ background: '#ffc107' }} />
                    <span style={{ background: '#00e676' }} />
                </div>
                <div>
                    <p className="header-eyebrow">Лабораторна №6</p>
                    <span className="header-title">Світлофор</span>
                </div>
            </div>

            <nav className="header-nav">
                <NavLink to="/" end
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Головна
                </NavLink>
                <NavLink to="/vertical"
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Вертикальний
                </NavLink>
                <NavLink to="/horizontal"
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Горизонтальний
                </NavLink>
            </nav>

        </div>
    </header>
)

export default Header