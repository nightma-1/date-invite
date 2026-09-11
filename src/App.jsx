import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { siteConfig } from './config/siteConfig'
import { useDraft } from './hooks/useDraft'
import { useSound } from './hooks/useSound'
import ErrorBoundary from './components/ErrorBoundary'
import SoundToggle from './components/SoundToggle'
import InvitePage from './pages/InvitePage'
import YesPage from './pages/YesPage'
import DateTimePage from './pages/DateTimePage'
import PlacePage from './pages/PlacePage'
import FinalPage from './pages/FinalPage'
import AdminPage from './pages/AdminPage'

const STEP_ORDER = ['invite', 'yes', 'datetime', 'place', 'final']

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return hash
}

function Wizard() {
  const { draft, updateDraft, clearDraft } = useDraft()
  const { enabled, toggle, playClick, playSuccess, playWhoosh } = useSound()

  const goTo = (step) => updateDraft({ step })

  const renderStep = () => {
    switch (draft.step) {
      case 'invite':
        return (
          <InvitePage
            key="invite"
            onAgree={() => {
              updateDraft({ agreed: true, step: 'yes' })
            }}
            playClick={playClick}
            playWhoosh={playWhoosh}
          />
        )
      case 'yes':
        return (
          <YesPage key="yes" onNext={() => goTo('datetime')} playSuccess={playSuccess} />
        )
      case 'datetime':
        return (
          <DateTimePage
            key="datetime"
            draft={draft}
            updateDraft={updateDraft}
            onNext={() => goTo('place')}
            onBack={() => goTo('yes')}
            playClick={playClick}
          />
        )
      case 'place':
        return (
          <PlacePage
            key="place"
            draft={draft}
            updateDraft={updateDraft}
            onNext={() => goTo('final')}
            onBack={() => goTo('datetime')}
            playClick={playClick}
          />
        )
      case 'final':
        return (
          <FinalPage
            key="final"
            draft={draft}
            onBack={() => goTo('place')}
            onSubmitted={() => updateDraft({ submitted: true })}
            playSuccess={playSuccess}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(160deg, ${siteConfig.colors.gradientFrom} 0%, ${siteConfig.colors.gradientVia} 55%, ${siteConfig.colors.gradientTo} 100%)`,
      }}
    >
      <SoundToggle enabled={enabled} onToggle={toggle} />
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      {/* clearDraft доступен, если понадобится добавить кнопку "начать заново" */}
    </div>
  )
}

export default function App() {
  const hash = useHashRoute()
  const isAdmin = hash === '#/admin' || hash === '#admin'

  return (
    <ErrorBoundary>
      {isAdmin ? (
        <div
          className="min-h-screen w-full"
          style={{
            background: `linear-gradient(160deg, ${siteConfig.colors.gradientFrom} 0%, ${siteConfig.colors.gradientVia} 55%, ${siteConfig.colors.gradientTo} 100%)`,
          }}
        >
          <AdminPage />
        </div>
      ) : (
        <Wizard />
      )}
    </ErrorBoundary>
  )
}
