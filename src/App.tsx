import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Button, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import html2canvas from 'html2canvas';
import chartData from './data/chartData.json';

type DataPoint = {
  timestamp: string;
  value: number;
};

const App: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<string>('daily');
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData(chartData);
  }, []);

  const filterDataByTimeframe = (timeframe: string) => {
    const filteredData = chartData.filter((point) => {
      const date = new Date(point.timestamp);
      if (timeframe === 'daily') return true;
      if (timeframe === 'weekly') return date.getDate() % 7 === 0;
      if (timeframe === 'monthly') return date.getDate() === 1;
      return true;
    });
    setData(filteredData);
  };

  const handleTimeframeChange = (event: SelectChangeEvent<string>) => {
    const selectedTimeframe = event.target.value as string;
    setTimeframe(selectedTimeframe);
    filterDataByTimeframe(selectedTimeframe);
  };

  const handleDataPointClick = (data: DataPoint) => {
    alert(`Data Point: ${data.timestamp}, Value: ${data.value}`);
  };

  const exportChartAsImage = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Charting App</h1>
      <Select
        value={timeframe}
        onChange={handleTimeframeChange}
        style={{ marginBottom: '20px' }}
      >
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
      </Select>
      <div ref={chartRef}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={(e) => {
              if (e && e.activePayload) {
                handleDataPointClick(e.activePayload[0].payload);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Button variant="contained" color="primary" onClick={exportChartAsImage} style={{ marginTop: '20px' }}>
        Export as PNG
      </Button>
    </div>
  );
};

export default App;
