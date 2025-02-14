// app.jsx
import React from "react";
import { createInertiaApp } from "@inertiajs/inertia-react";
import { InertiaProgress } from "@inertiajs/progress";
import { AuthProvider } from "./context/AuthContext";
import { SnackBarProvider } from "./context/SnackBarContext";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./Layout";
import { createRoot } from "react-dom/client"; // Import createRoot

createInertiaApp({
    resolve: (name) => import(`./Pages/${name}`).then((module) => module.default),
    setup({ el, App, props }) {
        const initialPage = JSON.parse(el.dataset.page);

        const root = createRoot(el); // Create a root
        root.render(
            <AuthProvider auth={initialPage.props.auth}>
                <ThemeProvider>
                    <SnackBarProvider>
                        <Layout>
                            <App {...props} />
                        </Layout>
                    </SnackBarProvider>
                </ThemeProvider>
            </AuthProvider>
        );
    },
});

InertiaProgress.init();