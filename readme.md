# WP Malicious Redirect Detector

This WordPress plugin detects and blocks malicious scripts that attempt to redirect the website to unwanted URLs. Initially designed to counteract specific malicious behavior from "https://sarcoma.space", it now detects and blocks similar patterns to ensure the website remains safe.

## Features

- Detects and blocks malicious script URLs.
- Logs detected malicious URLs for future reference.
- Efficient pattern recognition to detect variations of malicious URLs.

## Installation

1. Clone the repository or download the ZIP file.
2. Upload the `wp-malicious-redirect-detector` folder to the `/wp-content/plugins/` directory of your WordPress installation.
3. Activate the plugin through the 'Plugins' menu in WordPress.

## Usage

Once activated, the plugin will automatically scan for and block recognized malicious scripts. Detected URLs will be logged in a file (`malicious.txt`) within the `wp-content` directory.

## Author

Byron Jacobs  
[Website](https://byronjacobs.co.za)
