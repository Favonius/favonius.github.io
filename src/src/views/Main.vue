<template>
  <div>
    <el-row >
      <login></login>
    </el-row>
    <el-row>
      <el-input placeholder="어떤 종을 찾고 싶으세요?" v-model="searchText" class="input-with-select" @keyup.native="isValidQuestion" @keyup.native.enter="enterText">
        <!-- <el-select v-model="select" slot="prepend" placeholder="영역">
          <el-option label="전체" value="1"></el-option>
          <el-option label="종명" value="2"></el-option>
          <el-option label="속명" value="3"></el-option>
          <el-option label="과명" value="4"></el-option>
        </el-select> -->
        <el-button slot="append" icon="el-icon-search" v-on:click="enterText"></el-button>
      </el-input>
    </el-row>
    <el-row>
      <p> {{this.searchAnswer}} </p>
    </el-row>
    <el-row v-show="recentViewShow">
      <h2> Recent Update </h2>
    </el-row>
    <search-result :insect-data=searchResult></search-result>
  </div>
</template>
<script>
import { FindFull, FindRecentUpdate } from '@/api/insect'
import SearchResult from './SearchResult'
import Login from './Login'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      input3: '',
      input4: '',
      searchText: '',
      searchResult: null,
      searchAnswer: '',
      select: '',
      recentViewShow: false,
      db: null
    }
  },
  components: { SearchResult, Login },
  created () {
    this.searchText = this.$route.params && this.$route.params.searchText
    this.getAnswer()
  },
  methods: {
    isValidQuestion: function () {
      if (this.searchText == null) {
        return false
      }
      var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
      if (check.test(this.searchText)) {
        if (this.searchText.length >= 2) {
          return true
        } else {
          this.searchAnswer = '한글은 2자 이상...'
          return false
        }
      } else {
        if (this.searchText.length >= 3) {
          return true
        } else {
          this.searchAnswer = '영문은 3자 이상...'
          return false
        }
      }
    },
    enterText: function () {
      if (this.isValidQuestion()) {
        this.$router.push({name: 'Search', params: {searchText: this.searchText}})
        this.getAnswer()
      }
    },
    getAnswer: function () {
      if (this.isValidQuestion()) {
        this.searchResult = FindFull(this.searchText)
        this.searchAnswer = this.searchResult.length + '건 찾았어요!'
      }
    }
  },
  watch: {
    searchText: function (val) {
      if (val !== undefined) {
        if (val.length === 0) {
          this.recentViewShow = true
        } else {
          this.recentViewShow = !this.isValidQuestion()
        }
      } else {
        this.recentViewShow = true
      }
    },
    recentViewShow: function (val) {
      if (val) {
        this.searchResult = FindRecentUpdate()
      }
    }
  },
  head: {
    title: {
      inner: 'Insects of Korea'
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-select .el-input {
  width: 110px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-row {
  margin-bottom: 10px;
}
</style>
