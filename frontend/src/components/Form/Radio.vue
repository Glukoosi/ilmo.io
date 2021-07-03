<template>
<div class="field">
  <label class="label">{{ settings.label }}</label>
    <div class="control" id="v-model-radiobutton">
      <label v-for="option in settings.options" :value="option" v-bind:key="option" class="radio">
        <input
          type="radio" 
          :name="settings.label" 
          :value="option" 
          @input="$emit('update:modelValue', $event.target.value)"
          :required="settings.required" 
          :checked="modelValue === option"
        >
        {{ option }}
      </label>
    </div>
</div>
</template>

<script>
export default {
  name: 'Radio',
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