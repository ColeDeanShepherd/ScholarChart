export const googleAnalyticsMeasurementId = 'G-YMTRZJ6K28';

export function isDevEnv() {
  return import.meta.env.DEV;
}

export function isProdEnv() {
  return import.meta.env.PROD;
}

export function getOpenAIKey() {
  return import.meta.env.VITE_OPENAI_API_KEY;
}