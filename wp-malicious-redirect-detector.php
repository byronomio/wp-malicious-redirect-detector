<?php
/*
Plugin Name: WP Malicious Redirect Detector
Description: This plugin detects and blocks malicious scripts that attempt to redirect the website to unwanted URLs. Initially built to counteract specific malicious behavior originating from "https://sarcoma.space", the plugin now detects and blocks similar patterns to ensure the website remains safe.
Version: 1.0
Author: Byron Jacobs
Author URI: https://byronjacobs.co.za
*/

/**
 * Enqueues the malicious script detector JavaScript.
 */
function add_malicious_script_detector_js() {
    // Properly enqueue the script
    wp_enqueue_script('malicious-detector', plugin_dir_url(__FILE__) . 'malicious_detector.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'add_malicious_script_detector_js');

/**
 * Detects malicious scripts and logs them.
 */
function detect_malicious_script() {
    // Log to verify if the function is executed
    $log_file = ABSPATH . 'wp-content/malicious.txt';

    if (isset($_POST['maliciousScriptDetected']) && $_POST['maliciousScriptDetected'] === '1') {
        // Log the malicious script URL to a file
        if (isset($_POST['maliciousScriptURL'])) {
            file_put_contents($log_file, "Malicious script URL: " . $_POST['maliciousScriptURL'] . "\n", FILE_APPEND);
        }

        // Log to a file
        file_put_contents($log_file, "Malicious script detected on: " . date("Y-m-d H:i:s") . "\n", FILE_APPEND);
    }
}
add_action('init', 'detect_malicious_script');

