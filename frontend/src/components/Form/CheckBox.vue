<template>
<div class="field">
  <label class="checkbox">
    <input
      type="checkbox"
      :value="settings.label"
      @input="$emit('update:modelValue', $event.target.checked)"
      :checked="modelValue || false"
      :required="settings.required"
    />
    {{ settings.label }}
    </label>
</div>
</template>

<script>
export default {
  name: 'CheckBox',
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