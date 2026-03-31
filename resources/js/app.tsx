import React from 'react'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { route } from 'ziggy-js'
import AppLayout from './Layouts/AppLayout' // ✅ remove .jsx if renamed

// ✅ Global route typing
declare global {
    interface Window {
        route: typeof route
    }
}

window.route = route

// ✅ Page type
type InertiaPage = React.ComponentType & {
    layout?: (page: React.ReactNode) => React.ReactNode
}

// ✅ Module type
type PageModule = {
    default: InertiaPage
}

// ✅ Support both tsx + jsx
const pages = import.meta.glob<PageModule>('./Pages/**/*.{tsx,jsx}')

createInertiaApp({
    resolve: async (name: string) => {
        const path = `./Pages/${name}.tsx`
        const fallbackPath = `./Pages/${name}.jsx`

        const importer = pages[path] || pages[fallbackPath]

        if (!importer) {
            throw new Error(`Unknown page: ${name}`)
        }

        const module = await importer()
        const Page = module.default

        // ✅ Default layout
        Page.layout ??= (page: React.ReactNode) => (
            <AppLayout>{page}</AppLayout>
        )

        return Page
    },

    setup({ el, App, props }) {
        createRoot(el!).render(<App {...props} />)
    },
})