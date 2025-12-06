// src/content/config.ts

import { z, defineCollection } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content', 
  schema: z.object({
    
    // 1. 解决 published 字段 (日期和时间戳)
    // 使用 z.string() 接收 elog 导出的字符串，然后 transform 成 Date 对象。
    published: z.string().transform((str) => {
        // str 是 '2025-12-06 00:00:00'，Date() 构造函数可以处理这种格式
        return new Date(str); 
    }), 
    
    // 2. 解决 encrypted 和 pinned 字段 (布尔值和空字符串)
    // 接收字符串。如果字符串是 'true'，则为 true；如果为空字符串 ' '，则为 false。
    encrypted: z.string().transform((val) => val === 'true'), 
    pinned: z.string().transform((val) => val === 'true'),
    
    // 3. 其他字段定义 (根据图一添加和调整)
    category: z.string().optional(),
    password: z.string().optional(), // password 是字符串
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    urlname: z.string(),
    title: z.string(),
    author: z.string().optional(),
    
    // 💡 注意：如果您的 image 字段存在，也需要加上
    image: z.string().optional(),
    
  }),
});


// 导出所有内容集合
export const collections = {
  posts: postsCollection,
  // 如果您有 spec 集合，也需要在这里定义
  // spec: defineCollection({ /* ... */ }),
};