const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'src', 'images', 'illustrations');
const contentDir = path.join(__dirname, '..', 'content', 'illustrations');

if (!fs.existsSync(imagesDir)) {
  console.error('Images directory not found:', imagesDir);
  process.exit(1);
}
if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

const files = fs.readdirSync(imagesDir).filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f));
if (!files.length) {
  console.log('No image files found in', imagesDir);
  process.exit(0);
}

files.forEach((file) => {
  const name = path.parse(file).name;
  const slug = name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const mdPath = path.join(contentDir, `${slug}.md`);
  if (fs.existsSync(mdPath)) {
    console.log('Skipping existing:', mdPath);
    return;
  }
  const frontmatter = `---\ntitle: "${name.replace(/"/g, '')}"\nimage: "/images/illustrations/${file}"\nalt: "${name.replace(/"/g, '')}"\ndescription: ""\n---\n\n`;
  fs.writeFileSync(mdPath, frontmatter, 'utf8');
  console.log('Created:', mdPath);
});

console.log('Done.');
