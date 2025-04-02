<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>Projects table</h6>
    </div>
    <div>
      <vxe-toolbar ref="toolbarRef" custom></vxe-toolbar>
      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">

          <vxe-grid
              class="mylist-grid"
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
  </div>
</template>

<script>
import * as gradeService from '@/api/grade';

export default {

  data() {

    const customConfig = {
      allowVisible: true,
      allowFixed: false,
      allowResizable: false,
      allowSort: false
    }


    // 表头过滤器
    const nameFilterRender = {
      name: 'VxeSelect',
      options: [
        { label: 'Women', value: 'Women' },
        { label: 'Man', value: 'Man' }
      ]
    }
    const levelFilterRender = {
      name: 'VxeSelect',
      options: [
        { label: 'A+', value: 'A+' },
        { label: 'A', value: 'A' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B', value: 'B' },
        { label: 'B-', value: 'B-' },
        { label: 'C+', value: 'C+' },
        { label: 'C', value: 'C' },
        { label: 'C-', value: 'C-' },
        { label: 'D', value: 'D' },

      ]
    }

    // 表格配置
    const gridOptions = {
      showOverflow: true,
      border: true,
      loading: false,
      height: 650,
      columnConfig: {
        useKey: true
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
          {field: 'studentName', title: '姓名', itemRender: {name: 'VxeInput'}},
          {field: 'score', title: '分数', itemRender: {name: 'VxeInput'}},
          {field: 'gradeLevel', title: '等级', itemRender: {name: 'VxeInput'}},
          {
            itemRender: {
              name: 'VxeButtonGroup',
              options: [
                {type: 'submit', content: '搜索', status: 'primary'},
                {type: 'reset', content: '重置'}
              ]
            }
          }
        ]
      },
      columns: [
        {field: 'seq', type: 'seq', width: 70, align: 'center'},
        {field: 'studentId', title: '学号',  filters: [{ data: '' }], filterRender: nameFilterRender, visible: true, align: 'center'},
        {field: 'studentName', title: '姓名',  filters: [{ data: '' }], align: 'center'},
        {field: 'score', title: '分数', align: 'center'},
        {field: 'gradeLevel', title: '等级', filters: [{ data: '' }], filterRender: levelFilterRender, align: 'center'},
      ],
      data: [],
    }

    const allList= [];

    return {
      gridOptions,
      customConfig,
      allList,
    }
  },

  mounted () {
    const $table = this.$refs.tableRef
    const $toolbar = this.$refs.toolbarRef
    if ($table && $toolbar) {
      $table.connect($toolbar)
    }
  },

  created() {
    this.getGradeList();
    this.handlePageData();
  },

  methods: {



    // 模拟前端分页
    handlePageData () {
      this.gridOptions.loading = true
      setTimeout(() => {
        const { pageSize, currentPage } = this.gridOptions.pagerConfig
        console.log('总数据：' + this.allList.length);
        this.gridOptions.pagerConfig.total = this.allList.length
        this.gridOptions.data = this.allList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        this.gridOptions.loading = false
      }, 100)
    },

    pageChangeEvent ({ pageSize, currentPage }) {
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
        // this.gridOptions.data = response.data;
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
      console.log('form reset')
    },



  },


}

</script>
