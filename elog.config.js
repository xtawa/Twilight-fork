// elog.config.js
const r2 = require('@elog/plugin-img-r2')

module.exports = {
  write: {
    platform: 'notion',
    notion: {
      token: process.env.NOTION_TOKEN,
      databaseId: process.env.NOTION_DATABASE_ID,
      filter: { property: 'status', select: { equals: '已发布' }}
    }
  },
  deploy: {
    platform: 'local',
    local: {
      outputDir: './src/content/posts',
      filename: 'urlname',
      format: 'markdown',
      catalog: false,
      
      // 🟢 关键配置 1：引入自定义适配器
      formatExt: './format-adapter.js',

      frontMatter: {
        enable: true,
        // 🟢 关键配置 2：使用 Notion 预设的 'image' 字段
        include: ['tags', 'category', 'urlname', 'title', 'published', 'image', 'author','pinned', 'description', 'encrypted', 'password'],
        timeFormat: 'YYYY-MM-DD',
      },
    }
  },
  image: {
    enable: true,
    // 🟢 关键配置 3：确保开启扩展支持 (虽然 enable=true 通常就够了，但加双保险)
    enableForExt: true, 
    platform: 'r2',
    plugin: r2,
    r2: {
      accessKeyId: process.env.R2_ACCESSKEYID,
      secretAccessKey: process.env.R2_SECRET_ACCESSKEY,
      bucket: process.env.R2_BUCKET,
      endpoint: process.env.R2_ENDPOINT,
      host: process.env.R2_HOST,
      outputDir: './src/content/images',
      prefixKey: '/images'
    }
  }
}