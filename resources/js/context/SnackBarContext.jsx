import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const SnackBarContext = createContext(null);

const COLORS = {
    success: {
        bg: "#22c55e",
        icon: "✓",
    },
    error: {
        bg: "#ef4444",
        icon: "✕",
    },
    warning: {
        bg: "#f59e0b",
        icon: "⚠",
    },
    info: {
        bg: "#3b82f6",
        icon: "ℹ",
    },
};

function SnackBar({ message, open, color = "success", onClose }) {
    const config = COLORS[color] ?? COLORS.success;

    return (
        <>
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(110%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0%);
                        opacity: 1;
                    }
                }

                @keyframes slideOut {
                    from {
                        transform: translateX(0%);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(110%);
                        opacity: 0;
                    }
                }

                @keyframes progress {
                    from { width: 100%; }
                    to   { width: 0%;   }
                }

                .snackbar-enter {
                    animation: slideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
                }

                .snackbar-exit {
                    animation: slideOut 0.3s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
                }
            `}</style>

            {/* Only mount when open so exit animation can play via key trick below */}
            <div
                className={open ? "snackbar-enter" : "snackbar-exit"}
                style={{
                    position:     "fixed",
                    bottom:       "24px",
                    right:        "24px",
                    zIndex:       9999,
                    minWidth:     "280px",
                    maxWidth:     "380px",
                    borderRadius: "12px",
                    overflow:     "hidden",
                    boxShadow:    "0 8px 24px rgba(0,0,0,0.18)",
                    background:   "#1e1e2e",
                    display:      "flex",
                    flexDirection:"column",
                }}
            >
                {/* Main row */}
                <div style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "12px",
                    padding:    "14px 16px",
                }}>
                    {/* Icon bubble */}
                    <div style={{
                        width:          "32px",
                        height:         "32px",
                        borderRadius:   "50%",
                        background:     config.bg,
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        fontSize:       "15px",
                        color:          "#fff",
                        flexShrink:     0,
                        fontWeight:     "bold",
                    }}>
                        {config.icon}
                    </div>

                    {/* Message */}
                    <span style={{
                        color:      "#f1f5f9",
                        fontSize:   "14px",
                        fontWeight: "500",
                        flex:        1,
                        lineHeight: "1.4",
                    }}>
                        {message}
                    </span>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            background:  "transparent",
                            border:      "none",
                            color:       "#94a3b8",
                            cursor:      "pointer",
                            fontSize:    "18px",
                            padding:     "0",
                            lineHeight:  "1",
                            flexShrink:  0,
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Progress bar — only animate when open */}
                {open && (
                    <div style={{
                        height:     "3px",
                        background: "#2e2e3e",
                    }}>
                        <div style={{
                            height:          "3px",
                            background:      config.bg,
                            animation:       "progress 3s linear forwards",
                        }} />
                    </div>
                )}
            </div>
        </>
    );
}

export function SnackBarProvider({ children }) {
    const [snackBar, setSnackBar] = useState({
        message: "",
        open:    false,
        color:   "success",
    });

    const timerRef = useRef(null);

    // showSnackBar — the only method consumers need
    function showSnackBar(message, color = "success", duration = 3000) {
        // Clear any existing timer so back-to-back calls work correctly
        if (timerRef.current) clearTimeout(timerRef.current);

        setSnackBar({ message, color, open: true });

        timerRef.current = setTimeout(() => {
            setSnackBar(prev => ({ ...prev, open: false }));
        }, duration);
    }

    function hideSnackBar() {
        if (timerRef.current) clearTimeout(timerRef.current);
        setSnackBar(prev => ({ ...prev, open: false }));
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <SnackBarContext.Provider value={{ showSnackBar, hideSnackBar }}>
            {children}

            <SnackBar
                message={snackBar.message}
                open={snackBar.open}
                color={snackBar.color}
                onClose={hideSnackBar}
            />
        </SnackBarContext.Provider>
    );
}

export function useSnackBar() {
    const context = useContext(SnackBarContext);
    if (!context) {
        throw new Error("useSnackBar must be used inside <SnackBarProvider>");
    }
    return context;
}