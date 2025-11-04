import rss from './rss.mjs'

async function postbuild() {
  try {
    await rss()
    console.log('✅ Postbuild: RSS generation completed')
  } catch (err) {
    console.warn('⚠️ Postbuild: RSS generation skipped:', err.message)
  }
}

postbuild()
