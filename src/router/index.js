import { createRouter, createWebHistory } from "vue-router"

const routes=[   //创建路由规则
{
    path:"/",
    component: () => import("../views/index.vue")
}
,
{
    path:"/content",
    component: () => import("../views/content.vue")

}
]
//创建路由器
const router=createRouter({
history:createWebHistory(),
routes
})

//将路由器导出
export default router  //然后去main.js里面导入