<template>
  <div>
    <el-card class="box-card">
      <el-table :data="MenuData.data" v-loading="loading">
        <el-table-column type="index" label="编号" width="180" />
        <el-table-column prop="subjectname" label="课程" width="180" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="subjectEdit(scope.$index, scope.row)">
              修改名称
            </el-button>
            <el-button size="small" @click="subjectChapterEdit(scope.$index, scope.row)">
              查看章节
            </el-button>
            <el-button size="small" type="danger" @click="subjectDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; margin-top: 10px;">
        <el-input placeholder="课程名称" v-model="SubjectName" style="width: 200px; margin-right: 10px;" />
        <el-button type="primary" @click="addSubject">添加课程</el-button>
      </div>
    </el-card>
    <el-dialog v-model="editSubjectVisible" width="20%" title="修改">
      <div style="display: flex; margin-top: 10px;">
        <el-input placeholder="课程名称" v-model="UpdateSubjectName" style="width: 200px; margin-right: 10px;" />
        <el-button type="primary" @click="updateSubject">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="editChapterVisible" width="20%" title="修改">
      <div style="display: flex; margin-top: 10px;">
        <el-input placeholder="章节名称" v-model="UpdateChapterName" style="width: 200px; margin-right: 10px;" />
        <el-button type="primary" @click="updateChapter">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="editAllChpterVisible" width="35%" title="查看章节">
      <el-table :data="chapters.data" v-loading="loading">
        <el-table-column type="index" label="编号" width="180" />
        <el-table-column prop="name" label="章节" width="180" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="chapterEdit(scope.$index, scope.row)">
              修改名称
            </el-button>
            <el-button size="small" type="danger" @click="chapterDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; margin-top: 10px;">
        <el-input placeholder="课程名称" style="width: 200px; margin-right: 10px;" v-model="ChapterName" />
        <el-button type="primary" @click="addChapter">添加章节</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import code from '@/api/code';
import link from '@/api/link';
import url from '@/api/url';
let editVisible = ref(false)
const ErrorCode = code

const MenuData = ref({ data: [] });

let chapters = reactive({ data: [] });

let getChapter = async () => {
  let response = await link(url.allChapter);
  if (response.data.code != ErrorCode.NORMAL_SUCCESS) {
    return ElMessage.error(response.data.msg);
  }
  MenuData.value.data = response.data.data;
};
//增加课程和章节
let SubjectName = ref("")
let addSubject = async () => {
  let subject = {}
  subject.name = SubjectName.value
  subject.majorId = 1//默认是1仅仅只是物理
  let response = await link(url.subject.add, "post", subject)
  if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(response.data.msg);
    return;
  } else {
    ElMessage.success("添加成功！");
    await getChapter()
    SubjectName.value = ""
  }

}
let currentSubjectId = "";
let ChapterName = ref("")
let addChapter = async () => {
  let chapter = {}
  chapter.name = ChapterName.value
  chapter.subjectId = currentSubjectId
  let response = await link(url.chapter.add, "post", chapter)
  if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(response.data.msg);
    return;
  } else {
    ElMessage.success("添加成功！");
    ChapterName.value = ""
    await getChapter()
    updateTableChapter()
  }
}
//更新
let updateTableChapter = () => {
  let subjectId = currentSubjectId
  console.log(currentSubjectId)
  chapters.subjectId = subjectId
  chapters.data = [];
  MenuData.value.data.forEach((e) => {
    if (e.subjectId == subjectId) {
      console.log(e)
      e.chapters.forEach((item) => {
        let chapter = {};
        chapter.id = item.id;
        chapter.name = item.name;
        chapters.data.push(chapter);
      });
    }
  });
}
// 删除章节和课程
let subjectDelete = async (index, row) => {
  ElMessageBox.confirm
    (
      '确定要删除该课程?', '警告',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', }
    ).then( async () => {
      //确认
      let response = await link(url.subject.delete(row.subjectId), "post")
      if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
        ElMessage.error(response.data.msg);
        return;
      } else {
        ElMessage.success("删除成功！");
        await getChapter()
      }
    })
    .catch(() => {
      //取消
    })
}
let chapterDelete = async (index, row) => {
  ElMessageBox.confirm
    (
      '确定要删除该章节?', '警告',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', }
    ).then( async () => {
      //确认
      let response = await link(url.chapter.delete(row.id), "get")
      if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
        ElMessage.error(response.data.msg);
        return;
      } else {
        ElMessage.success("删除成功！");
        await getChapter()
        updateTableChapter()
      }
    })
    .catch(() => {
      //取消
    })
}

// 查看所有章节内容
let editAllChpterVisible = ref(false)
let subjectChapterEdit = (index, row) => {
  editAllChpterVisible.value = true
  currentSubjectId = row.subjectId
  let subjectId = row.subjectId
  chapters.subjectId = subjectId
  chapters.data = [];
  MenuData.value.data.forEach((e) => {
    if (e.subjectId == subjectId) {
      e.chapters.forEach((item) => {
        let chapter = {};
        chapter.id = item.id;
        chapter.name = item.name;
        chapters.data.push(chapter);
      });
    }
  });
};

// 修改课程名称
let editSubjectVisible = ref(false)
let UpdateSubjectName = ref("")
let subjectEdit = (index, row) => {
  editSubjectVisible.value = true
  console.log(row.subjectname)
  UpdateSubjectName.value = row.subjectname
  currentSubjectId = row.subjectId
}
let updateSubject = async () => {
  let subject = {}
  subject.majorId=1
  subject.id = currentSubjectId
  subject.name = UpdateSubjectName.value
  let response = await link(url.subject.update, "post", subject)
  if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(response.data.msg);
    return;
  } else {
    ElMessage.success("修改成功！");
    ChapterName.value = ""
    editSubjectVisible.value = false
    await getChapter()
  }
}

// 修改章节名称
let editChapterVisible = ref(false)
let UpdateChapterName = ref("")
let chapterId = "";
let chapterEdit = (index, row) => {
  editChapterVisible.value = true
  UpdateChapterName.value = row.name
  chapterId = row.id
}
let updateChapter = async () => {
  let chapter = {}
  chapter.id = chapterId
  chapter.name = UpdateChapterName.value
  chapter.subjectId = currentSubjectId
  let response = await link(url.chapter.update, "post", chapter)
  if (response.data.code !== ErrorCode.NORMAL_SUCCESS) {
    ElMessage.error(response.data.msg);
    return;
  } else {
    ElMessage.success("修改成功！");
    ChapterName.value = ""
    editChapterVisible.value = false
    await getChapter()
    updateTableChapter()
  }
}
onMounted(() => {
  getChapter()
})
</script>

<style scoped>
.box-card {
  width: 890px;
  margin: auto;
}

.input-username {
  margin-right: 20px;
  margin-bottom: 20px;
  width: 300px;
}
</style>