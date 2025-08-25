<script lang="ts">
  type Variant = 'default' | 'elevated' | 'outlined';
  type Padding = 'none' | 'sm' | 'md' | 'lg';

  let { 
    variant = 'default' as Variant, 
    padding = 'md' as Padding, 
    className = '', 
    children 
  } = $props();

  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl transition-all duration-200';
  
  const variantClasses = {
    default: 'border border-gray-200 dark:border-gray-700',
    elevated: 'shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700',
    outlined: 'border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
</script>

<div class="{baseClasses} {variantClasses[variant]} {paddingClasses[padding]} {className}">
  {@render children()}
</div>
