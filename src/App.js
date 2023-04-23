// Đề bài
// Xây dựng một bar chart đơn giản không sử dụng thư viện ngoài.
// (Chỉ sử dụng 1 trong các framework angularjs, nextjs, vuejs, reactjs)
// Thời gian thực hiện: 3 ngày làm việc kể từ lúc nhận đề bài.

// Bar chart hoạt động như sau:
// Mỗi giây, chương trình sinh ra một số ngẫu nhiên từ 1 đến 100.
// Tương ứng sẽ thêm một cột thêm vào bar chart có độ cao tương ứng với số ngẫu nhiên được sinh ra.
// Bar chart sẽ lưu lại 3600 số gần nhất và ban đầu hiển thị 50 số gần nhất được sinh ra.
// Có 1 input box để chọn điểm thời gian xem dữ liệu và sẽ hiển thị 50 cột từ thời điểm đó.
// (Không bắt buộc phải hiển thị label trên trục ox, oy và cột nhưng nếu hiển thị được là điểm cộng cho ứng viên)

import { useEffect, useState, useCallback, useMemo } from "react";
import "./App.css";
import { convertTimeToSeconds, convertSecondsToTime } from "./utils";

function App() {
  // const initialTime = new Date().toISOString().slice(11, 16);
  const initialTime = "";
  const [data, setData] = useState([]);
  const [timeSelected, setTimeSelected] = useState(initialTime);

  const maxLengthData = 3600;
  const maximumDataDisplay = 50;

  // auto generate data
  useEffect(() => {
    const milliseconds = 1000;
    const interval = setInterval(() => {
      // random number from 1 to 100
      const randomNumber = Math.floor(Math.random() * 100) + 1;

      setData((current) => {
        const baseData =
          current?.length >= maxLengthData
            ? current.slice(
                current.length - maxLengthData - 2,
                current.length - 1
              )
            : current;

        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        const seconds = new Date().getSeconds();
        return [
          ...baseData,
          {
            time: convertTimeToSeconds(hours, minutes, seconds),
            value: randomNumber,
          },
        ];
      });
    }, milliseconds);

    if (timeSelected) clearInterval();
    return () => {
      clearInterval(interval);
    };
  }, [timeSelected]);

  const handleChangeTime = (ev) => {
    setTimeSelected(ev.target.value);
  };

  // calculate data display
  const dataDisplay = useCallback(() => {
    if (timeSelected) {
      const timeStampSelected = convertTimeToSeconds(
        ...timeSelected.split(":")
      );
      const index = data?.findIndex((el) => el.time >= timeStampSelected);

      return index === -1 ? [] : data.slice(index, index + maximumDataDisplay);
    }

    return data?.length > maximumDataDisplay
      ? data.slice(data?.length - maximumDataDisplay - 1, data?.length - 1)
      : data;
  }, [data, timeSelected]);

  // render xaxis, yaxis
  const yAxis = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
  const getXAxis = useMemo(() => {
    const firstTime = dataDisplay()[0]?.time;
    return new Array(maximumDataDisplay).fill(0).map((_, i) => i + firstTime);
  }, [dataDisplay]);

  return (
    <div className="container">
      <div>
        Select time:
        <input
          type="time"
          id="datetime"
          name="datetime"
          value={timeSelected}
          onChange={handleChangeTime}
        />
      </div>
      <div className="chart">
        <div className="y-axis">
          {yAxis.map((el, i) => {
            return (
              <span key={el} className="value">
                {el}
              </span>
            );
          })}
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <div className="plot-area">
            {dataDisplay().map((record, index) => {
              return (
                <div
                  key={record.time}
                  className="bar"
                  style={{ height: `${record.value}%` }}
                >
                  {record.value}
                </div>
              );
            })}
          </div>
          <div className="x-axis">
            {getXAxis.map((time, index) => {
              return (
                <div className="time" key={`${time}_${index}`}>
                  {convertSecondsToTime(time)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
