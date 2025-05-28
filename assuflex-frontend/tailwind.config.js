/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  "./pages/**/*.{ts,tsx}",
	  "./components/**/*.{ts,tsx}",
	  "./app/**/*.{ts,tsx}",
	  "./src/**/*.{ts,tsx}",
	  "*.{js,ts,jsx,tsx,mdx}",
	],
	prefix: "",
	theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		fontFamily: {
    			sans: [
    				'Inter',
    				'sans-serif'
    			],
    			heading: [
    				'Montserrat',
    				'sans-serif'
    			]
    		},
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))',
    				light: 'hsl(var(--primary-light))',
    				dark: 'hsl(var(--primary-dark))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))',
    				light: 'hsl(var(--secondary-light))',
    				dark: 'hsl(var(--secondary-dark))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			assuflex: {
    				primary: '#F26522',
					'button-primary': '#003E8A',
					'button-secondary': '#FF6A00',
    				'primary-light': '#FF8A50',
    				'primary-dark': '#D14E0F',
    				secondary: '#003E7E',
    				'secondary-light': '#0055AB',
    				'secondary-dark': '#002C5C',
    				bg: '#F5F7FA',
    				surface: '#FFFFFF',
    				border: '#E2E8F0',
    				'text-muted': '#64748B',
    				success: '#10B981',
    				error: '#EF4444',
    				warning: '#F59E0B',
    				info: '#3B82F6',
    				text: '#1E293B',
    				'text-secondary': '#94A3B8'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		},
    		fontSize: {
    			xs: '0.75rem',
    			sm: '0.875rem',
    			base: '1rem',
    			lg: '1.125rem',
    			xl: '1.25rem',
    			'2xl': '1.5rem',
    			'3xl': '1.75rem',
    			'4xl': '2.25rem',
    			'5xl': '3rem'
    		},
    		lineHeight: {
    			tight: '1.2',
    			snug: '1.3',
    			normal: '1.4',
    			relaxed: '1.5',
    			loose: '1.6'
    		},
    		letterSpacing: {
    			tight: '-0.02em',
    			normal: '0',
    			wide: '0.01em',
    			wider: '0.02em'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
  }
  