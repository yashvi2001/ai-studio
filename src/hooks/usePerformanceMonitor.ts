import { useEffect, useRef, useCallback } from 'react';
import { devLog } from '../utils/logger';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export function usePerformanceMonitor() {
  const metricsRef = useRef<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  const observerRef = useRef<PerformanceObserver | null>(null);

  const updateMetric = useCallback(
    (name: keyof PerformanceMetrics, value: number) => {
      metricsRef.current[name] = value;

      // Log performance metrics in development
      devLog.log(`Performance Metric - ${name}:`, value);
    },
    []
  );

  const measureTimeToFirstByte = useCallback(() => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        updateMetric('ttfb', ttfb);
      }
    }
  }, [updateMetric]);

  const setupObservers = useCallback(() => {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        observerRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (
              entry.entryType === 'paint' &&
              entry.name === 'first-contentful-paint'
            ) {
              updateMetric('fcp', entry.startTime);
            }
          });
        });
        observerRef.current.observe({ entryTypes: ['paint'] });
      } catch (error) {
        // Log only in development
        devLog.warn('Failed to observe paint entries:', error);
      }
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            updateMetric('lcp', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        // Log only in development
        devLog.warn('Failed to observe LCP entries:', error);
      }
    }

    // First Input Delay
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'first-input') {
              const firstInputEntry = entry as FirstInputEntry;
              if (firstInputEntry.processingStart) {
                updateMetric(
                  'fid',
                  firstInputEntry.processingStart - entry.startTime
                );
              }
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        // Log only in development
        devLog.warn('Failed to observe FID entries:', error);
      }
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const layoutShiftEntry = entry as LayoutShiftEntry;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          });
          updateMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        // Log only in development
        devLog.warn('Failed to observe CLS entries:', error);
      }
    }
  }, [updateMetric]);

  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metricsRef.current };
  }, []);

  const getPerformanceScore = useCallback((): number => {
    const metrics = metricsRef.current;
    let score = 100;

    // FCP scoring (0-100)
    if (metrics.fcp !== null) {
      if (metrics.fcp < 1800) score -= 0;
      else if (metrics.fcp < 3000) score -= 10;
      else score -= 30;
    }

    // LCP scoring (0-100)
    if (metrics.lcp !== null) {
      if (metrics.lcp < 2500) score -= 0;
      else if (metrics.lcp < 4000) score -= 10;
      else score -= 30;
    }

    // FID scoring (0-100)
    if (metrics.fid !== null) {
      if (metrics.fid < 100) score -= 0;
      else if (metrics.fid < 300) score -= 10;
      else score -= 30;
    }

    // CLS scoring (0-100)
    if (metrics.cls !== null) {
      if (metrics.cls < 0.1) score -= 0;
      else if (metrics.cls < 0.25) score -= 10;
      else score -= 30;
    }

    return Math.max(0, score);
  }, []);

  const logPerformanceReport = useCallback(() => {
    const metrics = getMetrics();
    const score = getPerformanceScore();

    // Log only in development
    devLog.group('🚀 Performance Report');
    devLog.log('Overall Score:', score);
    devLog.log('FCP:', metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'N/A');
    devLog.log('LCP:', metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'N/A');
    devLog.log('FID:', metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A');
    devLog.log('CLS:', metrics.cls ? metrics.cls.toFixed(3) : 'N/A');
    devLog.log('TTFB:', metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'N/A');
    devLog.groupEnd();
  }, [getMetrics, getPerformanceScore]);

  useEffect(() => {
    // Measure TTFB immediately
    measureTimeToFirstByte();

    // Setup performance observers
    setupObservers();

    // Log performance report after a delay
    const timeoutId = setTimeout(logPerformanceReport, 5000);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearTimeout(timeoutId);
    };
  }, [measureTimeToFirstByte, setupObservers, logPerformanceReport]);

  return {
    getMetrics,
    getPerformanceScore,
    logPerformanceReport,
  };
}
