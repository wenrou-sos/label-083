import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl } from 'react-leaflet';
import type { StationData, MicroStationData } from '../data/mockData';
import { getAqiColor, getAqiLevelText, getAqiLevels } from '../utils/aqi';
import { StationPopup } from './StationPopup';
import { HeatmapLayer } from './HeatmapLayer';
import { useI18n } from '../i18n';

interface AirQualityMapProps {
  stations: StationData[];
  microStations: MicroStationData[];
}

const cityCenter: [number, number] = [39.9042, 116.4074];

export const AirQualityMap = ({ stations, microStations }: AirQualityMapProps) => {
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const { t, locale } = useI18n();
  const levels = getAqiLevels(locale);

  const highPollutionAreas = microStations
    .filter(s => s.aqi > 150)
    .sort((a, b) => b.aqi - a.aqi)
    .slice(0, 5);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={cityCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name={t.map.baseMap}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name={t.map.darkMap}>
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <HeatmapLayer data={microStations} show={showHeatmap} />

        {stations.map(station => (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lng]}
            radius={station.type === 'national' ? 14 : 11}
            fillColor={getAqiColor(station.aqi)}
            color="#fff"
            weight={2}
            opacity={1}
            fillOpacity={0.9}
            eventHandlers={{
              click: () => setSelectedStation(station),
            }}
          >
            <Popup closeButton={false} className="station-popup">
              <StationPopup station={station} />
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
        <div className="text-xs font-semibold text-gray-700 mb-2">{t.map.aqiLevel}</div>
        <div className="space-y-1">
          {levels.map(level => (
            <div key={level.min} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: level.color }}
              />
              <span className="text-xs text-gray-600">
                {level.min}-{level.max} {level.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000] max-w-[200px]">
        <div className="text-xs font-semibold text-red-600 mb-2">
          🔥 {t.map.highPollutionTitle}
        </div>
        <div className="space-y-1">
          {highPollutionAreas.map((area, idx) => (
            <div key={area.id} className="flex items-center justify-between text-xs">
              <span className="text-gray-600 truncate">
                {idx + 1}. {area.street}
              </span>
              <span
                className="font-bold text-white px-1.5 py-0.5 rounded text-[10px]"
                style={{ backgroundColor: getAqiColor(area.aqi) }}
              >
                {area.aqi} {getAqiLevelText(area.aqi, locale)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000] min-w-[160px]">
        <div className="text-xs font-semibold text-gray-700 mb-2">{t.map.layerControl}</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-green-400 to-red-600" />
              <span className="text-xs text-gray-600">{t.map.heatmap}</span>
            </div>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
                showHeatmap ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  showHeatmap ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="text-xs font-semibold text-gray-700 mb-1.5">{t.map.stationType}</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white bg-blue-500" />
                <span className="text-xs text-gray-600">{t.map.nationalStation} (9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-white bg-green-500" />
                <span className="text-xs text-gray-600">{t.map.provincialStation}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-green-400 to-red-600" />
                <span className="text-xs text-gray-600">{t.map.microStation} (100)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
