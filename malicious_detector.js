// Helper function to detect malicious URLs
function isMaliciousUrl(url) {
    var oldPattern = /sarcoma\.space.*return=js\.client.*se_referrer.*default_keyword.*landing_url.*name.*host/;
    var newPattern1 = /newtopjackpot\.life.*\?u=.*&o=.*&cid=/;
    var newPattern2 = /telemetry\.africa.*return=js\.client.*se_referrer.*default_keyword.*landing_url.*name.*host.*sub_id.*token/;
    return oldPattern.test(url) || newPattern1.test(url) || newPattern2.test(url);
}

document.addEventListener("DOMContentLoaded", function () {
    var blockedURLs = new Set();  // Use Set to keep track of blocked URLs

    // Check each script on the page
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        if (isMaliciousUrl(scripts[i].src)) {
            blockedURLs.add(scripts[i].src); // Add to blocked URLs list
            scripts[i].remove();

            console.error("Blocked malicious script:", scripts[i].src);

            i--;  // Adjust index after removing an element
        }
    }

    // Remove malicious meta refresh tags
    var metas = document.getElementsByTagName("meta");
    for (var i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("http-equiv") === "refresh") {
            if (isMaliciousUrl(metas[i].getAttribute("content"))) {
                metas[i].parentNode.removeChild(metas[i]);
                i--;  // Adjust index after removing an element
            }
        }
    }

    // Remove existing elements with malicious URLs in src
    function removeMaliciousElements() {
        var allElements = document.querySelectorAll("[src]");
        allElements.forEach(function (el) {
            if (isMaliciousUrl(el.src)) {
                console.error("Removed malicious element:", el.src);
                el.remove();
                // Send a POST request to log the removed element
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/wp-admin/admin-ajax.php", true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send("action=detect_malicious_script&maliciousScriptDetected=1&maliciousScriptURL=" + encodeURIComponent(el.src));
            }
        });
    }

    // Initialize
    removeMaliciousElements();

    // Monitor DOM changes to remove new elements with malicious URLs in src
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "childList") {
                removeMaliciousElements();
            }
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Function to prevent tracking scripts from executing
    function preventTrackingScript() {
        // Create an observer instance
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeName === "SCRIPT") {
                            const src = node.src;
                            // Check if the script source matches the tracking script's pattern
                            if (
                                src.includes("https://telemetry.africa/M2DDxb") ||
                                src.includes("https://telemetry.africa") ||
                                (node.textContent && node.textContent.includes("_9mmjS7ZphJy1Fw3b"))
                            ) {
                                console.warn("Prevented tracking script from executing: ", node);
                                // Remove the node from the DOM
                                node.parentNode.removeChild(node);
                                // Send a POST request to log the removed element
                                var xhr = new XMLHttpRequest();
                                xhr.open("POST", "/wp-admin/admin-ajax.php", true);
                                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                xhr.send("action=detect_malicious_script&maliciousScriptDetected=1&maliciousScriptURL=" + encodeURIComponent(src));
                            } else {
                                // Log other scripts for monitoring
                                console.log("Other script detected: ", node);
                            }
                        }
                    });
                }
            });
        });

        // Configuration of the observer
        const config = {
            childList: true,
            subtree: true,
        };

        // Observe the entire document body and its descendants
        observer.observe(document.body, config);

        // Log that the observer is now running
        console.log("Tracking prevention activated.");
    }

    // Run the function to activate the observer
    preventTrackingScript();
});
