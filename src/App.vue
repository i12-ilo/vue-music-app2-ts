<template>
  <div id="nav">
   <m-header></m-header>
   <tab></tab>
  </div>
  <keep-alive>
  <router-view />
  </keep-alive>
  <Player></Player>
</template>
<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  components: {
    'm-header':MHeader,
    Tab,
    Player
  }
}
</script>


