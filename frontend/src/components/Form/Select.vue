<template>
<div class="field">
  <label class="label">{{ settings.label }}</label>
    <div class="control">
      <div class="select">
        <select :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :required="settings.required">
          <option value='' selected disabled hidden></option>
          <option v-for="option in settings.options" :value="option" v-bind:key="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'Form',
  props: [
    'modelValue',
    'settings'
  ],
  emits: [
    'update:modelValue'
  ]
}
</script>

<style scoped>
</style>