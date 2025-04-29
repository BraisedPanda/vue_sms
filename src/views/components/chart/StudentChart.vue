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
          <!--
          <div class="row">
            <div class="col-lg-3 col-md-6 col-12">
              <mini-statistics-card
                  title="Sales"
                  value="$103,430"
                  description="<span
                  class='text-sm font-weight-bolder text-success'
                  >+5%</span> than last month"
              />
            </div>
            <div class="col-lg-3 col-md-6 col-12">
              <mini-statistics-card
                  title="Sales"
                  value="$103,430"
                  description="<span
                  class='text-sm font-weight-bolder text-success'
                  >+5%</span> than last month"

              />
            </div>
            <div class="col-lg-3 col-md-6 col-12">
              <mini-statistics-card
                  title="Sales"
                  value="$103,430"
                  description="<span
                  class='text-sm font-weight-bolder text-success'
                  >+5%</span> than last month"

              />
            </div>
            <div class="col-lg-3 col-md-6 col-12">
              <mini-statistics-card
                  title="Sales"
                  value="$103,430"
                  description="<span
                  class='text-sm font-weight-bolder text-success'
                  >+5%</span> than last month"

              />
            </div>
          </div>
          -->

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
              <vxe-form :data="studentData">
                <vxe-form-item title="姓名" field="studentId" span="10" :item-render="{}">
                  <template #default="params">
                    <vxe-select v-model="studentData.studentId" :options="studentOptions" @change="studentChange(params)" filterable></vxe-select>
                  </template>
                </vxe-form-item>
              </vxe-form>
              <div ref="chart1" style="width: 550px; height: 400px;"></div>
            </div>
            <div class="col-lg-6">
              <vxe-form :data="studentData">
                <vxe-form-item title="姓名" field="studentId" span="10" :item-render="{}">
                  <template #default="params">
                    <vxe-select v-model="studentData.studentId" :options="studentOptions" @change="studentChange(params)" filterable></vxe-select>
                  </template>
                </vxe-form-item>
              </vxe-form>
              <div ref="chart2" style="width: 550px; height: 400px;"></div>
            </div>
          </div>
          <!--        <div class="row mt-4">-->
          <!--          <div class="col-lg-7 mb-lg-0 mb-4">-->
          <!--            <div ref="chart" style="width: 300px; height: 200px;"></div>-->
          <!--          </div>-->
          <!--          <div class="col-lg-5">-->
          <!--            <div ref="chart" style="width: 300px; height: 200px;"></div>-->
          <!--          </div>-->
          <!--        </div>-->
        </div>
      </div>
      <vxe-text class="ps-3" icon="vxe-icon-warning-circle-fill" size="mini" status="info">成绩低于50不显示</vxe-text>
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
    const studentData = {
      studentName: '',
      studentId: '',
    }

    const yearOptions = []
    const classOptions = []
    const semesterOptions = []
    const subjectOptions = []
    const studentOptions = []

    const char1xData = [];
    const char1yData = [];
    const char1averageData = [];

    const char2xData = [];
    const char2yData = [];

    return {
      chart1: null,
      chart2: null,
      formData,
      yearOptions,
      classOptions,
      semesterOptions,
      subjectOptions,
      studentOptions,
      studentData,
      char1xData,
      char1yData,
      char1averageData,
      char2xData,
      char2yData,
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
              this.querySubjectChange();
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
              this.reloadChar1Data()
              this.reloadChar2Data()
            }
          }
        });
      }
    },

    querySubjectChange() {
      const classId = this.formData.classId;
      const semesterId = this.formData.semesterId;
        settingService.getTeacherStudentListByCondition({
          classId: classId,
          semesterId: semesterId
        }).then(response => {
          if (response.code === 200) {
            this.studentOptions = response.data;
            if (response.data[0] != null) {
              const studentId = response.data[0].value;
              this.studentData = {studentId: studentId}

              this.reloadChar1Data()
              this.reloadChar2Data()

            }
          }
        });
    },

    studentChange() {
      this.reloadChar1Data()
      this.reloadChar2Data()
    },

    reloadChar1Data() {
      const classId = this.formData.classId;
      const semesterId = this.formData.semesterId;
      const year = this.formData.year;
      const subjectId = this.formData.subjectId;
      const studentId = this.studentData.studentId;
      chartService.getStudentChart1Data({
        classId: classId,
        semesterId: semesterId,
        year: year,
        subjectId: subjectId,
        studentId: studentId,
      }).then(response => {
        if (response.code === 200) {
          this.char1xData = response.data.xdata;
          this.char1yData = response.data.ydata;
          this.char1averageData = response.data.averageData;
          this.initChart1();
        }
      });
    },

    reloadChar2Data() {
      const classId = this.formData.classId;
      const semesterId = this.formData.semesterId;
      const year = this.formData.year;
      const subjectId = this.formData.subjectId;
      const studentId = this.studentData.studentId;
      chartService.getStudentChart2Data({
        classId: classId,
        semesterId: semesterId,
        year: year,
        subjectId: subjectId,
        studentId: studentId,
      }).then(response => {
        if (response.code === 200) {
          this.char2xData = response.data.xdata;
          this.char2yData = response.data.ydata;
          this.initChart2();
        }
      });
    },



    initChart1() {
      if(this.$refs.chart1 != null) {
        this.chart = echarts.init(this.$refs.chart1);
      }
      const option = {
        title: {
          text: '成绩趋势统计',
        },
        legend: {
          data: ['学生成绩', '班级平均分']
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
          min: 50,
        },
        color: 'rgb(169, 223, 150)',
        series: [
          {
            name: '学生成绩',
            type: 'bar',
            data: this.char1yData,
          },
          {
            name: '班级平均分',
            color: 'rgb(176, 58, 91)',
            type: 'line',
            smooth: true,
            data: this.char1averageData
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
          text: '班级排名统计',
        },
        legend: {
          data: ['班级排名']
        },
        backgroundColor: '#FFFFFF',
        tooltip: {},
        xAxis: {
          data: this.char2xData,
        },
        yAxis: {
          inverse: true
        },
        series: [
          {
            name: '班级排名',
            type: 'line',
            smooth: true,
            data: this.char2yData
          },
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
