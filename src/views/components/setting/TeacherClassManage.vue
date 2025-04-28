<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card mb-4">
          <div class="card-header pb-0">
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <p style="margin-left: 2%">
                <vxe-button status="success" icon="vxe-icon-add" @click="addEvent">新增</vxe-button>
              </p>

              <vxe-grid
                  ref="gridRef"
                  :custom-config="customConfig"
                  v-bind="gridOptions"
                  @page-change="pageChangeEvent"
                  @form-submit="queryGradeInfo"
              >
                <template #action="{ row }">
                  <vxe-button type="text" status="primary" @click="approveRow(row)">通过</vxe-button>
                  <vxe-button type="text" status="error" @click="rejectionRow(row)">驳回</vxe-button>
                </template>
              </vxe-grid>

              <vxe-modal
                  resize
                  destroy-on-close
                  show-footer
                  show-confirm-button
                  show-cancel-button
                  v-model="showEditPopup"
                  title="新增考试信息"
                  width="450"
                  height="500"
                  :loading="loading"
                  :confirm-closable="false"
                  @confirm="createTeacherClassRelation">
                <vxe-form ref="formRef" v-bind="formOptions">

                </vxe-form>
              </vxe-modal>

            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as settingService from '@/api/settingInfoService';
import * as teacherClassRelationService from '@/api/teacherClassRelationService';

import {VxeUI} from 'vxe-pc-ui';


export default {

  data() {

    const formOptions = {
      titleWidth: 80,
      titleAlign: 'right',
      titleColon: true,
      span: '24',
      size: 'small',
      vertical: true,
      data: [{
        classIdValue: '',
      }],
      items: [
        {
          field: 'year',
          title: '年份',
          itemRender: {
            name: 'VxeDatePicker',
            props: {type: 'year', clearable: true},

          }
        },
        {
          field: 'classId',
          title: '班级',
          itemRender: {
            name: 'VxeSelect',
            options: [],
            props: {filterable: true, clearable: true},

          },
        },
        {
          field: 'semesterId',
          title: '学期',
          itemRender: {
            name: 'VxeSelect',
            options: [{label: '上学期', value: 'S1'}, {label: '下学期', value: 'S2'}],
            props: {clearable: true},

          }
        },
        {
          field: 'subjectId',
          title: '学科',
          itemRender: {
            name: 'VxeSelect',
            options: [],
            props: {clearable: true},
          }
        },
      ],
      rules: {
        year: [{required: true, message: '请选择年份'}],
        classId: [{required: true, message: '请选择班级'}],
        semesterId: [{required: true, message: '请选择学期'}],
        subjectId: [{required: true, message: '请选择科目'}],
      }

    }


    const customConfig = {
      allowVisible: false,
      allowFixed: false,
      allowResizable: false,
      allowSort: false
    }

    // 表格配置
    const gridOptions = {
      showOverflow: true,
      border: true,
      round: true,
      stripe: true,
      loading: false,
      height: 650,
      printConfig: {},
      columnConfig: {
        useKey: true
      },
      pagerConfig: {
        total: 50,
        currentPage: 1,
        pageSize: 10
      },
      editConfig: {
        trigger: 'click',
        mode: 'row'
      },

      rowConfig: {
        useKey: true
      },
      formConfig: {
        data: {},

        items: [
          {
            field: 'year',
            title: '年份',
            itemRender: {
              name: 'VxeSelect',
              options: [],
              props: {clearable: true},
            }
          },
          {
            field: 'semesterId',
            title: '学期',
            itemRender: {
              name: 'VxeSelect',
              vModel: 'createSemester',
              options: [{label: '上学期', value: 'S1'}, {label: '下学期', value: 'S2'}],
              props: {clearable: true},
            }
          },
          {
            field: 'subjectId',
            title: '学科',
            itemRender: {
              name: 'VxeSelect',
              vModel: 'createSubject',
              options: [],
              props: {clearable: true},
            }
          },

          {
            itemRender: {
              name: 'VxeButtonGroup',
              options: [
                // {type: 'submit', content: '查询', status: 'primary'},
                {type: 'submit', icon: "vxe-icon-search", content: '查询', status: 'primary'},
              ]
            }
          }
        ],
        rules: {
          year: [{required: false, message: '请选择年份'}],
          semesterId: [{required: false, message: '请选择学期'}],
          subjectId: [{required: false, message: '请选择科目'}],
        }

      },
      columns: [
        {field: 'seq', type: 'seq', width: 70, align: 'center', cellType: 'string'},
        {field: 'year', title: '年份', visible: true, align: 'center', cellType: 'string'},
        {
          field: 'semesterName',
          title: '学期',
          align: 'center',
        },
        {
          title: '班级',
          field: 'className',
          align: 'center',
          cellType: 'string',
        },
        {
          field: 'subjectName',
          title: '科目',
          align: 'center',
          cellType: 'string',
        },
        { field: 'action', title: '操作', width: 180, slots: { default: 'action' } }
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

    const myClassList = [];
    const mySemesterList = [];
    const mySubjectList = [];

    return {
      gridOptions,
      customConfig,
      allList,
      myClassList,
      mySemesterList,
      mySubjectList,
      formOptions,
      showEditPopup: false,
      loading: false,
    }
  },

  mounted() {
    const $table = this.$refs.gridRef
    const $toolbar = this.$refs.toolbarRef
    if ($table && $toolbar) {
      $table.connect($toolbar)
    }
    this.queryGradeInfo()
  },

  created() {
    this.getYearOptions()
    this.getQuerySubjectOptions()
    this.getAllClassOption();
    this.getAllSubjectOption();
  },

  methods: {

    // 模拟前端分页
    handlePageData() {
      const {pageSize, currentPage} = this.gridOptions.pagerConfig
      this.gridOptions.pagerConfig.total = this.allList.length
      this.gridOptions.data = this.allList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    },

    pageChangeEvent({pageSize, currentPage}) {
      this.gridOptions.pagerConfig.currentPage = currentPage
      this.gridOptions.pagerConfig.pageSize = pageSize
      this.handlePageData()
    },

    // 加载年份下拉选项
    getYearOptions() {
      settingService.getTeacherYearList().then(response => {
        if (response.code === 200) {
          this.gridOptions.formConfig.items[0].itemRender.options = response.data;
        }
      });
    },

    getQuerySubjectOptions() {
      const semesterId = this.formOptions.data.semesterId;
      const year = this.formOptions.data.year;
      settingService.getTeacherSubjectListByOptionalCondition(
          {
            semesterId: semesterId,
            year: year
          }
      ).then(response => {
        if (response.code === 200) {
          this.gridOptions.formConfig.items[2].itemRender.options = response.data;
        }
      });
    },

    getAllClassOption() {
      settingService.getAllClassInfo(
      ).then(response => {
        if (response.code === 200) {
          this.formOptions.items[1].itemRender.options = response.data;
        }
      });
    },

    getAllSubjectOption() {
      settingService.getAllSubjectInfo(
      ).then(response => {
        if (response.code === 200) {
          this.formOptions.items[3].itemRender.options = response.data;
        }
      });
    },


    addEvent() {
      this.showEditPopup = true
    },

    // 创建考试信息
    async createTeacherClassRelation() {
      const $form = this.$refs.formRef
      if ($form) {
        const errMap = await $form.validate()
        if (!errMap) {
          // 获取输入框中的值
          const inputData = this.formOptions.data;
          let year = inputData.year;
          const classId = inputData.classId;
          const semesterId = inputData.semesterId;
          const subjectId = inputData.subjectId;

          if ((year == null || year === '')
              || (classId == null || classId === '')
              || (semesterId == null || semesterId === '')
              || (subjectId == null || subjectId === '')) {
            VxeUI.modal.message({content: '输入框不允许为空', status: 'warning'})
            return
          }
          if(year.length > 4) {
            year = year.substring(0, 4);
          }
          const data = {};
          data.year = year;
          data.classId = classId;
          data.semesterId = semesterId;
          data.subjectId = subjectId;
          teacherClassRelationService.createTeacherClassRelation(JSON.stringify(data)).then((response) => {
            if (response.code === 200) {
              VxeUI.modal.message({content: `创建成功`, status: 'success'});

              this.queryGradeInfo();

            } else {
              VxeUI.modal.message({content: response.message, status: 'warning'});
            }
          }).catch(() => {
          });
          this.showEditPopup = false
        }
      }
    },

    // 查询考试信息
    queryGradeInfo() {
      const searchData = this.gridOptions.formConfig.data;
      this.gridOptions.loading = true;
      settingService.getTeacherClassRelationListByCondition(JSON.stringify(searchData)).then((response) => {
        if (response.code === 200) {
          this.gridOptions.data = response.data;
        } else {
          VxeUI.modal.message({content: response.message, status: 'warning'});
        }
      });
      this.gridOptions.loading = false;
      this.handlePageData();
    },

    approveRow (row) {
      VxeUI.modal.message({
        content: `通过审批：${row.name}`,
        status: 'success'
      })
    },
    rejectionRow (row) {
      VxeUI.modal.message({
        content: `驳回审批：${row.name}`,
        status: 'error'
      })
    }
  },
}

</script>
