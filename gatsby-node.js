exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type File implements Node {
      childImageSharp: ImageSharp
    }

    type ImageSharp implements Node {
      fluid: ImageSharpFluid
      fixed: ImageSharpFixed
    }

    type ImageSharpFluid {
      base64: String
      aspectRatio: Float
      src: String
      srcSet: String
      sizes: String
    }

    type ImageSharpFixed {
      base64: String
      width: Int
      height: Int
      src: String
      srcSet: String
    }
    
    type MarkdownRemark implements Node {
      fileAbsolutePath: String
      frontmatter: MarkdownRemarkFrontmatter
    }

    type MarkdownRemarkFrontmatter {
      title: String
      image: String
      alt: String
      description: String
    }
  `;
  createTypes(typeDefs);
};