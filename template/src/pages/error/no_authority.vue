<template>
  <div class="bg" :style="{ height: height + 'px' }">
    <h3>
      抱歉!您还没有访问权限哦......<span
        style="color: #00a292; cursor: pointer"
        @click="goBack"
        >点击返回</span
      >
    </h3>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    let height = document.documentElement.clientHeight - 100;
    this.height = height - 80;
  },
  mounted() {},

  data() {
    return {
      height: null,
      companyId: null,
      data: [],
      applicationData: [],
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.bg {
  position: relative;
  height: 700px;
  background: url(../../assets/image/noAuthority.png) no-repeat 0px 220px;
  background-size: contain;
}
h3 {
  width: 100%;
  font-family: "微软雅黑";
  font-weight: normal;
  text-align: center;
  font-size: 16px;
  color: #606266;
  position: absolute;
  bottom: 200px;
}
</style>
