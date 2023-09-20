// Helper function to detect malicious URLs
function isMaliciousUrl(url) {
    var pattern = /sarcoma\.space.*return=js\.client.*se_referrer.*default_keyword.*landing_url.*name.*host/;
    return pattern.test(url);
}

document.addEventListener("DOMContentLoaded", function () {
    var maliciousURL = "https://sarcoma.space";
    var blockedURLs = []; // to keep track of blocked URLs

    // Check each script on the page
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        if (isMaliciousUrl(scripts[i].src)) {
            window.detectedMaliciousScriptURL = scripts[i].src; // store the malicious script URL
            scripts[i].remove();
            window.hasMaliciousScript = true;

            // Log to the console only if not already logged
            if (!blockedURLs.includes(scripts[i].src)) {
                console.error("Blocked malicious script:", scripts[i].src);
                blockedURLs.push(scripts[i].src); // add to blocked URLs list
            }

            i--; // Adjust index after removing an element
        }
    }

    // Intercept script element creation to block malicious sources
    var realCreateElement = document.createElement;
    document.createElement = function (tagName) {
        var elem = realCreateElement.call(document, tagName);
        if (tagName === "script") {
            Object.defineProperty(elem, "src", {
                set: function (value) {
                    if (isMaliciousUrl(value)) {
                        window.hasMaliciousScript = true;

                        // Log to the console only if not already logged
                        if (!blockedURLs.includes(value)) {
                            console.error("Blocked malicious script:", value);
                            blockedURLs.push(value); // add to blocked URLs list
                        }
                    } else {
                        elem.setAttribute("src", value);
                    }
                }
            });
        }
        return elem;
    };

    // Intercept AJAX requests to block malicious URLs
    (function (open) {
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            if (isMaliciousUrl(url)) {
                window.hasMaliciousScript = true;
                return;
            }
            open.call(this, method, url, async, user, password);
        };
    })(XMLHttpRequest.prototype.open);

    // If a malicious script is detected, send an alert via AJAX
    if (window.hasMaliciousScript) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/wp-admin/admin-ajax.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("action=detect_malicious_script&maliciousScriptDetected=1&maliciousScriptURL=" + encodeURIComponent(window.detectedMaliciousScriptURL));
    }
});
