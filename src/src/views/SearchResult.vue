<template>
  <div ref="searchResult">
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <div class="grid">
        <el-card class="box-card" v-for="(insect,colIndex) in resultData" v-bind:key="colIndex">
          <img v-if="imageMap[insect.id] != undefined" v-bind:src=imageMap[insect.id].url style="width:100%" v-on:click="openPopup(imageMap[insect.id].sourceUrl)" >
          <p v-on:click="copyToClipboard">{{insect.ko}}</p>
          <p v-on:click="copyToClipboard">
            <i>{{insect.en}}</i> {{insect.ay}}</p>
          <p class="tags" v-on:click="copyToClipboard">{{insect.tags}}</p>
          <p>
            <button style="float: right;" icon="el-icon-search" v-show=isLoggedIn v-on:click="showAddPhotoDialog(insect)">Set Photo</button>
          </p>
        </el-card>
      </div>
      <div v-show="busy" v-loading="busy" style="height:100px" >  </div>
    </div>
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
import { setPhoto, getPhoto } from '@/api/insect'
import infiniteScroll from 'vue-infinite-scroll'

export default {
  name: 'SearchResult',
  props: {
    insectData: {
      type: Array
    }
  },
  directives: { infiniteScroll },
  created () {
    this.getResultData()
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
      imageMap: {},
      resultData: [],
      pageCount: 0,
      pageSize: 30,
      busy: false
    }
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.state.isLoggedIn
    }
  },
  methods: {
    copyToClipboard: function (event) {
      var t = document.createElement('textarea')
      document.body.appendChild(t)
      t.value = event.target.innerText
      t.select()
      document.execCommand('copy')
      document.body.removeChild(t)
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
      this.form.id = insect.id
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
    },
    getResultData () {
      if (this.insectData !== null) {
        var vm = this
        for (var i = this.pageCount * this.pageSize, len = this.insectData.length; i < (this.pageCount + 1) * this.pageSize && i < len; i++) {
          if (this.insectData[i] !== undefined) {
            getPhoto(this.insectData[i], function (id, data) {
              vm.$set(vm.imageMap, id, data)
            })
            this.$set(this.resultData, i, this.insectData[i])
          }
        }
      }
    },
    loadMore () {
      this.busy = true

      setTimeout(() => {
        this.pageCount += 1
        this.getResultData()
        this.busy = false
      }, 1000)
    }
  },
  watch: {
    insectData: function (newValue) {
      this.resultData = []
      this.pageCount = 0
      this.getResultData()
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.tags {
  font-size: 2px;
}
.grid {
   display: grid;
   grid-gap: 10px;
   grid-template-columns: repeat(auto-fill, minmax(300px,1fr));
}

.box-card {
  width: 100%;
}

</style>
