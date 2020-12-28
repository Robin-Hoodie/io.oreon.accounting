export const inDevelopment = (): boolean => process.env?.NODE_ENV === "development";
export const inProduction = (): boolean => process.env?.NODE_ENV === "production";
