import * as echarts from '../../libs/ec-canvas/echarts';
import geoJson from './china.js';

import provinceCenter from './province-center.js'

const app = getApp();

function convertData(data) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var geoCoord = provinceCenter[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value)
      });
    }
  }
  return res;
};

// const lightOption = {
//   title: {
//     text: '我的出差足迹',
//     subtext: '2018年',
//     x: 'center',
//     textStyle: {
//       color: '#ccc'
//     }
//   },
//   tooltip: {
//     show: false,
//     trigger: 'item'
//   },
//   toolbox: {
//     show: false,
//     orient: 'vertical',
//     left: 'right',
//     top: 'center',
//     feature: {
//       dataView: { readOnly: false },
//       restore: {},
//       saveAsImage: {}
//     }
//   },
//   geo: {
//     show: true,
//     map: 'china',
//     label: {
//       normal: {
//         show: false
//       },
//       emphasis: {
//         show: false,
//       }
//     },
//     roam: true,
//     itemStyle: {
//       normal: {
//         areaColor: '#031525',
//         borderColor: '#3B5077',
//       },
//       emphasis: {
//         areaColor: '#2B91B7',
//       }
//     }
//   },
//   series: [
//     {
//       name: '点',
//       type: 'scatter',
//       coordinateSystem: 'geo',
//       symbol: 'pin',
//       symbolSize: 10,
//       label: {
//         normal: {
//           show: true,
//           textStyle: {
//             color: '#fff',
//             fontSize: 9,
//           }
//         }
//       },
//       itemStyle: {
//         normal: {
//           color: '#F62157', //标志颜色
//         }
//       },
//       data: resolvedData
//     }
//   ]
// };

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  echarts.registerMap('china', geoJson);

  var myTrackData = app.globalData.myTrackData;

  var option = {
    backgroundColor: '#404a59',
    title: {
      text: '我的出差足迹',
      subtext: '2018年',
      x: 'center',
      y: '15px',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return params.name + ' : ' + params.value[2] + '天';
      }
    },
    geo: {
      map: 'china',
      label: {
        emphasis: {
          show: false
        }
      },
      roam: false,
      itemStyle: {
        normal: {
          areaColor: '#323c48',
          borderColor: '#111'
        },
        emphasis: {
          areaColor: '#2a333d'
        }
      }
    },
    series: [
      // {
      //   type: 'map',
      //   map: 'china',
      //   geoIndex: 0,
      //   aspectScale: 0.75, //长宽比
      //   showLegendSymbol: false, // 存在legend时显示
      //   label: {
      //     normal: {
      //       show: false
      //     },
      //     emphasis: {
      //       show: false,
      //       textStyle: {
      //         color: '#fff'
      //       }
      //     }
      //   },
      //   roam: true,
      //   itemStyle: {
      //     normal: {
      //       areaColor: '#031525',
      //       borderColor: '#3B5077',
      //     },
      //     emphasis: {
      //       areaColor: '#2B91B7'
      //     }
      //   },
      //   animation: false,
      //   data: myTrackData
      // },
      {
        name: 'credit_pm2.5',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(myTrackData),
        symbolSize: 5,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true,
            fontSize: 13
          },
          emphasis: {
            show: true,
            fontSize: 13
          }
        },
        itemStyle: {
          normal: {
            color: '#05C3F9'
          }
        }
      },
      {
        name: 'track',
        type: 'scatter',
        symbol: 'pin',
        coordinateSystem: 'geo',
        data: convertData(myTrackData),
        symbolSize: 20,
        label: {
          normal: {
            show: false,
            fontSize: 13,
            color: '#fff',
            formatter: function (params) {
              return params.value[2] + '天';
            }
          },
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            color: '#F62157', //标志颜色
          },
          // emphasis: {
          //   borderColor: '#fff',
          //   borderWidth: 1
          // }
        }
      }
    ]
  }

  chart.setOption(option);

  return chart;
}

Page({
  data: {
    ec: {
      onInit: initChart
    }
  },
  onLoad() {
    // console.log("app.globalData.myTrackData",app.globalData.myTrackData);
  },
  onReady() {
  },
  saveAsImg: function() {
    const ecComponent = this.selectComponent('#mychart-dom-area');
    // console.log(ecComponent)
    ecComponent.canvasToTempFilePath({
      fileType: 'png',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            wx.showToast({
              title: "图片已保存到本地！",
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: err => {
        console.log(err)
      },
      complete: message => {
      }
    });
  }
});
