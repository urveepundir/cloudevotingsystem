console.log('LoginScreen rendered');

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const API = 'https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com';

export default function StatsScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API}/stats`).then(res => {
      const colors = ['#FF6384', '#36A2EB', '#FFCE56'];
      const chartData = res.data.map((item, index) => ({
        name: item.name,
        population: item.votes,
        color: colors[index % colors.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 15
      }));
      setData(chartData);
    });
  }, []);

  return (
    <View>
      <PieChart
        data={data}
        width={screenWidth}
        height={220}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
}
