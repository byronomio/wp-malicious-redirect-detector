# WP Malicious Redirect Detector

This WordPress plugin detects and blocks malicious scripts that attempt to redirect the website to unwanted URLs. Initially designed to counteract specific malicious behavior from "https://sarcoma.space" and "https://telemetry.africa", it now detects and blocks similar patterns to ensure the website remains safe.

## Features

- Detects and blocks malicious script URLs.
- Logs detected malicious URLs for future reference.
- Efficient pattern recognition to detect variations of malicious URLs.
- Scans and removes malicious `<meta>` tags with a "refresh" attribute.
- Monitors DOM for newly added malicious elements and removes them in real-time.
- Includes tracking script prevention based on certain patterns.

## Installation

1. Clone the repository or download the ZIP file.
2. Upload the `wp-malicious-redirect-detector` folder to the `/wp-content/plugins/` directory of your WordPress installation.
3. Activate the plugin through the 'Plugins' menu in WordPress.

## Usage

Once activated, the plugin will automatically scan for and block recognized malicious scripts. Detected URLs will be logged in a file (`malicious.txt`) within the `wp-content` directory.

## Changelog

For details on updates and changes, please refer to the [CHANGELOG.md](CHANGELOG.md) file.

## Author

Byron Jacobs  
[Website](https://byronjacobs.co.za)
