# Changelog

All notable changes to the WP Malicious Redirect Detector plugin will be documented in this file.

## [1.1] - 2023-10-19
### Added
- Updated Malicious URL Patterns: Added new patterns to `isMaliciousUrl` function for detecting new types of malicious URLs.
- Meta Tag Checking: Added functionality to scan and remove malicious `<meta>` tags that have a "refresh" attribute.
- Enhanced Element Removal: Added a `removeMaliciousElements` function that scans all elements with a `src` attribute to identify and remove malicious elements from the DOM.
- DOM Observer for Elements: Implemented a MutationObserver that detects changes in the DOM and automatically removes newly added malicious elements.
- Tracking Script Prevention: Added a `preventTrackingScript` function that uses a MutationObserver to detect and remove tracking scripts based on certain patterns.
- Ajax Logging for Removed Elements: Whenever a malicious element is removed, an AJAX POST request is sent to log this action.

## [1.0] - 2023-09-15
### Added
- Initial release with basic malicious script detection and blocking features.
