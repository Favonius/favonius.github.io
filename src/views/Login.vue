<template>
  <div>
    <el-button class="loginButton" type="success" v-show=!isLoggedIn v-on:click="showLogin = true"> Login </el-button>
    <el-button class="loginButton" type="warning" v-show=isLoggedIn v-on:click="doLogout"> LogOut </el-button>
    <el-dialog title="Login" :visible.sync="showLogin">
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
      formLabelWidth: '120px',
      showLogin: false
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
</style>
