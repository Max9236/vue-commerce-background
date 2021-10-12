<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="login_portrait">
        <img src="../assets/img/wx.jpg" alt="" />
      </div>
      <!-- 表单区 --> 
      <!-- loginFormRef 是表单的引用 -->
      <el-form ref="loginFormRef" :model="loginFrom" :rules="rules" class="login_form">
        <!-- 账号 -->
        <el-form-item prop="id">
          <el-input 
            v-model="loginFrom.id" 
            prefix-icon="iconfont icon-user" 
          />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginFrom.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn_flex">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginFrom: {
        id: "admin",
        password: "123456",
      },
      rules: {
        // 注意：路由规则名称要和loginFrom对象的属性名一致
        id: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
      }
    };
  },

  mounted() {},

  methods: {
    // 重置登录表单
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields();
    },
    // 点击登录进行验证
    login(){
      // 先获取表单实例对象调用validate进行表单验证，验证结束调用回调，获取到验证结果boolean
      this.$refs.loginFormRef.validate(async (boolean) => {
        if(boolean){
            // 为true则正式发起登录请求
          let {data:res} = await this.$http.post('/login', {
            username: this.loginFrom.id,
            password: this.loginFrom.password
          })
          if(res.meta.status === 200){
            console.log(res.data);
            this.$message({
              message: '登录成功',
              type: 'success'
            });
            // 存储token
            window.sessionStorage.setItem('token',res.data.token);
            // 路由跳转
            this.$router.push('/home')
          }else this.$message.error('登录失败，请重新登录');
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background: rgb(34, 151, 230);
  height: 100%;
  .login_box {
    width: 400px;
    height: 300px;
    background-color: white;
    position: fixed;
    // top left 的百分比是相对于父类
    top: 50%;
    left: 50%;
    // translate(-50%,-50%); 的百分比是相对于自身
    transform: translate(-50%, -50%);
    border-radius: 2%;
    .login_portrait {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px solid rgb(40, 177, 231);
        box-shadow: 0 0 10px rgb(105, 183, 228);
      }
    }
    .login_form {
      position: absolute;
      top: 30%;
      width: 100%;
      box-sizing: border-box; //怪异盒模型
      padding: 0 20px;
      .btn_flex {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>