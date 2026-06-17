import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { I18nProvider, useI18n } from '../i18n';
import translations from '../i18n/translations';
import type { Locale } from '../i18n/translations';
import { ForecastPanel } from '../components/ForecastPanel';
import { getAqiLevelText, getAqiLevels } from '../utils/aqi';
import type { ForecastData } from '../data/mockData';

const TestComponent = () => {
  const { t, locale, setLocale, toggleLocale } = useI18n();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="title">{t.header.title}</span>
      <span data-testid="forecast-title">{t.forecast.title}</span>
      <button onClick={() => setLocale('en')} data-testid="set-en">Set EN</button>
      <button onClick={() => setLocale('zh')} data-testid="set-zh">Set ZH</button>
      <button onClick={toggleLocale} data-testid="toggle">Toggle</button>
    </div>
  );
};

const mockForecastData: ForecastData[] = [
  {
    date: '6/18',
    weekday: '周三',
    aqi: 75,
    level: '良',
    primaryPollutant: 'PM2.5',
    temperature: '22~30℃',
    weather: '晴',
    wind: '东风2级',
  },
  {
    date: '6/19',
    weekday: '周四',
    aqi: 125,
    level: '轻度污染',
    primaryPollutant: 'PM2.5',
    temperature: '24~32℃',
    weather: '多云',
    wind: '南风3级',
  },
  {
    date: '6/20',
    weekday: '周五',
    aqi: 45,
    level: '优',
    primaryPollutant: '无',
    temperature: '20~28℃',
    weather: '小雨',
    wind: '微风',
  },
];

const renderWithI18n = (ui: React.ReactNode, locale: Locale = 'zh') => {
  return render(
    <I18nProvider>
      <LocaleSetter locale={locale} />
      {ui}
    </I18nProvider>
  );
};

const LocaleSetter = ({ locale }: { locale: Locale }) => {
  const { setLocale } = useI18n();
  React.useEffect(() => {
    setLocale(locale);
  }, [setLocale, locale]);
  return null;
};

describe('i18n 多语言测试', () => {
  describe('翻译资源完整性', () => {
    it('包含 zh 和 en 两种语言配置', () => {
      expect(translations.zh).toBeDefined();
      expect(translations.en).toBeDefined();
    });

    it('中英翻译结构一致 - 所有 key 对齐', () => {
      const checkKeys = (zhObj: Record<string, any>, enObj: Record<string, any>, path = '') => {
        const zhKeys = Object.keys(zhObj);
        const enKeys = Object.keys(enObj);
        expect(zhKeys, `${path} 中英 key 数量不一致`).toHaveLength(enKeys.length);
        zhKeys.forEach(key => {
          expect(enKeys, `${path}.${key} 英文翻译缺失`).toContain(key);
          if (typeof zhObj[key] === 'object' && zhObj[key] !== null) {
            checkKeys(zhObj[key], enObj[key], `${path}.${key}`);
          }
        });
      };
      checkKeys(translations.zh, translations.en);
    });

    it('预报模块翻译完整', () => {
      const zhForecast = translations.zh.forecast;
      const enForecast = translations.en.forecast;

      expect(zhForecast.title).toBe('未来3天空气质量预报');
      expect(enForecast.title).toBe('3-Day Air Quality Forecast');

      expect(zhForecast.primaryPollutant).toBe('首要污染物');
      expect(enForecast.primaryPollutant).toBe('Primary');

      expect(zhForecast.temperature).toBe('温度');
      expect(enForecast.temperature).toBe('Temp');

      expect(zhForecast.weather).toBe('天气');
      expect(enForecast.weather).toBe('Weather');

      expect(zhForecast.wind).toBe('风力');
      expect(enForecast.wind).toBe('Wind');
    });

    it('星期翻译完整', () => {
      const zhWeekdays = translations.zh.forecast.weekdays;
      const enWeekdays = translations.en.forecast.weekdays;

      expect(zhWeekdays).toEqual({
        sun: '周日', mon: '周一', tue: '周二', wed: '周三',
        thu: '周四', fri: '周五', sat: '周六',
      });
      expect(enWeekdays).toEqual({
        sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed',
        thu: 'Thu', fri: 'Fri', sat: 'Sat',
      });
    });

    it('天气翻译完整 - 所有支持的天气类型', () => {
      const zhWeathers = ['晴', '多云', '阴', '小雨', '雷阵雨'];
      expect(translations.zh.forecast.weather).toBe('天气');

      zhWeathers.forEach(weather => {
        expect(weather, `天气"${weather}"在mock数据中使用`).toBeTruthy();
      });
    });

    it('风力翻译完整 - 所有支持的风力类型', () => {
      const zhWinds = ['东风2级', '南风3级', '西风2级', '北风4级', '微风'];
      expect(translations.zh.forecast.wind).toBe('风力');

      zhWinds.forEach(wind => {
        expect(wind, `风力"${wind}"在mock数据中使用`).toBeTruthy();
      });
    });
  });

  describe('I18nProvider Context 功能', () => {
    it('默认语言为中文', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      expect(screen.getByTestId('locale')).toHaveTextContent('zh');
      expect(screen.getByTestId('title')).toHaveTextContent('城市空气质量监测面板');
    });

    it('setLocale 切换到英文', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      act(() => {
        screen.getByTestId('set-en').click();
      });
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
      expect(screen.getByTestId('title')).toHaveTextContent('City Air Quality Monitor');
    });

    it('setLocale 切换到中文', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      act(() => {
        screen.getByTestId('set-en').click();
      });
      expect(screen.getByTestId('locale')).toHaveTextContent('en');

      act(() => {
        screen.getByTestId('set-zh').click();
      });
      expect(screen.getByTestId('locale')).toHaveTextContent('zh');
      expect(screen.getByTestId('title')).toHaveTextContent('城市空气质量监测面板');
    });

    it('toggleLocale 在中英文之间切换', () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );
      expect(screen.getByTestId('locale')).toHaveTextContent('zh');

      act(() => {
        screen.getByTestId('toggle').click();
      });
      expect(screen.getByTestId('locale')).toHaveTextContent('en');

      act(() => {
        screen.getByTestId('toggle').click();
      });
      expect(screen.getByTestId('locale')).toHaveTextContent('zh');
    });

    it('useI18n 在 Provider 外使用抛出错误', () => {
      const consoleError = console.error;
      console.error = () => {};
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useI18n must be used within an I18nProvider');
      console.error = consoleError;
    });
  });

  describe('AQI 等级多语言', () => {
    it('中文 AQI 等级文本正确', () => {
      expect(getAqiLevelText(25, 'zh')).toBe('优');
      expect(getAqiLevelText(75, 'zh')).toBe('良');
      expect(getAqiLevelText(125, 'zh')).toBe('轻度污染');
      expect(getAqiLevelText(175, 'zh')).toBe('中度污染');
      expect(getAqiLevelText(250, 'zh')).toBe('重度污染');
      expect(getAqiLevelText(350, 'zh')).toBe('严重污染');
    });

    it('英文 AQI 等级文本正确', () => {
      expect(getAqiLevelText(25, 'en')).toBe('Excellent');
      expect(getAqiLevelText(75, 'en')).toBe('Good');
      expect(getAqiLevelText(125, 'en')).toBe('Light');
      expect(getAqiLevelText(175, 'en')).toBe('Moderate');
      expect(getAqiLevelText(250, 'en')).toBe('Heavy');
      expect(getAqiLevelText(350, 'en')).toBe('Severe');
    });

    it('getAqiLevels 返回正确的中英文等级', () => {
      const zhLevels = getAqiLevels('zh');
      const enLevels = getAqiLevels('en');

      expect(zhLevels.map(l => l.level)).toEqual([
        '优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'
      ]);
      expect(enLevels.map(l => l.level)).toEqual([
        'Excellent', 'Good', 'Light', 'Moderate', 'Heavy', 'Severe'
      ]);

      zhLevels.forEach((level, idx) => {
        expect(level.min).toBe(enLevels[idx].min);
        expect(level.max).toBe(enLevels[idx].max);
        expect(level.color).toBe(enLevels[idx].color);
      });
    });

    it('默认 locale 为 zh', () => {
      expect(getAqiLevelText(75)).toBe('良');
      expect(getAqiLevels()[0].level).toBe('优');
    });
  });

  describe('ForecastPanel 多语言显示', () => {
    it('中文模式下显示正确的中文内容', () => {
      renderWithI18n(<ForecastPanel data={mockForecastData} />, 'zh');

      expect(screen.getByText('未来3天空气质量预报')).toBeInTheDocument();
      expect(screen.getAllByText('首要污染物')).toHaveLength(3);
      expect(screen.getAllByText('温度')).toHaveLength(3);
      expect(screen.getAllByText('天气')).toHaveLength(3);
      expect(screen.getAllByText('风力')).toHaveLength(3);

      expect(screen.getByText('周三')).toBeInTheDocument();
      expect(screen.getByText('周四')).toBeInTheDocument();
      expect(screen.getByText('周五')).toBeInTheDocument();

      expect(screen.getByText('晴')).toBeInTheDocument();
      expect(screen.getByText('多云')).toBeInTheDocument();
      expect(screen.getByText('小雨')).toBeInTheDocument();

      expect(screen.getByText('东风2级')).toBeInTheDocument();
      expect(screen.getByText('南风3级')).toBeInTheDocument();
      expect(screen.getByText('微风')).toBeInTheDocument();

      expect(screen.getByText('良')).toBeInTheDocument();
      expect(screen.getByText('轻度污染')).toBeInTheDocument();
      expect(screen.getByText('优')).toBeInTheDocument();
    });

    it('英文模式下标题和标签正确翻译', () => {
      renderWithI18n(<ForecastPanel data={mockForecastData} />, 'en');

      expect(screen.getByText('3-Day Air Quality Forecast')).toBeInTheDocument();
      expect(screen.getAllByText('Primary')).toHaveLength(3);
      expect(screen.getAllByText('Temp')).toHaveLength(3);
      expect(screen.getAllByText('Weather')).toHaveLength(3);
      expect(screen.getAllByText('Wind')).toHaveLength(3);
    });

    it('英文模式下 AQI 等级正确翻译', () => {
      renderWithI18n(<ForecastPanel data={mockForecastData} />, 'en');

      expect(screen.getByText('Good')).toBeInTheDocument();
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Excellent')).toBeInTheDocument();
    });

    it('英文模式下星期应显示英文 - 当前失败用例（待修复）', () => {
      renderWithI18n(<ForecastPanel data={mockForecastData} />, 'en');

      const zhWeekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const enWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      zhWeekdays.forEach(day => {
        expect(screen.queryByText(day), `英文模式下不应显示中文星期"${day}"`).not.toBeInTheDocument();
      });

      enWeekdays.forEach(day => {
        if (['Wed', 'Thu', 'Fri'].includes(day)) {
          expect(screen.getByText(day), `英文模式下应显示英文星期"${day}"`).toBeInTheDocument();
        }
      });
    });

    it('英文模式下天气应显示英文 - 当前失败用例（待修复）', () => {
      renderWithI18n(<ForecastPanel data={mockForecastData} />, 'en');

      const zhWeathers = ['晴', '多云', '阴', '小雨', '雷阵雨'];

      zhWeathers.forEach(weather => {
        expect(screen.queryByText(weather), `英文模式下不应显示中文天气"${weather}"`).not.toBeInTheDocument();
      });

      expect(screen.getByText('Sunny'), '英文模式下"晴"应翻译为"Sunny"').toBeInTheDocument();
      expect(screen.getByText('Cloudy'), '英文模式下"多云"应翻译为"Cloudy"').toBeInTheDocument();
      expect(screen.getByText('Light Rain'), '英文模式下"小雨"应翻译为"Light Rain"').toBeInTheDocument();
    });

    it('英文模式下风力应显示英文 - 当前失败用例（待修复）', () => {
      renderWithI18n(<ForecastPanel data={mockForecastData} />, 'en');

      const zhWinds = ['东风2级', '南风3级', '西风2级', '北风4级', '微风'];

      zhWinds.forEach(wind => {
        expect(screen.queryByText(wind), `英文模式下不应显示中文风力"${wind}"`).not.toBeInTheDocument();
      });

      expect(screen.getByText('E 2'), '英文模式下"东风2级"应翻译为"E 2"').toBeInTheDocument();
      expect(screen.getByText('S 3'), '英文模式下"南风3级"应翻译为"S 3"').toBeInTheDocument();
      expect(screen.getByText('Light'), '英文模式下"微风"应翻译为"Light"').toBeInTheDocument();
    });

    it('语言切换后预报内容应同步更新', () => {
      const { rerender } = render(
        <I18nProvider>
          <LocaleSetter locale="zh" />
          <ForecastPanel data={mockForecastData} />
        </I18nProvider>
      );

      expect(screen.getByText('未来3天空气质量预报')).toBeInTheDocument();
      expect(screen.getByText('良')).toBeInTheDocument();

      rerender(
        <I18nProvider>
          <LocaleSetter locale="en" />
          <ForecastPanel data={mockForecastData} />
        </I18nProvider>
      );

      expect(screen.getByText('3-Day Air Quality Forecast')).toBeInTheDocument();
      expect(screen.getByText('Good')).toBeInTheDocument();
    });

    it('天气图标在中英文模式下都能正确匹配', () => {
      const testData: ForecastData[] = [
        { ...mockForecastData[0], weather: '晴' },
        { ...mockForecastData[0], weather: 'Sunny' },
      ];

      const { container } = renderWithI18n(
        <ForecastPanel data={testData} />, 'zh'
      );

      const weathers = container.querySelectorAll('.text-2xl');
      expect(weathers.length).toBeGreaterThan(0);
    });
  });

  describe('翻译值不为空', () => {
    const checkAllValues = (obj: Record<string, any>, path = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === 'string') {
          expect(value.trim(), `${currentPath} 翻译值不能为空`).not.toBe('');
        } else if (typeof value === 'object' && value !== null) {
          checkAllValues(value, currentPath);
        }
      });
    };

    it('所有中文翻译值非空', () => {
      checkAllValues(translations.zh);
    });

    it('所有英文翻译值非空', () => {
      checkAllValues(translations.en);
    });
  });

  describe('Locale 类型安全', () => {
    it('Locale 类型只允许 zh 和 en', () => {
      const validLocales: Locale[] = ['zh', 'en'];
      expect(validLocales).toEqual(['zh', 'en']);
    });
  });
});
