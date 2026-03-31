import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
} from "react";
import SnackBar from "../components/ui/SnackBar";
import { SnackBarColor } from "../types/common";


// ✅ Context type
type SnackBarContextType = {
    showSnackBar: (message: string, color?: SnackBarColor, duration?: number) => void;
    hideSnackBar: () => void;
};

// ❗ Default is null → must handle in hook
const SnackBarContext = createContext<SnackBarContextType | null>(null);


export function SnackBarProvider({ children }: { children: ReactNode }) {
    const [snackBar, setSnackBar] = useState<{
        message: string;
        open: boolean;
        color: SnackBarColor;
    }>({
        message: "",
        open: false,
        color: "success",
    });

    // ✅ Timer ref type
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function showSnackBar(
        message: string,
        color: SnackBarColor = "success",
        duration: number = 3000
    ) {
        if (timerRef.current) clearTimeout(timerRef.current);

        setSnackBar({ message, color, open: true });

        timerRef.current = setTimeout(() => {
            setSnackBar((prev) => ({ ...prev, open: false }));
        }, duration);
    }

    function hideSnackBar() {
        if (timerRef.current) clearTimeout(timerRef.current);
        setSnackBar((prev) => ({ ...prev, open: false }));
    }

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

// ✅ Hook
export function useSnackBar(): SnackBarContextType {
    const context = useContext(SnackBarContext);

    if (!context) {
        throw new Error("useSnackBar must be used inside <SnackBarProvider>");
    }

    return context;
}