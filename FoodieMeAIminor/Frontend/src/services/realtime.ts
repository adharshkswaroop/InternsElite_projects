import { useState, useEffect, useRef, useCallback } from 'react';

export interface RealtimeTelemetryEvent {
  type: 'CONNECTED' | 'HEARTBEAT' | 'METRICS_TICK' | 'SECURITY_EVENT' | 'CACHE_UPDATE' | 'RECIPE_BROADCAST';
  timestamp: number;
  correlationId?: string;
  data?: {
    activeConnections?: number;
    memoryHeapMb?: number;
    cpuLoadPercent?: number;
    cacheHitRate?: number;
    circuitBreakerStatus?: 'CLOSED' | 'HALF_OPEN' | 'OPEN';
    p95LatencyMs?: number;
    totalRequests?: number;
    securityAuditScore?: number;
    message?: string;
    [key: string]: any;
  };
}

export interface UseRealtimeStreamReturn {
  isConnected: boolean;
  connectionLatencyMs: number;
  lastEvent: RealtimeTelemetryEvent | null;
  reconnectAttempts: number;
  telemetryHistory: RealtimeTelemetryEvent[];
  activeConnectionsCount: number;
  memoryUsageMb: number;
  circuitBreakerStatus: 'CLOSED' | 'HALF_OPEN' | 'OPEN';
  reconnect: () => void;
}

export function useRealtimeStream(endpointUrl: string = '/api/realtime/stream'): UseRealtimeStreamReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionLatencyMs, setConnectionLatencyMs] = useState(18);
  const [lastEvent, setLastEvent] = useState<RealtimeTelemetryEvent | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [telemetryHistory, setTelemetryHistory] = useState<RealtimeTelemetryEvent[]>([]);
  const [activeConnectionsCount, setActiveConnectionsCount] = useState(1);
  const [memoryUsageMb, setMemoryUsageMb] = useState(48.2);
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState<'CLOSED' | 'HALF_OPEN' | 'OPEN'>('CLOSED');

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const es = new EventSource(endpointUrl);
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
        setReconnectAttempts(0);
      };

      es.onmessage = (event) => {
        try {
          const parsed: RealtimeTelemetryEvent = JSON.parse(event.data);
          const now = Date.now();
          if (parsed.timestamp) {
            const latency = Math.max(1, Math.min(120, now - parsed.timestamp));
            setConnectionLatencyMs(latency);
          }

          setLastEvent(parsed);
          setTelemetryHistory((prev) => [parsed, ...prev].slice(0, 40));

          if (parsed.data?.activeConnections) {
            setActiveConnectionsCount(parsed.data.activeConnections);
          }
          if (parsed.data?.memoryHeapMb) {
            setMemoryUsageMb(parsed.data.memoryHeapMb);
          }
          if (parsed.data?.circuitBreakerStatus) {
            setCircuitBreakerStatus(parsed.data.circuitBreakerStatus);
          }
        } catch (e) {
          // Heartbeat or comment line
        }
      };

      es.onerror = () => {
        setIsConnected(false);
        es.close();

        // Exponential backoff with jitter: min(30s, 1s * 2^attempts + jitter)
        setReconnectAttempts((prev) => {
          const nextAttempt = prev + 1;
          const delay = Math.min(30000, Math.pow(2, Math.min(nextAttempt, 5)) * 1000 + Math.random() * 800);
          if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = window.setTimeout(connect, delay);
          return nextAttempt;
        });
      };
    } catch (err) {
      console.warn('Realtime SSE fallback mode active:', err);
    }
  }, [endpointUrl]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, [connect]);

  return {
    isConnected,
    connectionLatencyMs,
    lastEvent,
    reconnectAttempts,
    telemetryHistory,
    activeConnectionsCount,
    memoryUsageMb,
    circuitBreakerStatus,
    reconnect: connect,
  };
}
