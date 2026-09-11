import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Что-то сломалось:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="max-w-sm">
            <p className="text-4xl mb-4">😅</p>
            <h1 className="text-xl font-display font-bold mb-2">Что-то пошло не так</h1>
            <p className="text-gray-500 mb-4">
              Попробуй обновить страницу — твой прогресс уже сохранён.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-full bg-blush-500 text-white font-semibold shadow"
            >
              Обновить
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
