"use client"

import { useState, useEffect } from "react"
import UserGreeting from "./components/UserGreeting"
import StatusMessage from "./components/StatusMessage"
import DateTimeWeather from "./components/DateTimeWeather"
import Control from "./components/Control_Light_Fan"
import StatsBar from "./components/StatsBar"
import Timer from "./components/TimerDown"


export default function Dashboard() {
  // Khởi tạo ngày theo định dạng "vi-VN"
  const [lastControlChange, setLastControlChange] = useState<number | null>(null)
  const handleControlChange = () => {
    setLastControlChange(Date.now()) 
  }
  const [formattedDate, setFormattedDate] = useState(new Date().toLocaleDateString("vi-VN"))
  let userID =1;
  useEffect(() => {
    if (typeof window !== "undefined") {
      userID = (parseInt(localStorage.getItem("user_id") || "1"));
    }
}, []);
  // Cập nhật lại ngày mỗi 60 giây
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFormattedDate(new Date().toLocaleDateString("vi-VN"))
    }, 60000)
    return () => clearInterval(intervalId)
  }, [])


  return (
    <div className="grid grid-cols-1 gap-8 h-full ml-5 mr-5 ">
      {/* Row trên: dành cho desktop sẽ hiển thị 3 cột theo grid 12 cột */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 ">
        {/* Cột trái: UserGreeting và StatusMessage */}
        <div className="md:col-span-3 grid grid-rows-3 gap-4">
          <div className="row-span-1">
            <UserGreeting />
          </div>
          <div className="row-span-2">
            <StatusMessage />
          </div>
        </div>
        {/* Cột giữa: DateTimeWeather */}
        <div className="md:col-span-3">
          <DateTimeWeather />
        </div>
        {/* Cột phải: FanStats (Đèn) */}
        <div className="md:col-span-6">
          <StatsBar title="Đèn" date={formattedDate} color="pink" />

        </div>
      </div>

      {/* Row dưới */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 ">
        {/* Cột trái: LightControl và FanControl */}
        <div className="md:col-span-4 grid gap-4 ">
          <Control name={'Đèn'} user_id={userID} onChange={handleControlChange} />
          <Control name={'Quạt'} user_id={userID} onChange={handleControlChange} />
        </div>
        {/* Cột giữa: Timer */}
        <div className="md:col-span-2">
          <Timer lastChanged={lastControlChange} />
        </div>
        {/* Cột phải: FanStats (Quạt  ) */}
        <div className="md:col-span-6">
          <StatsBar title="Quạt" date={formattedDate} color="teal" />
        </div>
      </div>
      
    </div>
  )
}
