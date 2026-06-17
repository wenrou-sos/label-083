import { describe, it, expect } from 'vitest';
import {
  getAqiLevel,
  getAqiColor,
  getAqiBgColor,
  getAqiLevelText,
  normalizeAqi,
  aqiLevels,
} from '../utils/aqi';

describe('AQI 工具函数测试', () => {
  describe('getAqiLevel', () => {
    it('返回正确的优等级 (0-50)', () => {
      const level = getAqiLevel(0);
      expect(level.level).toBe('优');
      expect(level.color).toBe('#00E400');
      expect(level.min).toBe(0);
      expect(level.max).toBe(50);

      expect(getAqiLevel(25).level).toBe('优');
      expect(getAqiLevel(50).level).toBe('优');
    });

    it('返回正确的良等级 (51-100)', () => {
      expect(getAqiLevel(51).level).toBe('良');
      expect(getAqiLevel(75).level).toBe('良');
      expect(getAqiLevel(100).level).toBe('良');
    });

    it('返回正确的轻度污染等级 (101-150)', () => {
      expect(getAqiLevel(101).level).toBe('轻度污染');
      expect(getAqiLevel(125).level).toBe('轻度污染');
      expect(getAqiLevel(150).level).toBe('轻度污染');
    });

    it('返回正确的中度污染等级 (151-200)', () => {
      expect(getAqiLevel(151).level).toBe('中度污染');
      expect(getAqiLevel(180).level).toBe('中度污染');
      expect(getAqiLevel(200).level).toBe('中度污染');
    });

    it('返回正确的重度污染等级 (201-300)', () => {
      expect(getAqiLevel(201).level).toBe('重度污染');
      expect(getAqiLevel(250).level).toBe('重度污染');
      expect(getAqiLevel(300).level).toBe('重度污染');
    });

    it('返回正确的严重污染等级 (>300)', () => {
      expect(getAqiLevel(301).level).toBe('严重污染');
      expect(getAqiLevel(400).level).toBe('严重污染');
      expect(getAqiLevel(999).level).toBe('严重污染');
    });

    it('边界值测试', () => {
      expect(getAqiLevel(50).level).toBe('优');
      expect(getAqiLevel(51).level).toBe('良');
      expect(getAqiLevel(100).level).toBe('良');
      expect(getAqiLevel(101).level).toBe('轻度污染');
      expect(getAqiLevel(150).level).toBe('轻度污染');
      expect(getAqiLevel(151).level).toBe('中度污染');
      expect(getAqiLevel(200).level).toBe('中度污染');
      expect(getAqiLevel(201).level).toBe('重度污染');
      expect(getAqiLevel(300).level).toBe('重度污染');
      expect(getAqiLevel(301).level).toBe('严重污染');
    });
  });

  describe('getAqiColor', () => {
    it('优 - 返回绿色', () => {
      expect(getAqiColor(25)).toBe('#00E400');
    });

    it('良 - 返回黄色', () => {
      expect(getAqiColor(75)).toBe('#FFFF00');
    });

    it('轻度污染 - 返回橙色', () => {
      expect(getAqiColor(125)).toBe('#FF7E00');
    });

    it('中度污染 - 返回红色', () => {
      expect(getAqiColor(175)).toBe('#FF0000');
    });

    it('重度污染 - 返回紫色', () => {
      expect(getAqiColor(250)).toBe('#99004C');
    });

    it('严重污染 - 返回褐红色', () => {
      expect(getAqiColor(350)).toBe('#7E0023');
    });
  });

  describe('getAqiBgColor', () => {
    it('返回带透明度的背景色', () => {
      expect(getAqiBgColor(25)).toBe('rgba(0, 228, 0, 0.8)');
      expect(getAqiBgColor(75)).toBe('rgba(255, 255, 0, 0.8)');
    });
  });

  describe('getAqiLevelText', () => {
    it('返回中文等级文本', () => {
      expect(getAqiLevelText(25)).toBe('优');
      expect(getAqiLevelText(75)).toBe('良');
      expect(getAqiLevelText(125)).toBe('轻度污染');
      expect(getAqiLevelText(175)).toBe('中度污染');
      expect(getAqiLevelText(250)).toBe('重度污染');
      expect(getAqiLevelText(350)).toBe('严重污染');
    });
  });

  describe('normalizeAqi', () => {
    it('低值归一化到 [0, 1]', () => {
      expect(normalizeAqi(0)).toBe(0);
      expect(normalizeAqi(50)).toBe(0.1);
      expect(normalizeAqi(250)).toBe(0.5);
    });

    it('超过 500 的值归一化为 1', () => {
      expect(normalizeAqi(500)).toBe(1);
      expect(normalizeAqi(1000)).toBe(1);
    });
  });

  describe('aqiLevels 配置完整性', () => {
    it('包含 6 个等级', () => {
      expect(aqiLevels).toHaveLength(6);
    });

    it('等级名称正确', () => {
      const names = aqiLevels.map(l => l.level);
      expect(names).toEqual(['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染']);
    });

    it('所有等级都有颜色配置', () => {
      aqiLevels.forEach(level => {
        expect(level.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(level.bgColor).toContain('rgba');
      });
    });
  });
});
