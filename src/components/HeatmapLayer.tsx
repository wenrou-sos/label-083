import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { MicroStationData } from '../data/mockData';
import { getAqiColor, normalizeAqi } from '../utils/aqi';

interface HeatmapLayerProps {
  data: MicroStationData[];
  show: boolean;
}

export const HeatmapLayer = ({ data, show }: HeatmapLayerProps) => {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!map) return;

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.width = map.getSize().x;
    canvas.height = map.getSize().y;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';

    const customLayer = new L.Layer() as any;
    customLayer.onAdd = function (map: L.Map) {
      this._map = map;
      const pane = map.getPane('overlayPane');
      if (pane) pane.appendChild(canvas);
      this._canvas = canvas;
      this._draw();
      map.on('moveend', this._draw, this);
      map.on('zoomend', this._draw, this);
      map.on('resize', this._draw, this);
      return this;
    };

    customLayer.onRemove = function (map: L.Map) {
      if (this._canvas && this._canvas.parentNode) {
        this._canvas.parentNode.removeChild(this._canvas);
      }
      map.off('moveend', this._draw, this);
      map.off('zoomend', this._draw, this);
      map.off('resize', this._draw, this);
    };

    customLayer._draw = function () {
      if (!this._canvas || !this._map) return;
      const canvas: HTMLCanvasElement = this._canvas;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = this._map.getSize();
      canvas.width = size.x;
      canvas.height = size.y;
      ctx.clearRect(0, 0, size.x, size.y);

      const gridSize = 20;
      const radius = gridSize / 2;

      data.forEach(station => {
        const point = this._map.latLngToContainerPoint([station.lat, station.lng]);
        const intensity = normalizeAqi(station.aqi);
        const color = getAqiColor(station.aqi);

        const gridX = Math.floor(point.x / gridSize) * gridSize;
        const gridY = Math.floor(point.y / gridSize) * gridSize;

        const gradient = ctx.createRadialGradient(
          gridX + radius, gridY + radius, 0,
          gridX + radius, gridY + radius, radius
        );
        gradient.addColorStop(0, hexToRgba(color, 0.7 * intensity + 0.3));
        gradient.addColorStop(1, hexToRgba(color, 0.1 * intensity));

        ctx.fillStyle = gradient;
        ctx.fillRect(gridX, gridY, gridSize, gridSize);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(gridX, gridY, gridSize, gridSize);
      });
    };

    layerRef.current = customLayer;

    if (show) {
      map.addLayer(customLayer);
    }

    return () => {
      if (layerRef.current && map.hasLayer(layerRef.current)) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, data]);

  useEffect(() => {
    if (!map || !layerRef.current) return;

    if (show) {
      if (!map.hasLayer(layerRef.current)) {
        map.addLayer(layerRef.current);
      }
      (layerRef.current as any)._draw?.();
    } else {
      if (map.hasLayer(layerRef.current)) {
        map.removeLayer(layerRef.current);
      }
    }
  }, [map, show]);

  return null;
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
