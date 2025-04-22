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
            props: {defaultConfig: {selectMode: 'last'}, clearable: true, modelValue: 'classIdValue',
              vModel: 'classIdValue',},
          },
        },
        {
          field: 'semesterId',
          title: '学期',
          itemRender: {
            name: 'VxeSelect',
            options: [],
            props: {defaultConfig: {selectMode: 'last'}},
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
      filterConfig: {
        iconVisibleMethod: () => {
          return false
        }
      },
      editConfig: {
        trigger: 'click',
        mode: 'row'
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
              // events: {change: this.createYearChange},
            }
          },
          {
            field: 'class',
            title: '班级',
            itemRender: {
              name: 'VxeSelect',
              vModel: 'createClass',
              options: [],
              // props: {defaultConfig: {selectMode: 'last'}},
              events: {change: this.filterChange},
            }
          },
          {
            field: 'semester',
            title: '学期',
            itemRender: {
              name: 'VxeSelect',
              vModel: 'createSemester',
              options: [],
              props: {defaultConfig: {selectMode: 'last'}},
              events: {change: this.filterChange},
            }
          },
          {
            field: 'subject',
            title: '学科',
            itemRender: {
              name: 'VxeSelect',
              vModel: 'createSubject',
              options: [],
              props: {defaultConfig: {selectMode: 'last'}},
              events: {change: this.filterChange},
            }
          },
          {
            field: 'examName',
            title: '考试名称',
            itemRender: {
              name: 'VxeSelect',
              options: [],
              props: {defaultConfig: {selectMode: 'last'}},
              events: {change: this.filterChange},
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
          classId: [{required: true, message: '请选择班级'}],
          semesterId: [{required: true, message: '请选择学期'}],
          subjectId: [{required: true, message: '请选择科目'}],
          examName: [{required: true, message: '请输入考试名称'}],
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
    }
  },

  mounted() {
    const $table = this.$refs.gridRef
    const $toolbar = this.$refs.toolbarRef
    if ($table && $toolbar) {
      $table.connect($toolbar)
    }
    this.getSettingOptions()

  },

  created() {
    // this.getGradeList();
  },

  methods: {

    async inputYearChange( row, yearRow ) {
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
              // 加载学期下拉选项
              settingService.getTeacherSemesterListByCondition({year: year, classId: classId}).then(response => {
                if (response.code === 200) {
                  this.formOptions.items[2].itemRender.options = response.data;
                  if (response.data[0] != null) {
                    const semesterId = response.data[0].value;
                    this.formOptions.data = {year: year, classId: classId, semesterId: semesterId}
                    // 加载学科下拉选项
                    settingService.getTeacherSubjectListByCondition({year: year, classId: classId, semesterId: semesterId}).then(response => {
                      if (response.code === 200) {
                        this.formOptions.items[3].itemRender.options = response.data;
                        if (response.data[0] != null) {
                          const subjectId = response.data[0].value;
                          this.formOptions.data = {year: year, classId: classId, semesterId: semesterId, subjectId: subjectId}
                        }
                      }
                    });
                  }
                }
              });
            }
            }
        });
      }
    },

    // 获取setting下拉框选项
    getSettingOptions() {
      // 加载年份下拉选项

      settingService.getTeacherYearList().then(response => {
        if (response.code === 200) {
          this.formOptions.items[0].itemRender.options = response.data;
          this.gridOptions.formConfig.items[0].itemRender.options = response.data;

          if (response.data[0] != null) {
            const year = response.data[0].value;
            this.formOptions.data = {year: year}
            // 加载班级下拉选项
            settingService.getTeacherClassListByCondition({year: year}).then(response => {
              if (response.code === 200) {
                this.formOptions.items[1].itemRender.options = response.data;
                this.gridOptions.formConfig.items[1].itemRender.options = response.data;

                if (response.data[0] != null) {
                  const classId = response.data[0].value;
                  this.formOptions.data = {year: year, classId: classId}
                  // 加载学期下拉选项
                  settingService.getTeacherSemesterListByCondition({year: year, classId: classId}).then(response => {
                    if (response.code === 200) {
                      this.formOptions.items[2].itemRender.options = response.data;
                      this.gridOptions.formConfig.items[2].itemRender.options = response.data;
                      if (response.data[0] != null) {
                        const semesterId = response.data[0].value;
                        this.formOptions.data = {year: year, classId: classId, semesterId: semesterId}
                        // 加载学科下拉选项
                        settingService.getTeacherSubjectListByCondition({year: year, classId: classId, semesterId: semesterId}).then(response => {
                          if (response.code === 200) {
                            this.formOptions.items[3].itemRender.options = response.data;
                            this.gridOptions.formConfig.items[3].itemRender.options = response.data;
                            if (response.data[0] != null) {
                              const subjectId = response.data[0].value;
                              this.formOptions.data = {year: year, classId: classId, semesterId: semesterId, subjectId: subjectId}
                              // 加载考试名称下拉选项
                              settingService.getTeacherExamListByCondition({year: year, classId: classId, semesterId: semesterId, subjectId: subjectId}).then(response => {
                                if (response.code === 200) {
                                  this.gridOptions.formConfig.items[4].itemRender.options = response.data;
                                }
                              });
                            }
                          }
                        });
                      }
                    }
                  });
                }

              }
            });

          }

        }
      });
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
          const searchData = this.formOptions.data;
          const classId = searchData.class;
          const semesterId = searchData.semester;
          const subjectId = searchData.subject;
          const examName = searchData.examName;
          const examDate = searchData.examDate;
          if ((classId == null || classId === '')
              || (semesterId == null || semesterId === '')
              || (subjectId == null || subjectId === '')
              || (examName == null || examName === '')
              || (examDate == null || examDate === '')) {
            VxeUI.modal.message({content: '输入框不允许为空', status: 'warning'})
            return
          }
          let data = {};
          data.classId = classId;
          data.semesterId = semesterId;
          data.subjectId = subjectId;
          data.examName = examName;
          data.examDate = examDate;
          examInfoService.createExamInfo(JSON.stringify(data)).then((response) => {
            if (response.code === 200) {
              VxeUI.modal.message({content: `创建成功`, status: 'success'});
              setTimeout(() => {
                this.gridOptions.loading = true;
                window.location.reload();
                this.gridOptions.loading = false;
              }, 500)

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
      // this.gridOptions.loading = true;
      const searchData = this.gridOptions.formConfig.data;
      const classId = searchData.class;
      const semesterId = searchData.semester;
      const subjectId = searchData.subject;
      const examCode = searchData.examName;

      let data = {};
      data.classId = classId;
      data.semesterId = semesterId;
      data.subjectId = subjectId;
      data.examCode = examCode;
      gradeInfoService.getGradeList(JSON.stringify(data)).then((response) => {
        if (response.code === 200) {
          // VxeUI.modal.message({content: `查询成功!`, status: 'success'});
          this.gridOptions.data = response.data;
          // this.gridOptions.loading = false;
        } else {
          VxeUI.modal.message({content: response.message, status: 'warning'});
        }
      }).catch(() => {
      });
    },


    // 条件发生变化，重新加载数据
    filterChange() {
      this.getSettingOptions();
    },


    saveScore(cellParams) {
      const {row} = cellParams
      const obid = row.obid;
      const score = row.score;
      gradeInfoService.update({'obid': obid, 'score': score}).then(response => {
        if (response.code === 200) {
          this.queryGradeInfo();
        }
      });

    },




  },


}

</script>
