<template>
  <div>
    <el-row >
      <login></login>
    </el-row>
    <el-row>
      <el-input placeholder="어떤 종을 찾고 싶으세요?" v-model="searchText" class="input-with-select" @keyup.native="isValidQuestion" @keyup.native.enter="getAnswer">
        <el-select v-model="select" slot="prepend" placeholder="영역">
          <el-option label="전체" value="1"></el-option>
          <el-option label="종명" value="2"></el-option>
          <el-option label="속명" value="3"></el-option>
          <el-option label="과명" value="4"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" v-on:click="getAnswer"></el-button>
      </el-input>
    </el-row>
    <el-row>
      <p> {{this.searchAnswer}} </p>
    </el-row>
    <search-result :insect-data=searchResult></search-result>
  </div>
</template>
<script>
import { FindFull } from '@/api/insect'
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
      db: null
    }
  },
  components: { SearchResult, Login },
  created () {
    this.searchText = this.$route.params && this.$route.params.searchText
    this.getAnswer()
  },
  methods: {
    keymonitor: function (event) {
      this.isValidQuestion()
    },
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
    getAnswer: function () {
      if (this.isValidQuestion()) {
        this.searchResult = FindFull(this.searchText)
        this.searchAnswer = this.searchResult.length + '건 찾았어요!'
      }
    }
  },
  head: {
    title: {
      inner: 'Insects of Korea'
    },
    meta: [
      {
        property: 'og:description',
        content: '한국의 곤충들'
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:title',
        content: '한국 곤충 종 목록'
      },
      {
        property: 'og:url',
        content: 'https://favonius.github.io'
      },
      {
        property: 'og:image',
        content: 'https://favonius.github.io/static/img/metaimage.f7aa979.jpg'
      }
    ]
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
.loginButton {
  padding: 10px;
  float:right;
}
.el-row {
  margin-bottom: 10px;
}
</style>
