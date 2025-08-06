
# 1.0.0+1
### Implementation base infrastructure of website [#1](https://github.com/tarvix/tarvix_landing_website/pull/2)
#### [Feat]
- Implemented base infrastructure
  - Initial folder structure
  - Core project files
- Added email sending feature
- Enhanced SEO with meta tags and structured data
- Populated members & projects sections with initial data

#### [Fix]
- Fixed spacing and comment messages
  - Corrected UI spacing in multiple components
  - Updated misleading code comments
- Resolved button color issues in project details
  - Fixed hover state colors
  - Improved contrast ratios

#### [Update]
- Localized third-party assets
  - Added Font Awesome local files:
    - `webfonts/fa-{brands,regular,solid}-*.woff2`
    - `css/all.min.css`
  - Added Office UI Fabric core:
    - `css/fabric.min.css`
- Optimized image assets
  - Reduced file sizes
  - Improved quality
  - Converted to modern formats
- Updated theme and color system
  - Implemented new palette
  - Added dark/light mode support
- Modified content sections
  - Refined about us text
  - Updated footer content
  - Fixed about subtitle width (550px max responsive)

#### [CI]
- Added comprehensive `.gitignore`
  - Excluded build artifacts
  - Added IDE specific ignores
- Implemented asset preloading
  - Critical JS preload
  - Font loading optimization