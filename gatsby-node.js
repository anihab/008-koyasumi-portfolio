// Increase EventEmitter default listener limit to avoid MaxListenersExceededWarning
// during image processing or multiple concurrent streams in the build.
// 20 is a conservative increase; adjust as needed.
const { EventEmitter } = require("events");
EventEmitter.defaultMaxListeners = 20;

// Keep schema customization minimal to avoid conflicts with Gatsby's ImageSharp types.
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type MarkdownRemarkFrontmatter {
      title: String
      image: String
      alt: String
      description: String
    }
  `;
  createTypes(typeDefs);
};