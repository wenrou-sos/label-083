export type Locale = 'zh' | 'en';

const translations = {
  zh: {
    header: {
      title: '城市空气质量监测面板',
      subtitle: '实时监测',
      nationalStations: '个国控/省控站',
      microStations: '个微型站',
      avgAqi: '全市平均 AQI',
      excellent: '优',
      good: '良',
      polluted: '污染',
      updateTime: '更新时间',
    },
    station: {
      national: '国控站',
      provincial: '省控站',
      listTitle: '监测站点列表',
      clearAll: '取消全部',
      selectHint: '勾选站点进行对比分析',
      maxWarning: '最多只能对比 {max} 个站点',
    },
    map: {
      aqiLevel: 'AQI 分级',
      layerControl: '图层控制',
      heatmap: '微型站热力图',
      stationType: '站点类型',
      nationalStation: '国控站',
      provincialStation: '省控站',
      microStation: '微型站',
      highPollutionTitle: '高污染区域 TOP5',
      baseMap: '标准地图',
      darkMap: '暗色地图',
    },
    aqiLevel: {
      excellent: '优',
      good: '良',
      light: '轻度污染',
      moderate: '中度污染',
      heavy: '重度污染',
      severe: '严重污染',
    },
    popup: {
      trend24h: '24小时趋势',
      unitUgm3: 'μg/m³',
      unitMgm3: 'mg/m³',
      pollutants: {
        pm25: 'PM₂.₅',
        pm10: 'PM₁₀',
        o3: 'O₃',
        no2: 'NO₂',
        so2: 'SO₂',
        co: 'CO',
      },
    },
    forecast: {
      title: '未来3天空气质量预报',
      primaryPollutant: '首要污染物',
      temperature: '温度',
      weather: '天气',
      wind: '风力',
      none: '无',
      weekdays: {
        sun: '周日', mon: '周一', tue: '周二', wed: '周三',
        thu: '周四', fri: '周五', sat: '周六',
      },
    },
    history: {
      title: '历史日统计',
      goodDaysTitle: '本月优良天数比例',
      pollutantTitle: '首要污染物统计',
      excellent: '优',
      good: '良',
      polluted: '污染',
      days: '天',
      aqi: 'AQI',
      ozoneExceed: 'O₃ 超标占比',
      pm25Exceed: 'PM₂.₅ 超标占比',
    },
    compare: {
      title: '站点AQI对比分析',
      trendTitle: '近7天 AQI 趋势对比',
      emptyHint: '请从左侧站点列表勾选站点进行对比分析',
      emptySubHint: '最多支持同时对比6个站点',
      selectedCount: '已选择 {count} 个站点',
      legendHint: '点击图例可显示/隐藏对应折线',
      clearSelection: '清空选择',
      stations: '个站点',
    },
    tab: {
      stats: '历史统计',
      compare: '站点对比',
    },
  },
  en: {
    header: {
      title: 'City Air Quality Monitor',
      subtitle: 'Real-time Monitoring',
      nationalStations: ' National/Provincial Stations',
      microStations: ' Micro Stations',
      avgAqi: 'City Avg AQI',
      excellent: 'Excellent',
      good: 'Good',
      polluted: 'Polluted',
      updateTime: 'Updated',
    },
    station: {
      national: 'National',
      provincial: 'Provincial',
      listTitle: 'Monitoring Stations',
      clearAll: 'Clear All',
      selectHint: 'Select stations to compare',
      maxWarning: 'Max {max} stations for comparison',
    },
    map: {
      aqiLevel: 'AQI Level',
      layerControl: 'Layers',
      heatmap: 'Micro Station Heatmap',
      stationType: 'Station Type',
      nationalStation: 'National',
      provincialStation: 'Provincial',
      microStation: 'Micro Stations',
      highPollutionTitle: 'High Pollution TOP5',
      baseMap: 'Standard',
      darkMap: 'Dark',
    },
    aqiLevel: {
      excellent: 'Excellent',
      good: 'Good',
      light: 'Light',
      moderate: 'Moderate',
      heavy: 'Heavy',
      severe: 'Severe',
    },
    popup: {
      trend24h: '24h Trend',
      unitUgm3: 'μg/m³',
      unitMgm3: 'mg/m³',
      pollutants: {
        pm25: 'PM₂.₅',
        pm10: 'PM₁₀',
        o3: 'O₃',
        no2: 'NO₂',
        so2: 'SO₂',
        co: 'CO',
      },
    },
    forecast: {
      title: '3-Day Air Quality Forecast',
      primaryPollutant: 'Primary',
      temperature: 'Temp',
      weather: 'Weather',
      wind: 'Wind',
      none: 'None',
      weekdays: {
        sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed',
        thu: 'Thu', fri: 'Fri', sat: 'Sat',
      },
    },
    history: {
      title: 'Monthly Statistics',
      goodDaysTitle: 'Good Day Ratio',
      pollutantTitle: 'Primary Pollutant',
      excellent: 'Excellent',
      good: 'Good',
      polluted: 'Polluted',
      days: 'days',
      aqi: 'AQI',
      ozoneExceed: 'O₃ Exceed Rate',
      pm25Exceed: 'PM₂.₅ Exceed Rate',
    },
    compare: {
      title: 'Station AQI Comparison',
      trendTitle: '7-Day AQI Trend Comparison',
      emptyHint: 'Select stations from the list to compare',
      emptySubHint: 'Up to 6 stations can be compared',
      selectedCount: '{count} station(s) selected',
      legendHint: 'Click legend to show/hide lines',
      clearSelection: 'Clear',
      stations: 'stations',
    },
    tab: {
      stats: 'Statistics',
      compare: 'Compare',
    },
  },
} as const;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends Record<string, any>
    ? DeepStringify<T[K]>
    : T[K];
};

export type TranslationKey = DeepStringify<typeof translations.zh>;

export default translations;
