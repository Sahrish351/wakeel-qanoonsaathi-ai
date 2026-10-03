// =============================================================
// WAKEEL — Language Context
// Supports English, Urdu (script), and Roman Urdu.
// =============================================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { AppLanguage } from '@/types';

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ─── TRANSLATIONS ─────────────────────────────────────────────
// Minimal set for Phase 1 — expanded as pages are built
const translations: Record<AppLanguage, Record<string, string>> = {
  en: {
    'app.name': 'Wakeel',
    'app.tagline': 'Your AI Legal Guide',
    'app.slogan': 'When you don\'t know your rights, know your next step.',
    'nav.home': 'Home',
    'nav.cases': 'My Cases',
    'nav.ai': 'Wakeel AI',
    'nav.resources': 'Resources',
    'nav.profile': 'Profile',
    'nav.lawyers': 'Find a Lawyer',
    'nav.admin': 'Admin',
    'auth.login': 'Sign In',
    'auth.register': 'Create Account',
    'auth.logout': 'Sign Out',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.forgot': 'Forgot password?',
    'auth.no_account': 'Don\'t have an account?',
    'auth.have_account': 'Already have an account?',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Try again',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.submit': 'Submit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.skip': 'Skip for now',
    'common.done': 'Done',
    'common.verified': 'Verified',
    'common.demo': 'Demo / Synthetic',
    'disclaimer.short': 'Wakeel provides legal information and decision support — not legal advice. It is not a lawyer or law firm.',
    'disclaimer.full': 'Wakeel provides general legal information and decision support. It is not a law firm, does not create an attorney-client relationship, and does not replace advice from a licensed lawyer. Laws and procedures can vary by jurisdiction and change over time. For urgent or high-risk situations, seek appropriate human, legal, or emergency assistance.',
    'safety.emergency': 'Emergency',
    'safety.police': 'Police Emergency',
    'safety.rescue': 'Rescue',
    'safety.humanrights': 'Human Rights Helpline',
    'safety.cybercrime': 'Cybercrime Helpline',
    'safety.quick_exit': 'Quick Exit',
    'urgency.emergency': 'Emergency',
    'urgency.high': 'High Risk',
    'urgency.moderate': 'Moderate',
    'urgency.routine': 'Routine',
    'urgency.unknown': 'Assessing...',
    'confidence.high': 'High confidence',
    'confidence.medium': 'Medium confidence',
    'confidence.low': 'Low confidence — verify with a lawyer',
  },
  ur: {
    'app.name': 'وکیل',
    'app.tagline': 'آپ کا AI قانونی رہنما',
    'app.slogan': 'جب آپ اپنے حقوق نہیں جانتے، اپنا اگلا قدم جانیں۔',
    'nav.home': 'گھر',
    'nav.cases': 'میرے مقدمات',
    'nav.ai': 'وکیل AI',
    'nav.resources': 'وسائل',
    'nav.profile': 'پروفائل',
    'nav.lawyers': 'وکیل تلاش کریں',
    'auth.login': 'لاگ ان',
    'auth.register': 'اکاؤنٹ بنائیں',
    'auth.logout': 'لاگ آؤٹ',
    'auth.email': 'ای میل',
    'auth.password': 'پاس ورڈ',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.error': 'کچھ غلط ہوا',
    'common.retry': 'دوبارہ کوشش کریں',
    'common.save': 'محفوظ کریں',
    'common.cancel': 'منسوخ',
    'disclaimer.short': 'وکیل قانونی معلومات فراہم کرتا ہے — قانونی مشورہ نہیں۔ یہ کوئی وکیل یا قانونی فرم نہیں ہے۔',
    'safety.emergency': 'ہنگامی صورتحال',
    'safety.police': 'پولیس ہنگامی',
    'safety.rescue': 'ریسکیو',
  },
  roman_ur: {
    'app.name': 'Wakeel',
    'app.tagline': 'Aapka AI Qanooni Rehnuma',
    'app.slogan': 'Jab aap apne haqooq nahi jaante, apna agla qadam jaanein.',
    'nav.home': 'Ghar',
    'nav.cases': 'Mere Muqadme',
    'nav.ai': 'Wakeel AI',
    'nav.resources': 'Wasail',
    'nav.profile': 'Profile',
    'nav.lawyers': 'Wakeel Talash Karen',
    'auth.login': 'Login',
    'auth.register': 'Account Banaein',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'common.loading': 'Load ho raha hai...',
    'common.error': 'Kuch ghalat hua',
    'common.retry': 'Dobara koshish karein',
    'common.save': 'Mehfooz karein',
    'common.cancel': 'Mansookh',
    'disclaimer.short': 'Wakeel qanooni maloomat faraham karta hai — qanooni mashwara nahi. Yeh koi wakeel ya qanooni firm nahi hai.',
    'safety.emergency': 'Hungeemi Soorat-e-Haal',
    'safety.police': 'Police Emergency',
    'safety.rescue': 'Rescue',
  },
};

// ─── PROVIDER ────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    // Restore from localStorage if set previously
    const stored = localStorage.getItem('wakeel-language') as AppLanguage | null;
    return stored ?? 'en';
  });

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('wakeel-language', lang);
    // Update HTML dir attribute for RTL (Urdu script)
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === 'ur' ? 'ur' : lang === 'roman_ur' ? 'ur-Latn' : 'en';
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] ?? translations['en'][key] ?? key;
  }, [language]);

  const isRTL = language === 'ur';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── HOOK ────────────────────────────────────────────────────
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

