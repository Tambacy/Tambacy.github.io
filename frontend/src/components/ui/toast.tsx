import { useState, useRef, useCallback, createContext, useContext, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Toast {
  id: number
  message: string
  visible: boolean
}

interface ToastContextValue {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextIdRef = useRef(0)

  const showToast = useCallback((message: string) => {
    const id = nextIdRef.current++
    setToasts(prev => [...prev, { id, message, visible: false }])
    requestAnimationFrame(() => {
      setToasts(prev =>
        prev.map(t => (t.id === id ? { ...t, visible: true } : t))
      )
    })
    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => (t.id === id ? { ...t, visible: false } : t))
      )
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 400)
    }, 2500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-[30px] left-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              'bg-card border border-borderStrong px-[22px] py-3 rounded-[30px] text-[0.82rem] text-text shadow-[0_8px_32px_rgba(139,58,42,0.15)] transition-all duration-[0.4s] whitespace-nowrap pointer-events-auto',
              toast.visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-[100px] opacity-0'
            )}
            style={{ transform: toast.visible ? 'translate(-50%, 0)' : 'translate(-50%, 100px)' }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  message: string
  visible: boolean
}

export function ToastContainer({ message, visible }: ToastContainerProps) {
  return (
    <div className="fixed bottom-[30px] left-1/2 z-[200] pointer-events-none">
      <div
        className={cn(
          'bg-card border border-borderStrong px-[22px] py-3 rounded-[30px] text-[0.82rem] text-text shadow-[0_8px_32px_rgba(139,58,42,0.15)] transition-all duration-[0.4s] whitespace-nowrap',
          visible
            ? 'opacity-100 -translate-x-1/2 translate-y-0'
            : 'opacity-0 -translate-x-1/2 translate-y-[100px]'
        )}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {message}
      </div>
    </div>
  )
}