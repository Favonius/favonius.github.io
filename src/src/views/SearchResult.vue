<template>
  <div ref="searchResult">
    <el-row type="flex" justify="end">
      <el-col :span="6">
        <div id="mybutton" v-if="hasImage">
          <el-button type="primary" icon="el-icon-document" circle v-if="onlyphoto" v-on:click="onlyphoto=!onlyphoto"></el-button>
          <el-button type="success" icon="el-icon-picture" circle v-if="!onlyphoto" v-on:click="onlyphoto=!onlyphoto"></el-button>
        </div>
      </el-col>
    </el-row>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <div class="grid">
        <el-card class="box-card" v-for="(insect,colIndex) in resultData" v-bind:key="colIndex" v-if="isShowCard(insect)">
          <vue-flip :active-hover=true width=100% transition=1s v-if="!isMobile()">
            <div slot="front" v-if="imageMap[insect.id] != undefined">
              <img v-bind:src=imageMap[insect.id].url style="width:100%" v-on:click="openPopup(imageMap[insect.id].sourceUrl)" >
            </div>
            <div slot="back" v-if="imageMap[insect.id] != undefined">
              <img v-if="imageMap[insect.id].url_back !== undefined" v-bind:src=imageMap[insect.id].url_back style="width:100%" v-on:click="openPopup(imageMap[insect.id].sourceUrl)" >
              <img v-if="imageMap[insect.id].url_back === undefined" v-bind:src=imageMap[insect.id].url style="width:100%" v-on:click="openPopup(imageMap[insect.id].sourceUrl)" >
            </div>
          </vue-flip>
          <vue-flip :active-click=true width=100% transition=1s v-if="isMobile()">
            <div slot="front" v-if="imageMap[insect.id] != undefined">
              <img v-bind:src=imageMap[insect.id].url style="width:100%" >
            </div>
            <div slot="back" v-if="imageMap[insect.id] != undefined">
              <img v-if="imageMap[insect.id].url_back !== undefined" v-bind:src=imageMap[insect.id].url_back style="width:100%" >
              <img v-if="imageMap[insect.id].url_back === undefined" v-bind:src=imageMap[insect.id].url style="width:100%">
            </div>
          </vue-flip>
          <!-- <div v-touch:swipe="swipeHandler" class="flip-container" v-if="isMobile()">
            <div class="flipper" v-if="imageMap[insect.id] != undefined">
              <div class="front">
                    <img v-bind:src=imageMap[insect.id].url style="width:100%" v-on:click="openPopup(imageMap[insect.id].sourceUrl)" >
              </div>
              <div class="back" >
                <img v-if="imageMap[insect.id].url_back !== undefined" v-bind:src=imageMap[insect.id].url_back style="width:100%" v-on:click="openPopup(imageMap[insect.id].sourceUrl)" >
                <img v-if="imageMap[insect.id].url_back === undefined" v-bind:src=imageMap[insect.id].url style="width:100%" v-on:click="openPopup(imageMap[insect.id].sourceUrl)" >
              </div>
            </div>
          </div> -->
          <p v-on:click="copyToClipboard" v-if="!isMobile()"><b>{{insect.ko}}</b></p>
          <p v-on:click="openPopup(imageMap[insect.id].sourceUrl)" v-if="isMobile()"><b>{{insect.ko}}</b></p>
          <p v-on:click="copyToClipboard">
            <b><i>{{insect.en}}</i> {{insect.ay}}</b></p>
          <p class="tags" v-show=isLoggedIn v-on:click="copyToClipboard">{{insect.tags}}</p>
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
        <el-form-item label="Image1 Back URL" :label-width="formLabelWidth">
          <el-input v-model="form.url_back" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Image2 URL" :label-width="formLabelWidth">
          <el-input v-model="form.url2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Image2 Back URL" :label-width="formLabelWidth">
          <el-input v-model="form.url2_back" auto-complete="off"></el-input>
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
import { isMobile } from '@/util/util'
import infiniteScroll from 'vue-infinite-scroll'
import VueFlip from 'vue-flip'

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
  components: {
    'vue-flip': VueFlip
  },
  data () {
    return {
      dialogAddPhotoVisible: false,
      form: {
        name: '',
        id: '',
        url: '',
        url_back: '',
        url2: '',
        url_back2: '',
        sourceUrl: '',
        updateDate: ''
      },
      formLabelWidth: '120px',
      imageMap: {},
      resultData: [],
      pageCount: 0,
      pageSize: 30,
      busy: false,
      onlyphoto: false
    }
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.state.isLoggedIn
    },
    hasImage: function () {
      for (var i = 0, len = this.resultData.length; i < len; i++) {
        if (this.imageMap[this.resultData[i].id] !== undefined) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    swipeHandler: function (direction, event) {
      console.log(event)
      for (var i = 0, len = event.path.length; i < len; i++) {
        if (event.path[i].className.includes('flip-container')) {
          event.path[i].classList.toggle('flip')
          break
        }
      }
    },
    isMobile: function () {
      return isMobile()
    },
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
    isShowCard (insect) {
      if (this.onlyphoto) {
        if (this.imageMap[insect.id] !== undefined) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    showAddPhotoDialog (insect) {
      this.form.name = insect.skn + insect.sskn
      this.form.id = insect.id
      this.form.url = this.imageMap[insect.id].url
      this.form.url_back = this.imageMap[insect.id].url_back
      this.form.url2 = this.imageMap[insect.id].url2
      this.form.url2_back = this.imageMap[insect.id].url2_back
      this.form.sourceUrl = this.imageMap[insect.id].sourceUrl
      this.dialogAddPhotoVisible = true
    },
    doAddPhoto () {
      if (this.form.url.length > 1 && this.form.sourceUrl.length > 1) {
        this.form.updateDate = (new Date()).getTime()
        if (this.form.url2 === undefined) {
          this.form.url2 = ' '
        }
        if (this.form.url2_back === undefined) {
          this.form.url2_back = ' '
        }
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
      this.onlyphoto = false
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
@media screen and (max-width: 768px) {
  .grid {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(150px,1fr));
  }
  .flip-container, .front, .back {
    width: 100%;
    height: 240px;
  }
}

@media screen and (min-width: 769px) {
  .grid {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(300px,1fr));
  }
  .flip-container, .front, .back {
    width: 100%;
    height: 480px;
  }
}
.box-card {
  width: 100%;
}
#mybutton {
  position: fixed;
  bottom: 10px;
  right: 15px;
  z-index: 9999;
}

.flip-container {
  perspective: 1000px;
}
/* flip the pane when hovered */
.flip-container.hover .flipper, .flip-container.flip .flipper {
  transform: rotateY(180deg);
}

/* flip speed goes here */
.flipper {
  transition: 0.6s;
  transform-style: preserve-3d;
  position: relative;
}

.front, .back {
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

/* front pane, placed above back */
.front {
z-index: 2;
/* for firefox 31 */
transform: rotateY(0deg);
}

/* back, initially hidden pane */
.back {
  transform: rotateY(180deg);
}
</style>
