"use client";

import { useCallback, useRef, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

interface UseAutoSaveOptions<T> {
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  trigger: () => void;
  cancel: () => void;
  isPending: boolean;
}

/**
 * Hook for auto-saving data with debouncing
 *
 * @example
 * const { trigger } = useAutoSave({
 *   onSave: async (content) => {
 *     await saveMutation.mutateAsync({ content });
 *   },
 *   debounceMs: 2000,
 *   enabled: true,
 * });
 *
 * // In your onChange handler:
 * const handleChange = (newContent) => {
 *   setContent(newContent);
 *   trigger();
 * };
 */
export function useAutoSave<T>({
  onSave,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const dataRef = useRef<T | null>(null);
  const isPendingRef = useRef(false);

  const save = useCallback(async () => {
    if (!enabled || !dataRef.current) return;

    isPendingRef.current = true;
    try {
      await onSave(dataRef.current);
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      isPendingRef.current = false;
    }
  }, [onSave, enabled]);

  const debouncedSave = useDebouncedCallback(save, debounceMs);

  const trigger = useCallback(() => {
    if (!enabled) return;
    debouncedSave();
  }, [debouncedSave, enabled]);

  const cancel = useCallback(() => {
    debouncedSave.cancel();
  }, [debouncedSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return {
    trigger,
    cancel,
    isPending: isPendingRef.current,
  };
}

/**
 * Simplified version that auto-triggers on data change
 */
export function useAutoSaveOnChange<T>(
  data: T,
  options: UseAutoSaveOptions<T>,
) {
  const { onSave, debounceMs = 2000, enabled = true } = options;
  const previousDataRef = useRef<T>(data);
  const isInitialMount = useRef(true);

  const debouncedSave = useDebouncedCallback(
    async () => {
      if (!enabled) return;

      try {
        await onSave(data);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    },
    debounceMs,
  );

  useEffect(() => {
    // Skip initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousDataRef.current = data;
      return;
    }

    // Skip if data hasn't changed
    if (previousDataRef.current === data) {
      return;
    }

    previousDataRef.current = data;

    if (enabled) {
      debouncedSave();
    }
  }, [data, enabled, debouncedSave]);

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return {
    cancel: debouncedSave.cancel,
    flush: debouncedSave.flush,
  };
}
