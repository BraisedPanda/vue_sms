<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>学生成绩表</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <vxe-grid
            ref="tableRef"
            :custom-config="customConfig"
            v-bind="gridOptions"
            @page-change="pageChangeEvent"
            @form-submit="formSubmitEvent"
            @form-reset="formResetEvent"
        >
        </vxe-grid>
      </div>
    </div>

  </div>
</template>

<script>
import * as gradeService from '@/api/grade';
import * as settingService from '@/api/setting';
export default {

  data() {

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
      showFooter: true,
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
            field: 'semester',
            title: '学期',
            itemRender: {
              name: 'VxeSelect',
              options: [
              ],
              events: {change: this.semesterAndSubjectChange},
              props: {defaultConfig: {selectMode : 'last'} },
            }
          },
          {
            field: 'subject',
            title: '学科',
            itemRender: {
              name: 'VxeSelect',
              options: [
              ],
              events: {change: this.semesterAndSubjectChange},
              props: {defaultConfig: {selectMode : 'last'} },
            }
          },
          {
            field: 'unity',
            title: '单元',
            itemRender: {
              name: 'VxeSelect',
              options: [
              ],
              events: {change: this.filterTableData},
              props: {defaultConfig: {selectMode : 'last'} },
            }
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
                // {type: 'submit', content: '搜索', status: 'primary'},
                // {type: 'reset', content: '重置'},
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

    }
  },

  mounted() {
    const $table = this.$refs.tableRef
    const $toolbar = this.$refs.toolbarRef
    if ($table && $toolbar) {
      $table.connect($toolbar)
    }
    this.getSettingOptions()
    this.semesterAndSubjectChange()
  },

  created() {
    this.getGradeList();
    this.handlePageData();

  },

  methods: {

    // 获取setting下拉框选项
    getSettingOptions() {
      settingService.getGradeSetting().then(response => {
        if (response.code === 200) {
          this.gridOptions.formConfig.items[0].itemRender.options = response.data;
        }
      });
      settingService.getSubjectSetting().then(response => {
        if (response.code === 200) {
          this.gridOptions.formConfig.items[1].itemRender.options = response.data;
        }
      });
    },

    // 选择不同的学期，自动带入单元值
    semesterAndSubjectChange() {
      const searchData = this.gridOptions.formConfig.data;
      let semester = searchData.semester;
      let subject = searchData.subject;
      if(semester == null) {
        semester = '';
      }
      if(subject == null) {
        subject = '';
      }
      settingService.getUnitySetting({semester: semester, subject: subject}).then(response => {
        if (response.code === 200) {
          this.gridOptions.formConfig.items[2].itemRender.options = response.data;
        }
      });
    },




    filterTableData() {
      this.gridOptions.data = this.getResultList();
      this.handlePageData()
    },

    getResultList() {
      const searchData = this.gridOptions.formConfig.data;
      const studentName = searchData.studentName;
      const score = searchData.score;
      const gradeLevel = searchData.gradeLevel.toUpperCase();
      const $grid = this.$refs.tableRef

      let resultList = JSON.parse(JSON.stringify(this.allList));

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
            return item.gradeLevel.includes(gradeLevel)
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

    // 查询成绩数据
    getGradeList() {
      gradeService.getGradeList().then(response => {
        if (response.code === 200) {
          this.gridOptions.data = response.data;
        } else {
          this.$MessageAi.showMessage(response.message);
        }
        this.allList = response.data;
      }).catch(() => {
        this.$MessageAi.showMessage("服务器错误！")
      });
    },


    formSubmitEvent() {
      // 获取搜索栏中的值
      const searchData = this.gridOptions.formConfig.data;
      const studentName = searchData.studentName;
      const score = searchData.score;
      const gradeLevel = searchData.gradeLevel;
      this.getGradeList({studentName: studentName, score: score, gradeLevel: gradeLevel})

    },
    formResetEvent() {
      this.handlePageData()
    },


  },


}

</script>
