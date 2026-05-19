import Link from "next/link";

/* ============================================================
   SmartBudol — Landing Page
   Structure: original 60-line (Login / Register / 3 feature cards)
   Design:    500-line design system (DM Sans, emerald tokens,
              frosted navbar, light surfaces, pill CTAs, etc.)
   ============================================================ */

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');

        :root {
          --bg:            #F9FAFB;
          --surface:       #FFFFFF;
          --border:        #E5E7EB;
          --emerald:       #16a34a;
          --emerald-dark:  #166534;
          --emerald-light: #f0fdf4;
          --emerald-ring:  rgba(22,163,74,.12);
          --text-1:        #111827;
          --text-2:        #374151;
          --text-3:        #6B7280;
          --text-4:        #9CA3AF;
          --r-pill:        999px;
          --r-card:        16px;
          --shadow-sm:     0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.05);
          --shadow-md:     0 4px 20px rgba(0,0,0,.08);
          --shadow-lg:     0 8px 32px rgba(0,0,0,.12);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text-1);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* Navbar */
        .lp-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255,255,255,.9);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
          height: 58px; padding: 0 clamp(16px, 4vw, 56px);
          display: flex; align-items: center; justify-content: space-between;
        }
        .lp-logo {
          font-size: 18px; font-weight: 800; color: var(--emerald-dark);
          letter-spacing: -.03em; text-decoration: none;
        }
        .lp-nav-links { display: flex; gap: 24px; list-style: none; align-items: center; }
        .lp-nav-links a {
          font-size: 14px; font-weight: 500; color: var(--text-3);
          text-decoration: none; transition: color .18s;
        }
        .lp-nav-links a:hover { color: var(--text-1); }
        .lp-nav-login {
          font-size: 14px; font-weight: 600; color: var(--emerald-dark) !important;
          padding: 7px 18px; border-radius: var(--r-pill);
          border: 1.5px solid var(--emerald-dark);
          transition: background .18s, color .18s !important;
        }
        .lp-nav-login:hover { background: var(--emerald-dark); color: #fff !important; }

        /* Hero */
        .hero {
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          padding: clamp(64px, 10vw, 104px) clamp(16px, 4vw, 40px) clamp(48px, 7vw, 80px);
          gap: 20px;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600; letter-spacing: .08em;
          text-transform: uppercase; color: var(--emerald);
          background: var(--emerald-light); padding: 5px 14px;
          border-radius: var(--r-pill); border: 1px solid #bbf7d0;
        }
        .hero-pulse {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--emerald); flex-shrink: 0;
        }
        .hero-h1 {
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 800; letter-spacing: -.04em; line-height: 1.05;
          color: var(--text-1); max-width: 700px;
        }
        .hero-h1 span {
          background: linear-gradient(135deg, var(--emerald) 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: clamp(16px, 2vw, 19px);
          color: var(--text-3); max-width: 480px; line-height: 1.65;
        }

        /* CTA buttons */
        .cta-group {
          display: flex; gap: 12px; flex-wrap: wrap;
          justify-content: center; margin-top: 8px;
        }
        .cta-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: var(--r-pill);
          background: var(--emerald-dark); color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600; text-decoration: none;
          transition: background .18s, transform .15s, box-shadow .18s;
          box-shadow: 0 4px 14px rgba(22,101,52,.25);
        }
        .cta-primary:hover {
          background: #14532d; transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(22,101,52,.35);
        }
        .cta-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: var(--r-pill);
          background: transparent; color: var(--emerald-dark);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600; text-decoration: none;
          border: 1.5px solid var(--emerald-dark);
          transition: background .18s, transform .15s;
        }
        .cta-secondary:hover {
          background: var(--emerald-light); transform: translateY(-2px);
        }

        /* Trust strip */
        .trust-strip {
          display: flex; align-items: center; gap: 20px;
          flex-wrap: wrap; justify-content: center;
          padding: 0 clamp(16px, 4vw, 40px) clamp(40px, 6vw, 64px);
        }
        .trust-item {
          display: flex; align-items: center; gap: 7px;
          font-size: 13px; color: var(--text-3); font-weight: 500;
        }
        .trust-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--emerald); }
        .trust-sep { width: 1px; height: 16px; background: var(--border); }

        /* Feature cards */
        .features {
          max-width: 900px; margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 40px) clamp(64px, 10vw, 96px);
        }
        .features-eyebrow {
          text-align: center; font-size: 12px; font-weight: 600;
          letter-spacing: .08em; text-transform: uppercase;
          color: var(--emerald); margin-bottom: 12px;
        }
        .features-h2 {
          text-align: center;
          font-size: clamp(22px, 3.5vw, 34px); font-weight: 800;
          letter-spacing: -.03em; color: var(--text-1); margin-bottom: 40px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px;
        }
        .feat-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--r-card); padding: 28px 26px;
          display: flex; flex-direction: column; gap: 14px;
          transition: box-shadow .2s, transform .2s, border-color .2s;
        }
        .feat-card:hover {
          box-shadow: var(--shadow-lg); transform: translateY(-4px);
          border-color: #d1fae5;
        }
        .feat-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: var(--emerald-light);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }
        .feat-title { font-size: 16px; font-weight: 700; color: var(--text-1); letter-spacing: -.01em; }
        .feat-desc  { font-size: 14px; color: var(--text-3); line-height: 1.6; }

        /* Bottom CTA banner */
        .cta-banner {
          margin: 0 clamp(16px, 4vw, 48px) clamp(48px, 7vw, 80px);
          background: linear-gradient(135deg, var(--emerald-dark) 0%, #059669 100%);
          border-radius: 20px;
          padding: clamp(36px, 6vw, 56px) clamp(24px, 4vw, 56px);
          display: flex; flex-direction: column;
          align-items: center; text-align: center; gap: 20px;
        }
        .cta-banner h2 {
          font-size: clamp(22px, 3.5vw, 36px); font-weight: 800;
          letter-spacing: -.03em; color: #fff; max-width: 500px; line-height: 1.15;
        }
        .cta-banner p {
          font-size: 16px; color: rgba(255,255,255,.75);
          max-width: 380px; line-height: 1.6;
        }
        .cta-banner-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: var(--r-pill);
          background: #fff; color: var(--emerald-dark);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700; text-decoration: none;
          transition: transform .18s, box-shadow .18s;
          box-shadow: 0 4px 16px rgba(0,0,0,.15);
        }
        .cta-banner-btn:hover {
          transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.2);
        }

        /* Footer */
        .lp-footer {
          border-top: 1px solid var(--border);
          padding: 20px clamp(16px, 4vw, 56px);
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 10px;
        }
        .lp-footer-brand { font-size: 15px; font-weight: 800; color: var(--emerald-dark); letter-spacing: -.02em; }
        .lp-footer-copy  { font-size: 12px; color: var(--text-4); margin-top: 2px; }
        .lp-footer-links { display: flex; gap: 20px; list-style: none; }
        .lp-footer-links a { font-size: 13px; color: var(--text-3); text-decoration: none; transition: color .18s; }
        .lp-footer-links a:hover { color: var(--text-1); }

        /* Responsive */
        @media (max-width: 640px) {
          .lp-nav-links { display: none; }
          .trust-sep    { display: none; }
          .lp-footer    { flex-direction: column; text-align: center; }
          .lp-footer-links { justify-content: center; flex-wrap: wrap; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <a href="/" className="lp-logo">SmartBudol</a>
        <ul className="lp-nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#">Platforms</a></li>
          <li><a href="/login" className="lp-nav-login">Log In</a></li>
        </ul>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section className="hero">
          <span className="hero-eyebrow">
            <span className="hero-pulse" />
            Free · PH platforms · No sign-up needed
          </span>

          {/* Original headline, gradient on the key phrase */}
          <h1 className="hero-h1">
            Smart<br />
            <span>Budol</span>
          </h1>

          {/* Original subline */}
          <p className="hero-sub">
            Find the best deals across multiple platforms. Search, compare, and
            save — all in one place.
          </p>

          {/* Original CTAs */}
          <div className="cta-group">
            <Link href="/login" className="cta-primary">
              Log In
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/register" className="cta-secondary">
              Create Account
            </Link>
          </div>
        </section>

        {/* ── Trust strip ── */}
        <div className="trust-strip">
          {['No credit card required', 'Lazada & Shopee covered', '2M+ products indexed', 'Updated in real-time']
            .map((item, i, arr) => (
              <span key={item} style={{ display: 'contents' }}>
                <span className="trust-item"><span className="trust-dot" />{item}</span>
                {i < arr.length - 1 && <span className="trust-sep" />}
              </span>
            ))}
        </div>

        {/* ── Feature cards — original 3, styled up ── */}
        <section className="features" id="features">
          <p className="features-eyebrow">Why SmartBudol</p>
          <h2 className="features-h2">Everything you need to shop smarter</h2>
          <div className="features-grid">
            <div className="feat-card">
              <div className="feat-icon">🔍</div>
              <h3 className="feat-title">Smart Search</h3>
              <p className="feat-desc">Search products across multiple e-commerce platforms at once.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">⚖️</div>
              <h3 className="feat-title">Compare Prices</h3>
              <p className="feat-desc">Side-by-side comparison to find the best value for your money.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon">💰</div>
              <h3 className="feat-title">Save More</h3>
              <p className="feat-desc">Get notified about price drops and never miss a deal.</p>
            </div>
          </div>
        </section>

        {/* ── Bottom CTA banner ── */}
        <div className="cta-banner">
          <h2>Ready to start saving?</h2>
          <p>Create a free account and start comparing prices across Lazada, Shopee, and more in seconds.</p>
          <Link href="/register" className="cta-banner-btn">
            Create Free Account
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div>
          <div className="lp-footer-brand">SmartBudol</div>
          <div className="lp-footer-copy">© 2024 SmartBudol. Finding the best value for savvy shoppers.</div>
        </div>
        <ul className="lp-footer-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </footer>
    </>
  );
}
