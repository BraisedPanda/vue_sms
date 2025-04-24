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
                  @page-change="pageChangeEvent"
                  @form-submit="queryGradeInfo"
                  @form-reset="formResetEvent"
              >
              </vxe-grid>
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

export default {

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
      height: 650,
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
        {field: 'seq', type: 'seq', width: 70, align: 'center', cellType: 'string'},
        {field: 'studentId', title: '学号', visible: false, align: 'center', cellType: 'string'},
        {field: 'studentName', title: '姓名', align: 'center', cellType: 'string'},
        {field: 'score', title: '分数', align: 'center', cellType: 'string'},
        {field: 'gradeLevel', title: '等级', align: 'center', cellType: 'string'},
      ],
      data: [],

    }

    const allList = [];

    const filterList = [];


    return {
      gridOptions,
      customConfig,
      allList,
      filterList,
      examMessage
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
      this.gridOptions.loading = true
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
        this.gridOptions.loading = false
      }, 100)
    },

    pageChangeEvent({pageSize, currentPage}) {
      this.gridOptions.pagerConfig.currentPage = currentPage
      this.gridOptions.pagerConfig.pageSize = pageSize
      this.handlePageData()
    },


    queryGradeInfo() {
      const searchData = this.gridOptions.formConfig.data;
      this.gridOptions.loading = true;
      gradeInfoService.getGradeList(JSON.stringify(searchData)).then((response) => {
        if (response.code === 200) {
          this.gridOptions.data = response.data;
          this.setExamMessage();
          this.allList = response.data;
        } else {
          VxeUI.modal.message({content: response.message, status: 'warning'});
        }
      }).catch(() => {
        this.$MessageAi.showMessage("服务器错误！")
      });
      this.gridOptions.loading = false;
      this.handlePageData();
    },


    formResetEvent() {
      this.handlePageData()
    },


  },


}

</script>
