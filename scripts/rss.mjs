import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import siteMetadata from '../src/data/config.js'

const allBlogs = [] // Kosong karena MDX dihapus

// Escaper HTML
var replace = ''.replace
var ca = /[&<>'"]/g
var esca = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}
var pe = (m) => esca[m]
var escape = (es) => replace.call(es, ca, pe)

// Sort by date descending
function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

function sortPosts(posts, dateKey = 'date') {
  return posts.sort((a, b) => dateSortDesc(a[dateKey], b[dateKey]))
}

// Generate RSS item
const generateRssItem = (config, post) => `
<item>
  <guid>${config.siteURL}blog/${post.slug}</guid>
  <title>${escape(post.title)}</title>
  <link>${config.siteURL}blog/${post.slug}</link>
  ${post.summary ? `<description>${escape(post.summary)}</description>` : ''}
  <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  <author>${config.email} (${config.author})</author>
  ${post.tags ? post.tags.map((t) => `<category>${t}</category>`).join('') : ''}
</item>
`

// Generate RSS feed
const generateRss = (config, posts, page = 'feed.xml') => `
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(config.title)}</title>
    <link>${config.siteURL}blog</link>
    <description>${escape(config.description)}</description>
    <language>${config.language}</language>
    <managingEditor>${config.email} (${config.author})</managingEditor>
    <webMaster>${config.email} (${config.author})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${config.siteURL}/${page}" rel="self" type="application/rss+xml"/>
    ${posts.map((post) => generateRssItem(config, post)).join('')}
  </channel>
</rss>
`

// Main generator
async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true)
  if (publishPosts.length > 0) {
    const rss = generateRss(config, sortPosts(publishPosts))
    try {
      mkdirSync('./public', { recursive: true })
      writeFileSync(`./public/${page}`, rss)
      console.log('✅ RSS feed generated...')
    } catch (err) {
      console.warn('⚠️ RSS write failed:', err.message)
    }
  } else {
    console.log('No blog posts found, skipping RSS generation...')
  }
}

// Export callable function
export default async function rss() {
  await generateRSS(siteMetadata, allBlogs)
}
