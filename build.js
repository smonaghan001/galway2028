// Build script — converts _posts/*.md into posts.json for the news page
const fs = require('fs');
const path = require('path');

const postsDir = './_posts';
const posts = [];

if (fs.existsSync(postsDir)) {
  const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse(); // newest first

  for (const file of files) {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) continue;

    const frontmatter = {};
    match[1].split('\n').forEach(line => {
      const colonIdx = line.indexOf(': ');
      if (colonIdx > -1) {
        const key = line.slice(0, colonIdx).trim();
        const val = line.slice(colonIdx + 2).trim().replace(/^["']|["']$/g, '');
        frontmatter[key] = val;
      }
    });

    posts.push({
      slug: file.replace('.md', ''),
      title: frontmatter.title || '',
      date: frontmatter.date || '',
      summary: frontmatter.summary || '',
      image: frontmatter.image || '',
      content: match[2].trim()
    });
  }
}

fs.writeFileSync('./posts.json', JSON.stringify(posts, null, 2));
console.log(`Built ${posts.length} post(s) → posts.json`);
