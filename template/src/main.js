import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "puhoucorejs/src/core/assets/style/common.css";
import "puhoucorejs/src/core/iconfont/iconfont.css";
import "puhoucorejs/src/core/iconfont/iconfont.js";
//import "@/assets/iconfontStyle/iconfont.css";
//import "@/assets/iconfontStyle/iconfont.js";
import "@/assets/theme/index.css";
import ElementUI from "element-ui";
import network from "puhoucorejs/src/core/axios/install";
//import network from "@/core/axios/install";
import { Promised } from "vue-promised";
import { message } from "puhoucorejs/src/core/message";
import { Notification } from "element-ui";
import initDirectives from "./directive/index";
import global from "./utils/global";

Vue.use(network, {
  headers: {
    "Content-Type": "application/json",
  },
});
Vue.use(ElementUI);
Vue.prototype.$messages = message;
Vue.prototype.$windowHeight = document.documentElement.clientHeight;
Vue.component("Promised", Promised);
Vue.prototype.$notify = Notification;
Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue(); // $bus
//注入一些全局变量以供使用
Vue.prototype.GLOBAL = global;

//初始化自定义指令
initDirectives();

export default window._isLowBrowser
  ? {}
  : new Vue({
      watch: {
        $route(val) {
          if (val.name == "company-svc_login") {
            _.each(this.CancelTokens, (cancel) => {
              cancel("CBU");
            });
            this.CancelTokens = [];
          }
        },
      },

      beforeCreate() {
        this.STORE = {
          reportMap: {},
        };
        this.CancelTokens = [];
      },
      methods: {
        reset() {
          this.STORE = {};
          this.AUTH = {};
          this.USER = {};
          this.ROLES = [];
          this.MENUS = [];
          this.CancelTokens = [];
        },
        /**
         *  获取组织树
         */
        getAllOrgTree(force) {
          if (this.STORE.AllOrgUserList && !force)
            return Promise.resolve(this.STORE.AllOrgUserList);
          return (this.STORE.AllOrgUserList = this.$reqGet(
            `/company-svc/v2/departments`
          ).then((res) => {
            return (this.STORE.AllOrgUserList = res.data);
          }));
        },
        /**
         *  获取角色
         */
        getAllRole(force) {
          if (this.STORE.AllRoleList && !force)
            return Promise.resolve(this.STORE.AllRoleList);
          return (this.STORE.AllRoleList = this.$reqGet(
            `/company-svc/v2/application-roles`
          ).then((res) => {
            return (this.STORE.AllRoleList = res.data);
          }));
        },
        /**
         *  获取用户基本信息
         */
        getNowUserInfo() {
          if (this.STORE.UserInfo) return Promise.resolve(this.STORE.UserInfo);
          return (this.STORE.UserInfo = this.$reqGet(
            "/company-svc/v2/company-user-simple-infos"
          ).then((res) => {
            return (this.STORE.UserInfo = res.data);
          }));
        },
        /**
         *  获取用户基本信息
         */
        getcompanyInfo(force) {
          if (this.STORE.CompanyInfo && !force)
            return Promise.resolve(this.STORE.CompanyInfo);
          return (this.STORE.CompanyInfo = this.$reqGet(
            `/company-svc/v2/companies/${force}`
          ).then((res) => {
            return (this.STORE.CompanyInfo = res.data);
          }));
        },
        /**
         *  获取最简单位用户信息
         */
        getMinimalUserInfo(force) {
          if (this.STORE.MinimalUserInfo && !force)
            return Promise.resolve(this.STORE.MinimalUserInfo);
          return (this.STORE.MinimalUserInfo = this.$reqGet(
            `/company-svc/v2/companies/${force}/minimal-company-user-infos`
          ).then((res) => {
            return (this.STORE.MinimalUserInfo = res.data);
          }));
        },
        /**
         *  获取最简单位用户信息
         */
        getMinimalApplicationUserInfo(force) {
          if (this.STORE.MinimalApplicationUserInfo && !force)
            return Promise.resolve(this.STORE.MinimalApplicationUserInfo);
          return (this.STORE.MinimalApplicationUserInfo = this.$reqGet(
            `/company-svc/v2/companies/${force.companyId}/applications/${force.applicationId}/minimal-application-user-infos`
          ).then((res) => {
            return (this.STORE.MinimalApplicationUserInfo = res.data);
          }));
        },
      },
      router,
      render: (h) => h(App),
    }).$mount("#app");

console.log(`App v${process.env.VUE_APP_VERSION} is running`);
