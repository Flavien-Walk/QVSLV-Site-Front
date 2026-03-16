import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <div className="footer__brand-logo">QVSLV</div>
          <p className="footer__brand-desc">
            Plateforme communautaire d'exploration documentaire. Archives, dossiers déclassifiés, analyses et théories.
          </p>
        </div>
        <div>
          <div className="footer__col-title">Navigation</div>
          <ul className="footer__links">
            <li><Link to="/" className="footer__link">Accueil</Link></li>
            <li><Link to="/dossiers" className="footer__link">Dossiers</Link></li>
            <li><Link to="/archives" className="footer__link">Archives</Link></li>
            <li><Link to="/theories" className="footer__link">Théories</Link></li>
            <li><Link to="/ressources" className="footer__link">Ressources</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer__col-title">Communauté</div>
          <ul className="footer__links">
            <li><Link to="/register" className="footer__link">Rejoindre</Link></li>
            <li><Link to="/login" className="footer__link">Connexion</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer__col-title">Plateforme</div>
          <ul className="footer__links">
            <li><span className="footer__link">À propos</span></li>
            <li><span className="footer__link">Conditions</span></li>
            <li><span className="footer__link">Contact</span></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {year} QVSLV. Tous droits réservés.</span>
        <div className="footer__status">
          <div className="status-dot" />
          <span>Système opérationnel</span>
        </div>
      </div>
    </footer>
  )
}
