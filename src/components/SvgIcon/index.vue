<template lang="">
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>
<script>
import { defineComponent, computed } from "vue";
export default defineComponent({
  name: "SvgIcon",
  props: {
    icon: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const svgClass = computed(() => {
      if (props.className) {
        return "svg-icon " + props.className;
      } else {
        return "svg-icon";
      }
    });
    const iconName = computed(() => {
      return `#icon-${props.icon}`;
    });
    return {
      svgClass,
      iconName,
    };
  },
});
</script>
<style lang="css">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
