<template>
  <header class="page-header">
    <div class="header-container" flex="main:justify">
      <div class="left" style="width: 480px;" flex="main:justify cross:center">
        <div class="logo-org-tree">
          <h2>Bin-Tree-Org</h2>
        </div>
      </div>
      <div class="link">
        <a href="https://github.com/wangbin3162/bin-tree-org" class="github" target="_blank">GitHub</a>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'MainHeader'
  }
</script>

<style lang="scss">
  .page-header {
    background-color: #fff;
    box-shadow: 0 10px 60px 0 rgba(29, 29, 31, 0.07);
    opacity: 0.98;
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 80px;
    transition: all .3s;
    z-index: 100;
    .header-container {
      width: 100%;
      margin: 0 auto;
      height: 80px;
      .logo-org-tree h2 {
        color: #409EFF;
        font-weight: bold;
        font-size: 40px;
        padding: 10px 40px;
        border-bottom: none;
      }
      .link {
        padding: 0 20px;
        line-height: 80px;
        a {
          text-decoration: none;
          color: #1989fa;
          display: inline-block;
          line-height: 1.5;
          padding: 0 22px;
          font-size: 15px;
          &.github {
            color: #636363;
          }
        }
        .bin-dropdown {
          line-height: 1.5;
        }
      }
    }
  }
</style>
