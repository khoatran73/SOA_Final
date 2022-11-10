/** @type {import('tailwindcss').Config}  */

module.exports = {
    mode: 'jit',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {},
            boxShadow: {
                'linear-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
                'linear-sm': '0 1px 4px 0 rgba(0, 0, 0, 0.3)',
                'linear-md': '0 1px 8px 0 rgba(0, 0, 0, 0.3)',
            },
            backgroundColor: {
                'gray-main': '#f4f4f4',
            },
        },
    },
    variants: {
        extend: {
            textColor: ['responsive', 'hover', 'focus', 'group-hover'],
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        // function ({ addVariant }) {
        // addVariant('child', '& > *');
        // addVariant('child-hover', '& > *:hover');
        // addVariant('child-span-hover', '& > span:hover');
        // },
    ],
};
