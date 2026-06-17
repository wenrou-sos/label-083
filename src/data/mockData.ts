export interface StationData {
  id: string;
  name: string;
  type: 'national' | 'provincial';
  lat: number;
  lng: number;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  updateTime: string;
  trend24h: {
    time: string[];
    pm25: number[];
    pm10: number[];
    o3: number[];
    no2: number[];
    so2: number[];
    co: number[];
  };
  history7d: {
    date: string;
    aqi: number;
  }[];
}

export interface MicroStationData {
  id: string;
  lat: number;
  lng: number;
  aqi: number;
  street: string;
}

export interface ForecastData {
  date: string;
  weekday: string;
  aqi: number;
  level: string;
  primaryPollutant: string;
  temperature: string;
  weather: string;
  wind: string;
}

export interface HistoryStats {
  totalDays: number;
  excellentDays: number;
  goodDays: number;
  pollutedDays: number;
  excellentRate: number;
  primaryPollutants: {
    name: string;
    days: number;
    rate: number;
  }[];
}

const cityCenter = { lat: 39.9042, lng: 116.4074 };

const generateTrend24h = () => {
  const times = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    times.push(`${t.getHours().toString().padStart(2, '0')}:00`);
  }

  const generateValues = (base: number, variance: number) => {
    return Array.from({ length: 24 }, () =>
      Math.max(0, Math.round(base + (Math.random() - 0.5) * variance))
    );
  };

  return {
    time: times,
    pm25: generateValues(35, 30),
    pm10: generateValues(65, 40),
    o3: generateValues(80, 50),
    no2: generateValues(40, 25),
    so2: generateValues(12, 8),
    co: generateValues(0.8, 0.5),
  };
};

const generateHistory7d = (baseAqi: number) => {
  const history = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    const variance = baseAqi * 0.4;
    const aqi = Math.max(10, Math.round(baseAqi + (Math.random() - 0.5) * variance));
    history.push({ date: dateStr, aqi });
  }
  return history;
};

export const stations: StationData[] = [
  {
    id: '1001',
    name: '朝阳区农展馆',
    type: 'national',
    lat: cityCenter.lat + 0.012,
    lng: cityCenter.lng + 0.025,
    aqi: 72,
    pm25: 52,
    pm10: 89,
    o3: 124,
    no2: 56,
    so2: 18,
    co: 0.9,
    updateTime: new Date().toLocaleString('zh-CN'),
    trend24h: generateTrend24h(),
    history7d: generateHistory7d(72),
  },
  {
    id: '1002',
    name: '海淀区万柳',
    type: 'national',
    lat: cityCenter.lat + 0.008,
    lng: cityCenter.lng - 0.03,
    aqi: 45,
    pm25: 28,
    pm10: 52,
    o3: 76,
    no2: 32,
    so2: 8,
    co: 0.6,
    updateTime: new Date().toLocaleString('zh-CN'),
    trend24h: generateTrend24h(),
    history7d: generateHistory7d(45),
  },
  {
    id: '1003',
    name: '东城区东四',
    type: 'national',
    lat: cityCenter.lat + 0.015,
    lng: cityCenter.lng + 0.008,
    aqi: 98,
    pm25: 73,
    pm10: 112,
    o3: 145,
    no2: 78,
    so2: 22,
    co: 1.2,
    updateTime: new Date().toLocaleString('zh-CN'),
    trend24h: generateTrend24h(),
    history7d: generateHistory7d(98),
  },
  {
    id: '1004',
    name: '西城区官园',
    type: 'national',
    lat: cityCenter.lat + 0.006,
    lng: cityCenter.lng - 0.012,
    aqi: 156,
    pm25: 118,
    pm10: 168,
    o3: 192,
    no2: 95,
    so2: 35,
    co: 1.8,
    updateTime: new Date().toLocaleString('zh-CN'),
    trend24h: generateTrend24h(),
    history7d: generateHistory7d(156),
  },
  {
    id: '1005',
    name: '丰台区云岗',
    type: 'national',
    lat: cityCenter.lat - 0.035,
    lng: cityCenter.lng - 0.018,
    aqi: 205,
    pm25: 155,
    pm10: 215,
    o3: 248,
    no2: 125,
    so2: 48,
    co: 2.3,
    updateTime: new Date().toLocaleString('zh-CN'),
    trend24h: generateTrend24h(),
    history7d: generateHistory7d(205),
  },
  {
    id: '2001',
    name: '昌平区镇',
    type: 'provincial',
    lat: cityCenter.lat + 0.08,
    lng: cityCenter.lng - 0.01,
    aqi: 32,
    pm25: 18,
    pm10: 35,
    o3: 52,
    no2: 22,
    so2: 5,
    co: 0.4,
    updateTime: new Date().toLocaleString('zh-CN'),
    trend24h: generateTrend24h(),
    history7d: generateHistory7d(32),
  },
  {
    id: '2002',
    name: '大兴区榆垡',
    type: 'provincial',
    lat: cityCenter.lat - 0.08,
    lng: cityCenter.lng + 0.02,
    aqi: 230,
    pm25: 180,
    pm10: 255,
    o3: 285,
    no2: 145,
    so2: 58,
    co: 2.8,
    updateTime: new Date().toLocaleString('zh-CN'),
    trend24h: generateTrend24h(),
    history7d: generateHistory7d(230),
  },
  {
    id: '2003',
    name: '通州区',
    type: 'provincial',
    lat: cityCenter.lat - 0.005,
    lng: cityCenter.lng + 0.09,
    aqi: 310,
    pm25: 260,
    pm10: 340,
    o3: 380,
    no2: 185,
    so2: 75,
    co: 3.5,
    updateTime: new Date().toLocaleString('zh-CN'),
    trend24h: generateTrend24h(),
    history7d: generateHistory7d(310),
  },
  {
    id: '2004',
    name: '顺义区',
    type: 'provincial',
    lat: cityCenter.lat + 0.05,
    lng: cityCenter.lng + 0.06,
    aqi: 115,
    pm25: 86,
    pm10: 135,
    o3: 165,
    no2: 68,
    so2: 28,
    co: 1.4,
    updateTime: new Date().toLocaleString('zh-CN'),
    trend24h: generateTrend24h(),
    history7d: generateHistory7d(115),
  },
];

const streets = ['朝阳街道', '海淀街道', '东城街道', '西城街道', '丰台街道', '石景山街道', '通州街道', '昌平街道', '大兴街道', '顺义街道'];

export const microStations: MicroStationData[] = [];
for (let i = 0; i < 100; i++) {
  microStations.push({
    id: `M${i.toString().padStart(4, '0')}`,
    lat: cityCenter.lat + (Math.random() - 0.5) * 0.2,
    lng: cityCenter.lng + (Math.random() - 0.5) * 0.25,
    aqi: Math.floor(Math.random() * 350) + 20,
    street: streets[Math.floor(Math.random() * streets.length)],
  });
}

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
export const forecast: ForecastData[] = Array.from({ length: 3 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i + 1);
  const aqi = Math.floor(Math.random() * 200) + 30;
  let level = '';
  let primaryPollutant = '';
  if (aqi <= 50) { level = '优'; primaryPollutant = '无'; }
  else if (aqi <= 100) { level = '良'; primaryPollutant = Math.random() > 0.5 ? 'PM2.5' : 'PM10'; }
  else if (aqi <= 150) { level = '轻度污染'; primaryPollutant = 'PM2.5'; }
  else if (aqi <= 200) { level = '中度污染'; primaryPollutant = 'PM2.5'; }
  else { level = '重度污染'; primaryPollutant = 'PM2.5'; }

  const weathers = ['晴', '多云', '阴', '小雨', '雷阵雨'];
  const winds = ['东风2级', '南风3级', '西风2级', '北风4级', '微风'];

  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    weekday: weekdays[date.getDay()],
    aqi,
    level,
    primaryPollutant,
    temperature: `${Math.floor(Math.random() * 15) + 18}~${Math.floor(Math.random() * 8) + 28}℃`,
    weather: weathers[Math.floor(Math.random() * weathers.length)],
    wind: winds[Math.floor(Math.random() * winds.length)],
  };
});

export const historyStats: HistoryStats = {
  totalDays: 30,
  excellentDays: 12,
  goodDays: 10,
  pollutedDays: 8,
  excellentRate: 40,
  primaryPollutants: [
    { name: 'O₃', days: 12, rate: 40 },
    { name: 'PM2.5', days: 10, rate: 33.3 },
    { name: 'PM10', days: 5, rate: 16.7 },
    { name: 'NO₂', days: 3, rate: 10 },
  ],
};
