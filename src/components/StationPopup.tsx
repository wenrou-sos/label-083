import ReactECharts from 'echarts-for-react';
import type { StationData } from '../data/mockData';
import { getAqiColor, getAqiLevelText } from '../utils/aqi';
import { useI18n } from '../i18n';

interface StationPopupProps {
  station: StationData;
}

export const StationPopup = ({ station }: StationPopupProps) => {
  const { t, locale } = useI18n();

  const pollutantConfig = [
    { key: 'pm25', nameKey: 'pm25' as const, unitKey: 'unitUgm3' as const, color: '#5470c6' },
    { key: 'pm10', nameKey: 'pm10' as const, unitKey: 'unitUgm3' as const, color: '#91cc75' },
    { key: 'o3', nameKey: 'o3' as const, unitKey: 'unitUgm3' as const, color: '#fac858' },
    { key: 'no2', nameKey: 'no2' as const, unitKey: 'unitUgm3' as const, color: '#ee6666' },
    { key: 'so2', nameKey: 'so2' as const, unitKey: 'unitUgm3' as const, color: '#73c0de' },
    { key: 'co', nameKey: 'co' as const, unitKey: 'unitMgm3' as const, color: '#3ba272' },
  ];

  const trendOption = {
    title: {
      text: t.popup.trend24h,
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'normal' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: {
      data: pollutantConfig.map(p => t.popup.pollutants[p.nameKey]),
      bottom: 0,
      textStyle: { fontSize: 10 },
      type: 'scroll',
      pageIconSize: [10, 10],
      pageTextStyle: { fontSize: 10 },
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '15%',
      bottom: '20%',
    },
    xAxis: {
      type: 'category',
      data: station.trend24h.time,
      axisLabel: { fontSize: 9, interval: 3 },
      axisLine: { lineStyle: { color: '#ccc' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 9 },
      splitLine: { lineStyle: { color: '#eee' } },
    },
    series: pollutantConfig.map(p => ({
      name: t.popup.pollutants[p.nameKey],
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: { width: 2, color: p.color },
      itemStyle: { color: p.color },
      data: station.trend24h[p.key as keyof typeof station.trend24h] as number[],
    })),
  };

  return (
    <div className="min-w-[360px] p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold text-gray-800">{station.name}</div>
          <div className="text-xs text-gray-500">
            {station.type === 'national' ? t.station.national : t.station.provincial} · {station.updateTime}
          </div>
        </div>
        <div
          className="px-3 py-1 rounded-full text-white font-bold text-lg"
          style={{ backgroundColor: getAqiColor(station.aqi) }}
        >
          {station.aqi}
          <span className="text-xs ml-1 font-normal">{getAqiLevelText(station.aqi, locale)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {pollutantConfig.map(p => (
          <div
            key={p.key}
            className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100"
          >
            <div className="text-xs text-gray-500">{t.popup.pollutants[p.nameKey]}</div>
            <div className="font-semibold text-gray-800" style={{ color: p.color }}>
              {station[p.key as keyof Pick<typeof station, 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co'>]}
              <span className="text-xs text-gray-400 ml-0.5">{t.popup[p.unitKey]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="h-[200px]">
        <ReactECharts option={trendOption} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};
