import { useRouteError, Link } from 'react-router-dom'
import './ErrorPage.css'

const ErrorPage = () => {
    const error = useRouteError()

    return (
        <div className="error-page">
            <div className="error-content">
                <div className="error-icon">🚧</div>
                <h1 className="error-title">Упс! Щось пішло не так</h1>

                <div className="error-details">
                    <p className="error-status">
                        {error?.status && `Помилка ${error.status}`}
                    </p>
                    <p className="error-message">
                        {error?.statusText || error?.message || 'Сторінку не знайдено'}
                    </p>
                </div>

                <p className="error-description">
                    Схоже, ви потрапили на сторінку, якої не існує, або сталася непередбачена помилка.
                </p>

                <Link to="/" className="back-home-btn">
                    Повернутися на головну
                </Link>
            </div>
        </div>
    )
}

export default ErrorPage