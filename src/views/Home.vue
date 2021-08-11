<!--
 * @Author: chenyixin
 * @Date: 2021-08-10 15:10:34
 * @LastEditors: chenyixin
 * @LastEditTime: 2021-08-11 10:29:25
-->
<template>
  <div class="home">
    <HelloWorld :msg="options" />
    <Music />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Music from "@/components/Music.vue"; // @ is an alias to /src

@Options({
  components: {
    HelloWorld,
    Music,
  },
  data() {
    return {
      options: {
        xAxis: {
          data: ["4-3", "4-4", "4-5", "4-6", "4-7", "4-8", "4-9"],
        },
        yAxis: {},
        series: [
          {
            name: "用户量",
            type: "line",
            data: [8, 15, 31, 13, 15, 22, 11],
          },
        ],
      },
    };
  },
})
export default class Home extends Vue {}
</script>
