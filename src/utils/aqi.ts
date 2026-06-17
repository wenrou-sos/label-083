export interface AqiLevel {
  level: string;
  color: string;
  bgColor: string;
  min: number;
  max: number;
}

export const aqiLevels: AqiLevel[] = [
  { level: '优', color: '#00E400', bgColor: 'rgba(0, 228, 0, 0.8)', min: 0, max: 50 },
  { level: '良', color: '#FFFF00', bgColor: 'rgba(255, 255, 0, 0.8)', min: 51, max: 100 },
  { level: '轻度污染', color: '#FF7E00', bgColor: 'rgba(255, 126, 0, 0.8)', min: 101, max: 150 },
  { level: '中度污染', color: '#FF0000', bgColor: 'rgba(255, 0, 0, 0.8)', min: 151, max: 200 },
  { level: '重度污染', color: '#99004C', bgColor: 'rgba(153, 0, 76, 0.8)', min: 201, max: 300 },
  { level: '严重污染', color: '#7E0023', bgColor: 'rgba(126, 0, 35, 0.8)', min: 301, max: 999 },
];

export const getAqiLevel = (aqi: number): AqiLevel => {
  return aqiLevels.find(l => aqi >= l.min && aqi <= l.max) || aqiLevels[5];
};

export const getAqiColor = (aqi: number): string => {
  return getAqiLevel(aqi).color;
};

export const getAqiBgColor = (aqi: number): string => {
  return getAqiLevel(aqi).bgColor;
};

export const getAqiLevelText = (aqi: number): string => {
  return getAqiLevel(aqi).level;
};

export const heatmapGradient = {
  0.0: 'rgba(0, 228, 0, 0.2)',
  0.2: 'rgba(255, 255, 0, 0.3)',
  0.4: 'rgba(255, 126, 0, 0.4)',
  0.6: 'rgba(255, 0, 0, 0.5)',
  0.8: 'rgba(153, 0, 76, 0.6)',
  1.0: 'rgba(126, 0, 35, 0.7)',
};

export const normalizeAqi = (aqi: number): number => {
  return Math.min(1, aqi / 500);
};
