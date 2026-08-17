const fs = require('fs');
const matter = require('gray-matter');

function parseMarkdownFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  // Classificar o arquivo baseado no caminho ou no frontmatter
  const fileName = filePath.split('/').pop().replace('.md', '');
  const isProjeto = filePath.includes('/Projetos/');
  
  const type = frontmatter.type || (isProjeto ? 'projeto' : 'artigo');

  return {
    id: fileName,
    type,
    frontmatter,
    content
  };
}

module.exports = {
  parseMarkdownFile
};
