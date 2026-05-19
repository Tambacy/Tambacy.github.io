import { useState, useCallback } from 'react'
import DiagnosticTest from './components/DiagnosticTest'
import AdvanceGuide from './components/AdvanceGuide'
import TrainingTutorial from './components/TrainingTutorial'
import AIAssistant from './components/AIAssistant'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AuthDialog } from '@/components/AuthDialog'
import { CommentSection } from '@/components/CommentSection'
import { Button } from '@/components/ui/button'
import { diagnosticApi } from '@/lib/api'

interface TypeResult {
  code: string
  name: string
  desc: string
  strengths: string[]
  weaknesses: string[]
  advice: { title: string; desc: string }[]
}

const TABS = [
  { key: 'diagnostic', label: '诊断测试', icon: '🧪' },
  { key: 'guide', label: '进阶指南', icon: '📖' },
  { key: 'training', label: '训练教程', icon: '🏓' },
  { key: 'ai', label: 'AI建议', icon: '🤖' },
] as const

type TabKey = (typeof TABS)[number]['key']

function AuthButtons() {
  const { user, openAuthDialog, logout } = useAuth()

  if (user) {
    return (
      <>
        <span className="text-sm text-text2 font-medium">{user.nickname}</span>
        <Button variant="outline" size="sm" onClick={logout}>
          退出
        </Button>
      </>
    )
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => openAuthDialog('login')}>
        登录
      </Button>
      <Button size="sm" onClick={() => openAuthDialog('register')}>
        注册
      </Button>
    </>
  )
}

function AppContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabKey>('diagnostic')
  const [testCompleted, setTestCompleted] = useState(false)
  const [testTypeResult, setTestTypeResult] = useState<TypeResult | null>(null)
  const [dimScores, setDimScores] = useState<number[]>([])

  const handleTabChange = useCallback((tab: string) => {
    if (TABS.some((t) => t.key === tab)) {
      setActiveTab(tab as TabKey)
    }
  }, [])

  const handleTestComplete = useCallback((completed: boolean, typeResult: TypeResult | null, scores: number[]) => {
    setTestCompleted(completed)
    setTestTypeResult(typeResult)
    setDimScores(scores)

    if (completed && typeResult && user) {
      diagnosticApi.save({
        typeCode: typeResult.code,
        typeName: typeResult.name,
        scores: scores,
      }).catch(() => {})
    }
  }, [user])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'diagnostic':
        return (
          <DiagnosticTest
            onTabChange={handleTabChange}
            onTestComplete={handleTestComplete}
          />
        )
      case 'guide':
        return <AdvanceGuide onTabChange={handleTabChange} />
      case 'training':
        return <TrainingTutorial />
      case 'ai':
        return (
          <AIAssistant
            testCompleted={testCompleted}
            testTypeResult={testTypeResult}
            dimScores={dimScores}
            onTabChange={handleTabChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      <nav className="sticky top-0 z-[100] bg-[rgba(232,220,200,0.94)] backdrop-blur-[16px] border-b border-borderStrong shadow-[0_1px_12px_rgba(139,90,43,0.08)]">
        <div className="max-w-[1080px] mx-auto flex items-center justify-between h-14 px-2">
          <div className="flex items-center gap-2 pl-4 whitespace-nowrap">
            <span className="w-2.5 h-2.5 bg-accent rounded-full animate-[pulse-dot_2s_ease-in-out_infinite]" />
            <span className="font-display text-[1.3rem] tracking-[3px] text-accent">
              乒乓一站式
            </span>
          </div>

          <div className="flex gap-1 items-center">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`font-body text-[0.82rem] font-semibold px-4 py-2 rounded-[20px] transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 cursor-pointer border-none ${
                  activeTab === tab.key
                    ? 'bg-accent text-white'
                    : 'bg-transparent text-text2 hover:bg-[rgba(192,57,43,0.06)] hover:text-accent'
                }`}
              >
                <span className="text-[0.9rem]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <AuthButtons />
          </div>
        </div>
      </nav>

      <div className="max-w-[1080px] mx-auto px-8 relative z-[1]">
        <div key={activeTab} className="animate-[fadeIn_0.35s_ease]">
          {renderTabContent()}
        </div>
      </div>

      <CommentSection />

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(192,57,43,0.4); }
          50% { transform: scale(1.6); box-shadow: 0 0 16px rgba(192,57,43,0.6); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <AuthDialog />
    </AuthProvider>
  )
}

export default App