import type { ForecastData } from '../data/mockData';
import { getAqiColor, getAqiLevelText } from '../utils/aqi';
import { useI18n } from '../i18n';

interface ForecastPanelProps {
  data: ForecastData[];
}

const weatherIcons: Record<string, string> = {
  '晴': '☀️', '多云': '⛅', '阴': '☁️', '小雨': '🌧️', '雷阵雨': '⛈️',
  'Sunny': '☀️', 'Cloudy': '⛅', 'Overcast': '☁️', 'Light Rain': '🌧️', 'Thunderstorm': '⛈️',
};

export const ForecastPanel = ({ data }: ForecastPanelProps) => {
  const { t, locale } = useI18n();

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📅</span>
        {t.forecast.title}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl p-4 border transition-transform hover:scale-105 hover:shadow-md"
            style={{
              backgroundColor: getAqiColor(item.aqi) + '15',
              borderColor: getAqiColor(item.aqi) + '40',
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-gray-800">{item.date}</div>
                <div className="text-xs text-gray-500">{item.weekday}</div>
              </div>
              <span className="text-2xl">{weatherIcons[item.weather] || '🌤️'}</span>
            </div>

            <div
              className="text-center py-2 rounded-lg mb-3"
              style={{ backgroundColor: getAqiColor(item.aqi) }}
            >
              <div className="text-2xl font-bold text-white">{item.aqi}</div>
              <div className="text-xs text-white/90">{getAqiLevelText(item.aqi, locale)}</div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">{t.forecast.primaryPollutant}</span>
                <span className="font-medium text-gray-700">{item.primaryPollutant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.forecast.temperature}</span>
                <span className="font-medium text-gray-700">{item.temperature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.forecast.weather}</span>
                <span className="font-medium text-gray-700">{item.weather}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.forecast.wind}</span>
                <span className="font-medium text-gray-700">{item.wind}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
