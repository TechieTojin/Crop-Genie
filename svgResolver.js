/**
 * Custom resolver for SVG-related modules
 */

// Mock implementation of unified-client.js functions
const resolveAssetUri = (href) => href;
const transformToUniqueIds = (id) => id ? `svg-${id}` : id;
const createSVGElement = (tag) => ({ tag });
const extractViewBox = (props) => props.viewBox || '0 0 100 100';
const transformStyle = (style) => style;

// Export the functions required by react-native-svg
module.exports = {
  resolveAssetUri,
  transformToUniqueIds,
  createSVGElement,
  extractViewBox,
  transformStyle,
  default: {
    resolveAssetUri,
    transformToUniqueIds,
    createSVGElement,
    extractViewBox,
    transformStyle,
  }
}; 