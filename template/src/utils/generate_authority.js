/* arr是resourceList,obj是自定义的权限配置方案，这边的权限是叠加的，并且和arr传入的数组顺序无关，例如: 
 arr=[ "xx_add","xx_delete"] 
 let obj = {
  "xx_add": {
    add: true,
    delete: false,
    edit: false,
    share: false,
  },
  "xx_delete": {
    add: false,
    delete: true,
    edit: false,
    share: false,
  },
  "xx_use": {
    add: false,
    delete: false,
    edit: false,
    share: false,
  },
  "xx_manage": {
    add: true,
    delete: true,
    edit: true,
    share: true,
  },
}; 
那么最终权限数据为
{
    add:true,
    delete:true,
    edit:false,
    share:false
} 
*/
export default class Authority {
  constructor(obj, arr) {
    let authority = {};
    arr.forEach((item) => {
      for (let pro in obj[item]) {
        if (authority[pro]) continue;
        authority[pro] = obj[item][pro];
      }
    });
    return authority;
  }
}
