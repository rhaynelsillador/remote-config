<script lang="ts">
  type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'destructive';
  type Size = 'sm' | 'md' | 'lg';

  let { 
    variant = 'primary' as Variant,
    size = 'md' as Size,
    disabled = false,
    loading = false,
    href = '',
    onclick = undefined,
    type = 'button',
    className = '',
    children
  } = $props();

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-4';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800',
    destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-300 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-800',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 focus:ring-gray-300 dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-600 dark:focus:ring-gray-800'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';
</script>

{#if href}
  <a 
    {href}
    class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {disabled ? disabledClasses : ''} {className}"
    class:pointer-events-none={disabled}
  >
    {#if loading}
      <svg class="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
        <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {/if}
    {@render children()}
  </a>
{:else}
  <button
    {type}
    {disabled}
    {onclick}
    class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {disabled ? disabledClasses : ''} {className}"
  >
    {#if loading}
      <svg class="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
        <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {/if}
    {@render children()}
  </button>
{/if}
