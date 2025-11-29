/**
 * Mock数据生成器
 */
export interface MockGenerator {
  generate: (options?: any) => any
}

export const mockGenerators = {
  // 用户相关Mock数据
  user: {
    list: (count: number = 10) => Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      nickname: `用户${i + 1}`,
      avatar: `https://picsum.photos/seed/user${i + 1}/100/100`,
      email: `user${i + 1}@example.com`,
      phone: `1380000${String(i + 1).padStart(4, '0')}`,
      status: Math.random() > 0.2 ? 1 : 0,
      createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    })),

    detail: (id: number) => ({
      id,
      username: `user${id}`,
      nickname: `用户${id}`,
      avatar: `https://picsum.photos/seed/user${id}/100/100`,
      email: `user${id}@example.com`,
      phone: `1380000${String(id).padStart(4, '0')}`,
      status: Math.random() > 0.2 ? 1 : 0,
      createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      lastLoginTime: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    }),
  },

  // 订单相关Mock数据
  order: {
    categories: () => [
      { id: 1, name: '甄选套餐', icon: 'gift', badge: '超值' },
      { id: 2, name: '新品尝鲜', icon: 'filter', badge: 'NEW' },
      { id: 3, name: '原叶鲜奶茶', icon: 'chart-pie', badge: '热销' },
      { id: 4, name: '原叶特调茶', icon: 'layers', badge: '' },
      { id: 5, name: '活力轻果茶', icon: 'sugar', badge: '' },
      { id: 6, name: '低负担专区', icon: 'info-circle', badge: '0卡' },
      { id: 7, name: '经典奶茶', icon: 'heart', badge: '经典' },
      { id: 8, name: '鲜萃果茶', icon: 'lemon', badge: '清爽' },
      { id: 9, name: '芝士茗茶', icon: 'star', badge: '推荐' },
      { id: 10, name: '纯茶茗品', icon: 'leaf', badge: '' },
      { id: 11, name: '咖啡时光', icon: 'coffee', badge: '醇香' },
      { id: 12, name: '气泡水饮', icon: 'drop', badge: '0糖' },
    ],

    list: () => [
      {
        id: 1,
        name: '甄选套餐',
        items: [
          {
            id: 101,
            title: '【观象知时冰箱贴】单大杯随心配套餐',
            desc: '购买即得原叶鲜奶茶(大杯)*1+观象知时冰箱贴(随机款)*1，数量有限，售完即止。',
            price: 35.9,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '套餐',
          },
          {
            id: 102,
            title: '【降温好茶 伴你入秋】鲜奶茶三大杯随心选套餐',
            desc: '精选三杯好茶，温暖入秋，适合办公室分享。',
            price: 48.6,
            image: 'https://images.unsplash.com/photo-1626202378538-072485e16d87?auto=format&fit=crop&w=200&q=80',
            badge: '特惠',
          },
          {
            id: 103,
            title: '【双人畅饮】原叶鲜奶茶两杯套餐',
            desc: '任意两杯原叶鲜奶茶，搭配小食一份，适合与朋友分享。',
            price: 42.0,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=200&q=80',
            badge: '分享',
          },
          {
            id: 104,
            title: '【午后时光】咖啡茶饮组合套餐',
            desc: '一杯精品咖啡+一杯原叶茶饮，完美搭配你的下午时光。',
            price: 38.8,
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80',
            badge: '套餐',
          },
        ],
      },
      {
        id: 2,
        name: '新品尝鲜',
        items: [
          {
            id: 201,
            title: '赤霞跃金「广东限定」',
            desc: '入口白芽奇兰清雅兰香，回韵醇厚，叠加广东新会陈皮自然甘润，形成独特风味。',
            price: 18.0,
            image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 202,
            title: '万里木兰（原叶鲜奶茶）',
            desc: '经典红茶底，搭配优质鲜牛乳，茶香浓郁。',
            price: 16.0,
            image: 'https://images.unsplash.com/photo-1571934811356-5cc55449d0a4?auto=format&fit=crop&w=200&q=80',
            badge: '热销',
          },
          {
            id: 203,
            title: '青提茉莉果茶',
            desc: '新鲜青提果肉，搭配清香茉莉绿茶，口感清新。',
            price: 17.5,
            image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=200&q=80',
            badge: '新品',
          },
          {
            id: 204,
            title: '芒果椰椰鲜奶茶',
            desc: '热带芒果与新鲜椰奶完美融合，带来夏日清凉。',
            price: 19.5,
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=200&q=80',
            badge: '新品',
          },
          {
            id: 205,
            title: '抹茶红豆波波',
            desc: '日式抹茶粉搭配香甜红豆和Q弹波波，口感层次丰富。',
            price: 20.0,
            image: 'https://images.unsplash.com/photo-1579207207140-283a18a5ac7c?auto=format&fit=crop&w=200&q=80',
            badge: '限定',
          },
        ],
      },
      {
        id: 3,
        name: '原叶鲜奶茶',
        items: [
          {
            id: 301,
            title: '烤布蕾拿铁（原叶鲜奶茶）',
            desc: '意式烤布蕾风味融入鲜奶茶中，香甜浓郁。',
            price: 19.0,
            image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=200&q=80',
            badge: '推荐',
          },
          {
            id: 302,
            title: '黑糖波波鲜奶茶',
            desc: '台湾手工黑糖搭配Q弹波波，口感丰富。',
            price: 17.0,
            image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cda9?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 303,
            title: '红豆鲜奶茶',
            desc: '精选红豆慢煮至软糯，搭配香滑鲜奶，口感香甜。',
            price: 16.5,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 304,
            title: '芋泥波波鲜奶茶',
            desc: '香滑芋泥搭配Q弹波波，浓郁香芋味。',
            price: 18.5,
            image: 'https://images.unsplash.com/photo-1544145945-f90425d401c7?auto=format&fit=crop&w=200&q=80',
            badge: '热销',
          },
          {
            id: 305,
            title: '巧克力熔岩鲜奶茶',
            desc: '比利时巧克力与鲜奶完美融合，浓郁的巧克力风味。',
            price: 21.0,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
        ],
      },
      {
        id: 4,
        name: '原叶特调茶',
        items: [
          {
            id: 401,
            title: '四季春玛奇朵',
            desc: '清新四季春茶底，搭配绵密奶盖，层次分明。',
            price: 16.0,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 402,
            title: '大红袍奶茶',
            desc: '武夷山大红袍茶底，醇厚岩韵，搭配鲜奶更显香浓。',
            price: 18.0,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 403,
            title: '铁观音芝士茶',
            desc: '安溪铁观音的清香与芝士的浓香完美结合。',
            price: 17.5,
            image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=200&q=80',
            badge: '推荐',
          },
          {
            id: 404,
            title: '龙井玉露',
            desc: '西湖龙井的清雅香气，口感甘醇回甜。',
            price: 19.0,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 405,
            title: '普洱奶茶',
            desc: '云南普洱茶的陈香与鲜奶结合，口感独特。',
            price: 16.5,
            image: 'https://images.unsplash.com/photo-1572446946202-1af9ad8885c1?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
        ],
      },
      {
        id: 5,
        name: '活力轻果茶',
        items: [
          {
            id: 501,
            title: '多肉葡萄',
            desc: '新鲜葡萄果肉，搭配茉莉绿茶底，清爽怡人。',
            price: 18.0,
            image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=200&q=80',
            badge: '季节限定',
          },
          {
            id: 502,
            title: '草莓摇摇奶昔',
            desc: '新鲜草莓果肉，搭配酸奶和冰块，口感丰富。',
            price: 19.5,
            image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 503,
            title: '百香果柠檬茶',
            desc: '酸甜百香果与清新柠檬，夏日解暑首选。',
            price: 16.5,
            image: 'https://images.unsplash.com/photo-1586581037728-39472e8a4f85?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 504,
            title: '水蜜桃乌龙茶',
            desc: '香甜水蜜桃搭配清香乌龙，果香四溢。',
            price: 17.0,
            image: 'https://images.unsplash.com/photo-1572446946202-1af9ad8885c1?auto=format&fit=crop&w=200&q=80',
            badge: '热销',
          },
          {
            id: 505,
            title: '柠檬蜜柚茶',
            desc: '新鲜柠檬与蜜柚果肉，酸甜开胃。',
            price: 16.0,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 506,
            title: '奇异果莓果茶',
            desc: '绿色奇异果与混合莓果，维生素满满。',
            price: 18.5,
            image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
        ],
      },
      {
        id: 6,
        name: '低负担专区',
        items: [
          {
            id: 601,
            title: '0卡糖气泡水',
            desc: '无糖无负担，添加天然果味，清爽解渴。',
            price: 12.0,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&q=80',
            badge: '0卡',
          },
          {
            id: 602,
            title: '燃脂乌龙茶',
            desc: '精选乌龙茶，帮助新陈代谢，无糖无负担。',
            price: 14.0,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=80',
            badge: '0糖',
          },
          {
            id: 603,
            title: '蔬菜汁',
            desc: '新鲜蔬菜榨汁，富含维生素，无添加糖。',
            price: 15.0,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '健康',
          },
          {
            id: 604,
            title: '0糖元气茶',
            desc: '代糖配方，无热量负担，保持茶香原味。',
            price: 13.5,
            image: 'https://images.unsplash.com/photo-1572446946202-1af9ad8885c1?auto=format&fit=crop&w=200&q=80',
            badge: '0糖',
          },
        ],
      },
      {
        id: 7,
        name: '经典奶茶',
        items: [
          {
            id: 701,
            title: '珍珠奶茶',
            desc: '经典港式奶茶，Q弹珍珠，香浓顺滑。',
            price: 15.0,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=200&q=80',
            badge: '经典',
          },
          {
            id: 702,
            title: '椰果奶茶',
            desc: '香滑椰果搭配经典奶茶，口感丰富有嚼劲。',
            price: 15.5,
            image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 703,
            title: '布丁奶茶',
            desc: '嫩滑布丁配上香浓奶茶，甜蜜诱人。',
            price: 16.0,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '推荐',
          },
          {
            id: 704,
            title: '仙草冻奶茶',
            desc: '清爽仙草冻与香浓奶茶，夏日消暑佳品。',
            price: 15.0,
            image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cda9?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 705,
            title: '红豆布丁奶茶',
            desc: '香甜红豆搭配嫩滑布丁，双重口感享受。',
            price: 17.0,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=200&q=80',
            badge: '热销',
          },
        ],
      },
      {
        id: 8,
        name: '鲜萃果茶',
        items: [
          {
            id: 801,
            title: '柠檬红茶',
            desc: '新鲜柠檬片配红茶，酸甜清爽。',
            price: 14.0,
            image: 'https://images.unsplash.com/photo-1586581037728-39472e8a4f85?auto=format&fit=crop&w=200&q=80',
            badge: '清爽',
          },
          {
            id: 802,
            title: '橙子蜜茶',
            desc: '新鲜橙汁配蜂蜜，富含维生素C。',
            price: 15.5,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 803,
            title: '苹果绿茶',
            desc: '清甜苹果片配绿茶，果香清新。',
            price: 14.5,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 804,
            title: '热带水果茶',
            desc: '芒果、菠萝、百香果混合，热带风情。',
            price: 18.0,
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=200&q=80',
            badge: '季节限定',
          },
          {
            id: 805,
            title: '莓果茶',
            desc: '草莓、蓝莓、覆盆子混合，酸甜可口。',
            price: 17.5,
            image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
        ],
      },
      {
        id: 9,
        name: '芝士茗茶',
        items: [
          {
            id: 901,
            title: '芝士四季春',
            desc: '四季春茶底配咸香芝士奶盖，清香浓郁。',
            price: 19.0,
            image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=200&q=80',
            badge: '推荐',
          },
          {
            id: 902,
            title: '芝士茉莉绿',
            desc: '茉莉绿茶底配芝士奶盖，花香浓郁。',
            price: 18.0,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 903,
            title: '芝士红茶',
            desc: '经典红茶底配芝士奶盖，醇香浓郁。',
            price: 18.5,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '热销',
          },
          {
            id: 904,
            title: '芝士乌龙',
            desc: '乌龙茶底配芝士奶盖，层次丰富。',
            price: 19.5,
            image: 'https://images.unsplash.com/photo-1572446946202-1af9ad8885c1?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
        ],
      },
      {
        id: 10,
        name: '纯茶茗品',
        items: [
          {
            id: 1001,
            title: '龙井茶',
            desc: '西湖龙井，清香甘醇，回甘持久。',
            price: 12.0,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 1002,
            title: '碧螺春',
            desc: '洞庭碧螺春，茶香清雅，口感鲜爽。',
            price: 13.0,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 1003,
            title: '铁观音',
            desc: '安溪铁观音，兰香明显，回甘悠长。',
            price: 14.0,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 1004,
            title: '大红袍',
            desc: '武夷大红袍，岩韵明显，醇厚甘醇。',
            price: 15.0,
            image: 'https://images.unsplash.com/photo-1572446946202-1af9ad8885c1?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 1005,
            title: '普洱茶',
            desc: '云南普洱，陈香醇厚，越陈越香。',
            price: 16.0,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
        ],
      },
      {
        id: 11,
        name: '咖啡时光',
        items: [
          {
            id: 1101,
            title: '美式咖啡',
            desc: '经典美式咖啡，香醇浓郁，回味悠长。',
            price: 18.0,
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80',
            badge: '醇香',
          },
          {
            id: 1102,
            title: '拿铁咖啡',
            desc: '香浓奶泡配意式浓缩，口感丝滑。',
            price: 22.0,
            image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 1103,
            title: '卡布奇诺',
            desc: '浓缩咖啡配绵密奶泡，意式经典。',
            price: 21.0,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 1104,
            title: '摩卡咖啡',
            desc: '巧克力酱配咖啡，甜香浓郁。',
            price: 24.0,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=200&q=80',
            badge: '推荐',
          },
          {
            id: 1105,
            title: '焦糖玛奇朵',
            desc: '香草糖浆配焦糖酱，层次丰富。',
            price: 23.0,
            image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cda9?auto=format&fit=crop&w=200&q=80',
            badge: '热销',
          },
        ],
      },
      {
        id: 12,
        name: '气泡水饮',
        items: [
          {
            id: 1201,
            title: '柠檬气泡水',
            desc: '清新柠檬配气泡水，酸甜爽口。',
            price: 10.0,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&q=80',
            badge: '0糖',
          },
          {
            id: 1202,
            title: '青提气泡水',
            desc: '新鲜青提配气泡水，果香清新。',
            price: 12.0,
            image: 'https://images.unsplash.com/photo-1586581037728-39472e8a4f85?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 1203,
            title: '莓果气泡水',
            desc: '混合莓果配气泡水，酸甜可口。',
            price: 13.0,
            image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 1204,
            title: '西柚气泡水',
            desc: '西柚果肉配气泡水，微苦回甘。',
            price: 11.0,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 1205,
            title: '青柠薄荷气泡水',
            desc: '青柠配薄荷，清凉爽口无负担。',
            price: 10.5,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=200&q=80',
            badge: '0卡',
          },
        ],
      },
    ],

    // 根据分类ID获取商品
    getByCategory: (categoryId: number) => {
      const allProducts = mockGenerators.order.list()
      const category = allProducts.find(group => group.id === categoryId)
      return category ? category.items : []
    },

    // 获取单个商品详情
    getById: (productId: number) => {
      const allProducts = mockGenerators.order.list()
      for (const category of allProducts) {
        const product = category.items.find((item: any) => item.id === productId)
        if (product) {
          return {
            ...product,
            categoryId: category.id,
            categoryName: category.name,
          }
        }
      }
      return null
    },

    // 获取所有商品列表（平铺格式）
    getAllProducts: () => {
      const categories = mockGenerators.order.list()
      return categories.reduce((acc: any[], category: any) => {
        const products = category.items.map((item: any) => ({
          ...item,
          categoryId: category.id,
          categoryName: category.name,
        }))
        return acc.concat(products)
      }, [])
    },
  },

  // 分页数据生成器
  pagination: (data: any[], page: number = 1, pageSize: number = 10) => {
    const total = data.length
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      list: data.slice(start, end),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  },

  // 错误响应生成器
  error: {
    businessError: (code: number, message: string) => ({
      code,
      data: null,
      message,
      success: false,
    }),

    systemError: (error: string) => ({
      code: 500,
      data: null,
      message: `系统错误：${error}`,
      success: false,
    }),

    networkError: () => ({
      code: -1,
      data: null,
      message: '网络连接失败',
      success: false,
    }),

    timeoutError: () => ({
      code: -2,
      data: null,
      message: '请求超时',
      success: false,
    }),
  },

  // 登录相关Mock数据
  auth: {
    loginSuccess: (username: string, token: string) => ({
      code: 200,
      data: {
        token,
        refreshToken: `refresh-${token}`,
        userInfo: {
          id: 1,
          username,
          nickname: '测试用户',
          avatar: 'https://picsum.photos/seed/avatar/100/100',
        },
      },
      message: '登录成功',
    }),

    loginError: (message: string = '用户名或密码错误') => ({
      code: 401,
      data: null,
      message,
      success: false,
    }),

    captcha: () => ({
      code: 200,
      data: {
        captchaEnabled: true,
        uuid: `mock-uuid-${Date.now()}`,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      },
    }),
  },
}

/**
 * 创建Mock响应
 */
export function createMockResponse(generator: MockGenerator, options?: any): any {
  return generator.generate(options)
}

/**
 * 创建延迟Mock响应
 */
export function createDelayedMockResponse(generator: MockGenerator, delay: number = 300, options?: any): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generator.generate(options))
    }, delay)
  })
}
