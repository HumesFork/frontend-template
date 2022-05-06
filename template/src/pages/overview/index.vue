<template>
  <div>
    <section class="tasks">
      <p>近期截止的任务</p>
      <div class="caption">
        <img src="@/assets/image/table.png" width="120" height="120" />
        <div>暂无最近截止的任务</div>
      </div>
    </section>
    <section class="tasks">
      <p>近期浏览的任务</p>
      <div class="caption">
        <img src="@/assets/image/table.png" width="120" height="120" />
        <div>暂无最近访问的任务</div>
      </div>
    </section>
    <section class="tasks">
      <p>星标项目</p>
      <div class="singleApplication">
        <i class="el-icon-plus" style="font-size: 40px; margin-top: 50px"></i>
        <div style="margin-top: 20px">新增项目</div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "App",

  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.documentElement.clientHeight;
        that.screenHeight = window.screenHeight - 100;
      })();
    };
  },
  watch: {
    screenHeight(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenHeight = val;
        this.timer = true;
        let that = this;
        setTimeout(function() {
          // 打印screenWidth变化的值

          that.timer = false;
        }, 400);
      }
    },
  },
  data() {
    return {
      screenHeight: document.documentElement.clientHeight - 100,
    };
  },
  methods: {},
};
</script>

<style scoped>
.el-card {
  margin-top: 0px;
  margin-left: 0px;
}
.tasks {
  height: 250px;
  width: 100%;
  margin-top: 5px;
}
.tasks p {
  font-family: Microsoft YaHei UI;
  font-size: 14px;
  color: #606060;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.caption {
  text-align: center;
  color: #8f9298;
  font-size: 12px;
  margin-top: 50px;
}
.singleApplication {
  width: 290px;
  height: 160px;
  margin-top: 40px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  color: #bfc3cb;
  cursor: pointer;
}
</style>
