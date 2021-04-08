<template>
<div class="field">
  <label class="label">{{ settings.label }}</label>
  <div class="control">
    <textarea
      class="textarea"
      :placeholder="settings.label"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :required="settings.required"
    >
    </textarea>
  </div>
</div>
</template>

<script>
export default {
  name: 'TextArea',
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