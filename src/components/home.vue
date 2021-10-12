<template>
  <div>
    home <el-button @click="quit">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',

  data() {
    return {
      
    };
  },

  mounted() {
    
  },

  methods: {
    quit(){
      window.sessionStorage.clear();
      this.$router.push('/login')
    }
  },
};
</script>

<style lang="less" scoped>

</style>