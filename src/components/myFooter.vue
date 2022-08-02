<!--页脚部分-->
<template>
  <footer id="footer">
    <ul>
      <li><span>感谢使用！开发者：王子平，董林林</span></li>
    </ul>
  </footer>
</template>

<script>
export default {
  name: "myFooter"
}
</script>

<style scoped>
#footer span {
  color: #000000;
  font-size: 15px;
}
#footer {
  margin-bottom: 10px;
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 0px;
  width: 100%;
  background-color: #eee;
  opacity: 0.8;
}
#footer ul {
  border-top: 1px solid #d5d5d5;
  display: flex;
  justify-content: center;
  height: 50px;
  line-height: 50px;
}
#footer ul li {
  color: #919698;
  font-size: 14px;
  margin-right: 20px;
}
</style>
