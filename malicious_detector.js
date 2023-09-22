// Helper function to detect malicious URLs
function isMaliciousUrl(url) {
    var pattern = /sarcoma\.space.*return=js\.client.*se_referrer.*default_keyword.*landing_url.*name.*host/;
    return pattern.test(url);
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

    // Intercept script element creation to block malicious sources
    var realCreateElement = document.createElement.bind(document);  // bind to document
    document.createElement = function (tagName) {
        var elem = realCreateElement(tagName);
        if (tagName === "script") {
            let actualSrc = null;
            let settingSrc = false;  // Flag to prevent recursion

            Object.defineProperty(elem, "src", {
                set: function (value) {
                    if (settingSrc) return;  // Exit if already setting src

                    settingSrc = true;  // Set flag
                    if (isMaliciousUrl(value)) {
                        blockedURLs.add(value);  // Add to blocked URLs list
                        console.error("Blocked malicious script:", value);
                    } else {
                        actualSrc = value;
                        elem.setAttribute("src", value);
                    }
                    settingSrc = false;  // Reset flag
                },
                get: function () {
                    return actualSrc;
                }
            });
        }
        return elem;
    };


    // Intercept AJAX requests to block malicious URLs
    (function (open) {
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            if (isMaliciousUrl(url)) {
                blockedURLs.add(url);  // Add to blocked URLs list
                console.error("Blocked malicious script:", url);
                return;
            }
            open.call(this, method, url, async, user, password);
        };
    })(XMLHttpRequest.prototype.open);

    // If a malicious script is detected, send an alert via AJAX
    if (blockedURLs.size > 0) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/wp-admin/admin-ajax.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("action=detect_malicious_script&maliciousScriptDetected=1&maliciousScriptURL=" + encodeURIComponent(Array.from(blockedURLs).join(", ")));
    }
});