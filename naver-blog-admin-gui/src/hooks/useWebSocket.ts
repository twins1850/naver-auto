import { useEffect, useState, useRef, useCallback } from "react";

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: string;
}

export interface UserActivity {
  type: "user_activity";
  user_id: string;
  status:
    | "connected"
    | "starting"
    | "running"
    | "completed"
    | "failed"
    | "error";
  progress: number;
  message: string;
  timestamp: string;
}

export interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const {
    url,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    autoReconnect = true,
    reconnectInterval = 5000,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const isManuallyDisconnectedRef = useRef(false);
  const lastConnectAttemptRef = useRef(0);
  const lastPongReceivedRef = useRef(0);

  // Heartbeat 시작
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const now = Date.now();
        // 30초 동안 pong 응답이 없으면 연결이 끊어진 것으로 간주
        if (
          lastPongReceivedRef.current > 0 &&
          now - lastPongReceivedRef.current > 30000
        ) {
          console.log("WebSocket heartbeat timeout, 재연결 시도");
          wsRef.current.close();
          return;
        }

        // ping 전송
        wsRef.current.send(
          JSON.stringify({
            type: "ping",
            timestamp: new Date().toISOString(),
          })
        );
      }
    }, 10000); // 10초마다 ping
  }, []);

  // Heartbeat 중지
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    const now = Date.now();
    if (now - lastConnectAttemptRef.current < 2000) {
      console.log("🚫 연결 시도 간격이 너무 짧음, 스킵");
      return;
    }
    lastConnectAttemptRef.current = now;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("✅ 이미 WebSocket이 연결되어 있음");
      return;
    }

    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.log("⏳ 이미 연결 중인 WebSocket이 있음, 기다림");
      return;
    }

    console.log("🔌 WebSocket 연결 시도:", url);
    setConnectionStatus("connecting");

    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log("✅ WebSocket 연결 성공:", url);
        console.log("📊 WebSocket readyState:", wsRef.current?.readyState);
        setIsConnected(true);
        setConnectionStatus("connected");
        reconnectAttemptsRef.current = 0;
        isManuallyDisconnectedRef.current = false;
        lastPongReceivedRef.current = Date.now();

        // heartbeat 시작
        console.log("💓 Heartbeat 시작");
        startHeartbeat();

        onConnect?.();

        // 초기 ping 전송
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          console.log("📤 초기 ping 메시지 전송");
          wsRef.current.send(
            JSON.stringify({
              type: "ping",
              timestamp: new Date().toISOString(),
            })
          );
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("📨 WebSocket 메시지 수신:", message.type, message);
          setLastMessage(message);

          // pong 응답 처리
          if (message.type === "pong" || message.type === "heartbeat") {
            console.log("💗 Heartbeat 응답 수신:", message.type);
            lastPongReceivedRef.current = Date.now();
            return;
          }

          // 연결 성공 메시지 처리
          if (message.type === "connection_established") {
            console.log("🎉 서버에서 연결 확인:", message);
            return;
          }

          // 사용자 활동 업데이트
          if (message.type === "user_activity") {
            const activity = message as UserActivity;
            console.log("👤 사용자 활동 업데이트:", activity);
            setUserActivities((prev) => {
              const updated = prev.filter(
                (a) => a.user_id !== activity.user_id
              );
              return [...updated, activity].slice(-50);
            });
          }

          onMessage?.(message);
        } catch (error) {
          console.error("❌ WebSocket 메시지 파싱 오류:", error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("🔌 WebSocket 연결 종료:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          manualDisconnect: isManuallyDisconnectedRef.current,
        });

        setIsConnected(false);
        stopHeartbeat();

        if (event.code === 1000 || isManuallyDisconnectedRef.current) {
          console.log("✅ WebSocket 정상 종료");
          setConnectionStatus("disconnected");
          onDisconnect?.();
          return;
        }

        // 비정상 종료인 경우에만 재연결
        setConnectionStatus("error");
        onDisconnect?.();

        if (
          autoReconnect &&
          reconnectAttemptsRef.current < maxReconnectAttempts &&
          !isManuallyDisconnectedRef.current
        ) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `🔄 WebSocket 재연결 시도 ${reconnectAttemptsRef.current}/${maxReconnectAttempts} (${reconnectInterval}ms 후)`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isManuallyDisconnectedRef.current) {
              connect();
            }
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.log("❌ WebSocket 최대 재연결 시도 초과");
          setConnectionStatus("error");
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("💥 WebSocket 오류:", error);
        setConnectionStatus("error");
        onError?.(error);
      };
    } catch (error) {
      console.error("💥 WebSocket 생성 오류:", error);
      setConnectionStatus("error");
    }
  }, [
    url,
    autoReconnect,
    reconnectInterval,
    onConnect,
    onDisconnect,
    onError,
    startHeartbeat,
    stopHeartbeat,
  ]);

  const disconnect = useCallback(() => {
    isManuallyDisconnectedRef.current = true;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    stopHeartbeat();

    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus("disconnected");
  }, [stopHeartbeat]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error("WebSocket 메시지 전송 오류:", error);
        return false;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    if (!isManuallyDisconnectedRef.current) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    userActivities,
    sendMessage,
    connect,
    disconnect,
  };
};
