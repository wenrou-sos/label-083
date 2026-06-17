import ReactECharts from 'echarts-for-react';
import type { HistoryStats as HistoryStatsType } from '../data/mockData';
import { useI18n } from '../i18n';

interface HistoryStatsProps {
  data: HistoryStatsType;
}

export const HistoryStats = ({ data }: HistoryStatsProps) => {
  const { t } = useI18n();

  const daysPieOption = {
    title: {
      text: t.history.goodDaysTitle,
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 'normal' },
    },
    tooltip: {
      trigger: 'item',
      formatter: `{b}: {c}${t.history.days} ({d}%)`,
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      textStyle: { fontSize: 11 },
    },
    series: [
      {
        name: t.history.aqi,
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          fontSize: 11,
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
        },
        data: [
          { value: data.excellentDays, name: t.history.excellent, itemStyle: { color: '#00E400' } },
          { value: data.goodDays, name: t.history.good, itemStyle: { color: '#FFFF00' } },
          { value: data.pollutedDays, name: t.history.polluted, itemStyle: { color: '#FF7E00' } },
        ],
      },
    ],
  };

  const pollutantBarOption = {
    title: {
      text: t.history.pollutantTitle,
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 'normal' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const p = params[0];
        return `${p.name}<br/>${p.value}${t.history.days} (${p.data.rate}%)`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '25%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.primaryPollutants.map(p => p.name),
      axisLabel: { fontSize: 11, fontWeight: 'bold' },
      axisLine: { lineStyle: { color: '#ccc' } },
    },
    yAxis: {
      type: 'value',
      name: t.history.days,
      nameTextStyle: { fontSize: 10, color: '#999' },
      axisLabel: { fontSize: 10 },
      splitLine: { lineStyle: { color: '#eee' } },
    },
    series: [
      {
        type: 'bar',
        barWidth: '50%',
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#ee6666' },
              { offset: 1, color: '#fac858' },
            ],
          },
        },
        label: {
          show: true,
          position: 'top',
          formatter: `{c}${t.history.days}`,
          fontSize: 11,
          fontWeight: 'bold',
        },
        data: data.primaryPollutants.map(p => ({
          value: p.days,
          rate: p.rate,
        })),
      },
    ],
  };

  const o3 = data.primaryPollutants.find(p => p.name === 'O₃');
  const pm25 = data.primaryPollutants.find(p => p.name === 'PM2.5');

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        {t.history.title}
      </h3>

      <div className="grid grid-cols-2 gap-4 h-[calc(100%-60px)]">
        <div className="bg-gray-50 rounded-xl p-2">
          <ReactECharts option={daysPieOption} style={{ height: '100%', width: '100%' }} />
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-2 h-[55%]">
            <ReactECharts option={pollutantBarOption} style={{ height: '100%', width: '100%' }} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              className="rounded-lg p-3 text-center bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-300"
            >
              <div className="text-xs text-orange-700 mb-1">{t.history.ozoneExceed}</div>
              <div className="text-xl font-bold text-orange-800">{o3?.rate || 0}%</div>
              <div className="text-[10px] text-orange-600">{o3?.days || 0}{t.history.days}</div>
            </div>
            <div
              className="rounded-lg p-3 text-center bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300"
            >
              <div className="text-xs text-blue-700 mb-1">{t.history.pm25Exceed}</div>
              <div className="text-xl font-bold text-blue-800">{pm25?.rate || 0}%</div>
              <div className="text-[10px] text-blue-600">{pm25?.days || 0}{t.history.days}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
