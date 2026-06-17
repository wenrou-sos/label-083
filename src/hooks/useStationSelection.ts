import { useState, useMemo, useEffect, useCallback } from 'react';
import type { StationData } from '../data/mockData';

interface UseStationSelectionOptions {
  maxSelect?: number;
}

interface UseStationSelectionResult {
  selectedIds: Set<string>;
  selectedStations: StationData[];
  isSelected: (id: string) => boolean;
  isDisabled: (id: string) => boolean;
  toggleStation: (id: string) => void;
  clearSelection: () => void;
  count: number;
  isMax: boolean;
}

const DEFAULT_MAX = 6;

export const useStationSelection = (
  allStations: StationData[],
  options: UseStationSelectionOptions = {}
): UseStationSelectionResult & {
  activeTab: 'stats' | 'compare';
  setActiveTab: (tab: 'stats' | 'compare') => void;
} => {
  const maxSelect = options.maxSelect ?? DEFAULT_MAX;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'stats' | 'compare'>('stats');

  const selectedStations = useMemo(
    () => allStations.filter(s => selectedIds.has(s.id)),
    [allStations, selectedIds]
  );

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const isDisabled = useCallback(
    (id: string) => !selectedIds.has(id) && selectedIds.size >= maxSelect,
    [selectedIds, maxSelect]
  );

  const toggleStation = useCallback(
    (id: string) => {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          if (next.size === 0) {
            setTimeout(() => setActiveTab('stats'), 0);
          }
        } else {
          if (next.size >= maxSelect) {
            return prev;
          }
          next.add(id);
          setTimeout(() => setActiveTab('compare'), 0);
        }
        return next;
      });
    },
    [maxSelect]
  );

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setActiveTab('stats');
  }, []);

  useEffect(() => {
    if (selectedIds.size === 0 && activeTab === 'compare') {
      setActiveTab('stats');
    }
  }, [selectedIds.size, activeTab]);

  return {
    selectedIds,
    selectedStations,
    isSelected,
    isDisabled,
    toggleStation,
    clearSelection,
    count: selectedIds.size,
    isMax: selectedIds.size >= maxSelect,
    activeTab,
    setActiveTab,
  };
};
