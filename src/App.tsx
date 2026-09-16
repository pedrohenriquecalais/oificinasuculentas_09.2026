import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import logo from './assets/logo.png'
import adrianaPhoto from './assets/adriana-feature.jpeg'
import plantasPhoto from './assets/step-plantas.jpeg'
import entregaPhoto from './assets/step-entrega.jpeg'

const VIP_GROUP_URL =
  'https://chat.whatsapp.com/BRszbr7S4lELIRbj09Y1FS?s=cl&p=i&mlu=4&ilr=4'

// URL do Google Apps Script (Web App) que grava nome + telefone na planilha.
// Configurada em .env como VITE_LEADS_WEBHOOK_URL (veja .env.example).
const LEADS_WEBHOOK_URL = import.meta.env.VITE_LEADS_WEBHOOK_URL as string | undefined

function VipGroupModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    const trimmedPhone = phone.trim()
    if (!trimmedName || trimmedPhone.replace(/\D/g, '').length < 10) {
      setStatus('error')
      return
    }

    setStatus('submitting')

    if (LEADS_WEBHOOK_URL) {
      try {
        // O Apps Script não responde com cabeçalhos CORS, então usamos
        // no-cors: o envio funciona normalmente, só não lemos a resposta.
        await fetch(LEADS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            nome: trimmedName,
            telefone: trimmedPhone,
            origem: 'LP Clube VIP',
            data: new Date().toISOString(),
          }),
        })
      } catch {
        // Segue o fluxo mesmo se a rede falhar: não queremos travar o
        // acesso ao grupo por causa da planilha.
      }
    }

    window.open(VIP_GROUP_URL, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vip-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Fechar" onClick={onClose}>
          ×
        </button>

        <h2 id="vip-modal-title" className="modal-title">
          Quase lá! Só mais um passo
        </h2>
        <p className="modal-subtitle">
          Preencha seus dados para entrar no Clube VIP e ser redirecionado ao grupo no WhatsApp.
        </p>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <label className="modal-field">
            <span>Nome</span>
            <input
              type="text"
              name="nome"
              autoComplete="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="modal-field">
            <span>Telefone / WhatsApp</span>
            <input
              type="tel"
              name="telefone"
              autoComplete="tel"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          {status === 'error' && (
            <p className="modal-error">Preencha nome e telefone válidos para continuar.</p>
          )}

          <button className="cta modal-submit" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Enviando...' : 'Entrar no grupo VIP'}
            <span className="cta-arrow" aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Reveal-on-scroll, feito só com opacity/transform (GPU-friendly) e
  // desligado quando o usuário pede prefers-reduced-motion.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) return

    document.documentElement.classList.add('js-ready')

    const revealEls = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-visible'), (i % 6) * 80)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    revealEls.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* ============ CABEÇALHO: barra sólida de ponta a ponta ============ */}
      <header className="site-header">
        <img className="site-header-logo" src={logo} alt="Oficina das Suculentas" />
      </header>

      {/* ============ TOPO: oferta + CTA principal ============ */}
      <header className="top-banner">
        <div className="top-banner-inner">
          <p className="eyebrow reveal">
            <span className="eyebrow-label">Semana do Cliente</span>
            <span className="eyebrow-dates">15 a 18 de setembro</span>
          </p>

          <h1 className="banner-headline reveal">
            Condição exclusiva para o <span className="accent">Clube VIP</span>
          </h1>

          <p className="banner-sub reveal">
            Quer aproveitar primeiro? Entre agora no nosso Clube VIP.
          </p>

          <button className="cta reveal" type="button" onClick={() => setIsModalOpen(true)}>
            Entrar no grupo VIP
            <span className="cta-arrow" aria-hidden="true">→</span>
          </button>

          <p className="scarcity reveal">
            <span className="scarcity-dot" aria-hidden="true" />
            Vagas limitadas para esta edição
          </p>
        </div>
      </header>

      {/* ============ COMO FUNCIONA ============ */}
      <section className="how-section">
        <div className="how-inner">
          <p className="how-lead reveal">
            Nas edições especiais — como a Semana do Cliente (15 a 18 de setembro) — o Clube VIP
            recebe as condições primeiro, direto no WhatsApp.
          </p>
          <p className="how-kicker reveal">Entenda como funciona</p>

          <div className="steps-grid">
            <div className="step-card reveal">
              <div className="step-icon-panel">
                <span className="step-number" aria-hidden="true">1</span>
                <img src={adrianaPhoto} alt="Adriana Calais, fundadora da Oficina das Suculentas" />
              </div>
              <h3 className="step-title">Entre no grupo VIP</h3>
              <p className="step-desc">Clique no botão e garanta acesso a ofertas e condições exclusivas, direto no WhatsApp.</p>
            </div>

            <div className="step-card reveal">
              <div className="step-icon-panel">
                <span className="step-number" aria-hidden="true">2</span>
                <img src={plantasPhoto} alt="Suculentas coloridas selecionadas para os membros do Clube VIP" />
              </div>
              <h3 className="step-title">Novidades em primeira mão</h3>
              <p className="step-desc">Veja cada nova leva de suculentas antes de todo mundo, assim que chegam na Oficina.</p>
            </div>

            <div className="step-card reveal">
              <div className="step-icon-panel">
                <span className="step-number" aria-hidden="true">3</span>
                <img src={entregaPhoto} alt="Caixas de suculentas embaladas prontas para entrega em todo o Brasil" />
              </div>
              <h3 className="step-title">Entrega para todo o Brasil</h3>
              <p className="step-desc">Suas suculentas favoritas, embaladas com cuidado e enviadas para qualquer cidade do país.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BENEFÍCIOS ============ */}
      <section className="benefits-section">
        <div className="benefits-inner">
          <h2 className="benefits-heading reveal">Como membro do Clube VIP você tem vários benefícios.</h2>

          <div className="benefits-grid">
            <div className="benefit-card reveal">
              <span className="benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3.5 2" />
                </svg>
              </span>
              <span className="benefit-text">
                <p className="benefit-title">Acesso antecipado</p>
                <p className="benefit-desc">Veja e garanta as novidades antes de todo mundo.</p>
              </span>
              <svg className="benefit-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </div>

            <div className="benefit-card reveal">
              <span className="benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41 12 22 2 12l1-8 8-1 9.59 9.59a2 2 0 0 1 0 2.82Z" />
                  <circle cx="8" cy="8" r="1.5" />
                </svg>
              </span>
              <span className="benefit-text">
                <p className="benefit-title">Condições exclusivas</p>
                <p className="benefit-desc">Preços especiais em datas como a Semana do Cliente.</p>
              </span>
              <svg className="benefit-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </div>

            <div className="benefit-card reveal">
              <span className="benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v4M7 5l2 3M17 5l-2 3" />
                  <path d="M5 10h14l-1.2 8.4a2 2 0 0 1-2 1.6H8.2a2 2 0 0 1-2-1.6L5 10Z" />
                </svg>
              </span>
              <span className="benefit-text">
                <p className="benefit-title">Dicas de cultivo</p>
                <p className="benefit-desc">Orientações de cuidado direto da nossa fundaora, Adriana Calais.</p>
              </span>
              <svg className="benefit-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </div>

            <div className="benefit-card reveal">
              <span className="benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span className="benefit-text">
                <p className="benefit-title">Compra segura</p>
                <p className="benefit-desc">Seus dados e pagamento protegidos do pedido até a entrega.</p>
              </span>
              <svg className="benefit-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RODAPÉ: reforço final + CTA ============ */}
      <footer className="site-footer">
        <div className="footer-inner">
          <h2 className="footer-title reveal">Não fique de fora do Clube VIP</h2>

          <button className="cta reveal" type="button" onClick={() => setIsModalOpen(true)}>
            Entrar no grupo VIP
            <span className="cta-arrow" aria-hidden="true">→</span>
          </button>

          <p className="fine-print reveal">
            As ofertas especiais serão liberadas exclusivamente para os membros do Clube VIP.
          </p>
          <p className="brand-tagline">Oficina das Suculentas — cultivo, cuidado e curadoria</p>
        </div>
      </footer>

      {isModalOpen && <VipGroupModal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

export default App
