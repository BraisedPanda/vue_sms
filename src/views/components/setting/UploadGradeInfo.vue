<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card mb-4">
          <div class="card-header pb-0">
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">

              <vxe-tip status="primary">
                <div class="vxe-tip--body">
                  <div class="vxe-tip--title">考试成绩导入</div>
                  <div class="vxe-tip--content">使用Excel文件导入学生的考试成绩，请按照Excel模版的格式填写学生姓名和考试成绩 <a href="#" style="color: #0d6efd; text-decoration: underline" @click="downloadTemplate">点此下载模板</a></div>
                </div>
              </vxe-tip>

                <vxe-form
                    title-width="120"
                    :rules="formRules"
                    :data="formData"
                    @submit="submitEvent"
                    @form-reset="resetEvent">

                  <vxe-form-item title="年份" field="year" span="13" :item-render="{}">
                    <template #default="">
                      <vxe-select v-model="formData.year" :options="yearOptions" ></vxe-select>
                    </template>
                  </vxe-form-item>



                  <vxe-form-item title="班级" field="classId" span="13" :item-render="{}">
                    <template #default="">
                      <vxe-select v-model="formData.classId" :options="classOptions" filterable ></vxe-select>
                    </template>
                  </vxe-form-item>


                  <vxe-form-item title="学期" field="semesterId" span="13" :item-render="{}">
                    <template #default="">
                      <vxe-select v-model="formData.semesterId" :options="semesterOptions" ></vxe-select>
                    </template>
                  </vxe-form-item>
                  <vxe-form-item title="学科" field="subjectId" span="13" :item-render="{}">
                    <template #default="">
                      <vxe-select v-model="formData.subjectId" :options="subjectOptions"></vxe-select>
                    </template>
                  </vxe-form-item>

                  <vxe-form-item title="上传附件" field="fileList1"   show-progress="true" span="24" :item-render="fileList1Render"></vxe-form-item>


                  <vxe-form-item align="center" span="13" :item-render="actionItemRender"></vxe-form-item>
                </vxe-form>


            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as settingService from '@/api/settingInfoService';

import {VxeUI} from 'vxe-pc-ui';
import axios from "axios";

export default {

  data () {
    const formData = {
      name: 'test1',
      nickname: 'Testing',
      sex: '',
    }
    const fileData = new FormData;
    const formRules = {
      year: [
        { required: true, message: '必须填写' }
      ],
      classId: [
        { required: true, message: '必须填写' }
      ],
      semesterId: [
        { required: true, message: '必须填写' }
      ],
      subjectId: [
        { required: true, message: '必须填写' }
      ],
      fileList1: [
        { required: true, message: '必须填写' }
      ],
    }

    const fileList1Render = {
      name: 'VxeUpload',
      props: {
        showList: true,
        showProgress: true,
        uploadMethod ({ file }) {
          fileData.append('file', file)
        }
      }
    }



    const actionItemRender = {
      name: 'VxeButtonGroup',
      options: [
        { content: '重置', type: 'reset' },
        { content: '提交', type: 'submit', status: 'primary' }
      ]
    }

    const yearOptions = []
    const classOptions = []
    const semesterOptions = [{label: '上学期', value: 'S1'}, {label: '下学期', value: 'S2'}]
    const subjectOptions = []

    return {
      formData,
      fileData,
      formRules,
      yearOptions,
      classOptions,
      semesterOptions,
      subjectOptions,
      fileList1Render,
      actionItemRender
    }
  },

  mounted() {

  },

  created() {
    this.getYearOptions()
    this.getAllClassOption()
    this.getAllSubjectOption()
  },

  methods: {

    // 加载年份下拉选项
    getYearOptions() {
      settingService.getTeacherYearList().then(response => {
        if (response.code === 200) {
          this.yearOptions = response.data;
        }
      });
    },

    getAllClassOption() {
      settingService.getAllClassInfo(
      ).then(response => {
        if (response.code === 200) {
          this.classOptions = response.data;
        }
      });
    },

    getAllSubjectOption() {
      settingService.getAllSubjectInfo(
      ).then(response => {
        if (response.code === 200) {
          this.subjectOptions = response.data;
        }
      });
    },

    submitEvent () {
      this.fileData.append("year", this.formData.year);
      this.fileData.append("classId", this.formData.classId);
      this.fileData.append("semesterId", this.formData.semesterId);
      this.fileData.append("subjectId", this.formData.subjectId);

      let token = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");

      axios.post("api/gradeInfo/uploadGradeTemplate", this.fileData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", // 设置请求头
          "Authorization": "Bearer " + token,
        },
      }).then(response => {
        if (response.data.code === 200) {
          VxeUI.modal.message({content: `导入成功`, status: 'success'});
          this.resetEvent();
        }
      });
    },

    resetEvent() {
      this.formData.year = null;
      this.formData.classId = null;
      this.formData.semesterId = null;
      this.formData.subjectId = null;
      this.fileData.file = null;
    },

    
    downloadTemplate() {
      // 使用相对路径
      const fileUrl = '/模板文件.xlsx';
      // 创建一个隐藏的a标签
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = '导入模板.xlsx';  // 设置下载文件名

      // 将a标签添加到DOM并触发点击事件
      document.body.appendChild(link);
      link.click();
      // 移除a标签
      document.body.removeChild(link);
    },






  },
}

</script>
