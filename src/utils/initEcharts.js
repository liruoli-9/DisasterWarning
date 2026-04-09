import * as echarts from 'echarts';

export const initEcharts = ({ el, option }) => {
  // 检查el是否为有效的DOM元素
  const element = typeof el === 'string' ? document.getElementById(el) : el;
  if (!element) {
    console.error('Invalid element provided for ECharts initialization.');
    return;
  }

  // 检查是否已有实例，如果有，先销毁它以防止内存泄漏
  let myChart = echarts.getInstanceByDom(element);
  if (myChart) {
    myChart.dispose();
  }

  // 初始化ECharts实例
  myChart = echarts.init(element);

  // 如果没有提供option，使用默认的option
  const defaultOption = {
    title: {
      text: "ECharts 入门示例",
    },
    tooltip: {},
    legend: {
      data: ["销量"],
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  };

  // 使用传入的option或者默认的option
  myChart.setOption(option || defaultOption);

  // 返回图表实例，以便于后续的更新和销毁操作
  return myChart;
};
