<template>
  <div ref="searchResult">
    <el-row :gutter="5" v-for="(rowItem,rowIndex) in rowResult" v-bind:key="rowIndex">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" v-for="(insect,colIndex) in rowItem" v-bind:key="colIndex">
        <el-card class="box-card">
          <img v-if="imageMap[getID(insect)] != undefined" v-bind:src=imageMap[getID(insect)].url style="width:100%" v-on:click="openPopup(imageMap[getID(insect)].sourceUrl)" >
          <p v-on:click="copyToClipboard">{{insect.skn}}{{insect.sskn}}</p>
          <p v-on:click="copyToClipboard">
            <i>{{getName(insect)}}</i> {{getAuthorYear(insect)}}</p>
          <p class="tags" v-on:click="copyToClipboard">{{getTags(insect)}}</p>
          <p>
            <button style="float: right;" icon="el-icon-search" v-show=isLoggedIn v-on:click="showAddPhotoDialog(insect)">Set Photo</button>
          </p>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="Add Photo" :visible.sync="dialogAddPhotoVisible">
      <el-form :model="form">
        <el-form-item label="Insect Name" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Insect Id" :label-width="formLabelWidth">
          <el-input v-model="form.id" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Image URL" :label-width="formLabelWidth">
          <el-input v-model="form.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Source URL" :label-width="formLabelWidth">
          <el-input v-model="form.sourceUrl" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddPhotoVisible = false">Cancel</el-button>
        <el-button type="primary" @click="doAddPhoto()">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getfullSpeciesName, getAuthorYear, getTags, getID, setPhoto, getPhoto } from '@/api/insect'

export default {
  name: 'SearchResult',
  props: {
    insectData: {
      type: Array
    }
  },
  data () {
    return {
      dialogAddPhotoVisible: false,
      form: {
        name: '',
        id: '',
        url: '',
        sourceUrl: ''
      },
      formLabelWidth: '120px',
      imageMap: {}
    }
  },
  computed: {
    rowResult: function () {
      var totalResult = []
      var rowResult = []
      var vm = this
      if (this.insectData != null) {
        const count = this.getCountPerRow()
        for (var i = 0, len = this.insectData.length; i < len; i++) {
          rowResult.push(this.insectData[i])
          getPhoto(this.insectData[i], function (id, data) {
            vm.$set(vm.imageMap, id, data)
          })
          if (i % count === count - 1) {
            totalResult.push(rowResult)
            rowResult = []
          }
        }
        totalResult.push(rowResult)
      }
      return totalResult
    },
    isLoggedIn: function () {
      return this.$store.state.isLoggedIn
    }
  },
  methods: {
    getName (insect) {
      return getfullSpeciesName(insect)
    },
    getAuthorYear (insect) {
      return getAuthorYear(insect)
    },
    getTags (insect) {
      return getTags(insect)
    },
    copyToClipboard: function (event) {
      var t = document.createElement('textarea')
      document.body.appendChild(t)
      t.value = event.target.innerText
      t.select()
      document.execCommand('copy')
      document.body.removeChild(t)
    },
    getID (insect) {
      return getID(insect)
    },
    getCountPerRow () {
      if (this.$refs.searchResult !== undefined) {
        const width = this.$refs.searchResult.clientWidth
        if (width < 768) {
          return 1
        } else if (width >= 1920) {
          return 4
        } else if (width >= 992) {
          return 3
        } else {
          return 2
        }
      }
    },
    showAddPhotoDialog (insect) {
      this.form.name = insect.skn + insect.sskn
      this.form.id = getID(insect)
      this.form.url = ''
      this.form.sourceUrl = ''
      this.dialogAddPhotoVisible = true
    },
    doAddPhoto () {
      if (this.form.url.length > 1 && this.form.sourceUrl.length > 1) {
        setPhoto(this.form)
        this.dialogAddPhotoVisible = false
      }
    },
    openPopup (url) {
      window.open(url, '_blank')
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
