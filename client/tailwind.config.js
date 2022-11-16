/** @type {import('tailwindcss').Config}  */

module.exports = {
    mode: 'jit',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'red-2': '#d0021b',
                'green-2': '#589f39',
                'green-5': 'rgb(241, 248, 238)',
                'green-4': 'rgb(228, 241, 222)',
                'gray-0': 'rgb(119, 119, 119)',
                'gray-5': '#f8f8f8',
            },
            boxShadow: {
                'linear-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
                'linear-sm': '0 1px 4px 0 rgba(0, 0, 0, 0.3)',
                'linear-md': '0 1px 8px 0 rgba(0, 0, 0, 0.3)',
            },
            backgroundColor: {
                'gray-main': '#f4f4f4',
                'gray-2': '#cacaca',
                'gray-5': '#f8f8f8',
                'green-2': '#589f39',
                'green-4': 'rgb(228, 241, 222)',
                'green-5': 'rgb(241, 248, 238)',
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
