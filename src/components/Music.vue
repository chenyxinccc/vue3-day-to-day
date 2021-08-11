<template>
  <div class="music">
    <el-card
      class="music-box"
      :style="{ backgroundColor: theme }"
      shadow="hover"
      :class="{ 'music-box__hidden': showShrink }"
    >
      <h2
        class="music-box__title"
        :title="activeMusicName + '____' + activeMusicSinger"
      >
        {{ activeMusicName }}&nbsp;<span
          >&nbsp;&nbsp;{{ activeMusicSinger }}</span
        >
      </h2>
      <i
        class="el-icon-minus music-box__close"
        @click="showShrink = true"
        title="缩小应用"
      ></i>
      <!-- 音量控制 -->
      <div class="music-box__volume" @click="stopBubble">
        <i
          class="fa fa-volume-off fa-2x"
          @click="isSetVolume = !isSetVolume"
          title="切换音量"
        ></i>
        <el-slider
          vertical
          v-model="volumeNum"
          v-show="isSetVolume"
          class="music-volume__slider"
          @change="setVolume"
          height="100px"
        >
        </el-slider>
      </div>
      <!-- 封面展示 -->
      <div class="music-box__cover" :class="{ rotate: isPlay }">
        <img :src="coverImage" />
      </div>
      <!-- 进度条 -->
      <div class="music-box__schedule">
        <el-slider
          v-model="nowWidth"
          :show-tooltip="false"
          @change="setCurrentTime"
          :disabled="!durationTime"
        >
        </el-slider>
      </div>
      <div class="music-box__time">
        <span class="music-time__current" v-show="currentTime">{{
          currentTime
        }}</span>
        <span class="music-time__duration" v-show="durationTime">{{
          durationTime
        }}</span>
      </div>
      <!-- audio -->
      <audio
        :src="audioUrl"
        ref="audio_box"
        :autoplay="isAutoplay"
        @canplay="canplay"
      >
        老铁,该换浏览器了。
      </audio>
      <div class="music-box__operation">
        <i
          class="fa el-icon-caret-left fa-fast-backward fa-1x"
          @click="lastPlay"
          title="上一首"
        ></i>
        <i
          class="fa el-icon-video-pause fa-pause-circle fa-3x music-play__icon"
          v-show="isPlay"
          @click="checkPlay"
          title="暂停"
        ></i>
        <i
          class="fa el-icon-video-play fa-play-circle fa-3x music-play__icon"
          v-show="!isPlay"
          @click="checkPlay"
          title="开始"
        ></i>
        <i
          class="fa el-icon-caret-right fa-fast-forward fa-1x"
          @click="nextPlay"
          title="下一首"
        ></i>
      </div>

      <i
        class="fa fa-list fa-1x music-box__list el-icon-postcard"
        title="播放列表"
        v-popover:popover
      ></i>
      <el-popover ref="popover" placement="top" width="200" trigger="click">
        <div class="music-list__box">
          <ul>
            <li
              v-for="(item, i) of musics"
              :key="i"
              @click="setPlay(i)"
              :class="{ 'active-item': i == activeNum }"
            >
              <i
                class="
                  fa fa-chevron-right fa-1x
                  music-list__now
                  el-icon-arrow-right
                "
                title="当前播放"
                v-if="i == activeNum"
              ></i>
              <span>{{ item.name }}</span>
              <span class="music-list__singer">{{ item.singer }}</span>
            </li>
          </ul>
        </div>
      </el-popover>
    </el-card>
    <div
      class="music-shirink"
      :style="{ backgroundColor: theme }"
      :class="{ 'music-box__hidden': !showShrink }"
      @click="showShrink = false"
      title="打开应用"
    >
      <i class="el-icon-service" :class="{ rotate: isPlay }"></i>
    </div>
  </div>
</template>
<script lang="ts">
import cover1 from "@/assets/images/1.jpg";
import cover2 from "@/assets/images/2.jpg";
import cover3 from "@/assets/images/0.jpg";
import cover4 from "@/assets/images/3.jpg";
import audio1 from "@/assets/music/1.mp3";
import audio2 from "@/assets/music/2.mp3";
import audio3 from "@/assets/music/3.mp3";
import audio4 from "@/assets/music/4.mp3";
import { Options, Vue } from "vue-class-component";
// import { ElCard, ElPopover, ElPopper } from "element-plus";

@Options({
  data() {
    return {
      showShrink: true,
      gridData: [],
      activeMusicName: "",
      activeMusicSinger: "",
      coverImage: "",
      audioUrl: "",
      isPlay: false,
      isAutoplay: false,
      isSetVolume: false,
      nowProgressBar: null,
      nowWidth: 0,
      volume: 0.1,
      volumeNum: 10,
      activeNum: 0,
      musics: [
        {
          name: "LOSER",
          singer: "米津玄師",
          cover: cover1,
          audio: audio1,
        },
        {
          name: "DROP",
          singer: "ROOKiEZ is PUNK'D",
          cover: cover2,
          audio: audio2,
        },
        {
          name: "Terror",
          singer: "まふまふ",
          cover: cover3,
          audio: audio3,
        },
        {
          name: "我们的天空",
          singer: "黄艺明",
          cover: cover4,
          audio: audio4,
        },
      ],
      currentTime: null,
      durationTime: null,
      theme: "#c62f2f",
    };
  },
  // computed: {
  //   theme() {
  //     return this.$store.state.setting.theme || "#c62f2f";
  //   },
  // },
  components: {
    // ElCard,
    // ElPopover,
    // ElPopper,
  },
  watch: {
    activeNum() {
      if (this.activeNum + 1 > this.musics.length) {
        this.activeNum = 0;
        return;
      } else if (this.activeNum < 0) {
        this.activeNum = this.musics.length - 1;
        return;
      }
      this.initMusic();
      if (this.isPlay) {
        this.isAutoplay = true;
      } else {
        this.isAutoplay = false;
      }
    },
  },
  mounted() {
    this.initMusic();
    window.onclick = this.checkShow;
    this.$refs["audio_box"].volume = this.volume;
  },
  destroy() {
    window.onclick = null;
  },
  methods: {
    // 初始化歌曲信息
    initMusic() {
      const mowMusic = this.musics[this.activeNum];
      this.activeMusicName = mowMusic.name;
      this.activeMusicSinger = mowMusic.singer;
      this.coverImage = mowMusic.cover;
      this.audioUrl = mowMusic.audio;
      this.nowWidth = 0;
    },
    // 暂停or播放
    checkPlay() {
      this.isPlay = !this.isPlay;
      if (this.isPlay) {
        this.$refs["audio_box"].play();
      } else {
        this.$refs["audio_box"].pause();
      }
      this.setProgressBar();
    },
    // 列表跳转
    setPlay(i: number) {
      if (i !== this.activeNum) {
        this.activeNum = i;
      }
    },
    // 上一首
    lastPlay() {
      this.activeNum--;
    },
    // 下一首
    nextPlay() {
      this.activeNum++;
    },
    // 缓冲完成
    canplay() {
      const audio = this.$refs["audio_box"];
      this.currentTime = this.formatTime(Math.floor(audio.currentTime));
      this.durationTime = this.formatTime(Math.floor(audio.duration));
    },
    // 进度条
    setProgressBar() {
      const time = 200;
      const audio = this.$refs["audio_box"];
      this.nowProgressBar = this.nowProgressBar
        ? clearInterval(this.nowProgressBar)
        : (this.nowProgressBar = setInterval(() => {
            this.currentTime = this.formatTime(Math.floor(audio.currentTime));
            this.durationTime = this.formatTime(Math.floor(audio.duration));
            this.nowWidth =
              (Math.floor(audio.currentTime) / Math.floor(audio.duration)) *
              100;
            if (audio.ended) {
              this.activeNum++;
            }
          }, time));
    },
    // 格式化时间
    formatTime(seconds: number): string {
      if (isNaN(seconds)) {
        return "00:00";
      }
      return [
        // parseInt(seconds / 60 / 60),
        parseInt(((seconds / 60) % 60) + ""),
        parseInt((seconds % 60) + ""),
      ]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
    },
    // 音量设置
    setVolume(val: number) {
      if (val > 80) {
        this.$message({
          message: "注意保护听力(最大音量80)",
          type: "success",
        });
        this.volumeNum = 80;
        this.$refs["audio_box"].volume = 0.8;
      } else {
        this.$refs["audio_box"].volume = val / 100;
      }
    },
    // 时间跳转
    setCurrentTime(val: number) {
      this.$refs["audio_box"].currentTime = Math.floor(
        (this.$refs["audio_box"].duration * val) / 100
      );
    },
    checkShow() {
      this.isSetVolume = false;
    },
    stopBubble(e: MouseEvent) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
    },
  },
})
export default class Music extends Vue {}
</script>
<style lang="less" scoped>
.music {
  position: fixed;
  right: 5px;
  top: 30%;
  z-index: 99;
}
.music-shirink {
  width: 40px;
  height: 40px;
  right: 0;
  top: 0;
  line-height: 40px;
  position: absolute;
  text-align: center;
  background: #c62f2f;
  color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  z-index: 97;
  overflow: hidden;
}
/deep/ .music-box__schedule .el-slider__bar {
  background-color: #ff8c26;
}
/deep/ .music-box__schedule .el-slider__button {
  border: #ff8c26;
}
/deep/ .music-box__volume .music-volume__slider .el-slider__runway {
  margin-right: 0;
  margin-left: 16px;
}
.music .el-card {
  border: none;
}
.music-box {
  background: #c62f2f;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: all 0.2s;
  z-index: 98;
}
.music-box h2 {
  color: #fff;
  border-bottom: 1px solid #fff;
  line-height: 40px;
}
.music-box {
  width: 300px;
  height: 420px;
  margin: 0 auto;
}
.music-box__hidden {
  width: 0px;
  height: 0px;
}
.music-box__title span {
  font-size: 12px;
}
.music-box__close {
  position: absolute;
  right: 10px;
  top: 5px;
  color: #fff;
  cursor: pointer;
}
.music-box__volume {
  width: 34px;
  color: #fff;
  position: absolute;
  right: 6px;
  display: inline-block;
  text-align: center;
}
.music-box__volume i {
  cursor: pointer;
}
.music-box__cover {
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
  background: #fff;
  border-radius: 50%;
  margin: 0 auto;
  margin-top: 30px;
  position: relative;
  overflow: hidden;
}
.music-box__cover img {
  width: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.music-box__time span {
  color: #fff;
  font-size: 12px;
}
.music-time__current {
  float: left;
}
.music-time__duration {
  float: right;
}
.music-box__operation {
  height: 70px;
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.music-box__operation i {
  color: #fff;
  cursor: pointer;
  font-size: 30px;
}
.music-box__list {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: #fff;
  font-size: 24px !important;
  cursor: pointer;
}
.music-list__box {
  max-height: 300px;
  .active-item {
    color: #ff8c26;
  }
  ul {
    padding: 0 5px;
  }
  li {
    line-height: 30px;
    color: #c62f2f;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  li:hover {
    color: #ff8c26;
  }
}
.music-list__now {
  text-indent: 0;
}
.music-list__singer {
  margin-left: 4px;
  font-size: 12px;
}
.music-play__icon {
  margin: 0 15px;
  font-size: 40px !important;
}
.rotate {
  -webkit-transition-property: -webkit-transform;
  -moz-transition-property: -moz-transform;
  transition-property: -moz-transform;
  -webkit-transition-duration: 1s;
  -moz-transition-duration: 1s;
  transition-duration: text;
  -webkit-animation: rotate 12s linear infinite;
  -moz-animation: rotate 12s linear infinite;
  -o-animation: rotate 12s linear infinite;
  animation: rotate 12s linear infinite;
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(359deg);
  }
}
@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg);
  }
  to {
    -o-transform: rotate(359deg);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
