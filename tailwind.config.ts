/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wakeel design system
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        accent: 'var(--color-accent)',
        'accent-muted': 'var(--color-accent-muted)',
        'accent-foreground': 'var(--color-accent-foreground)',
        success: 'var(--color-success)',
        'success-muted': 'var(--color-success-muted)',
        caution: 'var(--color-caution)',
        'caution-muted': 'var(--color-caution-muted)',
        danger: 'var(--color-danger)',
        'danger-muted': 'var(--color-danger-muted)',
        border: 'var(--color-border)',
        // Semantic extras
        verified: '#059669',
        unverified: '#D97706',
        emergency: '#DC2626',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
      },
      fontSize: {
        // Responsive using clamp — reference via CSS custom props
        'hero': 'var(--text-hero)',
        'display': 'var(--text-display)',
        'h1': 'var(--text-h1)',
        'h2': 'var(--text-h2)',
        'h3': 'var(--text-h3)',
        'body-lg': 'var(--text-body-lg)',
        'body': 'var(--text-body)',
        'body-sm': 'var(--text-body-sm)',
        'caption': 'var(--text-caption)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'modal': '0 20px 60px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

