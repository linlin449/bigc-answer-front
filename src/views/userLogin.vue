<template>
  <div class="body">
    <div class="title">欢迎登录bigc物理答题系统!</div>
    <div class="login">
      <ul class="menu-tab">
        <li v-for="v in MenuData" :class="{ current: v.current }" :key="v.type" @click="clickMenu(v)">
          {{ v.txt }}
        </li>
      </ul>
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" class="demo-ruleForm" size="large">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="工号" type="text" autocomplete="off" maxlength="9" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" type="password" placeholder="密码" autocomplete="off" minlength="6"
            maxlength="15" />
        </el-form-item>

        <el-form-item prop="code">
          <el-input class="code" v-model="ruleForm.code" type="text" placeholder="验证码" autocomplete="off" maxlength="5"
            minlength="5" />
          <el-image class="login_code" :src="imgBase64" @click="refreshCode()" />
        </el-form-item>

        <el-form-item>
          <el-button :disabled="btnbool" type="primary" class="login-btn block" @click="submitForm(ruleFormRef)">
            登录</el-button>
          <el-button type="primary" class="login-btn block" @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCookies } from "vue3-cookies";
import { reactive, watch, onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import link from "../api/link.js";
import url from "../api/url.js";
import code from "../api/code.js";
import * as check from "../util/verfifcation.js";
import { ElMessage } from "element-plus";
import { FormInstance } from "element-plus";
import { useStore } from "vuex";
const store = useStore();
const { cookies } = useCookies();
let router = useRouter(); //登陆成功后跳转到首页
/*登录注册按钮数据及逻辑*/
const MenuData = reactive([
  { txt: "老师", current: true, type: "teacher" },
  { txt: "管理员", current: false, type: "admin" },
]);
let model = ref("teacher"); //model 提供给后面逻辑处理
let clickMenu = (item) => {
  MenuData.forEach((element) => {
    element.current = false;
  });
  item.current = true;
  model.value = item.type;
};
/**/

/* element表单部分*/
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  //表单部分
  username: "",
  password: "",
  code: "",
});

/*校验规则*/

const checkUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error("学号不能为空"));
  } else if (!check.checkUsername(value)) {
    callback(new Error("学号规则错误，9位数字，不能以0开头"));
  } else {
    callback();
  }
};

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error("密码不能为空"));
  } else if (!check.checkPassword(value)) {
    callback("密码格式不正确，正确为6~16位，包含大小写字母和数字的组合");
  } else {
    callback();
  }
};
const checkCode = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("验证码不能为空"));
  } else {
    callback();
  }
};

const rules = reactive({
  password: [{ validator: validatePassword, trigger: "blur" }],

  username: [{ validator: checkUsername, trigger: "blur" }],

  code: [{ validator: checkCode, trigger: "blur" }],
});
/**/
/*检测校验是否通过，通过按钮变为可登录*/
let btnbool = ref(true);
watch(ruleForm, (newval, oldval) => {
  if (model.value === "teacher") {
    if (newval.username != "" && newval.password != "" && newval.code != "") {
      btnbool.value = false;
    } else {
      btnbool.value = true;
    }
  } else {
    if (newval.username != "" && newval.password != "" && newval.code != "") {
      btnbool.value = false;
    } else {
      btnbool.value = true;
    }
  }
});
/**/
/*提交*/
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    //TODO 登录页面的修改
    if (model.value === "teacher") {
      let response = await link(url.login.teacher, "post", {
        username: ruleForm.username,
        password: ruleForm.password,
        vercode: ruleForm.code,
        verkey: identifyCode.value,
      });
      store.commit("setUsername", ruleForm.username);
      if (response.data.code === code.NORMAL_SUCCESS) {
        ElMessage({
          message: response.data.msg,
          type: "success",
        });
        store.commit("setRole", 2);
        store.commit("setToken", response.data.data.token);
        cookies.set(
          "token",
          response.data.data.token,
          new Date(response.data.data.expire)
        );
        router.push({ name: "user" }); //增加cookies
      } else {
        //登陆失败
        ElMessage.error(response.data.msg);
        //刷新验证码
        refreshCode();
      }
    } else {
      let response = await link(url.login.admin, "post", {
        username: ruleForm.username,
        password: ruleForm.password,
        vercode: ruleForm.code,
        verkey: identifyCode.value,
      });
      store.commit("setUsername", ruleForm.username);
      if (response.data.code === code.NORMAL_SUCCESS) {
        ElMessage({
          message: response.data.msg,
          type: "success",
        });
        store.commit("setToken", response.data.data.token);
        cookies.set(
          "token",
          response.data.data.token,
          new Date(response.data.data.expire)
        );
        router.push({ name: "user" }); //增加cookies
      } else {
        //登陆失败
        ElMessage.error(response.data.msg);
        //刷新验证码
        refreshCode();
      }
    }
  });
};
/*重置*/
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
/**/

// 图形验证码
let identifyCode = ref("");
let imgBase64 = ref("");
const refreshCode = async () => {
  let response = await link(url.getcaptcha);
  imgBase64.value = response.data.data.image;
  identifyCode.value = response.data.data.key;
};
onMounted(() => {
  refreshCode();
});
</script>

<style lang="scss" scoped>
.body {
  padding-top: 190px;
  height: 100%;
  position: absolute;
  width: 100%;
  text-align: center;
  overflow-y: auto;
  background-image: url("../assets/background.jpg");
  background-size: cover;

  .title {
    font-size: 40px;
    color: rgb(13, 237, 69);
    margin-bottom: 30px;
  }

  .login {
    background-color: rgba(169, 163, 163, 0.5);
    box-shadow: 0 6px 12px 0 rgba(138, 153, 150, 0.15);
    border-radius: 10px;
    width: 450px;
    margin: auto;

    .menu-tab {
      padding: 0;
      padding-top: 10px;
      padding-bottom: 10px;

      li {
        cursor: pointer;
        display: inline-block; //行内块
        margin: auto;
        width: 25%;
        line-height: 50px;
        font-size: 20px;
        color: rgb(253, 253, 253);
        border-radius: 8px;
      }

      .current {
        background-color: rgba(14, 180, 231, 0.5);
      }
    }

    .demo-ruleForm {
      display: inline-block;
      width: 65%;
      margin: auto;

      .block {
        display: block;
        width: 40%;
        margin: auto;
      }

      .code {
        width: 50%;
        margin-top: 10px;
      }

      .login_code {
        margin-top: 10px;
        margin-left: 10px;
      }
    }
  }
}
</style>
