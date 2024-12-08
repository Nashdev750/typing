document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown-container');
    
    dropdowns.forEach(dropdown => {
      const toggleButton = dropdown.querySelector('.dropdown-toggle');
      const dropdownMenu = dropdown.querySelector('.dropdown-menu');
      const options = dropdown.querySelectorAll('.dropdown-option');
      
      // Toggle dropdown
      toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
      });
      
      // Handle option selection
      options.forEach(option => {
        option.addEventListener('click', (e) => {
          const value = option.dataset.value;
          const valueSpan = dropdown.querySelector('.dropdown-value');
          valueSpan.textContent = value;
          dropdownMenu.classList.add('hidden');
          
          // Trigger change event
          const changeEvent = new CustomEvent('dropdown-change', { 
            detail: { value: value }
          });
          dropdown.dispatchEvent(changeEvent);
        });
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.querySelector('.dropdown-menu').classList.add('hidden');
        }
      });
    });
  });