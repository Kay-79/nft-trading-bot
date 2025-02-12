// src/config/theme.ts
export interface ThemeConfig {
    mode: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
}

export const lightTheme: ThemeConfig = {
    mode: "light",
    primaryColor: "#007bff",
    secondaryColor: "#6c757d",
    backgroundColor: "#f8f9fa",
    textColor: "#212529"
};

export const darkTheme: ThemeConfig = {
    mode: "dark",
    primaryColor: "#00a3ff",
    secondaryColor: "#a7b1b8",
    backgroundColor: "#212529",
    textColor: "#f8f9fa"
};

export const themes = {
    light: lightTheme,
    dark: darkTheme
};
