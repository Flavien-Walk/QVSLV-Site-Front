import { useNavigate } from 'react-router-dom'

const CATEGORY_META = {
  archives: { icon: '🗂', route: '/archives', badge: 'PUBLIC', badgeClass: 'badge--public' },
  ancient: { icon: '🏛', route: '/dossiers', badge: 'MEMBRES', badgeClass: 'badge--membres' },
  social: { icon: '🧠', route: '/theories', badge: 'MEMBRES', badgeClass: 'badge--membres' },
  tech: { icon: '⚙', route: '/dossiers', badge: 'EXCLUSIF', badgeClass: 'badge--exclusif' },
  consciousness: { icon: '🌀', route: '/theories', badge: 'MEMBRES', badgeClass: 'badge--membres' },
  symbols: { icon: '◈', route: '/ressources', badge: 'PUBLIC', badgeClass: 'badge--public' },
}

const STATIC_CATEGORIES = [
  {
    key: 'archives',
    title: 'Archives Historiques',
    desc: 'Documents officiels déclassifiés, rapports gouvernementaux et sources primaires.',
    count: null,
    lastUpdate: 'Récemment mis à jour',
  },
  {
    key: 'ancient',
    title: 'Civilisations Anciennes',
    desc: 'Textes archéologiques, découvertes controversées et études sur les civilisations disparues.',
    count: null,
    lastUpdate: 'Récemment mis à jour',
  },
  {
    key: 'social',
    title: 'Manipulation Sociale',
    desc: "Analyses comportementales, études de propagande et mécanique de l'influence.",
    count: null,
    lastUpdate: 'Récemment mis à jour',
  },
  {
    key: 'tech',
    title: 'Technologies Oubliées',
    desc: 'Brevets supprimés, recherches abandonnées et innovations non commercialisées.',
    count: null,
    lastUpdate: 'Récemment mis à jour',
  },
  {
    key: 'consciousness',
    title: 'Physique & Conscience',
    desc: 'Recherches en mécanique quantique, études sur la conscience et physique expérimentale.',
    count: null,
    lastUpdate: 'Récemment mis à jour',
  },
  {
    key: 'symbols',
    title: 'Symbolisme',
    desc: 'Sémiologie, systèmes symboliques, iconographie et analyse des signes.',
    count: null,
    lastUpdate: 'Récemment mis à jour',
  },
]

export default function CategoryCard({ category, count }) {
  const navigate = useNavigate()
  const meta = CATEGORY_META[category.key] || CATEGORY_META.archives

  // count = undefined → chargement en cours, number → valeur réelle
  const countLabel = count === undefined
    ? '…'
    : `${count.toLocaleString('fr-FR')} document${count !== 1 ? 's' : ''}`

  return (
    <div className="category-card" onClick={() => navigate(`${meta.route}?category=${category.key}`)}>
      <div className="category-card__header">
        <div className="category-card__icon">{meta.icon}</div>
        <span className={`category-card__badge ${meta.badgeClass}`}>{meta.badge}</span>
      </div>
      <div className="category-card__title">{category.title}</div>
      <div className="category-card__desc">{category.desc}</div>
      <div className="category-card__meta">
        <span className="category-card__meta-count">{countLabel}</span>
      </div>
    </div>
  )
}

export { STATIC_CATEGORIES }
