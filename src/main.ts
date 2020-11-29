import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'common/stylus/index.styl'
import FastClick from 'fastclick'
import 'swiper/css/swiper.min.css'
FastClick.attach(document.body)
const app = createApp(App);
app.use(store)
app.use(router)
app.directive("lazy",{
    beforeMount(el,binding){
        let lazyLoadObser = new IntersectionObserver((entries,observer)=>{
            entries.forEach((entry,index:number)=>{
                let lazyImage =  entry.target
                if (entry.intersectionRatio>0){
                    (lazyImage as any).src = binding.value
                    lazyLoadObser.unobserve(lazyImage)
                }
            })
        })
        lazyLoadObser.observe(el)
    }   
})
app.mount("#app")

