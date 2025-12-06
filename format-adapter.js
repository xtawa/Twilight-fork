// format-adapter.js
const { matterMarkdownAdapter } = require('@elog/cli')

/**
 * Elog 自定义文档适配器：
 * 1. 修正 pinned/encrypted 的空字符串 '' 为真正的布尔值。
 * 2. 修正 published 字符串为 Date 对象，以解决 Astro 的类型校验问题。
 * 3. 处理 'image' 封面图，上传到 R2 并替换链接。
 * * @param {DocDetail} doc 文档详情
 * @param {ImageClient} imageClient 图床下载器
 */
const format = async (doc, imageClient) => {
  const props = doc.properties;

  // ==================================================
  // 🟢 步骤 1: 修正 published 日期 (解决 published: Expected type "date", received "string" 错误)
  // ==================================================
  
  // 关键修正：检查 published 字段是否存在且为字符串
  if (props.published && typeof props.published === 'string') {
    // 强制将其转换为 JavaScript Date 对象。
    // new Date() 可以正确解析 'YYYY-MM-DD HH:mm:ss' 格式的字符串。
    props.published = new Date(props.published); 
    console.log('[Date Fixed] published 字段已转换为 Date 对象。');
  }

  // ==================================================
  // 🟢 步骤 2: 修正布尔值 (解决 pinned, encrypted 的 'string' 错误)
  // ==================================================
  
  // 这部分逻辑将 Notion 未勾选时导出的空字符串 '' 替换为布尔值 false
  const booleanFields = ['pinned', 'encrypted'];

  booleanFields.forEach(field => {
    // 处理空字符串 '' 
    if (props[field] === '') {
      props[field] = false; 
    }
    // 处理从 Notion 导出的 'true'/'false' 字符串
    if (props[field] === 'true') props[field] = true;
    if (props[field] === 'false') props[field] = false;
  });

  // ==================================================
  // 🟢 步骤 3: 处理封面图上传 (使用 'image' 字段)
  // ==================================================
  
  // 使用 'image' 字段名 (对应 Notion 属性)
  const image = props.image; 

  if (imageClient && image) {
    try {
      const url = await imageClient.uploadImageFromUrl(image, doc);
      props.image = url;
      console.log(`[Image Fixed] 封面图已替换为 R2 链接: ${url}`);
    } catch (error) {
      console.error('[Image Error] 封面图上传失败:', error);
    }
  }

  // ==================================================
  // 🟢 步骤 4: 生成 Markdown 正文
  // ==================================================
  
  // 使用修正后的 properties (包含 Date 对象和布尔值) 生成最终的 Front Matter 和正文
  doc.body = matterMarkdownAdapter(doc);
  
  return doc;
};

module.exports = {
  format,
};