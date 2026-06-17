import { useMemo } from 'react';
import { AirQualityMap } from '../components/AirQualityMap';
import { ForecastPanel } from '../components/ForecastPanel';
import { HistoryStats } from '../components/HistoryStats';
import { StationComparison } from '../components/StationComparison';
import { stations, microStations, forecast, historyStats } from '../data/mockData';
import { useStationSelection } from '../hooks/useStationSelection';
import { getAqiColor, getAqiLevelText } from '../utils/aqi';
import { useI18n } from '../i18n';

export default function Home() {
  const {
    selectedStations,
    isSelected,
    isDisabled,
    toggleStation,
    clearSelection,
    count,
    isMax,
    activeTab,
    setActiveTab,
  } = useStationSelection(stations);

  const { t, locale, toggleLocale } = useI18n();

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
              <h1 className="text-xl font-bold text-gray-800">{t.header.title}</h1>
              <p className="text-xs text-gray-500">
                {t.header.subtitle} · {stations.length}{t.header.nationalStations} · {microStations.length}{t.header.microStations}
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
                <div className="text-xs text-gray-500">{t.header.avgAqi}</div>
                <div
                  className="text-lg font-bold"
                  style={{ color: getAqiColor(overallStats.avgAqi) }}
                >
                  {getAqiLevelText(overallStats.avgAqi, locale)}
                </div>
              </div>
            </div>

            <div className="h-10 w-px bg-gray-200" />

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{overallStats.excellentCount}</div>
                <div className="text-xs text-gray-500">{t.header.excellent}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{overallStats.goodCount}</div>
                <div className="text-xs text-gray-500">{t.header.good}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{overallStats.pollutedCount}</div>
                <div className="text-xs text-gray-500">{t.header.polluted}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500">{t.header.updateTime}</div>
              <div className="text-sm font-medium text-gray-700">
                {new Date().toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}
              </div>
            </div>

            <div className="h-10 w-px bg-gray-200" />

            <button
              onClick={toggleLocale}
              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm"
              title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              {locale === 'zh' ? '中 / EN' : 'EN / 中'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex-1 min-h-0 rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <AirQualityMap stations={stations} microStations={microStations} />
          </div>
          <div className="h-[340px] flex-shrink-0 flex flex-col">
            <div className="flex bg-white rounded-t-xl shadow-sm border border-b-0 border-gray-100">
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
                  activeTab === 'stats'
                    ? 'text-blue-600 bg-blue-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <span>📊</span>
                  {t.tab.stats}
                </span>
                {activeTab === 'stats' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
              <div className="w-px bg-gray-200 my-2" />
              <button
                onClick={() => setActiveTab('compare')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
                  activeTab === 'compare'
                    ? 'text-blue-600 bg-blue-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <span>📈</span>
                  {t.tab.compare}
                  {selectedStations.length > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[10px] rounded-full bg-blue-600 text-white">
                      {selectedStations.length}
                    </span>
                  )}
                </span>
                {activeTab === 'compare' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            </div>
            <div className="flex-1 min-h-0 rounded-b-xl shadow-lg border border-t-0 border-gray-100 overflow-hidden">
              {activeTab === 'stats' ? (
                <div className="h-full">
                  <HistoryStats data={historyStats} />
                </div>
              ) : (
                <div className="h-full">
                  <StationComparison
                    stations={selectedStations}
                    onClear={clearSelection}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-[420px] flex-shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                {t.station.listTitle}
              </h3>
              {count > 0 && (
                <button
                  onClick={clearSelection}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {t.station.clearAll}
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500 mb-2 flex items-center justify-between">
              <span>{t.station.selectHint}</span>
              <span className={isMax ? 'text-orange-600 font-semibold' : ''}>
                {count}/6
              </span>
            </div>
            {isMax && (
              <div className="mb-2 text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1.5 rounded-md flex items-center gap-1.5">
                <span>⚠️</span>
                <span>{t.station.maxWarning.replace('{max}', '6')}</span>
              </div>
            )}
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {stations.map(station => {
                const checked = isSelected(station.id);
                const disabled = isDisabled(station.id);
                return (
                  <label
                    key={station.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-colors cursor-pointer border ${
                      checked
                        ? 'bg-blue-50 border-blue-200'
                        : disabled
                        ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
                        : 'bg-gray-50 hover:bg-gray-100 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleStation(station.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow flex-shrink-0"
                      style={{ backgroundColor: getAqiColor(station.aqi) }}
                    >
                      {station.aqi}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 text-sm truncate">{station.name}</div>
                      <div className="text-xs text-gray-500">
                        {station.type === 'national' ? t.station.national : t.station.provincial}
                      </div>
                    </div>
                    <div
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white flex-shrink-0"
                      style={{ backgroundColor: getAqiColor(station.aqi) }}
                    >
                      {getAqiLevelText(station.aqi, locale)}
                    </div>
                  </label>
                );
              })}
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
