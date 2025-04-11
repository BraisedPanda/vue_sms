<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>录入考试成绩</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <p style="margin-left: 2%">
          <vxe-button status="success" icon="vxe-icon-add" @click="addEvent">新增</vxe-button>
          <vxe-notice-bar content="温馨提示：录入新考试成绩时，请先新增并填写考试信息，然后点击查询并修改学生考试成绩"></vxe-notice-bar>
        </p>
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
          <vxe-form ref="formRef"  v-bind="formOptions">

          </vxe-form>
        </vxe-modal>

      </div>
    </div>

  </div>
</template>
