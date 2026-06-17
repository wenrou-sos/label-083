import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStationSelection } from '../hooks/useStationSelection';
import type { StationData } from '../data/mockData';

const mockStations: StationData[] = [
  { id: '1', name: '站点A', type: 'national', lat: 39.9, lng: 116.4, aqi: 50, pm25: 10, pm10: 20, o3: 30, no2: 15, so2: 5, co: 0.5, updateTime: '', trend24h: { time: [], pm25: [], pm10: [], o3: [], no2: [], so2: [], co: [] }, history7d: [] },
  { id: '2', name: '站点B', type: 'national', lat: 39.9, lng: 116.4, aqi: 80, pm25: 10, pm10: 20, o3: 30, no2: 15, so2: 5, co: 0.5, updateTime: '', trend24h: { time: [], pm25: [], pm10: [], o3: [], no2: [], so2: [], co: [] }, history7d: [] },
  { id: '3', name: '站点C', type: 'provincial', lat: 39.9, lng: 116.4, aqi: 120, pm25: 10, pm10: 20, o3: 30, no2: 15, so2: 5, co: 0.5, updateTime: '', trend24h: { time: [], pm25: [], pm10: [], o3: [], no2: [], so2: [], co: [] }, history7d: [] },
  { id: '4', name: '站点D', type: 'provincial', lat: 39.9, lng: 116.4, aqi: 150, pm25: 10, pm10: 20, o3: 30, no2: 15, so2: 5, co: 0.5, updateTime: '', trend24h: { time: [], pm25: [], pm10: [], o3: [], no2: [], so2: [], co: [] }, history7d: [] },
  { id: '5', name: '站点E', type: 'national', lat: 39.9, lng: 116.4, aqi: 200, pm25: 10, pm10: 20, o3: 30, no2: 15, so2: 5, co: 0.5, updateTime: '', trend24h: { time: [], pm25: [], pm10: [], o3: [], no2: [], so2: [], co: [] }, history7d: [] },
  { id: '6', name: '站点F', type: 'national', lat: 39.9, lng: 116.4, aqi: 50, pm25: 10, pm10: 20, o3: 30, no2: 15, so2: 5, co: 0.5, updateTime: '', trend24h: { time: [], pm25: [], pm10: [], o3: [], no2: [], so2: [], co: [] }, history7d: [] },
  { id: '7', name: '站点G', type: 'provincial', lat: 39.9, lng: 116.4, aqi: 90, pm25: 10, pm10: 20, o3: 30, no2: 15, so2: 5, co: 0.5, updateTime: '', trend24h: { time: [], pm25: [], pm10: [], o3: [], no2: [], so2: [], co: [] }, history7d: [] },
];

describe('useStationSelection Hook 测试', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('初始状态', () => {
    it('初始时没有选中站点', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));
      expect(result.current.count).toBe(0);
      expect(result.current.selectedIds.size).toBe(0);
      expect(result.current.selectedStations).toHaveLength(0);
    });

    it('初始 Tab 为 stats', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));
      expect(result.current.activeTab).toBe('stats');
    });

    it('初始时 isMax 为 false', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));
      expect(result.current.isMax).toBe(false);
    });
  });

  describe('toggleStation - 选择站点', () => {
    it('选择单个站点成功', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
      });

      expect(result.current.count).toBe(1);
      expect(result.current.isSelected('1')).toBe(true);
      expect(result.current.selectedStations[0].id).toBe('1');
    });

    it('选择多个站点', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
        result.current.toggleStation('2');
        result.current.toggleStation('3');
      });

      expect(result.current.count).toBe(3);
      expect(result.current.isSelected('1')).toBe(true);
      expect(result.current.isSelected('2')).toBe(true);
      expect(result.current.isSelected('3')).toBe(true);
      expect(result.current.isSelected('4')).toBe(false);
    });

    it('选中站点后自动切换到 compare Tab (异步)', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
      });

      expect(result.current.activeTab).toBe('stats');

      act(() => {
        vi.advanceTimersByTime(10);
      });

      expect(result.current.activeTab).toBe('compare');
    });
  });

  describe('toggleStation - 取消选择站点', () => {
    it('取消已选站点', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
        result.current.toggleStation('2');
      });
      expect(result.current.count).toBe(2);

      act(() => {
        result.current.toggleStation('1');
      });

      expect(result.current.count).toBe(1);
      expect(result.current.isSelected('1')).toBe(false);
      expect(result.current.isSelected('2')).toBe(true);
    });

    it('取消最后一个站点后自动切回 stats Tab', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
        vi.advanceTimersByTime(10);
      });
      expect(result.current.activeTab).toBe('compare');

      act(() => {
        result.current.toggleStation('1');
        vi.advanceTimersByTime(10);
      });

      expect(result.current.count).toBe(0);
      expect(result.current.activeTab).toBe('stats');
    });
  });

  describe('最多选择限制 (默认 6 个)', () => {
    it('达到最大数量后 isMax 为 true', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
        result.current.toggleStation('2');
        result.current.toggleStation('3');
        result.current.toggleStation('4');
        result.current.toggleStation('5');
        result.current.toggleStation('6');
      });

      expect(result.current.count).toBe(6);
      expect(result.current.isMax).toBe(true);
    });

    it('超过最大数量无法再选中新站点', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
        result.current.toggleStation('2');
        result.current.toggleStation('3');
        result.current.toggleStation('4');
        result.current.toggleStation('5');
        result.current.toggleStation('6');
      });
      expect(result.current.count).toBe(6);

      act(() => {
        result.current.toggleStation('7');
      });

      expect(result.current.count).toBe(6);
      expect(result.current.isSelected('7')).toBe(false);
    });

    it('超过最大数量后新站点 isDisabled 为 true', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
        result.current.toggleStation('2');
        result.current.toggleStation('3');
        result.current.toggleStation('4');
        result.current.toggleStation('5');
        result.current.toggleStation('6');
      });

      expect(result.current.isDisabled('7')).toBe(true);
      expect(result.current.isDisabled('1')).toBe(false);
    });

    it('可以自定义最大选择数', () => {
      const { result } = renderHook(() =>
        useStationSelection(mockStations, { maxSelect: 3 })
      );

      act(() => {
        result.current.toggleStation('1');
        result.current.toggleStation('2');
        result.current.toggleStation('3');
      });
      expect(result.current.isMax).toBe(true);

      act(() => {
        result.current.toggleStation('4');
      });
      expect(result.current.count).toBe(3);
    });
  });

  describe('clearSelection - 清空选择', () => {
    it('清空所有选择', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
        result.current.toggleStation('2');
        result.current.toggleStation('3');
      });
      expect(result.current.count).toBe(3);

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.count).toBe(0);
      expect(result.current.selectedIds.size).toBe(0);
      expect(result.current.selectedStations).toHaveLength(0);
    });

    it('清空后自动切回 stats Tab', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
        vi.advanceTimersByTime(10);
      });
      expect(result.current.activeTab).toBe('compare');

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.activeTab).toBe('stats');
    });

    it('清空后 isMax 恢复为 false', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
        result.current.toggleStation('2');
        result.current.toggleStation('3');
        result.current.toggleStation('4');
        result.current.toggleStation('5');
        result.current.toggleStation('6');
      });
      expect(result.current.isMax).toBe(true);

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.isMax).toBe(false);
    });
  });

  describe('isSelected & isDisabled', () => {
    it('isSelected 正确反映选中状态', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      expect(result.current.isSelected('1')).toBe(false);

      act(() => {
        result.current.toggleStation('1');
      });

      expect(result.current.isSelected('1')).toBe(true);
    });

    it('未达最大时，所有未选站点 isDisabled 为 false', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
      });

      expect(result.current.isDisabled('2')).toBe(false);
      expect(result.current.isDisabled('1')).toBe(false);
    });

    it('已选站点即使达最大也不会 disabled', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
        result.current.toggleStation('2');
        result.current.toggleStation('3');
        result.current.toggleStation('4');
        result.current.toggleStation('5');
        result.current.toggleStation('6');
      });

      expect(result.current.isDisabled('1')).toBe(false);
      expect(result.current.isDisabled('7')).toBe(true);
    });
  });

  describe('activeTab 手动切换', () => {
    it('可以手动 setActiveTab (有选中站点时不会被自动切回)', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.toggleStation('1');
        vi.advanceTimersByTime(10);
      });
      expect(result.current.activeTab).toBe('compare');

      act(() => {
        result.current.setActiveTab('stats');
      });
      expect(result.current.activeTab).toBe('stats');

      act(() => {
        result.current.setActiveTab('compare');
      });
      expect(result.current.activeTab).toBe('compare');
    });

    it('无选中站点时在 compare Tab 会自动切回 stats (useEffect 兜底)', () => {
      const { result } = renderHook(() => useStationSelection(mockStations));

      act(() => {
        result.current.setActiveTab('compare');
      });

      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(result.current.activeTab).toBe('stats');
    });
  });
});
