const words = document.querySelectorAll('.screenBasic-word');

// Convert NodeList to Array and map each element's text content
let combinedText = Array.from(words)
    .map(el => el.textContent.trim()) // Get text content and trim spaces/newlines
    .join(' '); // Combine words without any spaces

// Function to copy text to clipboard
function copyToClipboard(text) {
    const tempTextarea = document.createElement('textarea'); // Create a temporary textarea element
    tempTextarea.value = text; // Set its value to the text to copy
    document.body.appendChild(tempTextarea); // Append it to the body (required for copying)
    tempTextarea.select(); // Select the text
    document.execCommand('copy'); // Copy the text to clipboard
    document.body.removeChild(tempTextarea); // Remove the temporary textarea
}

// Call the function to copy the combined text to clipboard
copyToClipboard(combinedText);

console.log('Text copied to clipboard:', combinedText);