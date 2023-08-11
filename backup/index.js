// Developed by Fitr Media
// https://www.fitrmedia.com
// Copyright Fitr Media 2023-Current
// Last Updated 08/09/23

// Function to show the popup after the specified delay
function showPopupWithDelay(popupElement, delay) {
    setTimeout(function() {
        popupElement.style.display = "flex"; // Change "block" to "flex"
    }, delay * 1000);
}

// Function to show the popup on exit intent (if fitr-popr-exit-intent attribute is present)
function showPopupOnExitIntent(popupElement) {
    var exitIntentAttr = popupElement.getAttribute('fitr-popr-exit-intent');

    if (exitIntentAttr !== null) {
        document.addEventListener('mousemove', function(event) {
            var mouseX = event.clientX;
            var mouseY = event.clientY;
            var threshold = 100; // Increase the threshold value to 100 pixels

            if (mouseX <= threshold && mouseY <= threshold) {
                popupElement.style.display = "flex"; // Change "block" to "flex"
                document.removeEventListener('mousemove', this);
            }
        });
    }
}

// Function to show the popup on scroll trigger (if fitr-popr-scroll-trigger attribute is present)
function showPopupOnScrollTrigger(popupElement, triggerPercentage) {
    var scrollTriggerOffset = (triggerPercentage / 100) * (document.documentElement.scrollHeight - window.innerHeight);

    window.addEventListener('scroll', function() {
        var scrollPosition = window.scrollY || window.pageYOffset;
        if (scrollPosition >= scrollTriggerOffset) {
            popupElement.style.display = "flex"; // Change "block" to "flex"
            window.removeEventListener('scroll', this);
        }
    });
}

// Function to find and initialize the popups
function initializePopups() {
    var popups = document.querySelectorAll('[fitr-popr-popup]');
    popups.forEach(function(popup) {
        var delayAttr = popup.getAttribute('fitr-popr-delay');
        var scrollTriggerAttr = popup.getAttribute('fitr-popr-scroll-trigger');

        var delay = parseInt(delayAttr);
        var scrollTriggerPercentage = parseInt(scrollTriggerAttr);

        // Hide the popup by default
        popup.style.display = 'none';

        // Show the popup with a delay (if applicable)
        if (!isNaN(delay)) {
            showPopupWithDelay(popup, delay);
        }

        // Initialize exit intent (if applicable)
        if (popup.getAttribute('fitr-popr-exit-intent') !== null) {
            showPopupOnExitIntent(popup);
        }

        // Initialize scroll trigger (if applicable)
        if (!isNaN(scrollTriggerPercentage)) {
            showPopupOnScrollTrigger(popup, scrollTriggerPercentage);
        }

        // Close popup when elements with fitr-popr-close attribute are clicked
        var closeButton = popup.querySelector('[fitr-popr-close]');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                popup.style.display = 'none';
            });

            // Set cursor to pointer for the close button
            closeButton.style.cursor = 'pointer';
        }
    });
}

// Call the initializePopups function after the DOM has loaded
document.addEventListener('DOMContentLoaded', initializePopups);