<template>
  <header class="page-header">
    <row class="header-container" type="flex" justify="space-between">
      <i-col span="10" class="logo-org-tree">
        <h2>Zm-Tree-Org</h2>
      </i-col>
      <i-col span="6" class="link">
        <a href="https://gitee.com/sangtian152/zm-tree-org" class="github" target="_blank">Gitee</a>
      </i-col>
    </row>
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
        text-align: right;
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
      }
    }
  }
</style>
