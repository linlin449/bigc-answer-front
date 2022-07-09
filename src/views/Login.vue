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
          <el-input v-model="ruleForm.username" placeholder="学号" type="text" autocomplete="off" maxlength="9" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" type="password" placeholder="密码" autocomplete="off" minlength="6"
            maxlength="15" />
        </el-form-item>

        <el-form-item prop="code" v-show="model === 'login'">
          <el-input class="code" v-model="ruleForm.code" type="text" placeholder="验证码" autocomplete="off" maxlength="5"
            minlength="5" />
          <el-image class="login_code" :src="imgBase64" @click="refreshCode()" />
        </el-form-item>

        <el-form-item prop="repassword" v-show="model === 'register'">
          <el-input v-model="ruleForm.repassword" type="password" placeholder="重复密码" minlength="6" maxlength="15" />
        </el-form-item>
        <el-form-item prop="name" v-show="model === 'register'">
          <el-input v-model="ruleForm.name" type="text" placeholder="姓名" maxlength="5" />
        </el-form-item>
        <el-form-item prop="email" v-show="model === 'register'">
          <el-input v-model="ruleForm.email" type="text" placeholder="邮箱找回密码使用" />
        </el-form-item>

        <el-form-item>
          <el-button :disabled="btnbool" type="primary" class="login-btn block" @click="submitForm(ruleFormRef)">{{
              model === "login" ? "登录" : "注册"
          }}</el-button>
          <el-button type="primary" class="login-btn block" @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCookies } from 'vue3-cookies'
import { reactive, watch, onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import link from "../api/link.js";
import url from "../api/url.js";
import code from "../api/code.js";
import * as check from "../util/verfifcation.js";
import { ElMessage } from "element-plus";
import { FormInstance } from "element-plus";
import { useStore } from 'vuex';
const store = useStore();
const { cookies } = useCookies()
let router = useRouter(); //登陆成功后跳转到首页
/*登录注册按钮数据及逻辑*/
const MenuData = reactive([
  { txt: "登录", current: true, type: "login" },
  { txt: "注册", current: false, type: "register" },
]);
let model = ref("login"); //model 提供给后面逻辑处理
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
  name: "",
  username: "",
  password: "",
  code: "",
  repassword: "",
  email: "",
});

/*校验规则*/
const checkname = (rule, value, callback) => {
  if (!value) {
    callback(new Error("姓名不能为空"));
  } else if (!check.checkUsername(value)) {
    callback(new Error("请输入大于一位的中文名"));
  } else {
    callback();
  }
};
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
  }
  else {
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  //登陆时不用校验重复密码
  if (model.value === "login") {
    callback();
  }
  if (value === "") {
    callback(new Error("重复密码不能为空"));
  } else if (value !== ruleForm.password) {
    callback(new Error("两次密码必须相同"));
  } else {
    callback();
  }
};
const checkEmail = (rule, value, callback) => {
  //登陆时不用校验重复密码
  if (model.value === "login") {
    callback();
  }
  if (value === "") {
    callback(new Error("邮箱不能为空"));
  } else if (check.checkEmail(value)) {
    callback(new Error("邮箱格式不正确"));
  } else {
    callback();
  }
};
const rules = reactive({

  password: [{ validator: validatePassword, trigger: "blur" }],
  repassword: [{ validator: validatePass2, trigger: "blur" }],
  username: [{ validator: checkUsername, trigger: "blur" }],
  name: [{ validator: checkname, trigger: "blur" }],
  code: [{ validator: checkCode, trigger: "blur" }],
  email: [{ validator: checkEmail, trigger: "blur" }],
});
/**/
/*检测校验是否通过，通过按钮变为可登录*/
let btnbool = ref(true);
watch(ruleForm, (newval, oldval) => {
  if (model.value === "login") {
    if (newval.username != "" && newval.password != "" && newval.code != "") {
      btnbool.value = false;
    } else {
      btnbool.value = true;
    }
  } else {
    if (
      newval.username != "" &&
      newval.password != "" &&
      newval.repassword != ""
      &&
      newval.name != ""
      &&
      newval.email != ""
    ) {
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
    // if (!valid) {
    //   console.log("error submit!");
    //   return false;
    // }
    if (model.value === "register") {
      let data = {
        username: ruleForm.username,
        name: ruleForm.name,
        password: ruleForm.password,
        email: ruleForm.email,
      };
      let response = await link(url.register, "post", data);
      if (response.data.code === code.NORMAL_SUCCESS) {
        ElMessage({
          message: "注册成功",
          type: "success",
        });
        model.value = "login";
        MenuData.forEach((element) => {
          element.current = false;
        });
        MenuData[0].current = true;
      } else {
        ElMessage.error(response.data.msg);
      }
    } else {
      let response = await link(
        url.login.student,
        "post",
        {
          username: ruleForm.username, password: ruleForm.password,
          vercode: ruleForm.code, verkey: identifyCode.value
        },//md5(ruleForm.password).value }
      );
      // store.getters.set
      store.commit("setUsername", ruleForm.username);
      if (response.data.code === code.NORMAL_SUCCESS) {
        ElMessage({
          message: response.data.msg,
          type: "success",
        });
        router.push({ name: "student" }); //增加cookies
        cookies.set("token", response.data.data.token, new Date(response.data.data.expire));
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
  refreshCode()
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
      }

      .login_code {
        margin-top: 10px;
        margin-left: 10px;
      }
    }
  }
}
</style>
