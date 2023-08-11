// Developed by Fitr Media
// https://www.fitrmedia.com
// Copyright Fitr Media 2023-Current
// Last Updated 08/09/23

// Function to show the popup after the specified delay
function showPopupWithDelay(popupElement, delay) {
    setTimeout(function() {
        popupElement.style.display = "flex"; // Change "block" to "flex"
        sessionStorage.setItem('popup-opened', 1);
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
                sessionStorage.setItem('popup-opened', 1);
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
            sessionStorage.setItem('popup-opened', 1);
            window.removeEventListener('scroll', this);
        }
    });
}

// Function to find and initialize the popups
function initializePopups() {
        var popups = document.querySelectorAll('[fitr-popr-popup]');
        
        popups.forEach(function(popup) {
            // Hide the popup by default
            popup.style.display = 'none';

            // Get Last Closed Time (milliseconds)
            const lastClosedAt = parseFloat(localStorage.getItem("fitr-popr-closed-at"));

            // Determine to show or hide popup (hours)
            const hideDuration = parseFloat(localStorage.getItem("fitr-popr-cookie-duration"));

            // Show/Hide popup in same session (if applicable)
            if (popup.getAttribute('fitr-popr-same-session') !== 'true' && sessionStorage.getItem("popup-opened") == '1') {
                console.log(popup.getAttribute('fitr-popr-same-session'))
                lastClosedAt == 0;
                hideDuration == 0;
            }

            if (lastClosedAt + hideDuration * 3600 * 1000 < (new Date()).getTime()){
                
                // console.log("Duration passed.")
                var delayAttr = popup.getAttribute('fitr-popr-delay');
                var scrollTriggerAttr = popup.getAttribute('fitr-popr-scroll-trigger');

                var delay = parseInt(delayAttr);
                var scrollTriggerPercentage = parseInt(scrollTriggerAttr);

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

                        // Store closed time (milliseconds) in localStorage. Example: 1691744992147 
                        const d = new Date();
                        const currentTime = d.getTime();
                        localStorage.setItem("fitr-popr-closed-at", currentTime);

                        // Store duration to hide (Hours)
                        localStorage.setItem("fitr-popr-cookie-duration", popup.getAttribute("fitr-popr-cookie-duration"));

                    });

                    // Set cursor to pointer for the close button
                    closeButton.style.cursor = 'pointer';
                }
            }
        });
    
}

// Call the initializePopups function after the DOM has loaded
document.addEventListener('DOMContentLoaded', initializePopups);