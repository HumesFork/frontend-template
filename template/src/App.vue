<template>
  <div
    id="app"
    v-if="!$route.meta.full"
    :style="{ height: screenHeight + 100 + 'px' }"
  >
    <router-view></router-view>
  </div>
  <el-container v-else id="app">
    <el-header>
      <Header />
    </el-header>
    <el-main style="padding: 15px;">
      <el-row :gutter="20">
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
          <el-card
            class="box-card"
            :style="{ 'overflow-y': 'auto', height: screenHeight + 'px' }"
          >
            <Menu />
          </el-card>
        </el-col>
        <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
          <el-card
            class="box-card"
            :style="{ 'overflow-y': 'auto', height: screenHeight + 'px' }"
          >
            <div v-if="titles">
              <p class="secoend-titles">{{ titles }} &nbsp;</p>
              <el-divider class="dividerTitle"></el-divider>
            </div>
            <router-view></router-view>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
//import Header from "./components/common/header";
import Header from "puhoucorejs/src/core/comp/header";
import Menu from "./components/common/menu";
import { Base64 } from "js-base64";

export default {
  watch: {
    $route: {
      handler(val) {
        window.onresize = null;
        this.titles = val.meta.title;
      },
    },
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
  components: {
    Header,
    Menu,
  },
  data() {
    return {
      searchContent: "",
      titles: "", // 标题
      userInfo: "",
      screenHeight: document.documentElement.clientHeight - 100,
    };
  },
  created() {
    let url = window.location.href;
    if (_.includes(url, "token") === true) {
      let token = url.split("token=")[1].split("&")[0];
      token = Base64.decode(token);
      localStorage.setItem("token", token);
      // 截取上个应用id
      let oldapplicationId = url.split("oldapplicationId=")[1].split("&")[0];
      localStorage.setItem("oldapplicationId", oldapplicationId);
    }
    // 切换应用请求
    this.controlAuthority();
  },
  mounted() {
    const that = this;
    that.getSign();
    // 获取阿里云oss参数
    this.intervalId = window.setInterval(() => {
      that.getSign();
    }, 900000);
  },
  methods: {
    search(content) {
      this.searchContent = content;
    },
    // 获取用户信息
    getUserInfo() {
      let url = window.location.href;
      if (url.split("companyId=")[1]) {
        let companyId = url.split("companyId=")[1].split("&")[0];
        this.$reqGet(
          `/company-svc/company-user/get-common-user-info/${companyId}`
        ).then((res) => {
          if (res.code === 200) {
            localStorage.setItem("userInfo", JSON.stringify(res.data));
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    // 获取直传信息
    getSign() {
      this.$reqGet(`/file-svc/file/token`).then((res) => {
        if (res.code === 200) {
          localStorage.setItem("ossData", JSON.stringify(res.data));
        } else {
          this.$message.error(res.message);
        }
      });
    },
    changeApp() {
      let url = window.location.href;
      if (localStorage.getItem("oldapplicationId")) {
        let applicationId = url.split("applicationId=")[1].split("&")[0];
        this.$reqPost("/company-svc/v2/application-sessions", {
          applicationId: applicationId,
        }).then((res) => {
          if (res.code === 200) {
            localStorage.setItem("menuList", JSON.stringify(res.data.menuList));
            localStorage.setItem(
              "resourceList",
              JSON.stringify(res.data.resourceList)
            );
            /* 在此初始化一些元素级别的权限数据 */
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    async controlAuthority() {
      //  let data = await this.changeApp();
      //如果有权限数据，才开始渲染根组件APP
      //if (data) this.getAuthorityData = true;
      //此处开始权限控制
      let menuList = JSON.parse(localStorage.getItem("menuList"));
      if (!menuList) menuList = [];
      const pushMenu = (data) => {
        data.forEach((item) => {
          if (!item.meta.isControl) menuList.push(item.name);
          if (item.children) pushMenu(item.children);
        });
      };
      pushMenu(this.$router.options.routes);
      //控制页面权限;
      this.$router.beforeResolve((to, from, next) => {
        if (menuList.includes(to.name)) {
          next();
        } else {
          next({
            name: `noAuthority`,
            query: to.query,
          });
        }
      });
    },
  },
};
</script>
<style scoped>
.el-aside {
  color: #333;
  text-align: center;
  line-height: 200px;
}
.box-card {
  margin: 0px;
}
.el-divider--horizontal {
  margin: 10px 0;
}
.el-header {
  padding: 0 0px;
}
::v-deep .el-collapse-item__header {
  height: 35px;
}
/** 表格上方添加删除link标签 wf */
::v-deep .table_link {
  margin-left: 10px;
  margin-top: -5px;
}
/**  sxy  */
::v-deep .tableCell .cell {
  text-align: center;
  white-space: nowrap !important;
}
::v-deep .el-table .tableCell .cell {
  white-space: nowrap !important;
}
::v-deep .el-link--inner {
  font-weight: 400 !important;
}
::v-deep .amap-ui-control-position-rb {
  bottom: 120px !important;
  right: 20px !important;
}
::v-deep .amap-ui-control-zoom {
  width: 20px;
}
::v-deep .amap-ui-control-zoom a {
  font-size: 15px;
}
::v-deep .amap-ui-control-zoom a,
.amap-ui-control-zoom-num {
  width: 20px;
  height: 25px;
  line-height: 25px;
}
::v-deep .amap-geolocation-con .amap-geo {
  background: #fff
    url(https://webapi.amap.com/theme/v1.3/markers/b/loc_gray.png) 50% 50%
    no-repeat;
  background-size: 70% 70%;
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 3px;
  right: 4px;
}
</style>
<style>
.el-message-box__title {
  font-weight: bold;
}
.ibbox {
  font-size: 14px;
}
.el-dropdown-menu {
  padding: 0px !important;
}

.el-dropdown-menu__item {
  line-height: 30px !important;
}
.amap-overlay-text-container {
  background-color: rgba(48, 49, 51, 0.8);
  color: #fff;
  border: 0px solid;
}
.amap-marker-label {
  position: absolute;
  z-index: 2;
  border: 0px solid;
  background-color: rgba(48, 49, 51, 0.8);
  white-space: nowrap;
  cursor: default;
  padding: 3px;
  font-size: 12px;
  line-height: 14px;
  border-radius: 5px;
  color: #fff;
}
.amap-overlay-text-container {
  position: absolute;
  z-index: 2;
  border: 0px solid;
  background-color: rgba(48, 49, 51, 0.8);
  white-space: nowrap;
  cursor: default;
  padding: 3px;
  font-size: 12px;
  line-height: 14px;
  border-radius: 5px;
  color: #fff;
}
::-webkit-scrollbar {
  width: 0.6em;
  height: 0.6em;
}

::-webkit-scrollbar-thumb {
  background: rgba(155, 155, 155, 0.4);
  border-radius: 0.6em;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(155, 155, 155, 0.6);
}

::-webkit-scrollbar-track {
  background: transparent;
  background: rgba(200, 200, 200, 0.2);
}
.el-avatar > img {
  width: 100%;
}
.el-tag.el-tag--info .el-tag__close {
  color: #fff !important;
}
.el-link.el-link--primary.is-disabled {
  color: #c8c8c8 !important;
}
.el-link.el-link--danger.is-disabled {
  color: #c8c8c8 !important;
}
</style>
