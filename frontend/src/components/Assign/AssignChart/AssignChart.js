import React from 'react';
import { Pie as PieChart } from 'react-chartjs';

const ASSIGN_BUCKETS = {
  Bangla: {
    min: 0,
    max: 100
  },
  English: {
    min: 100,
    max: 200
  },
  Mathematics: {
    min: 200,
    max: 10000000
  }
};

const assignChart = props => {
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in ASSIGN_BUCKETS) {
    const filteredAssignCount = props.assign.reduce((prev, current) => {
      if (
        current.subject.price > ASSIGN_BUCKETS[bucket].min &&
        current.subject.price < ASSIGN_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredAssignCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      // label: "My First dataset",
      fillColor: 'rgba(220,220,220,0.5)',
      strokeColor: 'rgba(220,220,220,0.8)',
      highlightFill: 'rgba(220,220,220,0.75)',
      highlightStroke: 'rgba(220,220,220,1)',
      data: values
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <PieChart data={chartData} />
    </div>
  );
};

export default assignChart;
