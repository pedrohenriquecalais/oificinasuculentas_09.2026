import { useEffect } from 'react'
import './App.css'
import logo from './assets/logo.png'
import adrianaPhoto from './assets/adriana-feature.jpeg'
import plantasPhoto from './assets/step-plantas.jpeg'
import entregaPhoto from './assets/step-entrega.jpeg'

const VIP_GROUP_URL =
  'https://chat.whatsapp.com/BRszbr7S4lELIRbj09Y1FS?s=cl&p=i&mlu=4&ilr=4'

function App() {
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
          <p className="eyebrow reveal">Semana do Consumidor</p>

          <h1 className="banner-headline reveal">
            Condição exclusiva para o <span className="accent">Clube VIP</span>
          </h1>

          <p className="banner-sub reveal">
            Quer aproveitar primeiro? Entre agora no nosso Clube VIP.
          </p>

          <a className="cta reveal" href={VIP_GROUP_URL} target="_blank" rel="noopener noreferrer">
            Entrar no grupo VIP
            <span className="cta-arrow" aria-hidden="true">→</span>
          </a>

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
            Nas edições especiais — como a Semana do Consumidor — o Clube VIP recebe as condições
            primeiro, direto no WhatsApp.
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
                <p className="benefit-desc">Preços especiais em datas como a Semana do Consumidor.</p>
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
                  <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  <path d="m3 3 18 18" />
                </svg>
              </span>
              <span className="benefit-text">
                <p className="benefit-title">Zero spam</p>
                <p className="benefit-desc">Só avisos que realmente importam, sem enrolação.</p>
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

          <a className="cta reveal" href={VIP_GROUP_URL} target="_blank" rel="noopener noreferrer">
            Entrar no grupo VIP
            <span className="cta-arrow" aria-hidden="true">→</span>
          </a>

          <p className="fine-print reveal">
            As ofertas especiais serão liberadas exclusivamente para os membros do Clube VIP.
          </p>
          <p className="brand-tagline">Oficina das Suculentas — cultivo, cuidado e curadoria</p>
        </div>
      </footer>
    </>
  )
}

export default App
