<template>
<div class="field">
  <o-field :label=settings.label>
    <o-datetimepicker
      placeholder="Click to select..."  
      icon="calendar" 
      v-model="datetime"
      :required="settings.required"
      @blur="$emit('update:modelValue', datetime)"
      >
    </o-datetimepicker>
  </o-field>
</div>
</template>

<script>
export default {
  name: 'DateTimePicker',
  props: [
    'modelValue',
    'settings',
  ],
  emits: [
    'update:modelValue'
  ],
  data() {
    return {
      datetime: undefined
    };
  }
}
</script>

<style scoped>

</style>