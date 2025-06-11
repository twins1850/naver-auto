import { useState, useEffect, useCallback } from "react";
import type { UserActivity } from "./useWebSocket";

export interface RealTimeStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  successfulPosts: number;
  failedPosts: number;
  successRate: number;
  lastUpdate: string;
}

export interface UserSummary {
  userId: string;
  status: string;
  lastActivity: string;
  progress: number;
  message: string;
}

export const useRealTimeStats = (userActivities: UserActivity[]) => {
  const [stats, setStats] = useState<RealTimeStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    successfulPosts: 0,
    failedPosts: 0,
    successRate: 0,
    lastUpdate: new Date().toISOString(),
  });

  const [userSummaries, setUserSummaries] = useState<UserSummary[]>([]);

  const calculateStats = useCallback(() => {
    if (userActivities.length === 0) {
      return;
    }

    // 사용자별 최신 활동 그룹화
    const latestActivities = userActivities.reduce(
      (acc, activity) => {
        const existing = acc[activity.user_id];
        if (
          !existing ||
          new Date(activity.timestamp) > new Date(existing.timestamp)
        ) {
          acc[activity.user_id] = activity;
        }
        return acc;
      },
      {} as Record<string, UserActivity>
    );

    const activities = Object.values(latestActivities);

    // 통계 계산
    const totalUsers = activities.length;
    const activeUsers = activities.filter((a) =>
      ["connected", "starting", "running"].includes(a.status)
    ).length;

    let totalPosts = 0;
    let successfulPosts = 0;
    let failedPosts = 0;

    activities.forEach((activity) => {
      // 메시지에서 성공/실패 정보 추출 (예: "성공: 5개, 실패: 2개")
      const successMatch = activity.message.match(/성공:\s*(\d+)/);
      const failMatch = activity.message.match(/실패:\s*(\d+)/);

      if (successMatch) {
        successfulPosts += parseInt(successMatch[1]);
      }
      if (failMatch) {
        failedPosts += parseInt(failMatch[1]);
      }
    });

    totalPosts = successfulPosts + failedPosts;
    const successRate =
      totalPosts > 0 ? (successfulPosts / totalPosts) * 100 : 0;

    setStats({
      totalUsers,
      activeUsers,
      totalPosts,
      successfulPosts,
      failedPosts,
      successRate: Math.round(successRate * 10) / 10,
      lastUpdate: new Date().toISOString(),
    });

    // 사용자 요약 생성
    const summaries: UserSummary[] = activities.map((activity) => ({
      userId: activity.user_id,
      status: activity.status,
      lastActivity: activity.timestamp,
      progress: activity.progress,
      message: activity.message,
    }));

    setUserSummaries(summaries);
  }, [userActivities]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "connected":
        return "#10b981"; // green
      case "starting":
        return "#f59e0b"; // yellow
      case "running":
        return "#3b82f6"; // blue
      case "completed":
        return "#10b981"; // green
      case "failed":
      case "error":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "connected":
        return "연결됨";
      case "starting":
        return "시작 중";
      case "running":
        return "실행 중";
      case "completed":
        return "완료";
      case "failed":
        return "실패";
      case "error":
        return "오류";
      default:
        return "알 수 없음";
    }
  };

  return {
    stats,
    userSummaries,
    getStatusColor,
    getStatusLabel,
    refreshStats: calculateStats,
  };
};
