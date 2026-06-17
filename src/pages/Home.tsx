import { useMemo } from 'react';
import { AirQualityMap } from '../components/AirQualityMap';
import { ForecastPanel } from '../components/ForecastPanel';
import { HistoryStats } from '../components/HistoryStats';
import { stations, microStations, forecast, historyStats } from '../data/mockData';
import { getAqiColor, getAqiLevelText } from '../utils/aqi';

export default function Home() {
  const overallStats = useMemo(() => {
    const avgAqi = Math.round(stations.reduce((sum, s) => sum + s.aqi, 0) / stations.length);
    const maxAqi = Math.max(...stations.map(s => s.aqi));
    const excellentCount = stations.filter(s => s.aqi <= 50).length;
    const goodCount = stations.filter(s => s.aqi > 50 && s.aqi <= 100).length;
    const pollutedCount = stations.filter(s => s.aqi > 100).length;
    return { avgAqi, maxAqi, excellentCount, goodCount, pollutedCount };
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🌍</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">城市空气质量监测面板</h1>
              <p className="text-xs text-gray-500">
                实时监测 · {stations.length}个国控/省控站 · {microStations.length}个微型站
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: getAqiColor(overallStats.avgAqi) }}
              >
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{overallStats.avgAqi}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">全市平均 AQI</div>
                <div
                  className="text-lg font-bold"
                  style={{ color: getAqiColor(overallStats.avgAqi) }}
                >
                  {getAqiLevelText(overallStats.avgAqi)}
                </div>
              </div>
            </div>

            <div className="h-10 w-px bg-gray-200" />

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{overallStats.excellentCount}</div>
                <div className="text-xs text-gray-500">优</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{overallStats.goodCount}</div>
                <div className="text-xs text-gray-500">良</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{overallStats.pollutedCount}</div>
                <div className="text-xs text-gray-500">污染</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500">更新时间</div>
              <div className="text-sm font-medium text-gray-700">
                {new Date().toLocaleString('zh-CN')}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex-1 min-h-0 rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <AirQualityMap stations={stations} microStations={microStations} />
          </div>
          <div className="h-[320px] flex-shrink-0">
            <HistoryStats data={historyStats} />
          </div>
        </div>

        <div className="w-[420px] flex-shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📍</span>
              监测站点列表
            </h3>
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {stations.map(station => (
                <div
                  key={station.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0"
                      style={{ backgroundColor: getAqiColor(station.aqi) }}
                    >
                      {station.aqi}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-800 truncate">{station.name}</div>
                      <div className="text-xs text-gray-500">
                        {station.type === 'national' ? '国控站' : '省控站'}
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-xs font-semibold px-2 py-1 rounded-full text-white flex-shrink-0"
                    style={{ backgroundColor: getAqiColor(station.aqi) }}
                  >
                    {getAqiLevelText(station.aqi)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ForecastPanel data={forecast} />
          </div>
        </div>
      </main>
    </div>
  );
}