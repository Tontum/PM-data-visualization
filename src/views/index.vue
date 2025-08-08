<script setup>
import { ref, onMounted, computed } from 'vue'
import * as echarts from 'echarts'


const lineChartRef = ref(null)
let lineChart = null
const pieChartRef = ref(null)
let pieChart = null
const chinaMapRef = ref(null)
let chinaMapChart = null
const radarChartRef = ref(null)
let radarChart = null

// 真实数据 - 各省份热度数据
const provinceHeatData = ref([
  { name: '广东', value: 2314 },
  { name: '江苏', value: 1344 },
  { name: '浙江', value: 1140 },
  { name: '四川', value: 1045 },
  { name: '山东', value: 906 },
  { name: '上海', value: 854 },
  { name: '北京', value: 851 },
  { name: '河南', value: 793 },
  { name: '湖北', value: 671 },
  { name: '重庆', value: 655 },
  { name: '福建', value: 602 },
  { name: '湖南', value: 600 },
  { name: '安徽', value: 550 },
  { name: '河北', value: 547 },
  { name: '广西', value: 492 },
  { name: '陕西', value: 463 },
  { name: '辽宁', value: 405 },
  { name: '江西', value: 384 },
  { name: '山西', value: 274 },
  { name: '天津', value: 266 },
  { name: '云南', value: 252 },
  { name: '黑龙江', value: 240 },
  { name: '吉林', value: 194 },
  { name: '贵州', value: 188 },
  { name: '甘肃', value: 133 },
  { name: '内蒙古', value: 117 },
  { name: '海南', value: 110 },
  { name: '新疆', value: 101 },
  { name: '宁夏', value: 48 },
  { name: '香港', value: 38 },
  { name: '青海', value: 28 },
  { name: '台湾', value: 22 },
  { name: '西藏', value: 10 },
  { name: '澳门', value: 5 }
])



// 微博热搜话题数据（包含热度值）
const hotSearchData = ref([
  { topic: '警方通报胖猫与谭某经济往来情况', heat: 16583386 },
  { topic: '胖猫姐姐刘某操控舆论', heat: 7917456 },
  { topic: '谭某未以恋爱为名骗取胖猫财物', heat: 4041360 },
  { topic: '茶百道以胖猫之名捐款100万', heat: 2417110 },
  { topic: '胖猫姐姐多平台账号被封', heat: 2054054 },
  { topic: '妹妹曝胖猫曾说他的老婆不需要上班', heat: 1943939 },
  { topic: '殷世航为胖猫发声', heat: 1499703 },
  { topic: '胖猫通报里的三个关键点', heat: 1277516 },
  { topic: '胖猫跳江事发地摆满鲜花汉堡', heat: 1248244 },
  { topic: '胖猫', heat: 1127627 },
  { topic: '用户借胖猫事件煽动性别对立等被处置', heat: 765220 },
  { topic: '胖猫案细节公布', heat: 660438 },
  { topic: '胖猫事件不予立案', heat: 653228 },
  { topic: '各大网红替胖猫发声', heat: 647997 },
  { topic: '前职业选手谈胖猫代练2年赚50万', heat: 523139 },
  { topic: '多家品牌就胖猫事件道歉', heat: 516995 },
  { topic: '胖猫 谭竹', heat: 459723 },
  { topic: '警方通报胖猫事件', heat: 456830 },
  { topic: '胖猫谭竹', heat: 431130 },
  { topic: '市监局回应网友给胖猫点外卖为空包', heat: 312672 },
  { topic: '律师谈胖猫事件', heat: 281616 },
  { topic: '胖猫姐姐呼吁网友不要再叫外卖', heat: 178499 },
  { topic: '胖猫姐姐准备打官司追回被骗钱款', heat: 169466 }
])



// 按热度值排序的数据
const sortedHotSearchData = computed(() => {
  return [...hotSearchData.value].sort((a, b) => b.heat - a.heat)
})

// 格式化热度值
function formatHeatValue(heat) {
  if (heat >= 10000) {
    return (heat / 10000).toFixed(1) + '万'
  }
  return heat.toString()
}

// 处理雷达图数据
function processRadarData() {
  const rawData = [
    // 爆发期数据
    { period: '爆发期', fans: '粉丝数100万+', admiration: 13, anger: 1, annoyance: 13, approval: 4, caring: 0, confusion: 3, curiosity: 0, disgust: 0, fear: 0, neutral: 13, realization: 1, sadness: 1, unknown: 0 },
    { period: '爆发期', fans: '粉丝数10万-100万', admiration: 19, anger: 2, annoyance: 29, approval: 13, caring: 0, confusion: 3, curiosity: 7, disgust: 1, fear: 1, neutral: 26, realization: 4, sadness: 1, unknown: 0 },
    { period: '爆发期', fans: '粉丝数1万-10万', admiration: 103, anger: 12, annoyance: 61, approval: 59, caring: 11, confusion: 35, curiosity: 15, disgust: 5, fear: 0, neutral: 194, realization: 11, sadness: 20, unknown: 4 },
    { period: '爆发期', fans: '粉丝数1千-1万', admiration: 57, anger: 8, annoyance: 32, approval: 31, caring: 5, confusion: 16, curiosity: 8, disgust: 1, fear: 0, neutral: 183, realization: 4, sadness: 11, unknown: 14 },
    { period: '爆发期', fans: '粉丝数1百-1千', admiration: 24, anger: 7, annoyance: 29, approval: 14, caring: 7, confusion: 8, curiosity: 7, disgust: 4, fear: 0, neutral: 92, realization: 5, sadness: 11, unknown: 4 },
    { period: '爆发期', fans: '粉丝数1百以下', admiration: 15, anger: 10, annoyance: 27, approval: 13, caring: 9, confusion: 7, curiosity: 15, disgust: 3, fear: 1, neutral: 69, realization: 2, sadness: 10, unknown: 7 },
    
    // 高潮期数据
    { period: '高潮期', fans: '粉丝数100万+', admiration: 0, anger: 1, annoyance: 83, approval: 18, caring: 2, confusion: 3, curiosity: 3, disgust: 7, fear: 0, neutral: 226, realization: 3, sadness: 0, unknown: 0 },
    { period: '高潮期', fans: '粉丝数10万-100万', admiration: 3, anger: 6, annoyance: 92, approval: 23, caring: 1, confusion: 4, curiosity: 3, disgust: 8, fear: 0, neutral: 181, realization: 7, sadness: 2, unknown: 2 },
    { period: '高潮期', fans: '粉丝数1万-10万', admiration: 14, anger: 9, annoyance: 68, approval: 43, caring: 10, confusion: 27, curiosity: 27, disgust: 12, fear: 2, neutral: 190, realization: 16, sadness: 10, unknown: 3 },
    { period: '高潮期', fans: '粉丝数1千-1万', admiration: 8, anger: 10, annoyance: 83, approval: 32, caring: 4, confusion: 16, curiosity: 16, disgust: 16, fear: 0, neutral: 160, realization: 14, sadness: 4, unknown: 3 },
    { period: '高潮期', fans: '粉丝数1百-1千', admiration: 4, anger: 14, annoyance: 126, approval: 25, caring: 8, confusion: 15, curiosity: 20, disgust: 13, fear: 0, neutral: 212, realization: 12, sadness: 8, unknown: 7 },
    { period: '高潮期', fans: '粉丝数1百以下', admiration: 11, anger: 23, annoyance: 130, approval: 25, caring: 3, confusion: 21, curiosity: 29, disgust: 9, fear: 2, neutral: 239, realization: 22, sadness: 15, unknown: 12 },
    
    // 衰退期数据
    { period: '衰退期', fans: '粉丝数100万+', admiration: 0, anger: 0, annoyance: 6, approval: 2, caring: 1, confusion: 1, curiosity: 1, disgust: 0, fear: 0, neutral: 43, realization: 0, sadness: 0, unknown: 0 },
    { period: '衰退期', fans: '粉丝数10万-100万', admiration: 1, anger: 2, annoyance: 16, approval: 7, caring: 0, confusion: 4, curiosity: 1, disgust: 0, fear: 0, neutral: 66, realization: 0, sadness: 0, unknown: 2 },
    { period: '衰退期', fans: '粉丝数1万-10万', admiration: 0, anger: 0, annoyance: 6, approval: 10, caring: 0, confusion: 3, curiosity: 2, disgust: 2, fear: 0, neutral: 38, realization: 1, sadness: 0, unknown: 4 },
    { period: '衰退期', fans: '粉丝数1千-1万', admiration: 0, anger: 1, annoyance: 11, approval: 5, caring: 0, confusion: 0, curiosity: 2, disgust: 1, fear: 1, neutral: 30, realization: 2, sadness: 0, unknown: 6 },
    { period: '衰退期', fans: '粉丝数1百-1千', admiration: 0, anger: 3, annoyance: 22, approval: 6, caring: 0, confusion: 6, curiosity: 3, disgust: 4, fear: 0, neutral: 92, realization: 1, sadness: 0, unknown: 4 },
    { period: '衰退期', fans: '粉丝数1百以下', admiration: 1, anger: 5, annoyance: 29, approval: 6, caring: 0, confusion: 7, curiosity: 7, disgust: 6, fear: 0, neutral: 78, realization: 6, sadness: 2, unknown: 4 }
  ]

  // 按时期和粉丝数量区间组织数据
  const periods = ['爆发期', '高潮期', '衰退期']
  const emotions = ['admiration', 'anger', 'annoyance', 'approval', 'caring', 'confusion', 'curiosity', 'disgust', 'fear', 'neutral', 'realization', 'sadness', 'unknown']
  
  const radarData = periods.map(period => {
    const periodData = rawData.filter(item => item.period === period)
    
    // 按粉丝数量区间分组
    const fanData = periodData.map(item => {
      const emotionData = {}
      emotions.forEach(emotion => {
        emotionData[emotion] = item[emotion]
      })
      
      return {
        fans: item.fans,
        data: emotionData
      }
    })
    
    return {
      period,
      fanData
    }
  })
  
  return radarData
}









onMounted(() => {
  console.log('数据可视化布局已加载')
  
  // 初始化折线图
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
    
    const lineOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['积极', '消极', '中立'],
        top: '0%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['爆发期', '高潮期', '衰退期']
      },
      yAxis: {
        type: 'value',
        name: '数量'
      },
      series: [
        {
          name: '积极',
          type: 'line',
          data: [3571, 2326, 2547],
          itemStyle: {
            color: '#91cc75'
          },
          lineStyle: {
            width: 3
          },
          symbol: 'circle',
          symbolSize: 8
        },
        {
          name: '消极',
          type: 'line',
          data: [2820, 3397, 3088],
          itemStyle: {
            color: '#ee6666'
          },
          lineStyle: {
            width: 3
          },
          symbol: 'circle',
          symbolSize: 8
        },
        {
          name: '中立',
          type: 'line',
          data: [3609, 4277, 4365],
          itemStyle: {
            color: '#5470c6'
          },
          lineStyle: {
            width: 3
          },
          symbol: 'circle',
          symbolSize: 8
        }
      ]
    }
    
    lineChart.setOption(lineOption)
  }
  
  // 初始化饼图
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    
    // 情绪数据
    const emotionData = [
      { name: '中立', value: 7418 },
      { name: '恼怒', value: 2642 },
      { name: '赞同', value: 1012 },
      { name: '好奇', value: 665 },
      { name: '困惑', value: 581 },
      { name: '领悟', value: 570 },
      { name: '钦佩', value: 503 },
      { name: '失望', value: 500 },
      { name: '不赞同', value: 458 },
      { name: '愤怒', value: 438 },
      { name: '娱乐', value: 400 },
      { name: '厌恶', value: 331 },
      { name: '悲伤', value: 322 },
      { name: '喜爱', value: 308 },
      { name: '喜悦', value: 230 },
      { name: '关心', value: 221 },
      { name: '乐观', value: 208 },
      { name: '感激', value: 127 },
      { name: '兴奋', value: 115 },
      { name: '惊讶', value: 109 },
      { name: '渴望', value: 90 },
      { name: '恐惧', value: 67 },
      { name: '尴尬', value: 61 },
      { name: '悔恨', value: 52 },
      { name: '宽慰', value: 29 },
      { name: '紧张', value: 10 }
    ]
    
    const pieOption = {
      title: {
        text: '情绪分布统计',
        left: 'center',
        top: '5%',
        textStyle: {
          fontSize: 14,
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: '15%',
        type: 'scroll',
        pageTextStyle: {
          color: '#333'
        }
      },
      series: [
        {
          name: '情绪统计',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['65%', '55%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            show: false
          },
          data: emotionData
        }
      ]
    }
    
    pieChart.setOption(pieOption)
  }
  
    // 初始化中国地图
  if (chinaMapRef.value) {
    chinaMapChart = echarts.init(chinaMapRef.value)
    
    // 动态加载中国地图数据
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then(response => response.json())
      .then(chinaJson => {
        console.log('地图数据加载成功:', chinaJson.features.length, '个地区')
        
        // 注册中国地图
        echarts.registerMap('china', chinaJson)
        
        // 检查省份名称匹配
        const mapNames = chinaJson.features.map(f => f.properties.name)
        console.log('地图中的省份名称:', mapNames)
        console.log('数据中的省份名称:', provinceHeatData.value.map(d => d.name))
        
        // 找出不匹配的省份
        const dataNames = provinceHeatData.value.map(d => d.name)
        const missingInData = mapNames.filter(name => !dataNames.includes(name))
        const missingInMap = dataNames.filter(name => !mapNames.includes(name))
        
        console.log('地图中有但数据中没有的省份:', missingInData)
        console.log('数据中有但地图中没有的省份:', missingInMap)
        
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: function(params) {
              return params.name + ': ' + (params.value || 0)
            }
          },
          visualMap: {
            min: 0,
            max: 2500,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            calculable: true,
            inRange: {
              color: ['#e0f3f8', '#fee090', '#fdae61', '#f46d43', '#d73027']
            },
            textStyle: {
              fontSize: 12
            }
          },
          series: [
            {
              name: '热度分布',
              type: 'map',
              map: 'china',
              roam: true,
              center: ['50%', '55%'],
              zoom: 1.5,
              emphasis: {
                label: {
                  show: true
                }
              },
              itemStyle: {
                areaColor: '#f3f3f3',
                borderColor: '#ccc'
              },
              data: [
                { name: '广东省', value: 2314 },
                { name: '江苏省', value: 1344 },
                { name: '浙江省', value: 1140 },
                { name: '四川省', value: 1045 },
                { name: '山东省', value: 906 },
                { name: '上海市', value: 854 },
                { name: '北京市', value: 851 },
                { name: '河南省', value: 793 },
                { name: '湖北省', value: 671 },
                { name: '重庆市', value: 655 },
                { name: '福建省', value: 602 },
                { name: '湖南省', value: 600 },
                { name: '安徽省', value: 550 },
                { name: '河北省', value: 547 },
                { name: '广西壮族自治区', value: 492 },
                { name: '陕西省', value: 463 },
                { name: '辽宁省', value: 405 },
                { name: '江西省', value: 384 },
                { name: '山西省', value: 274 },
                { name: '天津市', value: 266 },
                { name: '云南省', value: 252 },
                { name: '黑龙江省', value: 240 },
                { name: '吉林省', value: 194 },
                { name: '贵州省', value: 188 },
                { name: '甘肃省', value: 133 },
                { name: '内蒙古自治区', value: 117 },
                { name: '海南省', value: 110 },
                { name: '新疆维吾尔自治区', value: 101 },
                { name: '宁夏回族自治区', value: 48 },
                { name: '香港特别行政区', value: 38 },
                { name: '青海省', value: 28 },
                { name: '台湾省', value: 22 },
                { name: '西藏自治区', value: 10 },
                { name: '澳门特别行政区', value: 5 }
              ]
            }
          ]
        }
        
        chinaMapChart.setOption(option)
        console.log('中国地图初始化完成，数据:', provinceHeatData.value)
      })
.catch(error => {
  console.error('加载中国地图数据失败:', error)
  // 如果地图加载失败，显示错误信息并重试
  chinaMapChart.setOption({
    title: {
      text: '地图加载中...',
      left: 'center',
      top: 'center',
      textStyle: {
        fontSize: 16,
        color: '#666'
      }
    }
  })
  
  // 3秒后重试加载地图
  setTimeout(() => {
    console.log('重试加载中国地图数据...')
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then(response => response.json())
      .then(chinaJson => {
        echarts.registerMap('china', chinaJson)
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: function(params) {
              return params.name + ': ' + (params.value || 0)
            }
          },
          visualMap: {
            min: 0,
            max: 2500,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            calculable: true,
            inRange: {
              color: ['#e0f3f8', '#fee090', '#fdae61', '#f46d43', '#d73027']
            },
            textStyle: {
              fontSize: 12
            }
          },
          series: [
            {
              name: '热度分布',
              type: 'map',
              map: 'china',
              roam: true,
              center: ['50%', '55%'],
              zoom: 1.5,
              emphasis: {
                label: {
                  show: true
                }
              },
              itemStyle: {
                areaColor: '#f3f3f3',
                borderColor: '#ccc'
              },
              data: [
                { name: '广东省', value: 2314 },
                { name: '江苏省', value: 1344 },
                { name: '浙江省', value: 1140 },
                { name: '四川省', value: 1045 },
                { name: '山东省', value: 906 },
                { name: '上海市', value: 854 },
                { name: '北京市', value: 851 },
                { name: '河南省', value: 793 },
                { name: '湖北省', value: 671 },
                { name: '重庆市', value: 655 },
                { name: '福建省', value: 602 },
                { name: '湖南省', value: 600 },
                { name: '安徽省', value: 550 },
                { name: '河北省', value: 547 },
                { name: '广西壮族自治区', value: 492 },
                { name: '陕西省', value: 463 },
                { name: '辽宁省', value: 405 },
                { name: '江西省', value: 384 },
                { name: '山西省', value: 274 },
                { name: '天津市', value: 266 },
                { name: '云南省', value: 252 },
                { name: '黑龙江省', value: 240 },
                { name: '吉林省', value: 194 },
                { name: '贵州省', value: 188 },
                { name: '甘肃省', value: 133 },
                { name: '内蒙古自治区', value: 117 },
                { name: '海南省', value: 110 },
                { name: '新疆维吾尔自治区', value: 101 },
                { name: '宁夏回族自治区', value: 48 },
                { name: '香港特别行政区', value: 38 },
                { name: '青海省', value: 28 },
                { name: '台湾省', value: 22 },
                { name: '西藏自治区', value: 10 },
                { name: '澳门特别行政区', value: 5 }
              ]
            }
          ]
        }
        chinaMapChart.setOption(option)
        console.log('中国地图重试加载成功')
      })
      .catch(retryError => {
        console.error('重试加载地图数据也失败:', retryError)
        chinaMapChart.setOption({
          title: {
            text: '地图数据加载失败，请刷新页面重试',
            left: 'center',
            top: 'center',
            textStyle: {
              fontSize: 14,
              color: '#ff6b6b'
            }
          }
        })
      })
  }, 3000)
})
  // 初始化柱状图 - 普通用户和认证用户的情绪变化对比
  if (radarChartRef.value) {
    radarChart = echarts.init(radarChartRef.value)
    
    // 新数据：普通用户和认证用户在三个时期的情绪数据
    const userData = {
      '普通用户': {
        '爆发期': { admiration: 100, anger: 24, annoyance: 86, approval: 50, caring: 23, confusion: 25, curiosity: 24, disgust: 9, neutral: 286, realization: 11, sadness: 32 },
        '高潮期': { admiration: 19, anger: 46, annoyance: 355, approval: 79, caring: 15, confusion: 46, curiosity: 64, disgust: 33, neutral: 693, realization: 46, sadness: 27 },
        '衰退期': { admiration: 1, anger: 8, annoyance: 60, approval: 18, caring: 0, confusion: 14, curiosity: 11, disgust: 10, neutral: 212, realization: 8, sadness: 2 }
      },
      '认证用户': {
        '爆发期': { admiration: 129, anger: 16, annoyance: 99, approval: 81, caring: 9, confusion: 43, curiosity: 27, disgust: 5, neutral: 267, realization: 15, sadness: 18 },
        '高潮期': { admiration: 21, anger: 17, annoyance: 222, approval: 71, caring: 12, confusion: 31, curiosity: 25, disgust: 13, neutral: 485, realization: 27, sadness: 12 },
        '衰退期': { admiration: 1, anger: 3, annoyance: 30, approval: 25, caring: 3, confusion: 5, curiosity: 3, disgust: 3, neutral: 126, realization: 2, sadness: 0 }
      }
    }
    
    const emotions = ['neutral', 'annoyance', 'approval', 'curiosity', 'confusion', 'realization', 'admiration', 'anger', 'caring', 'disgust', 'sadness']
    const periods = ['爆发期', '高潮期', '衰退期']
    const userTypes = ['普通用户', '认证用户']
    
    // 准备柱状图数据
    const series = []
    
    // 为每个用户类型创建系列
    userTypes.forEach((userType, userIndex) => {
      periods.forEach((period, periodIndex) => {
        const periodData = userData[userType][period]
        
        series.push({
          name: `${userType}-${period}`,
          type: 'bar',
          data: emotions.map(emotion => periodData[emotion] || 0),
          itemStyle: {
            color: getColorByUserAndPeriod(userType, period)
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        })
      })
    })
    
    const barOption = {
      title: {
        text: '',
        left: 'center',
        top: '1%',
        textStyle: {
          fontSize: 14,
          color: '#333',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          let result = `${params[0].name}<br/>`
          params.forEach(param => {
            if (param.value > 0) {
              result += `${param.seriesName}: ${param.value}<br/>`
            }
          })
          return result
        }
      },
      legend: {
        data: series.map(s => s.name),
        top: '2%',
        textStyle: {
          fontSize: 10
        },
        type: 'scroll'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '2%',
        top: '25%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: emotions.map(emotion => {
          const emotionNames = {
            'neutral': '中立',
            'annoyance': '恼怒',
            'approval': '赞同',
            'curiosity': '好奇',
            'confusion': '困惑',
            'realization': '领悟',
            'admiration': '钦佩',
            'anger': '愤怒',
            'caring': '关心',
            'disgust': '厌恶',
            'sadness': '悲伤'
          }
          return emotionNames[emotion] || emotion
        }),
        axisLabel: {
          rotate: 45,
          fontSize: 11,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: '数量',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 12
        },
        interval: 50,
        minInterval: 50,
        max: 300
      },
      series: series
    }
    
    radarChart.setOption(barOption)
  }
  
  // 根据用户类型和时期返回颜色
  function getColorByUserAndPeriod(userType, period) {
    const colorSchemes = {
      '普通用户': {
        '爆发期': '#ff6b6b',    // 深红色
        '高潮期': '#ff8e8e',    // 中红色
        '衰退期': '#ffb3b3'     // 浅红色
      },
      '认证用户': {
        '爆发期': '#2c7da0',    // 深蓝色
        '高潮期': '#3ba3b3',    // 中蓝色
        '衰退期': '#4ecdc4'     // 浅蓝色
      }
    }
    return colorSchemes[userType]?.[period] || '#999'
  }
  
  // 响应式调整
  window.addEventListener('resize', () => {
    lineChart && lineChart.resize()
    pieChart && pieChart.resize()
    chinaMapChart && chinaMapChart.resize()
    radarChart && radarChart.resize()
  })
})
</script>

<template>
  <div class="dashboard-container">
    <!-- 左侧区域 (7:3) -->
    <div class="left-section">
      <!-- 左侧上部 -->
      <div class="left-upper">
        <div class="left-upper-left">
          <div class="chart-area">
            <h3>情感趋势折线图</h3>
            <div ref="lineChartRef" class="chart-container"></div>
          </div>
        </div>
        <div class="left-upper-right">
          <div class="chart-area">
            <h3>情绪统计饼状图</h3>
            <div ref="pieChartRef" class="chart-container"></div>
          </div>
        </div>
      </div>
      
      <!-- 左侧下部 -->
      <div class="left-lower">
        <div class="left-lower-left">
          <div class="chart-area">
            <h3>普通用户与认证用户不同阶段情绪对比图</h3>
            <div ref="radarChartRef" class="chart-container"></div>
          </div>
        </div>
        <div class="left-lower-right">
          <!-- 正方形网格分为四个格子 -->
          <div class="grid-container">
            <div class="grid-item wordcloud-item">
              <h4>兴趣领域类博主高频词</h4>
              <img src="/兴趣领域类_词云.png" alt="兴趣领域类词云" class="wordcloud-image">
            </div>
            <div class="grid-item wordcloud-item">
              <h4>娱乐领域类博主高频词</h4>
              <img src="/娱乐类_词云.png" alt="娱乐类词云" class="wordcloud-image">
            </div>
            <div class="grid-item wordcloud-item">
              <h4>新闻资讯类博主高频词</h4>
              <img src="/新闻资讯类_词云.png" alt="新闻资讯类词云" class="wordcloud-image">
            </div>
            <div class="grid-item wordcloud-item">
              <h4>知识科普类博主高频词</h4>
              <img src="/知识科普类_词云.png" alt="知识科普类词云" class="wordcloud-image">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧区域 (7:3) -->
    <div class="right-section">
      <!-- 右侧上部 -->
      <div class="right-upper">
        <div class="chart-area">
          <div class="area5-header">
            <h3>微博热搜话题热度榜单</h3>
          </div>
          
          <!-- 热搜话题内容 -->
          <div class="hotsearch-content">
            <div class="hotsearch-list">
              <div 
                v-for="(item, index) in sortedHotSearchData" 
                :key="index"
                class="hotsearch-item"
                :class="{ 'top-rank': index < 3 }"
              >
                <span class="rank-number">{{ index + 1 }}</span>
                <span class="topic-text">{{ item.topic }}</span>
                <span class="heat-value">{{ formatHeatValue(item.heat) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧下部 -->
      <div class="right-lower">
        <div class="chart-area">
          <h3>讨论热度地域分布热力图</h3>
          <div ref="chinaMapRef" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  padding: 20px;
  gap: 20px;
  box-sizing: border-box;
}

/* 左侧区域 (7:3) */
.left-section {
  flex: 7;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

/* 左侧上部 */
.left-upper {
  flex: 1;
  display: flex;
  gap: 20px;
  height: 50%;
}

.left-upper-left {
  flex: 6;
  height: 100%;
}

.left-upper-right {
  flex: 4;
  height: 100%;
}

/* 左侧下部 */
.left-lower {
  flex: 1;
  display: flex;
  gap: 20px;
  height: 50%;
}

.left-lower-left {
  flex: 6;
  height: 100%;
}

.left-lower-right {
  flex: 4;
  height: 100%;
}

/* 右侧区域 (7:3) */
.right-section {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.right-upper {
  flex: 4;
  height: 55%;
}

.right-lower {
  flex: 6;
  height: 45%;
}

/* 网格容器 - 正方形分为四个格子 (在左侧下部右面) */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
  height: 100%;
  width: 100%;
}

.grid-item {
  background: white;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.wordcloud-item {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.wordcloud-item:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.wordcloud-item:hover .wordcloud-image {
  transform: scale(1.2);
}

.wordcloud-image {
  width: 100%;
  height: calc(100% - 25px);
  object-fit: contain;
  border-radius: 6px;
  transition: transform 0.3s ease;
}



.grid-item h4 {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
  text-align: center;
  position: relative;
  z-index: 5;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
}

/* 图表区域通用样式 */
.chart-area {
  background: white;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.chart-area h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.chart-placeholder {
  height: calc(100% - 50px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
  border: 2px dashed #d9d9d9;
}

.chart-container {
  height: calc(100% - 50px);
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-container {
    flex-direction: column;
    height: auto;
  }
  
  .left-section, .right-section {
    flex: none;
    height: auto;
  }
  
  .left-upper, .left-lower {
    flex-direction: column;
    height: auto;
  }
  
  .left-upper-left, .left-upper-right,
  .left-lower-left, .left-lower-right {
    flex: none;
    height: 300px;
  }
}

/* 区域5样式 */
.area5-header {
  margin-bottom: 15px;
}

.area5-header h3 {
  margin: 0;
  border-bottom: none;
  padding-bottom: 0;
}



.hotsearch-content {
  height: calc(100% - 60px);
  overflow: hidden;
}

.hotsearch-list {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 5px;
}

.hotsearch-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background: #f8f9fa;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 40px;
}

.hotsearch-item:hover {
  background: #e9ecef;
  transform: translateX(3px);
}

.hotsearch-item.top-rank {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
}

.rank-number {
  font-weight: bold;
  margin-right: 10px;
  min-width: 18px;
  text-align: center;
  font-size: 12px;
}

.topic-text {
  flex: 1;
  font-size: 11px;
  line-height: 1.3;
  margin-right: 10px;
}

.heat-value {
  font-size: 10px;
  color: #666;
  font-weight: bold;
  min-width: 40px;
  text-align: right;
}

.hotsearch-item.top-rank .heat-value {
  color: rgba(255, 255, 255, 0.9);
}






</style>
