import ReactECharts from 'echarts-for-react';
import type { StationData } from '../data/mockData';
import { getAqiColor, getAqiLevelText } from '../utils/aqi';

interface StationPopupProps {
  station: StationData;
}

const pollutantConfig = [
  { key: 'pm25', name: 'PM₂.₅', unit: 'μg/m³', color: '#5470c6' },
  { key: 'pm10', name: 'PM₁₀', unit: 'μg/m³', color: '#91cc75' },
  { key: 'o3', name: 'O₃', unit: 'μg/m³', color: '#fac858' },
  { key: 'no2', name: 'NO₂', unit: 'μg/m³', color: '#ee6666' },
  { key: 'so2', name: 'SO₂', unit: 'μg/m³', color: '#73c0de' },
  { key: 'co', name: 'CO', unit: 'mg/m³', color: '#3ba272' },
];

export const StationPopup = ({ station }: StationPopupProps) => {
  const trendOption = {
    title: {
      text: '24小时趋势',
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'normal' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: {
      data: pollutantConfig.map(p => p.name),
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
      name: p.name,
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
            {station.type === 'national' ? '国控站' : '省控站'} · 更新于 {station.updateTime}
          </div>
        </div>
        <div
          className="px-3 py-1 rounded-full text-white font-bold text-lg"
          style={{ backgroundColor: getAqiColor(station.aqi) }}
        >
          {station.aqi}
          <span className="text-xs ml-1 font-normal">{getAqiLevelText(station.aqi)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {pollutantConfig.map(p => (
          <div
            key={p.key}
            className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100"
          >
            <div className="text-xs text-gray-500">{p.name}</div>
            <div className="font-semibold text-gray-800" style={{ color: p.color }}>
              {station[p.key as keyof Pick<typeof station, 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co'>]}
              <span className="text-xs text-gray-400 ml-0.5">{p.unit}</span>
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
