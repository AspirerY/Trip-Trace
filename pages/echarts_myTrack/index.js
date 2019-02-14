import * as echarts from '../../libs/ec-canvas/echarts';
import geoJson from './china.js';

import provinceCenter from './province-center.js'

const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  echarts.registerMap('china', geoJson);

  const option = {
    tooltip: {
      show:false,
      trigger: 'item'
    },

    // visualMap: {
    //   min: 0,
    //   max: 100,
    //   left: 'left',
    //   top: 'bottom',
    //   text: ['高', '低'], // 文本，默认为数值文本
    //   calculable: true
    // },
    toolbox: {
      show: false,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    series: [{
      type: 'map',
      mapType: 'china',
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false,
          textStyle: {
            color: '#fff'
          }
        }
      },
      roam: true,
      itemStyle: {
        normal: {
          areaColor: '#031525',
          borderColor: '#3B5077',
        },
        emphasis: {
          areaColor: '#2B91B7'
        }
      },
      animation: false,

      data: [
        { name: '郑州市', value: 100 },
        { name: '洛阳市', value: 10 },
        { name: '开封市', value: 20 },
        { name: '信阳市', value: 30 },
        { name: '驻马店市', value: 40 },
        { name: '南阳市', value: 41 },
        { name: '周口市', value: 15 },
        { name: '许昌市', value: 25 },
        { name: '平顶山市', value: 35 },
        { name: '新乡市', value: 35 },
        { name: '漯河市', value: 35 },
        { name: '商丘市', value: 35 },
        { name: '三门峡市', value: 35 },
        { name: '济源市', value: 35 },
        { name: '焦作市', value: 35 },
        { name: '安阳市', value: 35 },
        { name: '鹤壁市', value: 35 },
        { name: '濮阳市', value: 35 },
        { name: '开封市', value: 45 }
      ]

    }],

  };

  chart.setOption(option);

  return chart;
}

Page({
  data: {
    ec: {
      onInit: initChart
    }
  },

  onReady() {
  }
});
