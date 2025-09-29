/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'logo': "url('/images/logo.svg')",
        'block-background': "url('/images/block-background.svg')",
        'about-us-image': "url('/images/about-us-image.svg')",
        'barter-logo': "url('/images/barter-logo.svg')",
        'donation-logo': "url('/images/donation-logo.svg')",
        'borrowing-logo': "url('/images/borrowing-logo.svg')",
        'recycle-repair-logo': "url('/images/recycle-repair-logo.svg')",
        'hero-image-1': "url('/images/hero-image-1.svg')",
        'hero-image-2': "url('/images/hero-image-2.svg')",
        'hero-image-3': "url('/images/hero-image-3.svg')",
        'hero-background-1': "url('/images/hero-background-1.svg')",
        'hero-background-2': "url('/images/hero-background-2.svg')",
        'hero-background-3': "url('/images/hero-background-3.svg')",
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        'primary': '#1E3B20', // Evergreen Teal
        'secondary': '#3C7140', // Marigold Orange
        'tertiary': '#007908', // Marigold Orange
        'action': '#3E83C5', // Recycle Blue
        'background': '#F7F6F3', // Linen White
        'text-primary': '#3D4043', // Charcoal Gray
        'text-subtle': '#A9A9A9', // Stone Gray
        'accent': {
          'light': '#EFEFEF', // Light Gray
        },
        'status': {
          'success': '#28a745',
          'info': '#17a2b8',
          'error': '#dc3545',
          'warning': '#ffc107',
        },
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
