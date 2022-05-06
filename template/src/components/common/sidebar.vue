<template>
  <div>
    <el-drawer
      :visible.sync="show"
      :modal="false"
      direction="ltr"
      size="320px"
      :before-close="handleClose"
      custom-class="resourceDrawer"
    >
      <template slot="title">
        <div style="display: flex">
          <el-link
            icon="el-icon-menu"
            style="
              font-size: 30px;
              color: #00a292;
              margin-left: 10px;
              margin-top: 3px;
            "
            :underline="false"
          >
          </el-link>
          <el-avatar
            size="small"
            :src="circleUrl"
            @error="errorHandler"
            style="margin-left: 10px; margin-top: 3px"
          >
            <i class="iconfont iconjiazaishibai" />
          </el-avatar>
          <span style="margin-left: 10px; margin-top: 5px">{{
            userInfo.username
          }}</span>
        </div>
      </template>
      <div
        style="
          height: 750px;
          overflow-y: overlay;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
        "
      >
        <div
          class="sideBarItem"
          v-for="item in sidebarData"
          :key="item.id"
          @click="toDetail(item)"
        >
          <el-image
            :src="item.applicationDto ? item.applicationDto.icon : ''"
            fit="cover"
            class="applicationIcon"
          >
            <div
              slot="error"
              class="image-slot"
              style="background-color: #c5c5c5; width: 44px; height: 44px"
            >
              <i
                class="iconfont iconjiazaishibai"
                style="
                  font-size: 20px;
                  margin-top: 10px;
                  position: absolute;
                  color: #fff;
                  margin-left: -9px;
                "
              ></i>
            </div>
          </el-image>
          <el-tooltip
            v-if="item.applicationDto && item.applicationDto.name.length > 5"
            effect="dark"
            :content="item.applicationDto ? item.applicationDto.name : ''"
            placement="top"
          >
            <p class="itemText">
              {{ item.applicationDto ? item.applicationDto.name : "" }}
            </p>
          </el-tooltip>
          <p class="itemText" v-else>
            {{ item.applicationDto ? item.applicationDto.name : "" }}
          </p>
        </div>
      </div>
      <div style="margin-right: 10px" v-show="visible">
        <p class="bottom" @click="toApplicationShop">
          <span
            class="icon iconfont"
            style="margin-left: 30px; font-size: 20px; color: #909399"
            >&#xe63a;</span
          >
          <span style="font-size: 16px; color: #909399">应用商店</span>
          <i class="el-icon-arrow-right"></i>
        </p>
        <p class="bottom" @click="toBackStage">
          <i
            class="el-icon-menu"
            style="margin-left: 30px; font-size: 20px; color: #909399"
          ></i>
          <span style="font-size: 16px; color: #909399">单位后台管理</span>
          <i class="el-icon-arrow-right"></i>
        </p>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import changeUrls from "puhoucorejs/src/core/fun/changeUrl"; // 阿里云资源添加签名
export default {
  name: "Sidebar",
  props: ["show"],
  data() {
    return {
      sidebarData: [],
      userInfo: {},
      visible: false,
      circleUrl: "",
    };
  },
  watch: {
    $route: {
      // eslint-disable-next-line no-unused-vars
      handler(val, old) {
        this.getData(val.query.companyId);
      },
    },
  },
  mounted() {
    let companyId = this.$route.query.companyId;
    this.getUserInfo(companyId);
    this.getData(companyId);
    let flag = window.location.hash.indexOf("company-svc");
    if (flag != -1) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  },
  methods: {
    errorHandler() {
      return true;
    },
    getUserInfo(companyId) {
      this.$reqGet(
        `/company-svc/company-user/get-common-user-info/${companyId}`
      ).then((res) => {
        if (res.code === 200) {
          this.userInfo = res.data;
          if (_.includes(this.userInfo.photoUrl, "ipuhou")) {
            this.circleUrl = changeUrls(this.userInfo.photoUrl);
          } else {
            this.circleUrl = this.userInfo.photoUrl;
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getData(companyId) {
      this.$reqGet(`/company-svc/app/navigation/sidebar/${companyId}`).then(
        (res) => {
          if (res.code === 200) {
            this.sidebarData = res.data;
            this.sidebarData.forEach((item) => {
              let url = item.applicationDto.icon;
              if (_.includes(url, "ipuhou")) {
                item.applicationDto.icon = changeUrls(url);
              }
            });
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    toDetail(item) {
      let token = localStorage.getItem("token");
      let companyId = this.$route.query.companyId;
      let applicationId = item.id;
      let url = item.applicationDto.identification;

      // eslint-disable-next-line no-unused-vars
      let popup = window.open(
        `${url}?applicationId=${applicationId}&companyId=${companyId}&token=${token}`
      );
    },
    toApplicationShop() {
      this.$router.push({
        name: "company-svc_applicationShop",
        query: {
          companyId: this.$route.query.companyId,
          applicationId: this.$route.query.applicationId,
        },
      });
      this.handleClose();
    },
    toBackStage() {
      this.$router.push({
        name: "company-svc_company",
        query: {
          companyId: this.$route.query.companyId,
          applicationId: this.$route.query.applicationId,
        },
      });
      this.handleClose();
    },
    handleClose() {
      this.$emit("close", false);
    },
  },
};
</script>

<style scoped>
::v-deep .resourceDrawer {
  outline: none;
}
::v-deep .resourceDrawer .el-drawer__header {
  font-size: 18px;
  color: #303133;
  font-weight: bold;
  margin-bottom: 0px;
  padding: 10px 10px 10px;
}
::v-deep .resourceDrawer .el-drawer__header span {
  outline: none;
}
.el-drawer__header {
  font-size: 24px;
}
.bottom {
  height: 56px;
  line-height: 56px;
  margin-top: 10px;
  font-size: 14px;
  color: #606060;
  cursor: pointer;
}
.bottom:hover {
  background: #e7f6f3;
}
.bottom span {
  margin-left: 10px;
}
.bottom i {
  font-size: 16px;

  margin-left: 20px;
  cursor: pointer;
}
.el-icon-arrow-right {
  float: right;
  margin-top: 20px;
}
.sideBarItem {
  width: 68px;
  height: 68px;
  position: relative;
  margin-left: 25px;
  margin-top: 20px;
  cursor: pointer;
  text-align: center;
}
.itemText {
  color: rgb(96, 96, 96);
  width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  margin-top: 54px;
  outline: none;
}
.applicationIcon {
  position: absolute;
  top: 0;
  left: 12px;
  background-image: linear-gradient(180deg, #41efd9 0%, #23b4a5 100%);
  box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  width: 44px;
  height: 44px;
  overflow: hidden;
}
.applicationIcon {
  transition-property: margin-top;
  transition-duration: 0.1s;
  transition-timing-function: linear;
}
.applicationIcon:hover {
  margin-top: -5px;
}
</style>
