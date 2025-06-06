"use client"

import React, { useEffect, useState, useCallback ,useRef} from 'react';
import { useWeather } from '@/app/hooks/useWeather'; 
import { useMqttClient } from "@/app/hooks/useMqttClient"; // Import hook MQTT
// Component chính
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;
const AIO_KEY = process.env.NEXT_PUBLIC_AIO_KEY;
const AIO_USERNAME = process.env.NEXT_PUBLIC_AIO_USERNAME;

const getLatestFeedValue = async (feed: string) => {
  if (!AIO_KEY ){
      throw new Error("AIO_KEY is not defined");
  }
  const res = await fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feed}/data?limit=1`, {
      headers: {
          "X-AIO-Key": AIO_KEY,
      },
      });

  if (!res.ok) {
      throw new Error("Failed to fetch feed data");
      }
  const data = await res.json();
  return data[0]?.value || null;

}

export default function DateTimeWeather() {
  const { date, time } = useDateTime();
  // const { temperature, humidity, isLoading, error } = useWeather();
  const [temperature, setTemperature] = useState<string>("");
  const [humidity, setHumidity] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
// lấy dữ liệu lần đầu
  useEffect(()=>{
    const fetchData = async()=>{
      try{

        const temp = await getLatestFeedValue("temperature")
        const humi = await getLatestFeedValue("huminity")
        setTemperature(temp)
        setHumidity(humi)
        setError(null)
      }
      catch(err: any){
        setError(err.message);
      }finally{
        setIsLoading(false);
      }
    }
    fetchData()
  },[])

  const mqttCallback = useCallback((feed: string, value: string) => {
    if (feed == "temperature" ) setTemperature(value);
    if (feed == "huminity") setHumidity(value);
  }, []);
  const {publish } = useMqttClient(mqttCallback);
  // Gradient background styles
  const backgroundStyle = {
    background: 'linear-gradient(226.54deg, rgba(234, 50, 50, 0) 3.33%, rgba(234, 50, 50, 0.380622) 67.29%, rgba(234, 50, 50, 0.4) 73.26%), rgba(97, 122, 215, 0.51)',
    backgroundBlendMode: 'multiply, normal'
  };

  return (
    <div 
      className="rounded-xl p-4 text-white flex flex-col justify-between h-full"
      style={backgroundStyle}
    >
      <div className="text-left">
        <div className="text-xl">{date}</div>
        <div className="text-4xl font-bold">{time}</div>
      </div>
      
      <WeatherIcon />
      
      <div className="flex items-center justify-between mt-8">
        <div className="text-2xl font-bold">Hồ Chí Minh</div>
        
        {isLoading ? (
          <div className="text-lg">Đang tải...</div>
        ) : error ? (
          <div className="text-sm text-red-300">Lỗi: không thể lấy nhiệt độ</div>
        ) : (
          <WeatherDisplay temperature={temperature} humidity={humidity} />
        )}
      </div>
    </div>
  );
}


function useDateTime() {
  const [dateTime, setDateTime] = useState({
    date: "",
    time: ""
  });

  const updateDateTime = useCallback(() => {
    const now = new Date();
    setDateTime({
      date: now.toLocaleDateString("vi-VN", { month: "short", day: "2-digit" }),
      time: now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: true })
    });
  }, []);

  useEffect(() => {
    updateDateTime(); // Cập nhật ngay lần đầu
    
    const interval = setInterval(updateDateTime, 60000); 
    
    return () => clearInterval(interval);
  }, [updateDateTime]);

  return dateTime;
}

// Thành phần giao diện
const WeatherIcon = () => (
  <div className="flex justify-center items-center">
    <img src="/OIP.png" className="w-30 h-30" alt="Biểu tượng thời tiết" />
  </div>
);

const WeatherDisplay = ({ temperature, humidity }: { temperature: any,  humidity: any }) => (
  <div className="flex items-center gap-2">
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1">
        <svg
          className="w-6 h-6 text-red-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 2a2 2 0 1 1 4 0v10.465A4.998 4.998 0 0 1 17 17a5 5 0 1 1-7-4.535V2Zm4 12.17V4h-2v10.17l-.5.287A3 3 0 1 0 14 17a2.99 2.99 0 0 0-1.5-2.543l-.5-.287Z" />
        </svg>
        <div className="text-3xl font-bold">{temperature}°C</div>
      </div>
      <div className="flex items-center gap-1">
        <svg
          className="w-6 h-6 text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 2C10 2 4 7.5 4 12a6 6 0 1012 0c0-4.5-6-10-6-10zm3 13a3 3 0 11-6 0c0-.75.25-1.5.75-2.1.5-.6 1.25-1.15 2.25-1.15s1.75.55 2.25 1.15c.5.6.75 1.35.75 2.1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="text-3xl font-bold">{humidity}%</div>
      </div>
    </div>
  </div>

);

