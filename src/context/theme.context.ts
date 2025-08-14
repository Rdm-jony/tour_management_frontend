import type { ThemeProviderState } from "@/providers/theme.provider";
import { createContext } from "react";

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)
