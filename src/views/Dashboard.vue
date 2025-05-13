<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import MiniImgCard from "@/examples/Cards/MiniImgCard.vue";
import * as echarts from 'echarts';
import Carousel from "./components/Carousel.vue";
import CategoriesList from "./components/CategoriesList.vue";

import US from "@/assets/img/icons/flags/US.png";
import DE from "@/assets/img/icons/flags/DE.png";
import GB from "@/assets/img/icons/flags/GB.png";
import BR from "@/assets/img/icons/flags/BR.png";

const sales = {
  us: {
    country: "United States",
    sales: 2500,
    value: "$230,900",
    bounce: "29.9%",
    flag: US,
  },
  germany: {
    country: "Germany",
    sales: "3.900",
    value: "$440,000",
    bounce: "40.22%",
    flag: DE,
  },
  britain: {
    country: "Great Britain",
    sales: "1.400",
    value: "$190,700",
    bounce: "23.44%",
    flag: GB,
  },
  brasil: {
    country: "Brasil",
    sales: "562",
    value: "$143,960",
    bounce: "32.14%",
    flag: BR,
  },
};



</script>

<script>

import * as chartService from "@/api/chartService";

export default {

  data() {

    const char1xData = [];
    const char1yData = [];

    return {
      char1xData,
      char1yData,
      todayWeather: {
        cityName: '合肥',
        today: '06月27日(星期四)',
        maxTemp: '35℃',
        minTemp: '24℃',
        nowTemp: "32.6℃",
        weather: '多云',
        aqi: '56',
        wind: '西南风3级',
      },
    };
  },
  mounted() {
    this.reloadChar1Data();
    // this.getTodayWeather();
  },


  methods: {


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
              :title="todayWeather.cityName + '  ' + todayWeather.today"
              :value="todayWeather.weather"
              :description="todayWeather.minTemp + '~' + todayWeather.maxTemp + ' ' + todayWeather.wind"
              :img="{
                src: 'https://i.i8tq.com/e_index/todayweather/01_d.png',
                shape: 'rounded-circle',
              }"
            />
          </div>

          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Today's Users"
              value="2,300"
              description="<span
                class='text-sm font-weight-bolder text-success'
                >+3%</span> since last week"
              :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
            />
          </div>

          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="New Clients"
              value="+3,462"
              description="<span
                class='text-sm font-weight-bolder text-danger'
                >-2%</span> since last quarter"
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>

          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Sales"
              value="$103,430"
              description="<span
                class='text-sm font-weight-bolder text-success'
                >+5%</span> than last month"
              :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-warning',
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
      </div>
    </div>
  </div>
</template>
