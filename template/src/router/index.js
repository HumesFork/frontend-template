import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);

// eslint-disable-next-line no-unused-vars
let url = "";
//isControl属性代表该页面是否做权限控制,所有权限在app.vue里进行控制
const routes = [
  {
    path: "/",
    name: "main",
    meta: {
      loading: true,
      title: "朴厚",
    },
  },
  {
    path: "/overview/index",
    name: "overview",
    meta: {
      title: "总览",
      full: true,
      isControl: false,
    },
    component: () => import("@/pages/overview/index"),
  },
  {
    path: "/error/noAuthority",
    name: "noAuthority",
    meta: {
      title: "无权限页面",
      full: true,
    },
    component: () => import("@/pages/error/no_authority"),
  },
];
const router = new VueRouter({
  routes,
});

export default router;
