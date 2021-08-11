<!--
 * @Author: chenyixin
 * @Date: 2021-08-10 15:10:34
 * @LastEditors: chenyixin
 * @LastEditTime: 2021-08-10 17:48:58
-->
<template>
  <div class="hello">
    <div id="chart"></div>
  </div>
</template>

<script lang="ts">
import * as echarts from "echarts";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    msg: Object,
  },
  mounted() {
    const dom = document.getElementById("chart") as HTMLElement;
    if (dom) {
      let myChart = echarts.init(dom);
      // 绘制图表
      myChart.setOption(this.msg);
      window.onresize = function () {
        // 自适应大小
        myChart.resize();
      };
    }
  },
})
export default class HelloWorld extends Vue {
  msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#chart {
  width: 100vw;
  height: 33vh;
}
</style>
