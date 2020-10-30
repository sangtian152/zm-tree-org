<template>
    <div id="app" ref="scrollBox">
        <main-header></main-header>
        <div class="main-cnt">
          <side-nav class="nav"></side-nav>
          <div class="page-container">
            <router-view></router-view>
          </div>
        </div>
        <main-footer></main-footer>
        <back-top>
          <Icon type="md-arrow-dropup" />
        </back-top>
    </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        showBackToTop: false,
        componentScrollBar: null
      }
    }
  }
</script>

<style lang="scss">
    #app {
      width: 100%;
      min-height: 100vh;
    }
    .main-cnt {
      padding-top: 80px;
      width: $app-main-width;
      height: 100%;
      margin: 0 auto;
      .page-container {
        box-sizing: border-box;
        margin-left: 270px;
        background: #fff;
      }
    }
    .ivu-back-top {
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #eee;
      box-shadow: 0 0px 8px 0px rgba(0,0,0,.1);
      .ivu-back-top-inner {
        background: none;
        border-radius: 0;
        box-shadow: none;
        border: none;
      }
      i.ivu-icon{
        color: #2d8cf0;
        font-size: 24px;
        padding: 10px;
        background: #fff;
        border-radius: 50%;
        padding: 10px;
      }
    }
</style>
