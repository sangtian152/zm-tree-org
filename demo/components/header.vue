<template>
  <header class="page-header">
    <row class="header-container" type="flex" justify="space-between">
      <i-col span="10" class="logo-org-tree">
        <h2>zm-tree-org</h2>
      </i-col>
      <i-col span="6" class="link">
        <a href="https://gitee.com/sangtian152/zm-tree-org" class="gitee" target="_blank">Gitee</a>
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
    opacity: 0.98;
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 80px;
    z-index: 100;
    .header-container {
      width: $app-main-width;
      margin: 0 auto;
      height: 80px;
      line-height: 80px;
      border-bottom: 1px solid #dcdfe6;
      .logo-org-tree h2 {
        color: #409EFF;
        font-weight: bold;
        font-size: 30px;
      }
      .link {
        line-height: 80px;
        text-align: right;
        a {
          text-decoration: none;
          color: #1989fa;
          font-size: 15px;
          &.gitee {
            color: #636363;
          }
        }
      }
    }
  }
</style>
