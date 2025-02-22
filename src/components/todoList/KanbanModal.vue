<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-4 border-b">
        <slot name="header"></slot>
      </div>
      
      <div class="p-4">
        <slot></slot>
      </div>
      
      <div class="p-4 border-t">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskModal'
}
</script>