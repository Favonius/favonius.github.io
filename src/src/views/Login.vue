<template>
  <div ref="content">
    <p class="headerObject" v-show=!isLoggedIn v-on:click="showLogin = true">
      <u>Login</u>
    </p>
    <p class="headerObject" v-show=isLoggedIn v-on:click="doLogout">
      <u>LogOut</u>
    </p>
    <p class="headerObject" v-on:click="aboutVisible = true">
      <u>About</u>
    </p>
    <el-dialog width=90% title="Login" :visible.sync="showLogin">
      <el-form :model="form">
        <el-form-item label="E-Mail" :label-width="formLabelWidth">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Password" :label-width="formLabelWidth">
          <el-input v-model="form.password" type=password auto-complete="off" @keyup.native.enter="doLogin"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="doLogin">Login</el-button>
      </span>
    </el-dialog>
    <el-dialog title="About" :visible.sync="aboutVisible" width="50%">
      <p>한국 곤충 총 목록 입니다..</p>
      <p> 적적해서 만들어 보았습니다..</p>
      <p>사진 링크 노가다꾼 구합니다.</p>
      <a href="mailto:peoplece@gmail.com"><i class="el-icon-message"></i></a>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="aboutVisible = false">확인</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Login, Logout } from '@/api/auth'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      formLabelWidth: '80px',
      showLogin: false,
      aboutVisible: false
    }
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.state.isLoggedIn
    }
  },
  methods: {
    doLogin () {
      Login(this.form.email, this.form.password)
      this.closeDialog()
    },
    doLogout () {
      Logout()
    },
    closeDialog () {
      this.showLogin = false
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.tags {
  font-size: 2px;
}
.headerObject {
  padding: 10px;
  padding-bottom: 0px;
  margin: 0px;
  float: right;
  color: gray;
}
</style>
