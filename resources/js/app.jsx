import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { route } from 'ziggy-js'
import AppLayout from './Layouts/AppLayout'

window.route = route

const pages = import.meta.glob('./Pages/**/*.jsx')
console.log("test test")

createInertiaApp({
    resolve: async name => {
        console.log(`Resolving page: ${name}`)
        const page = pages[`./Pages/${name}.jsx`]
        if (!page) throw new Error(`Unknown page: ${name}`)

        const module = await page()
        const Page = module.default

        // ✅ Every page gets AppLayout by default
        Page.layout ??= (page) => <AppLayout>{page}</AppLayout>

        return Page
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})