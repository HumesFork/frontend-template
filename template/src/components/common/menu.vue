<template>
  <el-menu
    :default-active="defaultActiveIndex"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
  >
    <el-menu-item index="overview">
      <i class="iconfont iconzonglan" style="font-size: 20px">
        <span class="menu-fontSize">总览</span></i
      >
    </el-menu-item>

    <el-submenu index="3">
      <template slot="title">
        <i class="iconfont icondaohang-shezhi"
          ><span class="menu-fontSize">设置</span></i
        >
      </template>
      <el-menu-item-group>
        <el-menu-item
          index="user"
          style="padding-left: 50px"
          class="menu-fontSize"
          >成员管理</el-menu-item
        >
        <el-menu-item
          index="role"
          style="padding-left: 50px"
          class="menu-fontSize"
          >角色管理</el-menu-item
        >
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import menuData from "./menuData";
export default {
  name: "Menu",
  beforeMount() {
    this.menuData = menuData;
  },
  watch: {
    $route: {
      // eslint-disable-next-line no-unused-vars
      handler(val) {
        this.defaultActiveIndex = val.name;
      },
    },
  },
  mounted() {
    if (this.data) {
      this.loadMenu();
    }
    this.defaultActiveIndex = this.$route.name;
  },
  props: ["height", "data"],
  data() {
    return {
      defaultActiveIndex: "",
      menuData: [],
      menuList: [],
    };
  },
  methods: {
    handleOpen() {},
    handleClose() {},
    handleSelect(index) {
      this.$router.push({
        name: index,
        query: {
          companyId: this.$route.query.companyId,
          applicationId: this.$route.query.applicationId,
        },
      });
    },
    loadMenu() {
      let menuList = this.data;
      this.menuList = this.data;
      //如果子目录全部无权限访问，则父目录不显示
      menuData.map((item) => {
        if (item.children) {
          item.allow = item.children.length;
          item.children.map((item2) => {
            if (menuList.indexOf(item2.index) == -1) item.allow--;
          });
        } else {
          if (
            menuList.indexOf(item.index) == -1
              ? (item.allow = 0)
              : (item.allow = 1)
          );
        }
      });
    },
  },
};
</script>

<style scoped>
.el-menu {
  border-right: solid 0px #e6e6e6;
}
.menu-fontSize {
  font-size: 16px;
  padding-left: 10px;
}
.iconfont {
  color: #595959;
  font-size: 20px !important;
}
.iconfont:hover {
  color: #262626;
}
.menu-fontSize:active {
  color: #262626 !important;
}
.iconfont {
  color: #595959;
  font-size: 20px;
}
::v-deep .el-menu-item.is-active {
  color: #262626 !important;
  background-color: #e6f6f4;
}
::v-deep .el-submenu__title * {
  vertical-align: bottom;
}
::v-deep .el-menu-item * * {
  vertical-align: initial;
}
</style>
