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