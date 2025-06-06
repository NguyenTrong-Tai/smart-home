// services/sensorStatisticsService.ts
import axiosClient from "../utils/axiosClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;
export interface SensorStatItem {
    device_id: string;
    value: number;
    timestamp: string;
  }
// const token = localStorage.getItem("access_token");
export const sensorStatisticsService = {
    getSensorStatistics: async (
      deviceType: "temp_sensor" | "humid_sensor",
      userId: number | string
    ): Promise<SensorStatItem[]> => {
      try {
        const response = await axiosClient.get(`${API_BASE_URL}/device/${deviceType}/statistics?user_id=${userId}`,{
          headers: { "Content-Type": "application/json" },
        });
        if (!response) {
          throw new Error(`Lỗi khi lấy dữ liệu thống kê từ ${deviceType}`);
        }
  
        const data = await response.data;
        return data;
      } catch (error: any) {
        console.error(`Lỗi khi gọi API ${deviceType}:`, error.message);
        throw error;
      }
    }
  };
  