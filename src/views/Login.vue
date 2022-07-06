<template>
<<<<<<< HEAD
  <div class="body">
    <div class="login">
      <div class="login-con">
        <ul class="menu-tab">
          <li
            v-for="v in MenuData"
            :class="{ current: v.current }"
            :key="v.type"
            @click="clickMenu(v)"
          >
            {{ v.txt }}
          </li>
        </ul>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <label>邮箱</label>
          <el-input
            v-model="ruleForm.username"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item prop="password">
          <label>密码</label>
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
            minlength="6"
            maxlength="15"
          />
        </el-form-item>


        <el-form-item prop="code">
          <label>邮箱</label>
          <el-input
            v-model="ruleForm.username"
            type="text"
            autocomplete="off"
          />
        </el-form-item>


        <el-form-item prop="repassword" v-show="model === 'register'">
          <label>重复密码</label>
          <el-input
            v-model="ruleForm.repassword"
            type="password"
            minlength="6"
            maxlength="15"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="btnbool"
            type="primary"
            class="login-btn block"
            @click="submitForm(ruleFormRef)"
            >{{ model === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive,watch } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import link from "../api/link.js";
import url from "../api/url.js";
import { ElMessage } from "element-plus";
import { FormInstance } from "element-plus";
// import md5 from "../hook/index.js";

let router = useRouter();//登陆成功后跳转到首页
/*登录注册按钮数据及逻辑*/
const MenuData = reactive([
  { txt: "登录", current: true, type: "login" },
  { txt: "注册", current: false, type: "register" },
]);
let model = ref("login");//model 提供给后面逻辑处理
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
const ruleForm = reactive({//表单部分
  username: "",
  password: "",
  repassword: "",
});

/*校验规则*/
const checkUsername = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("邮箱不能为空"));
  }
  callback();
};
const validatePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("密码不能为空"));
  } else {
    if (ruleForm.password !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass", () => null);
    }
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
const rules = reactive({
  password: [{ validator: validatePassword, trigger: "blur" }],
  repassword: [{ validator: validatePass2, trigger: "blur" }],
  username: [{ validator: checkUsername, trigger: "blur" }],
});
/**/
/*检测校验是否通过，通过按钮变为可登录*/
let btnbool=ref(true)
watch(ruleForm, (newval, oldval) => {
  if (model.value === "login") {
    if (newval.username != "" && newval.password != "") {
      btnbool.value = false;
    } else {
      btnbool.value = true;
    }
  } 
  else {
    if (
      newval.username != "" &&
      newval.password != "" &&
      newval.repassword != ""
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
  formEl.validate((valid) => {
    if (valid) {
      if (model.value === "register") {
        let data = {
          name: ruleForm.username,
          password:ruleForm.password,
        };
        link(url.register, "post", data).then((ok: any) => {
          console.log(ok.data);
          if (Object.keys(ok.data).length !== 0) {
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
            ElMessage.error("注册失败");
          }
        });
      } else {
        link(
          url.register,
          "get",
          {},
          { name: ruleForm.username, password:ruleForm.password} //md5(ruleForm.password).value }
        ).then((ok) => {
          if (ok.data.length != 0) {
            ElMessage({
              message: "登录成功",
              type: "success",
            });
            router.push("/home");
          } else {
            ElMessage.error("登录失败");
          }
        });
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
/*重置*/
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
/**/
</script>

<style lang="scss">
.current {
  //是登录注册按钮选择的提示色
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
=======
    登陆
</template>
<script setup>
</script>
<style>
</style>
>>>>>>> 897475d68c6f62e6d3c3547dc27288bb0565cc6c
