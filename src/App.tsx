import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import logo from './assets/logo.png'
import adrianaPhoto from './assets/adriana-feature.jpeg'
import heroPhoto from './assets/hero-suculentas.jpg'
import plantasPhoto from './assets/step-plantas.jpeg'

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
            origem: 'LP Pré Black Friday',
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

      {/* ============ TOPO: Pré Black Friday + CTA principal ============ */}
      <header className="top-banner">
        <img className="bf-hero-bg" src={heroPhoto} alt="" aria-hidden="true" />
        <div className="top-banner-inner">
          <p className="bf-dates reveal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="15" rx="2" />
              <path d="M3.5 10h17M8 3v4M16 3v4" />
            </svg>
            De 30/10 a 02/11
          </p>

          <h1 className="bf-title reveal">
            <span className="bf-title-pre">Pré</span>
            <span className="bf-title-main">Black Friday</span>
          </h1>

          <p className="bf-discount reveal">
            <span className="bf-discount-label">Descontos de até</span>
            <span className="bf-discount-value">75%</span>
            <span className="bf-discount-off">OFF</span>
          </p>

          <p className="banner-sub reveal">
            Faça parte do nosso Clube VIP no WhatsApp e receba todas as informações, ofertas e novidades em
            primeira mão.
          </p>

          <button className="cta reveal" type="button" onClick={() => setIsModalOpen(true)}>
            Quero entrar no Clube VIP
            <span className="cta-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      {/* ============ FAIXA ANIMADA: reforço da Black Friday ============ */}
      <div className="bf-ticker" aria-hidden="true">
        <div className="bf-ticker-track">
          <div className="bf-ticker-group"><span>Pré Black Friday</span><span>Até 75% OFF</span><span>30/10 a 02/11</span><span>Clube VIP no WhatsApp</span></div>
          <div className="bf-ticker-group"><span>Pré Black Friday</span><span>Até 75% OFF</span><span>30/10 a 02/11</span><span>Clube VIP no WhatsApp</span></div>
        </div>
      </div>

      {/* ============ COMO FUNCIONA ============ */}
      <section className="how-section">
        <div className="how-inner">
          <p className="how-lead reveal">
            Na Pré Black Friday — de 30/10 a 02/11 — o Clube VIP recebe todas as ofertas primeiro, direto no WhatsApp.
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
                <p className="benefit-desc">Descontos de até 75% OFF na Pré Black Friday.</p>
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
                <p className="benefit-desc">Seus dados e seu pagamento sempre protegidos.</p>
              </span>
              <svg className="benefit-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RODAPÉ: reforço final + CTA ============ */}
      <footer className="site-footer">
        <div className="footer-inner">
          <h2 className="footer-title reveal">Não fique de fora da <span className="accent">Pré Black Friday</span></h2>
          <p className="footer-sub reveal">As melhores oportunidades esperam por você!</p>

          <button className="cta reveal" type="button" onClick={() => setIsModalOpen(true)}>
            Quero entrar no Clube VIP
            <span className="cta-arrow" aria-hidden="true">→</span>
          </button>

          <p className="fine-print reveal">
            De 30/10 a 02/11, com descontos de até 75% OFF. As ofertas serão liberadas exclusivamente para os membros do Clube VIP.
          </p>
          <p className="brand-tagline">Oficina das Suculentas — cultivo, cuidado e curadoria</p>
        </div>
      </footer>

      {isModalOpen && <VipGroupModal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

export default App
