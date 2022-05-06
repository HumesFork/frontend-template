//根据权限控制页面元素
export default function() {
  Vue.directive("authority", {
    bind: function(el, binding) {
      console.log("绑定到自定义指令", binding.value);
      console.log(el.nodeName);
      if (!binding.value) {
        el.style.color = "#bbb";
        el.style.pointerEvents = "none";
        if (el.nodeName == "BUTTON") {
          el.style.backgroundColor = "#c8c8c8";
          el.style.borderColor = "#c8c8c8";
          el.style.color = "#fff";
        }
      }
    },
  });
}
