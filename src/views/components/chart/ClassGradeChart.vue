<script setup>
// import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import * as echarts from 'echarts';
import {VxeUI} from 'vxe-pc-ui'


</script>
<template>

  <div class="py-4 container-fluid ">
    <div class="card mb-4">
      <div class="card-header pb-0">
<!--        <h6>录入考试成绩</h6>-->
      </div>

      <div class="row">


        <div class="col-lg-12">
          <vxe-form
              title-colon
              ref="formRef"
              title-width="58"
              title-align="right"
              :data="formData"
              @submit="submitEvent">
            <vxe-form-item title="年份" field="year" span="6" :item-render="{}">
              <template #default="params">
                <vxe-select v-model="formData.year" :options="yearOptions"  @change="queryYearChange(params)"></vxe-select>
              </template>
            </vxe-form-item>
            <vxe-form-item title="班级" field="classId" span="6" :item-render="{}">
              <template #default="params">
                <vxe-select v-model="formData.classId" :options="classOptions" @change="queryClassChange(params)"></vxe-select>
              </template>
            </vxe-form-item>
            <vxe-form-item title="学期" field="semesterId" span="6" :item-render="{}">
              <template #default="params">
                <vxe-select v-model="formData.semesterId" :options="semesterOptions" @change="querySemesterChange(params)"></vxe-select>
              </template>
            </vxe-form-item>
            <vxe-form-item title="学科" field="subjectId" span="6" :item-render="{}">
              <template #default="params">
                <vxe-select v-model="formData.subjectId" :options="subjectOptions" @change="querySubjectChange(params)"></vxe-select>
              </template>
            </vxe-form-item>

            <vxe-form-item align="center" span="24">
              <template #default>
<!--                <vxe-button type="submit" status="primary" content="搜索"></vxe-button>-->
<!--                <vxe-button type="reset" content="重置"></vxe-button>-->
              </template>
            </vxe-form-item>
          </vxe-form>

          <div class="pt-2 row">
            <div class="col-lg-6 mb-lg">

              <div ref="chart1" style="width: 600px; height: 400px;"></div>
              <vxe-text class="ps-3" icon="vxe-icon-warning-circle-fill" size="mini" status="info">班级平均分低于60不显示</vxe-text>

            </div>
            <div class="col-lg-6">
              <vxe-form :data="examData">
                <vxe-form-item title="考试名称" field="examCode" span="10" :item-render="{}">
                  <template #default="params">
                    <vxe-select v-model="examData.examCode" :options="examOptions" @change="examChange(params)" filterable></vxe-select>
                  </template>
                </vxe-form-item>
              </vxe-form>
              <div ref="chart2" style="width: 600px; height: 400px;"></div>
            </div>
          </div>


          <div class="row mt-4">
            <div class="col-lg-6">
              <vxe-form :data="examData">
                <vxe-form-item title="考试名称" field="examCode" span="10" :item-render="{}">
                  <template #default="params">
                    <vxe-select v-model="examData.examCode" :options="examOptions" @change="examChange(params)" filterable></vxe-select>
                  </template>
                </vxe-form-item>
              </vxe-form>
              <div ref="chart3" style="width: 600px; height: 400px;"></div>
            </div>
            <div class="col-lg-6">
<!--              <div ref="chart" style="width: 300px; height: 200px;"></div>-->
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

import * as settingService from "@/api/settingInfoService";
import * as chartService from "@/api/chartService";
export default {

  data() {
    const formData = {
      year: '',
      classId: '',
      semesterId: '',
      subjectId: '',
    }
    const examData = {
      examCode: '',
      examName: '',
    }

    const yearOptions = []
    const classOptions = []
    const semesterOptions = []
    const subjectOptions = []
    const examOptions = []

    const char1xData = [];
    const char1yData = [];

    const char2Data = null;
    const char3Data = null;

    return {
      chart1: null,
      chart2: null,
      chart3: null,
      formData,
      yearOptions,
      classOptions,
      semesterOptions,
      subjectOptions,
      examOptions,
      examData,
      char1xData,
      char1yData,
      char2Data,
      char3Data,
    };
  },
  mounted() {
    this.initChart1();
    this.initChart2();
  },

  created() {
    this.getYearOptions()

  },

  methods: {

    // 获取年份下拉框选项
    getYearOptions() {
      // 加载年份下拉选项
      settingService.getTeacherYearList().then(response => {
        if (response.code === 200) {
          this.yearOptions = response.data;
          if (response.data[0] != null) {
            const year = response.data[0].value;
            this.formData = {year: year}
            this.queryYearChange();
            this.reloadChar1Data()
            this.reloadChar2Data()
          }
        }
      });
    },

    // 查询时，年份变化下拉框联动
    queryYearChange() {
      const year = this.formData.year;
      if (year != null && year !== '') {
        // 加载班级下拉选项
        settingService.getTeacherClassListByCondition({year: year}).then(response => {
          if (response.code === 200) {
            this.formData = {year: year, classId: ''}
            this.classOptions = response.data;
            if (response.data[0] != null) {
              const classId = response.data[0].value;

              this.formData = {year: year, classId: classId}
              this.queryClassChange();
              this.reloadChar1Data()
              this.reloadChar2Data()
            }
          }
        });
      }
    },

    // 查询时，班级变化下拉框联动
    queryClassChange() {
      const classId = this.formData.classId;
      const year = this.formData.year;
      if (classId != null && classId !== '') {
        // 加载学期下拉选项
        settingService.getTeacherSemesterListByCondition({year: year, classId: classId}).then(response => {
          if (response.code === 200) {
            this.semesterOptions = response.data;
            if (response.data[0] != null) {
              const semesterId = response.data[0].value;
              this.formData = {year: year, classId: classId, semesterId: semesterId}
              // 加载学科下拉选项
              this.querySemesterChange();
              this.reloadChar1Data()
              this.reloadChar2Data()
            }
          }
        });
      }
    },

    // 查询时，学期变化下拉框联动
    querySemesterChange() {
      const semesterId = this.formData.semesterId;
      const year = this.formData.year;
      const classId = this.formData.classId;
      if (classId != null && classId !== '') {
        settingService.getTeacherSubjectListByCondition({
          year: year,
          classId: classId,
          semesterId: semesterId
        }).then(response => {
          if (response.code === 200) {
            this.subjectOptions = response.data;
            if (response.data[0] != null) {
              const subjectId = response.data[0].value;
              this.formData = {
                year: year,
                classId: classId,
                semesterId: semesterId,
                subjectId: subjectId
              }
              this.querySubjectChange();
              this.reloadChar1Data()
              this.reloadChar2Data()
            }
          }
        });
      }
    },

    querySubjectChange() {
      const semesterId = this.formData.semesterId;
      const year = this.formData.year;
      const classId = this.formData.classId;
      const subjectId = this.formData.subjectId;
      if (subjectId != null && subjectId !== '') {
        settingService.getTeacherExamListByCondition({
          year: year,
          classId: classId,
          semesterId: semesterId,
          subjectId: subjectId
        }).then(response => {
          if (response.code === 200) {
            this.examOptions = response.data;
            if (response.data[0] != null) {
              const examCode = response.data[0].value;
              this.examData = {
                examCode: examCode,
              }
              this.reloadChar1Data()
              this.reloadChar2Data()
              this.reloadChar3Data()
            }
          }
        });
      }
    },

    examChange() {
      this.reloadChar2Data()
      this.reloadChar3Data()
    },

    reloadChar1Data() {
      const classId = this.formData.classId;
      const semesterId = this.formData.semesterId;
      const year = this.formData.year;
      const subjectId = this.formData.subjectId;
      chartService.getClassChart1Data({
        classId: classId,
        semesterId: semesterId,
        year: year,
        subjectId: subjectId,
      }).then(response => {
        if (response.code === 200) {
          this.char1xData = response.data.xdata;
          this.char1yData = response.data.ydata;
          this.initChart1();
        }
      });
    },

    reloadChar2Data() {
      const classId = this.formData.classId;
      const semesterId = this.formData.semesterId;
      const year = this.formData.year;
      const subjectId = this.formData.subjectId;
      const examCode = this.examData.examCode;
      chartService.getClassChart2Data({
        classId: classId,
        semesterId: semesterId,
        year: year,
        subjectId: subjectId,
        examCode: examCode,
      }).then(response => {
        if (response.code === 200) {
          this.char2Data = response.data;
          this.initChart2();
        }
      });
    },

    reloadChar3Data() {
      const classId = this.formData.classId;
      const semesterId = this.formData.semesterId;
      const year = this.formData.year;
      const subjectId = this.formData.subjectId;
      const examCode = this.examData.examCode;
      chartService.getClassChart3Data({
        classId: classId,
        semesterId: semesterId,
        year: year,
        subjectId: subjectId,
        examCode: examCode,
      }).then(response => {
        if (response.code === 200) {
          this.char3Data = response.data;
          this.initChart3();
        }
      });
    },


    initChart1() {
      if(this.$refs.chart1 != null) {
        this.chart = echarts.init(this.$refs.chart1);
      }
      const option = {
        title: {
          text: '班级平均分折线图',
        },
        legend: {
          data: ['班级平均分']
        },
        backgroundColor: '#FFFFFF',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          data: this.char1xData,
        },
        yAxis: {
          min: 60,
        },
        color: 'rgb(169, 223, 150)',
        series: [
          {
            name: '班级平均分',
            color: 'rgb(176, 58, 91)',
            type: 'line',
            smooth: true,
            data: this.char1yData
          }
        ],
      };
      this.chart.setOption(option);
    },

    initChart2() {
      if(this.$refs.chart2 != null) {
        this.chart = echarts.init(this.$refs.chart2);
      }
      const option = {
        title: {
          text: '成绩等级环形图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        backgroundColor: '#FFFFFF',

        series: [
          {
            name: '成绩等级统计',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: this.char2Data
          }
        ],
      };
      this.chart.setOption(option);
    },

    initChart3() {
      if(this.$refs.chart3 != null) {
        this.chart = echarts.init(this.$refs.chart3);
      }
      const option = {
        title: {
          text: '成绩等级统计图',
          left: 'center'
        },
        xAxis: {
          min: 50,
          name: '分数',
        },
        yAxis: {
          name: '人数',
        },
        tooltip: {
          trigger: 'item'
        },
        backgroundColor: '#FFFFFF',
        series: [
          {
            name: '成绩等级统计',
            type: 'scatter',
            data: this.char3Data
          }
        ],
      };
      this.chart.setOption(option);
    },

    changeEvent(params) {
      const $form = this.$refs.formRef
      if ($form) {
        $form.updateStatus(params)
      }
    },
    submitEvent() {
      VxeUI.modal.message({content: '保存成功', status: 'success'})
    }
  },
};
</script>

<style scoped>
</style>
