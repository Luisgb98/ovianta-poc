# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- Replaced all primitive `<button>` elements with the design-system `Button` component from `components/atoms/button`.
- Extended the atoms `Button` wrapper with `tab` and `menu` variants (selected state via `aria-pressed`) without modifying shadcn `components/ui/button`.
- Removed unused legacy button CSS (`.link-btn`, `.tab`, `.lang-opt`, `.btn`) and slimmed `.sidebar-toggle` to layout/visibility only.
- Refined `StatusBadge` visuals: blue active, green completed, amber pending, red cancelled; distinct hues and improved pending contrast.
