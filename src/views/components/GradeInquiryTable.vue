<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card mb-4">
          <div class="card-header pb-0">
            <!--      <h6>成绩查询</h6>-->
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <vxe-tag status="primary" :content="examMessage" icon="vxe-icon-feedback"></vxe-tag>
              <vxe-grid
                  ref="tableRef"
                  :custom-config="customConfig"
                  v-bind="gridOptions"
                  @sort-change="sortChangeEvent"
                  @page-change="pageChangeEvent"
                  @form-submit="queryGradeInfo"
              >
              </vxe-grid>
            </div>

          </div>

          <div class="col-lg-12">
            <div class="row mt-4">
              <div class="col-xl-12">
                <div class="row">

                  <div class="col-md-2">
                    <default-info-card
                        :icon="{
                    component: 'vxe-icon-number',
                    background: 'bg-gradient-primary',
                  }"
                        :title="top1"
                        description="第一名"
                    />
                  </div>
                  <div class="col-md-2">
                    <default-info-card
                        :icon="{
                    component: 'vxe-icon-chart-line',
                    background: 'bg-gradient-success',
                  }"
                        :title="average"
                        description="平均分"
                    />
                  </div>
                  <div class="col-md-2">
                    <default-info-card
                        :icon="{
                    component: 'vxe-icon-add-users',
                    background: 'bg-gradient-warning',
                  }"
                        :title="moreThan90"
                        description="90分以上人数"
                    />
                  </div>
                  <div class="col-md-2">
                    <default-info-card
                        :icon="{
                    component: 'vxe-icon-star-fill',
                    background: 'bg-gradient-danger',
                  }"
                        :title="excellentRate"
                        description="优秀率(90分以上)"
                    />
                  </div>
                  <div class="col-md-2">
                    <default-info-card
                        :icon="{
                    component: 'vxe-icon-chart-pie',
                    background: 'bg-gradient-info',
                  }"
                        :title="modalValue"
                        description="分数众数"
                    />
                  </div>
                  <div class="col-md-2">
                    <default-info-card
                        :icon="{
                    component: 'vxe-icon-calendar',
                    background: 'bg-gradient-dark',
                  }"
                        :title="examDate"
                        description="考试时间"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>


    </div>
  </div>
</template>

<script>
import * as settingService from '@/api/settingInfoService';
import * as gradeInfoService from "@/api/gradeInfoService";
import {VxeUI} from "vxe-pc-ui";
import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue";


export default {
  components: { DefaultInfoCard},

  data() {

    const examMessage = '考试信息';

    const customConfig = {
      allowVisible: true,
      allowFixed: false,
      allowResizable: false,
      allowSort: false
    }

    // 表格配置
    const gridOptions = {
      showOverflow: true,
      border: true,
      loading: false,
      height: 750,
      sortConfig: {
        remote: true
      },
      printConfig: {},
      columnConfig: {
        useKey: true
      },
      toolbarConfig: {
        refresh: false,
        import: false,
        export: true,
        print: true,
        zoom: false,
        custom: true,
      },
      exportConfig: {
        type: 'xlsx'
      },
      rowConfig: {
        useKey: true
      },
      pagerConfig: {
        total: 50,
        currentPage: 1,
        pageSize: 10
      },
      formConfig: {
        data: {
          studentId: '',
          studentName: '',
          score: '',
          gradeLevel: '',
        },

        items: [
          {
            field: 'year',
            title: '年份',
            itemRender: {
              name: 'VxeSelect',
              options: [],
              props: {defaultConfig: {selectMode: 'first'}},
              events: {change: this.queryYearChange},
            }
          },
          {
            field: 'classId',
            title: '班级',
            itemRender: {
              name: 'VxeSelect',
              vModel: 'createClass',
              options: [],
              events: {change: this.queryClassChange},
            }
          },
          {
            field: 'semesterId',
            title: '学期',
            itemRender: {
              name: 'VxeSelect',
              options: [],
              props: {defaultConfig: {selectMode: 'last'}},
              events: {change: this.querySemesterChange},
            }
          },
          {
            field: 'subjectId',
            title: '学科',
            itemRender: {
              name: 'VxeSelect',
              options: [],
              props: {defaultConfig: {selectMode: 'last'}},
              events: {change: this.querySubjectChange},
            }
          },
          {
            field: 'examCode',
            title: '考试名称',
            itemRender: {
              name: 'VxeSelect',
              options: [],
              props: {defaultConfig: {selectMode: 'last'}},
              events: {change: this.queryExamChange},
            },
          },
          {
            field: 'studentName',
            title: '姓名',
            itemRender: {name: 'VxeInput', events: {change: this.filterTableData}},
          },
          {
            field: 'score',
            title: '分数',
            itemRender: {name: 'VxeInput', events: {change: this.filterTableData}}
          },
          {
            field: 'gradeLevel',
            title: '等级',
            itemRender: {name: 'VxeInput', events: {change: this.filterTableData}}
          },
          {
            itemRender: {
              name: 'VxeButtonGroup',
              options: [
                {type: 'submit', icon: "vxe-icon-search", content: '查询', status: 'primary'},
              ]
            }
          }
        ]

      },
      columns: [
        {field: 'seq', type: 'seq', width: 70, align: 'center'},
        {field: 'studentId', title: '学号', visible: false, align: 'center'},
        {field: 'studentName', title: '姓名', align: 'center', sortable: true},
        {field: 'score', title: '分数', align: 'center', sortType: 'number', sortable: true},
        {field: 'gradeLevel', title: '等级', align: 'center'},
      ],
      data: [],
      // 分页连续序号的相关代码
      seqConfig: {
        seqMethod: ({rowIndex}) => {
          return (this.gridOptions.pagerConfig.currentPage - 1) * this.gridOptions.pagerConfig.pageSize + rowIndex + 1
        }
      },

    }

    const allList = [];

    const filterList = [];

    const top1 = '';
    const average = '';
    const moreThan90 = '';
    const excellentRate = '';
    const examDate = '';
    const modalValue = '';

    return {
      gridOptions,
      customConfig,
      allList,
      filterList,
      examMessage,
      top1,
      average,
      moreThan90,
      excellentRate,
      examDate,
      modalValue,
    }
  },

  mounted() {
    const $table = this.$refs.tableRef
    const $toolbar = this.$refs.toolbarRef
    if ($table && $toolbar) {
      $table.connect($toolbar)
    }
  },

  created() {
    this.getYearOptions();
    this.handlePageData();
  },

  methods: {

    // 获取年份下拉框选项
    getYearOptions() {
      // 加载年份下拉选项
      settingService.getTeacherYearList().then(response => {
        if (response.code === 200) {
          this.gridOptions.formConfig.items[0].itemRender.options = response.data;

          if (response.data[0] != null) {
            const year = response.data[0].value;
            const yearRow = {};
            yearRow.value = year;
            this.queryYearChange(null, yearRow);
            this.setExamMessage();
          }
        }
      });
    },

    setExamMessage() {
      const searchData = this.gridOptions.formConfig.data;
      settingService.getExamMessage(JSON.stringify(searchData)).then(response => {
        if (response.code === 200) {
          this.examMessage = response.data;
        }
      });
    },

    setExamStaticInfo() {
      const searchData = this.gridOptions.formConfig.data;
      settingService.getExamStaticInfo(JSON.stringify(searchData)).then(response => {
        if (response.code === 200) {
          this.top1 = response.data.top1;
          this.average = response.data.average;
          this.moreThan90 = response.data.moreThan90;
          this.excellentRate = response.data.excellentRate;
          this.examDate = response.data.examDate;
          this.modalValue = response.data.modalValue;
        }
      });
    },

    // 查询时，年份变化下拉框联动
    queryYearChange(row, yearRow) {
      const year = yearRow.value;
      if (year != null && year !== '') {
        // 加载班级下拉选项
        settingService.getTeacherClassListByCondition({year: year}).then(response => {
          if (response.code === 200) {
            this.gridOptions.formConfig.data = {year: year, classId: ''}
            this.gridOptions.formConfig.items[1].itemRender.options = response.data;
            if (response.data[0] != null) {
              const classId = response.data[0].value;
              this.gridOptions.formConfig.data = {year: year, classId: classId}
              const classRow = {};
              classRow.value = classId;
              this.queryClassChange(null, classRow);
            }
          }
        });
      }
    },
    // 查询时，班级变化下拉框联动
    queryClassChange(row, classRow) {
      const classId = classRow.value;
      const year = this.gridOptions.formConfig.data.year;
      if (classId != null && classId !== '') {
        // 加载学期下拉选项
        settingService.getTeacherSemesterListByCondition({year: year, classId: classId}).then(response => {
          if (response.code === 200) {
            this.gridOptions.formConfig.items[2].itemRender.options = response.data;
            if (response.data[0] != null) {
              const semesterId = response.data[0].value;
              this.gridOptions.formConfig.data = {year: year, classId: classId, semesterId: semesterId}
              const semesterRow = {};
              semesterRow.value = semesterId;

              // 加载学科下拉选项
              this.querySemesterChange(null, semesterRow);
            }
          }
        });
      }
    },
    // 查询时，学期变化下拉框联动
    querySemesterChange(row, semesterRow) {
      const semesterId = semesterRow.value;
      const year = this.gridOptions.formConfig.data.year;
      const classId = this.gridOptions.formConfig.data.classId;
      if (classId != null && classId !== '') {
        settingService.getTeacherSubjectListByCondition({
          year: year,
          classId: classId,
          semesterId: semesterId
        }).then(response => {
          if (response.code === 200) {
            this.gridOptions.formConfig.items[3].itemRender.options = response.data;
            if (response.data[0] != null) {
              const subjectId = response.data[0].value;
              this.gridOptions.formConfig.data = {
                year: year,
                classId: classId,
                semesterId: semesterId,
                subjectId: subjectId
              }

              const subjectRow = {};
              subjectRow.value = subjectId;
              // 加载学科下拉选项
              this.querySubjectChange(null, subjectRow);
            }
          }
        });
      }
    },
    // 查询时，学科变化下拉框联动
    querySubjectChange(row, subjectRow) {
      const subjectId = subjectRow.value;
      const year = this.gridOptions.formConfig.data.year;
      const classId = this.gridOptions.formConfig.data.classId;
      const semesterId = this.gridOptions.formConfig.data.semesterId;
      if (classId != null && classId !== '') {
        settingService.getTeacherExamListByCondition({
          year: year,
          classId: classId,
          semesterId: semesterId,
          subjectId: subjectId
        }).then(response => {
          if (response.code === 200) {
            this.gridOptions.formConfig.items[4].itemRender.options = response.data;
            if (response.data[0] != null) {
              const examCode = response.data[0].value;
              this.gridOptions.formConfig.data = {
                year: year,
                classId: classId,
                semesterId: semesterId,
                subjectId: subjectId,
                examCode: examCode
              }
              this.queryGradeInfo();
            }
          }
        });
      }
    },
    // 查询时，考试名称变化重新加载table数据
    queryExamChange() {
      this.queryGradeInfo();
    },


    filterTableData() {
      this.gridOptions.data = this.getResultList();
      this.gridOptions.pagerConfig.currentPage = 1;
      this.handlePageData()
    },

    getResultList() {
      const searchData = this.gridOptions.formConfig.data;
      const studentName = searchData.studentName;
      const score = searchData.score != null ? searchData.score : "";
      const gradeLevel = searchData.gradeLevel != null ? searchData.gradeLevel.toUpperCase() : "";
      const $grid = this.$refs.tableRef

      let resultList = this.allList;
      if ($grid) {
        if (studentName != null && studentName !== '') {
          resultList = resultList.filter(item => {
            return item.studentName.includes(studentName)
          })
        }
        if (score != null && score !== '') {
          resultList = resultList.filter(item => {
            return item.score.toString().includes(score)
          })
        }

        if (gradeLevel != null && gradeLevel !== '') {
          resultList = resultList.filter(item => {
            if (item.gradeLevel != null && item.gradeLevel !== '') {
              return item.gradeLevel.includes(gradeLevel)
            }
          })
        }
      }
      this.filterList = resultList;
      return resultList;
    },


    // 模拟前端分页
    handlePageData() {

      const searchData = this.gridOptions.formConfig.data;
      const studentName = searchData.studentName;
      const score = searchData.score != null ? searchData.score.toString() : "";
      const gradeLevel = searchData.gradeLevel != null ? searchData.gradeLevel.toUpperCase() : "";
      let flag = true;
      if ((studentName == null || studentName === '') &&
          (score == null || score === '') &&
          (gradeLevel == null || gradeLevel === '')) {
        flag = false;
      }
      setTimeout(() => {
        const {pageSize, currentPage} = this.gridOptions.pagerConfig
        if (flag) {
          this.gridOptions.pagerConfig.total = this.filterList.length
          this.gridOptions.data = this.filterList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        } else {
          this.gridOptions.pagerConfig.total = this.allList.length
          this.gridOptions.data = this.allList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        }

      }, 0)
    },

    pageChangeEvent({pageSize, currentPage}) {
      this.gridOptions.pagerConfig.currentPage = currentPage
      this.gridOptions.pagerConfig.pageSize = pageSize
      this.handlePageData()
    },


    queryGradeInfo(field, order) {
      // this.gridOptions.loading = true
      return new Promise(resolve => {
        setTimeout(() => {
          // this.gridOptions.loading = false
          const searchData = this.gridOptions.formConfig.data;
          gradeInfoService.getGradeList(JSON.stringify(searchData)).then((response) => {
            if (response.code === 200) {

              if (field && order) {
                let list = []
                if (order === 'asc' || order === 'desc') {
                  if (field === 'score') {
                    // 分离数字和字符
                    let numbers = response.data.filter(item => !isNaN(item.score)); // 提取数字
                    let strings = response.data.filter(item => isNaN(item.score)); // 提取字符
                    numbers.sort((a, b) => {
                      if (isNaN(a[field])) return -1
                      if (isNaN(b[field])) return -1
                      const aVal = Number(a[field])
                      const bVal = Number(b[field])
                      return aVal === bVal ? 0 : (aVal > bVal ? 1 : -1)
                    })
                    list = list.concat(strings);
                    list = list.concat(numbers);
                  } else {
                    list = response.data.sort((a, b) => {
                      const aVal = a[field]
                      const bVal = b[field]
                      return aVal === bVal ? 0 : (aVal > bVal ? 1 : -1)
                    })
                  }
                }
                if (order === 'desc') {
                  list.reverse()
                }
                this.gridOptions.data = list
                this.allList = list;
              } else {
                this.gridOptions.data = response.data
                resolve(response.data)
                this.allList = response.data;
              }
              this.setExamMessage();
              this.handlePageData();
              this.setExamStaticInfo();
            } else {
              VxeUI.modal.message({content: response.message, status: 'warning'});
            }
          }).catch(() => {
            this.$MessageAi.showMessage("服务器错误！")
          });


        }, 300)
      })
    },

    sortChangeEvent({field, order}) {
      this.gridOptions.pagerConfig.currentPage = 1;
      this.queryGradeInfo(field, order)
    },


  },


}

</script>
