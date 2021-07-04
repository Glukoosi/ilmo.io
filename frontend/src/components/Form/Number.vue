<template>
<div class="field">
  <label class="label">{{ settings.label }}</label>
  <div class="control">
    <input
      class="input"
      type="number"
      v-model.number="value"
      :placeholder="settings.label"
      @input="$emit('update:modelValue', value)"
      :required="settings.required"
    />
  </div>
</div>
</template>

<script>
export default {
  name: 'Number',
  props: [
    'modelValue',
    'settings',
  ],
  emits: [
    'update:modelValue'
  ],
  data() {
    return {
      value: undefined
    };
  }
}
</script>

<style scoped>

</style>