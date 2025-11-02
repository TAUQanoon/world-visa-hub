// Export theme variables for Builder.io to consume
export const builderTheme = {
  colors: {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    muted: 'hsl(var(--muted))',
    border: 'hsl(var(--border))',
  },
  fonts: {
    heading: 'var(--font-heading, system-ui, sans-serif)',
    body: 'var(--font-sans, system-ui, sans-serif)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
  },
};

// Generate CSS custom properties for Builder.io
export const getBuilderThemeCSS = () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  return {
    '--theme-primary': computedStyle.getPropertyValue('--primary'),
    '--theme-secondary': computedStyle.getPropertyValue('--secondary'),
    '--theme-accent': computedStyle.getPropertyValue('--accent'),
    '--theme-background': computedStyle.getPropertyValue('--background'),
    '--theme-foreground': computedStyle.getPropertyValue('--foreground'),
  };
};
