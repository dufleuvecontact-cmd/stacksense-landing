import { createContext, useContext, useState, useCallback } from 'react'

const translations = {
  en: {
    nav: {
      features: 'Features',
      product: 'Product',
      timeline: 'Timeline',
      waitlist: 'Waitlist',
      investors: 'Investors',
      joinWaitlist: 'Join Waitlist',
    },
    footer: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      dataRetention: 'Data Retention',
      dataRequests: 'Data Requests',
      contact: 'Contact',
      privacyUrl: '/privacy-policy.html',
      termsUrl: '/terms-of-service.html',
      dataRetentionUrl: '/data-retention-policy.html',
    },
    waitlist: {
      consent: "I agree to StackSense collecting my email for waitlist purposes and product updates. See our",
      consentLinkText: 'Privacy Policy',
    },
    legal: {
      comingSoon: 'Version française à venir.',
      backToEnglish: 'Back to English version',
    },
    lang: {
      switchToFr: 'Switch to French',
      switchToEn: 'Switch to English',
    },
  },
  fr: {
    nav: {
      features: 'Fonctionnalités',
      product: 'Produit',
      timeline: 'Chronologie',
      waitlist: "Liste d'attente",
      investors: 'Investisseurs',
      joinWaitlist: "Rejoindre la liste",
    },
    footer: {
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
      dataRetention: 'Conservation des données',
      dataRequests: 'Demandes de données',
      contact: 'Contact',
      privacyUrl: '/fr/politique-confidentialite.html',
      termsUrl: '/fr/conditions-utilisation.html',
      dataRetentionUrl: '/data-retention-policy.html',
    },
    waitlist: {
      consent: "J'accepte que StackSense collecte mon courriel aux fins de liste d'attente et d'actualités produit. Voir notre",
      consentLinkText: 'Politique de confidentialité',
    },
    legal: {
      comingSoon: 'Version française à venir.',
      backToEnglish: 'Retour à la version anglaise',
    },
    lang: {
      switchToFr: 'Passer au français',
      switchToEn: 'Switch to English',
    },
  },
}

function detectInitialLocale() {
  const stored = localStorage.getItem('stacksense_locale')
  if (stored === 'en' || stored === 'fr') return stored
  const browser = navigator.language?.slice(0, 2).toLowerCase()
  return browser === 'fr' ? 'fr' : 'en'
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(detectInitialLocale)

  const setLocale = useCallback((lang) => {
    localStorage.setItem('stacksense_locale', lang)
    setLocaleState(lang)
  }, [])

  const t = useCallback((path) => {
    const keys = path.split('.')
    let val = translations[locale]
    for (const k of keys) val = val?.[k]
    return val ?? path
  }, [locale])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
