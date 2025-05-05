import {createWebHashHistory, createRouter} from 'vue-router'

const routes = [
    {path: '/', redirect: '/index'},
    {path: '/index', component: () => import('@/views/index/index.vue')},
    {path: '/calculate', component: () => import('@/views/calculate/calculate.vue')}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router