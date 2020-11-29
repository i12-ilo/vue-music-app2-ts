<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import BScroll from "better-scroll";
import { onMounted, ref, defineComponent } from "vue";
export default defineComponent({
  props: {
    probeType: {
      type: Number,
      default: 1,
    },
    click: {
      type: Boolean,
      default: true,
    },
    listenScroll: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: null,
    },
    pullup: {
      type: Boolean,
      default: false,
    },
    beforeScroll: {
      type: Boolean,
      default: false,
    },
    refreshDelay: {
      type: Number,
      default: 20,
    },
  },

  setup(props:any, context:any) {
   let scrollWrap:any = null;
    const wrapper = ref<null|HTMLElement>(null);
    onMounted(() => {
      setTimeout(() => {
        _initScroll();
      }, 20);
    });

    const _initScroll = () => {
      if (!wrapper.value) {
        return;
      }
      scrollWrap = new BScroll(wrapper.value, {
        probeType: props.probeType,
        click: props.click,
      });
      console.log(scrollWrap,"scroll里的")
      
      if (props.listenScroll) {
          scrollWrap.on("scroll", (pos:any) => {
           context.emit("scroll", pos);
        });
      }

      if (props.pullup) {
        scrollWrap.on("scrollEnd", () => {
          console.log("dsfas")
          if (scrollWrap.y <= scrollWrap.maxScrollY + 50) {
            context.emit("scrolltoend");
          }
        });
      }

      if (props.beforeScroll) {
        scrollWrap.on("beforeScrollStart", () => {
          context.emit("beforescroll");
        });
      }
    };

    const disable = () => {
      scrollWrap && scrollWrap.disable();
    };
    const enable = () => {
    scrollWrap && scrollWrap.enable();
    };
    const refresh = () => {
      scrollWrap && scrollWrap.refresh();
    };
    const scrollTo = (args:any) => {
      scrollWrap &&
       scrollWrap.scrollto.apply(scrollWrap, ...args);
    };
    const scrollToElement = (args:any) => {
      scrollWrap &&
      scrollWrap.scrollToElement(...args);
    };
    return {
      wrapper,
      disable,
      enable,
      refresh,
      scrollTo,
      scrollToElement,
    };
  },
});
</script>

<style>
</style>