<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>录入考试成绩</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <p style="margin-left: 2%">
          <vxe-button status="success" icon="vxe-icon-add" @click="addEvent">新增</vxe-button>
<!--          <vxe-notice-bar content="温馨提示：录入新考试成绩时，请先新增并填写考试信息，然后点击查询并修改学生考试成绩"></vxe-notice-bar>-->
        </p>
        <vxe-tag status="primary" :content="examMessage" icon="vxe-icon-feedback"></vxe-tag>
        <vxe-grid
            ref="gridRef"
            :custom-config="customConfig"
            v-bind="gridOptions"
            @form-submit="queryGradeInfo"
        >
          <template #nameHeader="{ column }">
            <div v-for="(option, index) in column.filters" :key="index">
              <vxe-input v-model="option.data" clearable @change="confirmFilterEvent(option)"
                         style="width: 100%;"></vxe-input>
            </div>
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
            height="600"
            :loading="loading"
            :confirm-closable="false"
            @confirm="createExamInfo">
          <vxe-form ref="formRef" v-bind="formOptions">

          </vxe-form>
        </vxe-modal>

      </div>
    </div>

  </div>
</template>

<script>
import * as settingService from '@/api/settingInfoService';
import * as examInfoService from '@/api/examInfoService';
import * as gradeInfoService from '@/api/gradeInfoService';
import {VxeUI} from 'vxe-pc-ui';


export default {

  data() {


       const examMessage = '考试信息';

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
            name: 'VxeSelect',
            options: [],
            props: {defaultConfig: {selectMode: 'first'}},
            events: {change: this.inputYearChange},
          }
        },
        {
          field: 'classId',
          title: '班级',
          modelValue: 'classIdValue',
          vModel: 'classIdValue',
          itemRender: {
            name: 'VxeSelect',
            ref: 'selectRef',
            modelValue: 'classIdValue',
            vModel: 'classIdValue',
            options: [],
            props: {defaultConfig: {selectMode: 'last'}},
            events: {change: this.inputClassChange},
          },
        },
        {
          field: 'semesterId',
          title: '学期',
          itemRender: {
            name: 'VxeSelect',
            options: [],
            props: {defaultConfig: {selectMode: 'last'}},
            events: {change: this.inputSemesterChange},
          }
        },
        {
          field: 'subjectId',
          title: '学科',
          itemRender: {
            name: 'VxeSelect',
            options: [],
            props: {defaultConfig: {selectMode: 'last'}},
          }
        },
        {
          field: 'examCode',
          title: '考试名称',
          itemRender: {
            name: 'VxeInput',
            props: {placeholder: "如：第一单元测试"},
          },

        },
        {
          field: 'examDate',
          title: '考试时间',
          itemRender: {name: 'VxeDatePicker'},
        },
      ],
      rules: {
        classId: [{required: true, message: '请选择班级'}],
        semesterId: [{required: true, message: '请选择学期'}],
        subjectId: [{required: true, message: '请选择科目'}],
        examName: [{required: true, message: '请输入考试名称'}],
        examDate: [{required: true, message: '请选择考试时间'}],
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
      filterConfig: {
        iconVisibleMethod: () => {
          return false
        }
      },
      editConfig: {
        trigger: 'click',
        mode: 'row'
      },
      // toolbarConfig: {
      //   refresh: false,
      //   import: false,
      //   export: true,
      //   print: true,
      //   zoom: false,
      //   custom: true,
      // },
      exportConfig: {
        type: 'xlsx'
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
              // props: {defaultConfig: {selectMode: 'last'}},
              events: {change: this.queryClassChange},
            }
          },
          {
            field: 'semesterId',
            title: '学期',
            itemRender: {
              name: 'VxeSelect',
              vModel: 'createSemester',
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
              vModel: 'createSubject',
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
          year: [{required: true, message: '请选择年份'}],
          classId: [{required: true, message: '请选择班级'}],
          semesterId: [{required: true, message: '请选择学期'}],
          subjectId: [{required: true, message: '请选择科目'}],
          examCode: [{required: true, message: '请选择考试名称'}],
        }

      },
      columns: [
        {field: 'seq', type: 'seq', width: 70, align: 'center', cellType: 'string'},
        {field: 'studentId', title: '学号', visible: true, align: 'center', cellType: 'string'},
        {
          title: '姓名',
          align: 'center',
          children: [
            {
              field: 'studentName',
              filters: [
                {data: ''}
              ],
              filterMethod: ({option, row, column}) => {
                if (option.data) {
                  return `${row[column.field]}`.indexOf(option.data) > -1
                }
                return true
              },
              slots: {
                header: 'nameHeader'
              }
            }
          ]
        },

        {
          title: '分数',
          field: 'score',
          align: 'center',
          cellType: 'string',
          editRender: {name: 'VxeInput', props: {type: 'input'}, events: {blur: this.saveScore}},
        },
        {
          field: 'gradeLevel',
          title: '等级',
          align: 'center',
          cellType: 'string',
        },
        {
          field: 'examDate',
          title: '考试时间',
          align: 'center',
          cellType: 'string',
        },
      ],
      data: [],

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
      examMessage
    }
  },

  mounted() {
    const $table = this.$refs.gridRef
    const $toolbar = this.$refs.toolbarRef
    if ($table && $toolbar) {
      $table.connect($toolbar)
    }
  },

  created() {
    this.getYearOptions()

  },

  methods: {
