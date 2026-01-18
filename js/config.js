export const colorMap = [
    { bg: '#EEEEEE', fg: '#000' }, { bg: '#1E88E5', fg: '#FFF' }, { bg: '#00695C', fg: '#FFF' }, 
    { bg: '#F8BBD0', fg: '#000' }, { bg: '#D32F2F', fg: '#FFF' }, { bg: '#FFEB3B', fg: '#000' }, 
    { bg: '#EF6C00', fg: '#FFF' }, { bg: '#5D4037', fg: '#FFF' }, { bg: '#212121', fg: '#FFF' }, 
    { bg: '#7B1FA2', fg: '#FFF' }, { bg: '#CCFF90', fg: '#000' }, { bg: '#80DEEA', fg: '#000' }, 
    { bg: '#F06292', fg: '#000' }, { bg: '#9E9E9E', fg: '#000' }, { bg: '#FFE0B2', fg: '#000' }
];

export const defaultActTags = [
    {t:'狼任务', c:'wolf'}, {t:'鹅任务', c:'good'}, {t:'看腿不拉', c:'warn'},
    {t:'单走', c:'neutral'}, {t:'外置位', c:'neutral'}, {t:'贴贴', c:'good'},
    {t:'划水', c:'warn'}, {t:'偷窥', c:'warn'}, {t:'窥子', c:'warn'}, {t:'不动', c:'wolf'}
];

export const mapData = {
    'base': ['实验室','锅炉房','书房','雾洞','礼堂','祭坛','前堂','储藏室','地牢','收藏室','储藏间','隧道入口','隧道','坑'],
    'church': ['礼拜堂','法院','广场','银行','红灯区','小屋','港口','码头','进出口','仓库','工厂','警察局','城市广场','酒厂','酒馆','办公室','理发店'],
    'ship': ['桥梁','通讯间','货舱','储物间','娱乐室','武器房','宿舍','淋浴间','电机室','医疗室','监狱','食堂','孵化器','发动机','反应器'],
    'jungle': ['训练场','前堂','喷泉','墓室','宝物室','祭坛','营地','供货区','敬拜坑','西宝室','金銮殿','准备室','准备区']
};

export const tagColorMap = {
    'wolf': { bg: '#ffebee', fg: '#c62828' },
    'good': { bg: '#e0f7fa', fg: '#006064' },
    'warn': { bg: '#fff3e0', fg: '#e65100' },
    'neutral': { bg: '#eceff1', fg: '#546e7a' },
    'blue': { bg: '#e3f2fd', fg: '#1565c0' },
    'purple': { bg: '#f3e5f5', fg: '#7b1fa2' }
};
