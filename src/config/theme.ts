// src/config/theme.ts
export interface ThemeConfig {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
}

export const lightTheme: ThemeConfig = {
    primaryColor: "#007bff",
    secondaryColor: "#6c757d",
    backgroundColor: "#f8f9fa",
    textColor: "#212529"
};

export const darkTheme: ThemeConfig = {
    primaryColor: "#00a3ff",
    secondaryColor: "#a7b1b8",
    backgroundColor: "#212529",
    textColor: "#f8f9fa"
};

export const themes = {
    light: lightTheme,
    dark: darkTheme
};
