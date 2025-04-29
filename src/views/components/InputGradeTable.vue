<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card mb-4">
          <div class="card-header pb-0">
<!--            <h6>录入考试成绩</h6>-->
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <p style="margin-left: 2%">
                <vxe-button status="success" icon="vxe-icon-add" @click="addEvent">新增</vxe-button>
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

    // 获取年份下拉框选项
    getYearOptions() {
      // 加载年份下拉选项
      settingService.getTeacherYearList().then(response => {
        if (response.code === 200) {
          this.formOptions.items[0].itemRender.options = response.data;
          this.gridOptions.formConfig.items[0].itemRender.options = response.data;

          if (response.data[0] != null) {
            const year = response.data[0].value;
            this.formOptions.data = {year: year}
            const yearRow = {};
            yearRow.value = year;
            this.inputYearChange(null, yearRow);
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

    // 新增时，年份变化下拉框联动
    inputYearChange(row, yearRow) {
      const year = yearRow.value;
      if (year != null && year !== '') {
        // 加载班级下拉选项
        settingService.getTeacherClassListByCondition({year: year}).then(response => {
          if (response.code === 200) {
            this.formOptions.data = {year: year, classId: ''}
            this.formOptions.items[1].itemRender.options = response.data;
            if (response.data[0] != null) {
              const classId = response.data[0].value;
              this.formOptions.data = {year: year, classId: classId}
              const classRow = {};
              classRow.value = classId;
              this.inputClassChange(null, classRow);
            }
          }
        });
      }
    },
    // 新增时，班级变化下拉框联动
    inputClassChange(row, classRow) {
      const classId = classRow.value;
      const year = this.formOptions.data.year;
      if (classId != null && classId !== '') {
        // 加载学期下拉选项
        settingService.getTeacherSemesterListByCondition({year: year, classId: classId}).then(response => {
          if (response.code === 200) {
            this.formOptions.items[2].itemRender.options = response.data;
            if (response.data[0] != null) {
              const semesterId = response.data[0].value;
              this.formOptions.data = {year: year, classId: classId, semesterId: semesterId}
              const semesterRow = {};
              semesterRow.value = semesterId;

              // 加载学科下拉选项
              this.inputSemesterChange(null, semesterRow);
            }
          }
        });
      }
    },
    // 新增时，学期变化下拉框联动
    inputSemesterChange(row, semesterRow) {
      const semesterId = semesterRow.value;
      const year = this.formOptions.data.year;
      const classId = this.formOptions.data.classId;
      if (classId != null && classId !== '') {
        settingService.getTeacherSubjectListByCondition({
          year: year,
          classId: classId,
          semesterId: semesterId
        }).then(response => {
          if (response.code === 200) {
            this.formOptions.items[3].itemRender.options = response.data;
            if (response.data[0] != null) {
              const subjectId = response.data[0].value;
              this.formOptions.data = {year: year, classId: classId, semesterId: semesterId, subjectId: subjectId}
            }
          }
        });
      }
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

    // 表头搜索
    confirmFilterEvent(option) {
      const $grid = this.$refs.gridRef
      if ($grid) {
        // 设置为选中状态
        $grid.updateFilterOptionStatus(option, !!option.data)
        // 修改条件之后，需要手动调用 updateData 处理表格数据
        $grid.updateData()
      }
    },


    addEvent() {
      this.showEditPopup = true
    },

    // 创建考试信息
    async createExamInfo() {
      const $form = this.$refs.formRef
      if ($form) {
        const errMap = await $form.validate()
        if (!errMap) {
          // 获取输入框中的值
          const inputData = this.formOptions.data;
          const year = inputData.year;
          const classId = inputData.classId;
          const semesterId = inputData.semesterId;
          const subjectId = inputData.subjectId;
          const examName = inputData.examCode;
          const examDate = inputData.examDate;
          if ((year == null || year === '')
              || (classId == null || classId === '')
              || (semesterId == null || semesterId === '')
              || (subjectId == null || subjectId === '')
              || (examName == null || examName === '')
              || (examDate == null || examDate === '')) {
            VxeUI.modal.message({content: '输入框不允许为空', status: 'warning'})
            return
          }
          const data = {};
          data.year = year;
          data.classId = classId;
          data.semesterId = semesterId;
          data.subjectId = subjectId;
          data.examName = examName;
          data.examDate = examDate;
          examInfoService.createExamInfo(JSON.stringify(data)).then((response) => {
            if (response.code === 200) {
              VxeUI.modal.message({content: `创建成功`, status: 'success'});
              setTimeout(() => {
                const examInfo = response.data;
                settingService.getTeacherExamListByCondition({
                  year: year,
                  classId: classId,
                  semesterId: semesterId,
                  subjectId: subjectId
                }).then(response => {
                  if (response.code === 200) {
                    this.gridOptions.formConfig.items[4].itemRender.options = response.data;
                    this.gridOptions.formConfig.data = {
                      year: examInfo.year,
                      classId: examInfo.classId,
                      semesterId: examInfo.semesterId,
                      subjectId: examInfo.subjectId,
                      examCode: examInfo.examCode
                    };
                  }
                });
                this.queryGradeInfo();
              }, 800)

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
      gradeInfoService.getGradeList(JSON.stringify(searchData)).then((response) => {
        if (response.code === 200) {
          this.gridOptions.data = response.data;
          this.setExamMessage();
        } else {
          VxeUI.modal.message({content: response.message, status: 'warning'});
        }
      });
      this.gridOptions.loading = false;
    },

    saveScore(cellParams) {
      const {row} = cellParams
      const obid = row.obid;
      let score = row.score;
      if (score !== '' && (Number(score) < 0 || Number(score) > 100)) {
        return;
      }
      this.gridOptions.loading = true;
      gradeInfoService.update({'obid': obid, 'score': score}).then(response => {
        if (response.code === 200) {
          this.queryGradeInfo();
        }
      });
      this.gridOptions.loading = false;
    },
  },
}

</script>
