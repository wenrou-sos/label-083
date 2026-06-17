import { describe, it, expect } from 'vitest';
import { stations, microStations, forecast, historyStats } from '../data/mockData';

describe('模拟数据完整性测试', () => {
  describe('国控/省控站点数据 (stations)', () => {
    it('站点数据存在且非空', () => {
      expect(stations).toBeDefined();
      expect(stations.length).toBeGreaterThan(0);
    });

    it('包含国控站和省控站两种类型', () => {
      const types = new Set(stations.map(s => s.type));
      expect(types.has('national')).toBe(true);
      expect(types.has('provincial')).toBe(true);
    });

    it('每个站点包含必需字段', () => {
      stations.forEach(station => {
        expect(station.id).toBeDefined();
        expect(station.name).toBeDefined();
        expect(station.type).toBeDefined();
        expect(typeof station.lat).toBe('number');
        expect(typeof station.lng).toBe('number');
        expect(typeof station.aqi).toBe('number');
        expect(typeof station.pm25).toBe('number');
        expect(typeof station.pm10).toBe('number');
        expect(typeof station.o3).toBe('number');
        expect(typeof station.no2).toBe('number');
        expect(typeof station.so2).toBe('number');
        expect(typeof station.co).toBe('number');
      });
    });

    it('站点坐标在有效范围内', () => {
      stations.forEach(station => {
        expect(station.lat).toBeGreaterThan(-90);
        expect(station.lat).toBeLessThan(90);
        expect(station.lng).toBeGreaterThan(-180);
        expect(station.lng).toBeLessThan(180);
      });
    });

    it('24小时趋势数据结构正确', () => {
      stations.forEach(station => {
        const { trend24h } = station;
        expect(trend24h.time).toHaveLength(24);
        expect(trend24h.pm25).toHaveLength(24);
        expect(trend24h.pm10).toHaveLength(24);
        expect(trend24h.o3).toHaveLength(24);
        expect(trend24h.no2).toHaveLength(24);
        expect(trend24h.so2).toHaveLength(24);
        expect(trend24h.co).toHaveLength(24);
      });
    });

    it('趋势时间格式为 HH:00', () => {
      stations.forEach(station => {
        station.trend24h.time.forEach(t => {
          expect(t).toMatch(/^\d{2}:00$/);
        });
      });
    });

    it('历史7天数据存在且结构正确', () => {
      stations.forEach(station => {
        expect(station.history7d).toBeDefined();
        expect(station.history7d).toHaveLength(7);
        station.history7d.forEach(day => {
          expect(day.date).toBeDefined();
          expect(typeof day.aqi).toBe('number');
          expect(day.aqi).toBeGreaterThanOrEqual(0);
        });
      });
    });

    it('历史日期格式正确 (M/D)', () => {
      stations.forEach(station => {
        station.history7d.forEach(day => {
          expect(day.date).toMatch(/^\d{1,2}\/\d{1,2}$/);
        });
      });
    });

    it('AQI 值非负且合理', () => {
      stations.forEach(station => {
        expect(station.aqi).toBeGreaterThanOrEqual(0);
        expect(station.aqi).toBeLessThanOrEqual(999);
      });
    });

    it('站点 ID 唯一', () => {
      const ids = stations.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('微型站数据 (microStations)', () => {
    it('微型站数量为 100 个', () => {
      expect(microStations).toHaveLength(100);
    });

    it('每个微型站包含必需字段', () => {
      microStations.forEach(station => {
        expect(station.id).toBeDefined();
        expect(typeof station.lat).toBe('number');
        expect(typeof station.lng).toBe('number');
        expect(typeof station.aqi).toBe('number');
        expect(station.street).toBeDefined();
      });
    });

    it('微型站 AQI 值范围正确', () => {
      microStations.forEach(station => {
        expect(station.aqi).toBeGreaterThanOrEqual(20);
        expect(station.aqi).toBeLessThanOrEqual(370);
      });
    });

    it('微型站 ID 唯一且格式正确', () => {
      const ids = microStations.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
      microStations.forEach(station => {
        expect(station.id).toMatch(/^M\d{4}$/);
      });
    });

    it('所有微型站街道在预设列表中', () => {
      const expectedStreets = [
        '朝阳街道', '海淀街道', '东城街道', '西城街道',
        '丰台街道', '石景山街道', '通州街道', '昌平街道',
        '大兴街道', '顺义街道'
      ];
      microStations.forEach(station => {
        expect(expectedStreets).toContain(station.street);
      });
    });
  });

  describe('未来3天预报数据 (forecast)', () => {
    it('预报天数为 3 天', () => {
      expect(forecast).toHaveLength(3);
    });

    it('每天预报包含完整字段', () => {
      forecast.forEach(day => {
        expect(day.date).toBeDefined();
        expect(day.weekday).toBeDefined();
        expect(typeof day.aqi).toBe('number');
        expect(day.level).toBeDefined();
        expect(day.primaryPollutant).toBeDefined();
        expect(day.temperature).toBeDefined();
        expect(day.weather).toBeDefined();
        expect(day.wind).toBeDefined();
      });
    });

    it('AQI 等级匹配 AQI 数值', () => {
      forecast.forEach(day => {
        const { aqi, level } = day;
        if (aqi <= 50) expect(level).toBe('优');
        else if (aqi <= 100) expect(level).toBe('良');
        else if (aqi <= 150) expect(level).toBe('轻度污染');
        else if (aqi <= 200) expect(level).toBe('中度污染');
        else expect(level).toBe('重度污染');
      });
    });

    it('优等级首要污染物为无', () => {
      const excellentDays = forecast.filter(d => d.aqi <= 50);
      excellentDays.forEach(d => {
        expect(d.primaryPollutant).toBe('无');
      });
    });

    it('日期格式正确', () => {
      forecast.forEach(day => {
        expect(day.date).toMatch(/^\d{1,2}\/\d{1,2}$/);
      });
    });

    it('星期格式正确', () => {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      forecast.forEach(day => {
        expect(weekdays).toContain(day.weekday);
      });
    });

    it('温度范围格式正确', () => {
      forecast.forEach(day => {
        expect(day.temperature).toMatch(/^\d+~\d+℃$/);
      });
    });

    it('日期按升序排列', () => {
      for (let i = 1; i < forecast.length; i++) {
        const prev = forecast[i - 1].date.split('/').map(Number);
        const curr = forecast[i].date.split('/').map(Number);
        const prevDay = prev[0] * 31 + prev[1];
        const currDay = curr[0] * 31 + curr[1];
        expect(currDay).toBeGreaterThanOrEqual(prevDay);
      }
    });
  });

  describe('历史统计数据 (historyStats)', () => {
    it('包含必需统计字段', () => {
      expect(typeof historyStats.totalDays).toBe('number');
      expect(typeof historyStats.excellentDays).toBe('number');
      expect(typeof historyStats.goodDays).toBe('number');
      expect(typeof historyStats.pollutedDays).toBe('number');
      expect(typeof historyStats.excellentRate).toBe('number');
      expect(Array.isArray(historyStats.primaryPollutants)).toBe(true);
    });

    it('本月总天数应为 30 天', () => {
      expect(historyStats.totalDays).toBe(30);
    });

    it('优+良+污染天数 = 总天数', () => {
      const sum = historyStats.excellentDays + historyStats.goodDays + historyStats.pollutedDays;
      expect(sum).toBe(historyStats.totalDays);
    });

    it('优良天数比例计算正确', () => {
      const expectedRate = (historyStats.excellentDays / historyStats.totalDays) * 100;
      expect(historyStats.excellentRate).toBeCloseTo(expectedRate, 0);
    });

    it('首要污染物包含 O₃ 和 PM₂.₅', () => {
      const names = historyStats.primaryPollutants.map(p => p.name);
      expect(names).toContain('O₃');
      expect(names).toContain('PM2.5');
    });

    it('每个首要污染物有完整信息', () => {
      historyStats.primaryPollutants.forEach(p => {
        expect(p.name).toBeDefined();
        expect(typeof p.days).toBe('number');
        expect(p.days).toBeGreaterThan(0);
        expect(typeof p.rate).toBe('number');
        expect(p.rate).toBeGreaterThan(0);
      });
    });
  });
});
