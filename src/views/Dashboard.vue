<script setup>
import MiniImgCard from "@/examples/Cards/MiniImgCard.vue";
import * as echarts from 'echarts';
import Carousel from "./components/Carousel.vue";
// import CategoriesList from "./components/CategoriesList.vue";



</script>

<script>

import * as chartService from "@/api/chartService";
import axios from "axios";
import { getLunar } from "chinese-lunar-calendar";
import * as settingService from "@/api/settingInfoService";

export default {

  data() {

    const char1xData = [];
    const char1yData = [];
    const currentTime = '';
    const curYear = null; // 当前年份
    const curMonth = ""; // 当前月份
    const curDay = ""; // 当前日期
    const curWeek = ""; // 当前周
    const lunarYear = "";
    const lunarDay = ""; // 农历日期
    const dayOfYear = ""; // 当前日期是一年中的第几天
    const weekOfYear = ""; // 当前日期是一年的第几周
    const averageChange = "";
    const moreThan90CountChange = "";

    return {
      char1xData,
      char1yData,
      todayWeather: {
        address: '安徽省 合肥市',
        temp: "32.6℃",
        weather: '多云',
        windDirection: '东',
        windPower: '<3',
        humidity: '40%',
        src: 'weather/weather.png',
      },
      currentTime,
      curYear,
      curMonth,
      curDay,
      curWeek,
      lunarYear,
      lunarDay,
      dayOfYear,
      weekOfYear,
      averageChange,
      moreThan90CountChange,
    };
  },
  mounted() {
    this.reloadChar1Data();
    this.getTodayWeather();
    this.initDate();
  },

  created() {
    this.updateTime();
  },

  methods: {

    updateTime() {
      setInterval(() => {
        this.currentTime = new Date().toLocaleTimeString();
      }, 1000);

    },

    initDate() {
      // 初始化日历
      const date = new Date();
      this.curYear = date.getFullYear();
      this.curMonth = date.getMonth() + 1;
      this.curDay = date.getDate();

      const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      const day = date.getDay();
      this.curWeek = weekday[day];


      const lunarDate = getLunar(this.curYear, this.curMonth, this.curDay);
      this.lunarYear = lunarDate.lunarYear;
      this.lunarDay = lunarDate.dateStr;
      // 获取当前时间是当年的第几天
      this.dayOfYear = Math.floor((date - new Date(this.curYear, 0, 0)) / 86400000);
      // 获取当前时间是当年的第几周
      const start = new Date(this.curYear, 0, 1);
      this.weekOfYear = Math.ceil((((date - start) / 86400000) + start.getDay() + 1) / 7);

      settingService.getDashboard().then(response => {
        if (response.code === 200) {
          this.averageChange = response.data.averageChange;
          this.moreThan90CountChange = response.data.moreThan90CountChange;

        }
      });

    },

    getTodayWeather() {
      axios.get("https://www.mxnzp.com/api/weather/current/合肥市?app_id=gpyu9yjltmjmgovk&app_secret=TpjigP4XZsp27gidYCnKZkDvMeX5zlqF").then(response => {
        if (response.data.code === 1) {
          const weather = response.data.data;
          this.todayWeather.temp = weather.temp;
          this.todayWeather.weather = weather.weather;
          this.todayWeather.windDirection = weather.windDirection;
          this.todayWeather.windPower = weather.windPower;
          this.todayWeather.humidity = weather.humidity;
          if(weather.weather.includes("晴")) {
            this.todayWeather.src = 'weather/sun.png';
          }
          if(weather.weather.includes("多云")) {
            this.todayWeather.src = 'weather/cloudy2.png';
          }
          if(weather.weather.includes("转晴") || weather.weather.includes("阴")) {
            this.todayWeather.src = 'weather/cloudy.png';
          }
          if(weather.weather.includes("雷")) {
            this.todayWeather.src = 'weather/flash.png';
          }
          if(weather.weather.includes("雾")) {
            this.todayWeather.src = 'weather/fog.png';
          }
          if(weather.weather.includes("雨")) {
            this.todayWeather.src = 'weather/rain.png';
          }
          if(weather.weather.includes("雪")) {
            this.todayWeather.src = 'weather/snow.png';
          }
          if(weather.weather.includes("风")) {
            this.todayWeather.src = 'weather/wind.png';
          }
        }
      });

    },

    reloadChar1Data() {
      chartService.getDefaultClassChart1Data().then(response => {
        if (response.code === 200) {
          this.char1xData = response.data.xdata;
          this.char1yData = response.data.ydata;
          this.initChart1();
        }
      });
    },


    initChart1() {
      if(this.$refs.chart1 != null) {
        this.chart = echarts.init(this.$refs.chart1);
      }
      const option = {
        title: {
          text: '本学期班级平均分',
        },
        legend: {
          data: ['平均分-折线', '平均分-柱状']
        },
        backgroundColor: '#FFFFFF',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              show: true,
            },
            type: 'cross'
          }
        },
        xAxis: {
          data: this.char1xData,
          axisLabel: {
            //x轴文字的配置
            show: true,
            interval: 0,//使x轴文字显示全
            formatter: function(params) {
              var newParamsName = "";
              var paramsNameNumber = params.length;
              var provideNumber = 4; //一行显示几个字
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = "";
                  var start = p * provideNumber;
                  var end = start + provideNumber;
                  if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            }
          },
        },
        yAxis: [
          {
            type: 'value',
            position: 'left',
            alignTicks: true,
            min: 80,
            axisLine: {
              show: true,
            },

          },
          {
            type: 'value',
            position: 'right',
            alignTicks: true,
            min: 80,
            axisLine: {
              show: true,
            },
          },
        ],

        series: [
          {
            name: '平均分-折线',
            color: '#EE6666',
            type: 'line',
            smooth: true,
            data: this.char1yData
          },
          {
            name: '平均分-柱状',
            color: '#91CC75',
            type: 'bar',
            data: this.char1yData
          }
        ],
      };
      this.chart.setOption(option);

    },

  },
};




</script>


<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">

          <div class="col-lg-3 col-md-6 col-12">
            <mini-img-card
                :title= "curYear+'年'+curMonth+'月'+curDay+'日'"
                :value="currentTime"
                :description="lunarYear+lunarDay + ' ' + curWeek +'<br>'+   '第'+dayOfYear +'天 第'+weekOfYear +'周'"
                :img="{
                src: '/calendar.png',
                shape: 'rounded-circle',
              }"
            />
          </div>


          <div class="col-lg-3 col-md-6 col-12">
            <mini-img-card
              :title="todayWeather.address"
              :value="todayWeather.weather + '  ' + todayWeather.temp"
              :description="todayWeather.windDirection + '风' + todayWeather.windPower + '<br> 湿度' + todayWeather.humidity"
              :img="{
                src: todayWeather.src,
                shape: 'rounded-circle',
              }"
            />
          </div>

          <div class="col-lg-3 col-md-6 col-12">
            <mini-img-card
                title= "平均分变化"
                :value="averageChange"
                description="*<br>最近一次考试与上次考试平均分比较"
                :img="{
                src: '/average.png',
                shape: 'rounded-circle',
              }"
            />
          </div>

          <div class="col-lg-3 col-md-6 col-12">
            <mini-img-card
                title="90分以上人数"
                :value="moreThan90CountChange"
                description="*<br>最近一次考试与上次考试90分以上人数比较"
                :img="{
                src: '/moreThan90.png',
                shape: 'rounded-circle',
              }"
            />
          </div>



        </div>

        <div class="row">
          <div class="col-lg-7 mb-lg">
            <!-- line chart -->
            <div class="card card-body z-index-2">
              <div ref="chart1" style="height: 400px;"></div>
            </div>

          </div>
          <div class="col-lg-5">
            <carousel />
          </div>
        </div>
        <!--
        <div class="row mt-4">
          <div class="col-lg-7 mb-lg-0 mb-4">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h6 class="mb-2">Sales by Country</h6>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center">
                  <tbody>
                    <tr v-for="(sale, index) in sales" :key="index">
                      <td class="w-30">
                        <div class="px-2 py-1 d-flex align-items-center">
                          <div>
                            <img :src="sale.flag" alt="Country flag" />
                          </div>
                          <div class="ms-4">
                            <p class="mb-0 text-xs font-weight-bold">
                              Country:
                            </p>
                            <h6 class="mb-0 text-sm">{{ sale.country }}</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold">Sales:</p>
                          <h6 class="mb-0 text-sm">{{ sale.sales }}</h6>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold">Value:</p>
                          <h6 class="mb-0 text-sm">{{ sale.value }}</h6>
                        </div>
                      </td>
                      <td class="text-sm align-middle">
                        <div class="text-center col">
                          <p class="mb-0 text-xs font-weight-bold">Bounce:</p>
                          <h6 class="mb-0 text-sm">{{ sale.bounce }}</h6>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <categories-list
              :categories="[
                {
                  icon: {
                    component: 'ni ni-mobile-button',
                    background: 'dark',
                  },
                  label: 'Devices',
                  description: '250 in stock <strong>346+ sold</strong>',
                },
                {
                  icon: {
                    component: 'ni ni-tag',
                    background: 'dark',
                  },
                  label: 'Tickets',
                  description: '123 closed <strong>15 open</strong>',
                },
                {
                  icon: { component: 'ni ni-box-2', background: 'dark' },
                  label: 'Error logs',
                  description: '1 is active <strong>40 closed</strong>',
                },
                {
                  icon: { component: 'ni ni-satisfied', background: 'dark' },
                  label: 'Happy Users',
                  description: '+ 430',
                },
              ]"
            />
          </div>
        </div>
        -->
      </div>
    </div>
  </div>
</template>
