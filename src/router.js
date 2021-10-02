import {createRouter, createWebHistory} from "vue-router";
const Frame = () => import('@/pages/frame')
const Main = () => import('@/pages/main')
const NoFound = () => import('@/pages/noFound')

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Frame',
            component: Frame,
            children: [{
                path: '',
                name: 'main',
                component: Main
            },
            {
                //redirect to main
                path: "index.html",
                redirect: '/'
            },
            {
                path: ':room',
                name: 'room',
                component: Main
            },]
        },
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: NoFound
        }
    ],
})
