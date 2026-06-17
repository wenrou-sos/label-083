import ReactECharts from 'echarts-for-react';
import type { StationData } from '../data/mockData';
import { aqiLevels } from '../utils/aqi';

interface StationComparisonProps {
  stations: StationData[];
  onClear?: () => void;
}

const stationColors = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
];

export const StationComparison = ({ stations, onClear }: StationComparisonProps) => {
  if (stations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-2xl">📈</span>
        站点AQI对比分析
      </h3>
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div>请从左侧站点列表勾选站点进行对比分析</div>
          <div className="text-xs text-gray-400 mt-1">最多支持同时对比6个站点</div>
        </div>
          </div>
        </div>
    );
  }

  const dates = stations[0]?.history7d.map(h => h.date) || [];

  const getAqiLevelColor = (aqi: number) => {
    return aqiLevels.find(l => aqi >= l.min && aqi <= l.max) || aqiLevels[5];
  };

  const option = {
    title: {
      text: `近7天 AQI 趋势对比(${stations.length} 个站点)`,
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 'normal' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
      formatter: (params: any) => {
        let result = `<div style="font-weight:bold;margin-bottom:4px">${params[0].axisValue}</div>`;
        params.forEach((p: any) => {
          const level = getAqiLevelColor(p.data);
          result += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
            <span>${p.seriesName}</span>
            <span style="font-weight:bold;margin-left:auto;color:${level.color}">${p.data} ${level.level}</span>
          </div>`;
        });
        return result;
      },
    },
    legend: {
      data: stations.map(s => s.name),
      bottom: 5,
      type: 'scroll',
      pageIconSize: [10, 10],
      textStyle: { fontSize: 11 },
      selectedMode: true,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '18%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: { fontSize: 11 },
      axisLine: { lineStyle: { color: '#ddd' } },
    },
    yAxis: {
      type: 'value',
      name: 'AQI',
      nameTextStyle: { fontSize: 10, color: '#999' },
      axisLabel: { fontSize: 11 },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
      min: 0,
    },
    series: stations.map((station, idx) => ({
      name: station.name,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2.5, color: stationColors[idx % stationColors.length] },
      itemStyle: {
        color: stationColors[idx % stationColors.length] },
      emphasis: {
        focus: 'series',
        lineStyle: { width: 4 },
        },
      data: station.history7d.map(h => h.aqi),
    })),
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          站点AQI对比分析
        </h3>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs px-3 py-1.5 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            清空选择
          </button>
        )}
      </div>
      <div className="text-xs text-gray-500 mb-2">
        已选择 {stations.length} 个站点 · 点击图例可显示/隐藏对应折线
      </div>
      <div className="flex-1 min-h-0">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={true} lazyUpdate={true} />
      </div>
    </div>
  );
};
