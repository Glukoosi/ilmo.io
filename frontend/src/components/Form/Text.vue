<template>
<div class="field">
  <label class="label">{{ settings.label }}</label>
  <div class="control">
    <input
      class="input"
      type="text"
      :placeholder="settings.label"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :required="settings.required"
    />
  </div>
</div>
</template>

<script>
export default {
  name: 'Text',
  props: [
    'modelValue',
    'settings',
  ],
  emits: [
    'update:modelValue'
  ]
}
</script>

<style scoped>

</style>