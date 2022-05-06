<template>
  <el-card class="box-card" style="height: 60px;">
    <Sidebar :show="show" @close="handleClose"> </Sidebar>
    <div style="width:98%">
      <el-link
        icon="el-icon-menu"
        style="font-size:30px;color:#00A292;margin-top: -5px;"
        :underline="false"
        @click="changeShow"
      >
      </el-link>
      <el-avatar
        size="small"
        :src="headurl"
        @error="errorHandler"
        style="position: absolute;margin-left:10px;margin-top:-5px"
      >
        <i class="iconfont iconjiazaishibai" />
      </el-avatar>
      <span
        style="font-size:18px;font-weight:bold;color:#262626;margin-left:45px;position: absolute;margin-top:-2.5px;"
        >{{ name }}
        <span style="margin-left:10px;font-size:17px;">|</span>
        <span style="margin-left:10px;">{{ title }}</span></span
      >
      <span
        style="font-size:14px;color:#595959;margin-top:3px;right: 60px;position: absolute;"
      >
        {{ userInfo.username }}
      </span>
    </div>

    <el-dropdown
      style="float:right;margin-top: -30px;margin-right: 10px;"
      @command="handleCommand"
    >
      <el-avatar
        size="small"
        @error="errorHandler"
        :src="circleUrl"
        fit="cover"
        style="margin-top:1px;margin-right:-10px;width:30px;height:30px"
      >
        <i class="iconfont iconjiazaishibai" style="font-size:16px;" />
      </el-avatar>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="userInfo">用户信息</el-dropdown-item>
        <el-dropdown-item command="changeCompany">切换单位</el-dropdown-item>
        <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-card>
</template>
<script>
import Sidebar from "puhoucorejs/src/core/comp/sidebar";
// import Sidebar from "./sidebar";
import userInfo from "../dialog/userInfo";
import showComp from "puhoucorejs/src/core/fun/show-comp";
import changePassword from "../dialog/changePassword";
import JSEncrypt from "jsencrypt";
import changeUrls from "puhoucorejs/src/core/fun/changeUrl"; // 阿里云资源添加签名
export default {
  name: "Header",
  components: {
    Sidebar
  },
  watch: {
    $route: {
      // eslint-disable-next-line no-unused-vars
      handler(val, old) {
        if (val.meta.search) {
          this.searchShow = true;
        } else {
          this.searchShow = false;
        }
      }
    }
  },
  created() {
    this.applicationId = this.$route.query.applicationId;
    this.companyId = this.$route.query.companyId;
    this.getUserInfo();
    this.getcompanyInfo(this.companyId);
  },
  mounted() {
    this.dev = process.env.NODE_ENV;
    this.title = document.title;
    if (this.$route.meta.search) {
      this.searchShow = true;
    } else {
      this.searchShow = false;
    }

    let that = this;
    this.$bus.$on("getcompanyInfo", () => {
      this.getcompanyInfo(that.companyId);
    });
  },

  data() {
    return {
      searchShow: false,
      show: false,
      name: "",
      dev: "",
      companyId: "",
      applicationId: "",
      headurl: "",
      input: "",
      userInfo: "",
      title: "",
      circleUrl: ""
    };
  },
  methods: {
    getUserInfo() {
      // 获取角色
      this.$reqGet(`/company-svc/v2/company-user-simple-infos`).then(res => {
        if (res.code === 200) {
          if (_.includes(res.data.photoUrl, "oss")) {
            this.circleUrl = changeUrls(res.data.photoUrl);
          } else {
            this.circleUrl = res.data.photoUrl;
          }
          let userInfo = {
            email: res.data.email,
            id: res.data.id,
            userId: res.data.userId,
            phoneNumber: res.data.mobilePhone,
            photoUrl: res.data.photoUrl,
            username: res.data.username
          };
          this.userInfo = userInfo;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        } else {
          this.$message.error(res.message);
        }
      });
    },
    /**
     *  密码加密
     */
    md2Pwd(pwd) {
      let jes = new JSEncrypt();
      jes.setPublicKey(this.pulickKey);
      pwd = jes.encrypt(pwd);
      return pwd;
    },
    getcompanyInfo(val) {
      this.$reqGet(`/company-svc/v2/companies/${val}`).then(res => {
        if (res.code === 200) {
          this.name = res.data.companyName;
          if (_.includes(res.data.companyHeadUrl, "oss")) {
            this.headurl = changeUrls(res.data.companyHeadUrl);
          } else {
            this.headurl = res.data.companyHeadUrl;
          }
          localStorage.setItem("companyInfo", JSON.stringify(res.data));
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleCommand(command) {
      if (command === "logout") {
        this.$reqDel("/company-svc/v2/sessions").then(res => {
          if (res.code === 200) {
            if (this.dev === "dev") {
              window.location.href = `http://10.1.52.185:8088/#/company-svc/login`;
            } else if (this.dev === "test") {
              window.location.href = `http://puhouddns.imwork.net:33111/platform-company/#/company-svc/login`;
            } else {
              window.location.href = `https://ph.ipuhou.com/platform-company/#/company-svc/login`;
            }
            localStorage.clear();
          } else {
            this.$message.error(res.message);
          }
        });
      } else if (command === "changeCompany") {
        if (this.dev === "dev") {
          window.location.href = `http://10.1.52.185:8088/#/company-svc/company/changeCompany?companyId=${this.companyId}&applicationId=${this.applicationId}`;
        } else if (this.dev === "test") {
          window.location.href = `http://puhouddns.imwork.net:33111/platform-company/#/company-svc/company/changeCompany?companyId=${this.companyId}&applicationId=${this.applicationId}`;
        } else if (this.dev === "prod") {
          window.location.href = `https://ph.ipuhou.com/platform-company/#/company-svc/company/changeCompany?companyId=${this.companyId}&applicationId=${this.applicationId}`;
        }
      } else if (command === "userInfo") {
        showComp(userInfo, {
          attrs: {
            max: 100,
            row: this.userInfo,
            beforeConfirm: dialog => {
              this.$reqPut(
                `/company-svc/v2/company-users/${dialog.ruleForm.id}`,
                {
                  username: dialog.ruleForm.username,
                  email: dialog.ruleForm.email,
                  headUrl: dialog.ruleForm.photoUrl
                }
              )
                .then(res => {
                  if (res.code === 200) {
                    dialog.close();
                    let userInfo = {
                      phoneNumber: dialog.ruleForm.phoneNumber,
                      username: dialog.ruleForm.username,
                      email: dialog.ruleForm.email,
                      photoUrl: dialog.ruleForm.photoUrl
                    };
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                    this.userInfo = userInfo;
                    if (_.includes(this.userInfo.photoUrl, "oss")) {
                      this.circleUrl = changeUrls(this.userInfo.photoUrl);
                    } else {
                      this.circleUrl = this.userInfo.photoUrl;
                    }
                    this.$message.success(this.$messages._success);
                  } else {
                    this.$message.error(res.message);
                  }
                  [];
                })
                .finally(() => {
                  dialog.hideLoading();
                });
            }
          }
        });
      } else if (command === "changePassword") {
        let that = this;
        showComp(changePassword, {
          attrs: {
            max: 100,
            row: this.userInfo,
            beforeConfirm: dialog => {
              if (dialog.flag === false) {
                return;
              }
              // 获取密码密匙
              that.$reqPost("/company-svc/v2/key-pairs").then(res => {
                if (res.code === 200) {
                  that.pulickKey = res.data.pubKeyBase64;
                  that.changePassword(dialog);
                } else {
                  that.$message.error(res.message);
                }
              });
            }
          }
        });
      }
    },
    changePassword(dialog) {
      this.$reqPut(
        `/company-svc/v2/system-users/${this.userInfo.id}/password-change-tasks`,
        {
          oldPassword: this.md2Pwd(dialog.ruleForm.oldpasswordHash),
          newPassword: this.md2Pwd(dialog.ruleForm.passwordHash),
          pubKeyBase64: this.pulickKey
        }
      )
        .then(res => {
          if (res.code === 200) {
            dialog.close();
            this.$message.success(this.$messages._success);
          } else {
            this.$message.error(res.message);
          }
          [];
        })
        .finally(() => {
          dialog.hideLoading();
        });
    },
    errorHandler() {
      return true;
    },
    changeShow() {
      this.show = true;
    },
    handleClose(data) {
      this.show = data;
    },
    getSearch() {
      this.$emit("search", this.input);
    },
    toStatistics() {
      this.$router.push({
        name: "company-svc_statistics",
        query: {
          companyId: this.$route.query.companyId,
          applicationId: this.$route.query.applicationId
        }
      });
    }
  }
};
</script>
<style scoped>
.el-input--prefix .el-input__inner {
  border-radius: 15px;
}
.el-drawer__header > :first-child {
  outline: none;
  font-size: 16px;
}
.el-drawer__open .el-drawer.ltr {
  outline: none;
}
</style>
