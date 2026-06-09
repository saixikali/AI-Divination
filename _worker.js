export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (url.pathname === '/api/fortune' && request.method === 'POST') {
            return handleFortune(request, env);
        }

        if (url.pathname === '/api/bagua' && request.method === 'GET') {
            return new Response(JSON.stringify(BAGUA), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (url.pathname === '/' || url.pathname === '/index') {
            return new Response(INDEX_HTML, {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        return new Response('Not Found', { status: 404 });
    }
};

const BAGUA = {
    '乾': {
        'symbol': '☰',
        'nature': '天',
        'direction': '西北',
        'meaning': '刚健、自强不息',
        'lines': [1, 1, 1],
        'element': '金',
        'family': '父',
        'body': '首',
        'animal': '马',
        'season': '秋',
        'image': '健',
        'character': '元亨利贞',
        'xiang': '天行健，君子以自强不息',
        'shu': '1'
    },
    '坤': {
        'symbol': '☷',
        'nature': '地',
        'direction': '西南',
        'meaning': '柔顺、厚德载物',
        'lines': [0, 0, 0],
        'element': '土',
        'family': '母',
        'body': '腹',
        'animal': '牛',
        'season': '夏秋之交',
        'image': '顺',
        'character': '元亨，利牝马之贞',
        'xiang': '地势坤，君子以厚德载物',
        'shu': '8'
    },
    '震': {
        'symbol': '☳',
        'nature': '雷',
        'direction': '东',
        'meaning': '震动、奋发',
        'lines': [1, 0, 0],
        'element': '木',
        'family': '长男',
        'body': '足',
        'animal': '龙',
        'season': '春',
        'image': '动',
        'character': '亨。震来虩虩，笑言哑哑',
        'xiang': '洊雷，震。君子以恐惧修省',
        'shu': '4'
    },
    '巽': {
        'symbol': '☴',
        'nature': '风',
        'direction': '东南',
        'meaning': '渗入、谦逊',
        'lines': [0, 1, 0],
        'element': '木',
        'family': '长女',
        'body': '股',
        'animal': '鸡',
        'season': '春夏之交',
        'image': '入',
        'character': '小亨，利有攸往，利见大人',
        'xiang': '随风，巽。君子以申命行事',
        'shu': '5'
    },
    '坎': {
        'symbol': '☵',
        'nature': '水',
        'direction': '北',
        'meaning': '险陷、智慧',
        'lines': [0, 1, 1],
        'element': '水',
        'family': '中男',
        'body': '耳',
        'animal': '豕',
        'season': '冬',
        'image': '陷',
        'character': '习坎，有孚维心亨，行有尚',
        'xiang': '水洊至，习坎。君子以常德行，习教事',
        'shu': '6'
    },
    '离': {
        'symbol': '☲',
        'nature': '火',
        'direction': '南',
        'meaning': '光明、美丽',
        'lines': [1, 0, 1],
        'element': '火',
        'family': '中女',
        'body': '目',
        'animal': '雉',
        'season': '夏',
        'image': '丽',
        'character': '利贞，亨。畜牝牛吉',
        'xiang': '明两作，离。大人以继明照于四方',
        'shu': '3'
    },
    '艮': {
        'symbol': '☶',
        'nature': '山',
        'direction': '东北',
        'meaning': '停止、稳重',
        'lines': [1, 1, 0],
        'element': '土',
        'family': '少男',
        'body': '手',
        'animal': '狗',
        'season': '冬春之交',
        'image': '止',
        'character': '艮其背，不获其身；行其庭，不见其人，无咎',
        'xiang': '兼山，艮。君子以思不出其位',
        'shu': '7'
    },
    '兑': {
        'symbol': '☱',
        'nature': '泽',
        'direction': '西',
        'meaning': '喜悦、言语',
        'lines': [0, 0, 1],
        'element': '金',
        'family': '少女',
        'body': '口',
        'animal': '羊',
        'season': '秋',
        'image': '说',
        'character': '亨，利贞',
        'xiang': '丽泽，兑。君子以朋友讲习',
        'shu': '2'
    }
};

const LIUSHISI_GUA = {
    '1': {
        'name': '乾为天',
        'pinyin': 'Qián wéi Tiān',
        'upper': '乾',
        'lower': '乾',
        'judgement': '大吉',
        'guaci': '元亨，利贞',
        'xiangci': '天行健，君子以自强不息',
        'meaning': '象征天，纯阳至健。龙德而正中，刚健中正，纯粹精也。象曰：天行健，君子以自强不息。',
        'zhiyao': [
            '初九：潜龙勿用',
            '九二：见龙在田，利见大人',
            '九三：君子终日乾乾，夕惕若厉，无咎',
            '九四：或跃在渊，无咎',
            '九五：飞龙在天，利见大人',
            '上九：亢龙有悔'
        ],
        'summary': '乾卦象征刚健进取，六爻皆阳，代表事物发展的鼎盛阶段。宜进不宜退，宜动不宜静，但需戒骄戒躁。'
    },
    '2': {
        'name': '坤为地',
        'pinyin': 'Kūn wéi Dì',
        'upper': '坤',
        'lower': '坤',
        'judgement': '大吉',
        'guaci': '元亨，利牝马之贞。君子有攸往，先迷后得主。利西南得朋，东北丧朋。安贞吉。',
        'xiangci': '地势坤，君子以厚德载物',
        'meaning': '象征地，纯阴至顺。坤厚载物，德合无疆。含弘光大，品物咸亨。',
        'zhiyao': [
            '初六：履霜，坚冰至',
            '六二：直方大，不习无不利',
            '六三：含章可贞，或从王事，无成有终',
            '六四：括囊，无咎无誉',
            '六五：黄裳，元吉',
            '上六：龙战于野，其血玄黄'
        ],
        'summary': '坤卦象征柔顺包容，六爻皆阴，代表事物发展的孕育阶段。宜静不宜动，宜柔不宜刚，厚德载物，以柔克刚。'
    },
    '3': {
        'name': '水雷屯',
        'pinyin': 'Shuǐ Léi Tún',
        'upper': '坎',
        'lower': '震',
        'judgement': '平',
        'guaci': '元亨，利贞。勿用有攸往，利建侯。',
        'xiangci': '云雷，屯。君子以经纶',
        'meaning': '屯者，物之始生也。刚柔始交而难生，动乎险中，大亨贞。',
        'zhiyao': [
            '初九：磐桓，利居贞，利建侯',
            '六二：屯如邅如，乘马班如。匪寇婚媾，女子贞不字，十年乃字',
            '六三：即鹿无虞，惟入于林中，君子几不如舍，往吝',
            '六四：乘马班如，求婚媾，往吉，无不利',
            '九五：屯其膏，小贞吉，大贞凶',
            '上六：乘马班如，泣血涟如'
        ],
        'summary': '屯卦象征初生之艰难，水雷相交，险象环生。宜积蓄力量，不宜冒进，待时而动。'
    },
    '4': {
        'name': '山水蒙',
        'pinyin': 'Shān Shuǐ Méng',
        'upper': '艮',
        'lower': '坎',
        'judgement': '平',
        'guaci': '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
        'xiangci': '山下出泉，蒙。君子以果行育德',
        'meaning': '蒙者，蒙昧也。山下有险，险而止，蒙。',
        'zhiyao': [
            '初六：发蒙，利用刑人，用说桎梏，以往吝',
            '九二：包蒙，吉。纳妇，吉。子克家',
            '六三：勿用取女，见金夫，不有躬，无攸利',
            '六四：困蒙，吝',
            '六五：童蒙，吉',
            '上九：击蒙，不利为寇，利御寇'
        ],
        'summary': '蒙卦象征启蒙教育，山水相映，蒙昧待启。宜虚心学习，尊师重道，循序渐进。'
    },
    '11': {
        'name': '地天泰',
        'pinyin': 'Dì Tiān Tài',
        'upper': '坤',
        'lower': '乾',
        'judgement': '大吉',
        'guaci': '小往大来，吉亨。',
        'xiangci': '天地交，泰。后以财成天地之道，辅相天地之宜，以左右民',
        'meaning': '泰者，通也。天地交而万物通，上下交而其志同。',
        'zhiyao': [
            '初九：拔茅茹，以其汇，征吉',
            '九二：包荒，用冯河，不遐遗，朋亡，得尚于中行',
            '九三：无平不陂，无往不复，艰贞无咎。勿恤其孚，于食有福',
            '六四：翩翩，不富以其邻，不戒以孚',
            '六五：帝乙归妹，以祉元吉',
            '上六：城复于隍，勿用师，自邑告命，贞吝'
        ],
        'summary': '泰卦象征通泰亨达，天地交泰，阴阳和谐。诸事顺利，上下同心，但需居安思危，戒骄戒躁。'
    },
    '12': {
        'name': '天地否',
        'pinyin': 'Tiān Dì Pǐ',
        'upper': '乾',
        'lower': '坤',
        'judgement': '凶',
        'guaci': '否之匪人，不利君子贞，大往小来。',
        'xiangci': '天地不交，否。君子以俭德辟难，不可荣以禄',
        'meaning': '否者，闭也。天地不交而万物不通，上下不交而天下无邦。',
        'zhiyao': [
            '初六：拔茅茹，以其汇，贞吉，亨',
            '六二：包承，小人吉，大人否，亨',
            '六三：包羞',
            '九四：有命，无咎，畴离祉',
            '九五：休否，大人吉。其亡其亡，系于苞桑',
            '上九：倾否，先否后喜'
        ],
        'summary': '否卦象征闭塞不通，天地不交，阴阳相悖。宜守正待时，积蓄力量，等待否极泰来。'
    },
    '13': {
        'name': '天火同人',
        'pinyin': 'Tiān Huǒ Tóng Rén',
        'upper': '乾',
        'lower': '离',
        'judgement': '大吉',
        'guaci': '同人于野，亨。利涉大川，利君子贞。',
        'xiangci': '天与火，同人。君子以类族辨物',
        'meaning': '同人者，与人同也。天与火，同人。君子以类族辨物。',
        'zhiyao': [
            '初九：同人于门，无咎',
            '六二：同人于宗，吝',
            '九三：伏戎于莽，升其高陵，三岁不兴',
            '九四：乘其墉，弗克攻，吉',
            '九五：同人，先号咷而后笑。大师克相遇',
            '上九：同人于郊，无悔'
        ],
        'summary': '同人卦象征与人同心，团结协作。宜广结善缘，公正处事，避免宗派之见。'
    },
    '14': {
        'name': '火天大有',
        'pinyin': 'Huǒ Tiān Dà Yǒu',
        'upper': '离',
        'lower': '乾',
        'judgement': '大吉',
        'guaci': '元亨。',
        'xiangci': '火在天上，大有。君子以遏恶扬善，顺天休命',
        'meaning': '大有者，大所有也。火在天上，普照万物，君子以遏恶扬善。',
        'zhiyao': [
            '初九：无交害，匪咎，艰则无咎',
            '九二：大车以载，有攸往，无咎',
            '九三：公用亨于天子，小人弗克',
            '九四：匪其彭，无咎',
            '六五：厥孚交如，威如，吉',
            '上九：自天佑之，吉无不利'
        ],
        'summary': '大有卦象征富有盛大，火天相应，光明普照。宜行善积德，保持诚信，得天助也。'
    },
    '33': {
        'name': '天山遁',
        'pinyin': 'Tiān Shān Dùn',
        'upper': '乾',
        'lower': '艮',
        'judgement': '平',
        'guaci': '亨，小利贞。',
        'xiangci': '天下有山，遁。君子以远小人，不恶而严',
        'meaning': '遁者，退也。天下有山，遁。君子以远小人，不恶而严。',
        'zhiyao': [
            '初六：遁尾，厉，勿用有攸往',
            '六二：执之用黄牛之革，莫之胜说',
            '九三：系遁，有疾厉，畜臣妾吉',
            '九四：好遁，君子吉，小人否',
            '九五：嘉遁，贞吉',
            '上九：肥遁，无不利'
        ],
        'summary': '遁卦象征退避隐遁，天高于山，知进知退。宜审时度势，急流勇退，保存实力。'
    },
    '34': {
        'name': '雷天大壮',
        'pinyin': 'Léi Tiān Dà Zhuàng',
        'upper': '震',
        'lower': '乾',
        'judgement': '大吉',
        'guaci': '利贞。',
        'xiangci': '雷在天上，大壮。君子以非礼弗履',
        'meaning': '大壮者，壮盛也。雷在天上，声威远播，君子以非礼弗履。',
        'zhiyao': [
            '初九：壮于趾，征凶，有孚',
            '九二：贞吉',
            '九三：小人用壮，君子用罔，贞厉。羝羊触藩，羸其角',
            '九四：贞吉，悔亡。藩决不羸，壮于大舆之輹',
            '六五：丧羊于易，无悔',
            '上六：羝羊触藩，不能退，不能遂，无攸利，艰则吉'
        ],
        'summary': '大壮卦象征强盛壮大，雷天相应，声威显赫。宜守正不阿，量力而行，不可恃强凌弱。'
    },
    '52': {
        'name': '艮为山',
        'pinyin': 'Gèn wéi Shān',
        'upper': '艮',
        'lower': '艮',
        'judgement': '平',
        'guaci': '艮其背，不获其身；行其庭，不见其人，无咎。',
        'xiangci': '兼山，艮。君子以思不出其位',
        'meaning': '艮者，止也。兼山，艮。君子以思不出其位。',
        'zhiyao': [
            '初六：艮其趾，无咎。利永贞',
            '六二：艮其腓，不拯其随，其心不快',
            '九三：艮其限，列其夤，厉熏心',
            '六四：艮其身，无咎',
            '六五：艮其辅，言有序，悔亡',
            '上九：敦艮，吉'
        ],
        'summary': '艮卦象征静止安定，两山相重，知止有度。宜审时度势，适可而止，坚守本位。'
    },
    '53': {
        'name': '风山渐',
        'pinyin': 'Fēng Shān Jiàn',
        'upper': '巽',
        'lower': '艮',
        'judgement': '大吉',
        'guaci': '女归吉，利贞。',
        'xiangci': '山上有木，渐。君子以居贤德善俗',
        'meaning': '渐者，进也。山上有木，渐。君子以居贤德善俗。',
        'zhiyao': [
            '初六：鸿渐于干，小子厉，有言，无咎',
            '六二：鸿渐于磐，饮食衎衎，吉',
            '九三：鸿渐于陆，夫征不复，妇孕不育，凶。利御寇',
            '六四：鸿渐于木，或得其桷，无咎',
            '九五：鸿渐于陵，妇三岁不孕，终莫之胜，吉',
            '上九：鸿渐于陆，其羽可用为仪，吉'
        ],
        'summary': '渐卦象征循序渐进，风山相应，稳步前进。宜脚踏实地，循序渐进，水到渠成。'
    },
    '63': {
        'name': '水火既济',
        'pinyin': 'Shuǐ Huǒ Jì Jì',
        'upper': '坎',
        'lower': '离',
        'judgement': '大吉',
        'guaci': '亨，小利贞，初吉终乱。',
        'xiangci': '水在火上，既济。君子以思患而豫防之',
        'meaning': '既济者，事已成也。水在火上，既济。君子以思患而豫防之。',
        'zhiyao': [
            '初九：曳其轮，濡其尾，无咎',
            '六二：妇丧其茀，勿逐，七日得',
            '九三：高宗伐鬼方，三年克之，小人勿用',
            '六四：繻有衣袽，终日戒',
            '九五：东邻杀牛，不如西邻之禴祭，实受其福',
            '上六：濡其首，厉'
        ],
        'summary': '既济卦象征功成圆满，水火既济，阴阳和谐。宜居安思危，防患未然，不可骄纵。'
    },
    '64': {
        'name': '火水未济',
        'pinyin': 'Huǒ Shuǐ Wèi Jì',
        'upper': '离',
        'lower': '坎',
        'judgement': '平',
        'guaci': '亨。小狐汔济，濡其尾，无攸利。',
        'xiangci': '火在水上，未济。君子以慎辨物居方',
        'meaning': '未济者，事未成也。火在水上，未济。君子以慎辨物居方。',
        'zhiyao': [
            '初六：濡其尾，吝',
            '九二：曳其轮，贞吉',
            '六三：未济，征凶，利涉大川',
            '九四：贞吉，悔亡。震用伐鬼方，三年有赏于大国',
            '六五：贞吉，无悔。君子之光，有孚，吉',
            '上九：有孚于饮酒，无咎。濡其首，有孚失是'
        ],
        'summary': '未济卦象征事未完成，火水未济，阴阳未合。宜继续努力，坚持不懈，终能成功。'
    }
};

const MEIHUA_YISHU = {
    'intro': '梅花易数是北宋邵雍所创的占卜方法，以八卦为基础，结合时间、方位、动静等因素起卦，具有简便灵活、准确率高的特点。',
    'rules': [
        '起卦方法：以年、月、日、时之数相加，除8取余得上卦，除6取余得动爻',
        '体用生克：体卦为主，用卦为事，生克定吉凶',
        '互变之卦：互卦看过程，变卦看结果',
        '应期判断：根据卦象、爻位、五行生克判断应事时间'
    ],
    'shili': [
        '年月日时起卦：年+月+日=上卦，年+月+日+时=下卦，(年+月+日+时)%6=动爻',
        '声音起卦：闻声音数定卦',
        '方位起卦：来人方向定卦',
        '字数起卦：字数分半定上下卦'
    ],
    'xiangfa': [
        '观物取象：根据事物形态、颜色、动静取卦',
        '察言观色：根据语言、表情判断',
        '时空感应：结合时间、地点判断'
    ]
};

const WUXING_SHENGKE = {
    'wood': { 'name': '木', 'sheng': '火', 'ke': '土', 'color': '青', 'season': '春', 'direction': '东' },
    'fire': { 'name': '火', 'sheng': '土', 'ke': '金', 'color': '红', 'season': '夏', 'direction': '南' },
    'earth': { 'name': '土', 'sheng': '金', 'ke': '水', 'color': '黄', 'season': '四季', 'direction': '中' },
    'metal': { 'name': '金', 'sheng': '水', 'ke': '木', 'color': '白', 'season': '秋', 'direction': '西' },
    'water': { 'name': '水', 'sheng': '木', 'ke': '火', 'color': '黑', 'season': '冬', 'direction': '北' }
};

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function getRandomFromSeed(seed, array) {
    const index = seed % array.length;
    return array[index];
}

function generateHexagram(userInput) {
    const guaNames = Object.keys(BAGUA);
    const seed = hashCode(userInput);

    const gua1 = getRandomFromSeed(seed, guaNames);
    const gua2 = getRandomFromSeed(seed + 1, guaNames);

    const hexagramNum = String((parseInt(BAGUA[gua1].shu) - 1) * 8 + parseInt(BAGUA[gua2].shu));
    
    let hexInfo = LIUSHISI_GUA[hexagramNum] || {
        'name': `${gua1}${gua2}`,
        'pinyin': '',
        'upper': gua1,
        'lower': gua2,
        'judgement': '平',
        'guaci': '',
        'xiangci': '',
        'meaning': `${BAGUA[gua1].meaning}上，${BAGUA[gua2].meaning}下，相辅相成。`,
        'zhiyao': [],
        'summary': ''
    };

    return {
        hexagram_num: hexagramNum,
        upper: gua1,
        lower: gua2,
        upper_symbol: BAGUA[gua1].symbol,
        lower_symbol: BAGUA[gua2].symbol,
        upper_nature: BAGUA[gua1].nature,
        lower_nature: BAGUA[gua2].nature,
        upper_direction: BAGUA[gua1].direction,
        lower_direction: BAGUA[gua2].direction,
        upper_element: BAGUA[gua1].element,
        lower_element: BAGUA[gua2].element,
        lines: [...BAGUA[gua1].lines, ...BAGUA[gua2].lines],
        ...hexInfo
    };
}

async function callDeepSeekAPI(prompt, apiKey) {
    if (!apiKey) {
        return '请配置DeepSeek API密钥以获取详细卦象解释。';
    }

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: `你是一位精通易经、梅花易数的资深算命大师。请结合以下专业知识，为用户提供准确、详细、专业的卦象解读：

【周易六十四卦】
${JSON.stringify(LIUSHISI_GUA, null, 2)}

【八卦详解】
${JSON.stringify(BAGUA, null, 2)}

【梅花易数】
${MEIHUA_YISHU.intro}

请用简洁优美的文言文风格解释卦象含义，结合用户的问题给出专业建议。要引经据典，体现易经智慧。`
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.6,
                max_tokens: 1500
            })
        });

        const result = await response.json();
        return result.choices[0].message.content;
    } catch (e) {
        return 'API调用出错，请稍后重试。';
    }
}

async function handleFortune(request, env) {
    try {
        const data = await request.json();
        const name = (data.name || '').trim();
        const question = (data.question || '').trim();
        const birthTime = (data.birthTime || '').trim();

        if (!name) {
            return new Response(JSON.stringify({ error: '请输入您的姓名' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const userInput = `${name}${question}${birthTime}${Date.now()}`;
        const hexagram = generateHexagram(userInput);
        hexagram.name_input = name;
        hexagram.question = question;

        const prompt = `【求测信息】
- 求测人：${name}
- 问题：${question}
- 出生时辰：${birthTime || '未提供'}

【卦象信息】
- 卦名：${hexagram.name}（第${hexagram.hexagram_num}卦）
- 拼音：${hexagram.pinyin || ''}
- 上卦：${hexagram.upper}（${BAGUA[hexagram.upper].nature}，${BAGUA[hexagram.upper].element}，方向${BAGUA[hexagram.upper].direction}）
- 下卦：${hexagram.lower}（${BAGUA[hexagram.lower].nature}，${BAGUA[hexagram.lower].element}，方向${BAGUA[hexagram.lower].direction}）
- 卦辞：${hexagram.guaci || '暂无'}
- 象辞：${hexagram.xiangci || '暂无'}
- 卦意：${hexagram.meaning}

【爻辞】
${hexagram.zhiyao && hexagram.zhiyao.length > 0 ? hexagram.zhiyao.join('\n') : '暂无'}

【卦义摘要】
${hexagram.summary || ''}

请结合易经智慧和用户的问题，给出专业详细的卦象解读和建议。要求：
1. 引用易经原文
2. 分析卦象的体用关系
3. 结合五行生克
4. 给出具体的行动建议
5. 判断吉凶和应期`;

        const explanation = await callDeepSeekAPI(prompt, 'REDACTED_DEEPSEEK_KEY');
        hexagram.explanation = explanation;

        return new Response(JSON.stringify(hexagram), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: '请求处理出错' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

const INDEX_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="description" content="易经算命系统 — 基于周易六十四卦、梅花易数与DeepSeek AI智能解读">
    <title>易经算命 | 卦象解读</title>
    <style>
        :root {
            --bg-deep: #1a1a2e;
            --bg-mid: #16213e;
            --gold: #ffd700;
            --gold-dim: rgba(255, 215, 0, 0.12);
            --gold-glow: rgba(255, 215, 0, 0.35);
            --text-primary: #e8e8e8;
            --text-secondary: #b0b0b0;
            --text-muted: #888;
            --card-bg: rgba(255, 255, 255, 0.04);
            --card-border: rgba(255, 255, 255, 0.08);
            --wuxing-metal: #ffd700;
            --wuxing-wood: #4caf50;
            --wuxing-water: #42a5f5;
            --wuxing-fire: #ef5350;
            --wuxing-earth: #ff9800;
            --judge-daji: #66bb6a;
            --judge-xiong: #ef5350;
            --judge-ping: #ffa726;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: "Noto Serif SC", "Songti SC", "SimSun", "STSong", -apple-system, BlinkMacSystemFont, "Segoe UI", serif;
            background: linear-gradient(170deg, #0d0d1a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%);
            background-attachment: fixed;
            min-height: 100vh;
            color: var(--text-primary);
            line-height: 1.7;
            overflow-x: hidden;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background:
                radial-gradient(ellipse at 15% 15%, rgba(255, 215, 0, 0.04) 0%, transparent 50%),
                radial-gradient(ellipse at 85% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 90%, rgba(100, 150, 255, 0.03) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 24px 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            z-index: 1;
        }

        /* ================================================================
           HEADER
           ================================================================ */
        .site-header {
            text-align: center;
            margin-bottom: 10px;
            padding-top: 10px;
        }
        .site-header .brand-icon {
            font-size: 2.4rem;
            color: var(--gold);
            text-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
            letter-spacing: 6px;
            margin-bottom: 6px;
        }
        .site-header h1 {
            font-size: 2.2rem;
            color: var(--gold);
            text-shadow: 0 0 35px rgba(255, 215, 0, 0.4), 0 0 70px rgba(255, 215, 0, 0.1);
            letter-spacing: 8px;
            margin-bottom: 0;
            font-weight: 700;
        }
        .site-header .ornament {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin: 12px 0 6px;
            color: rgba(255, 215, 0, 0.3);
            font-size: 0.6rem;
            letter-spacing: 4px;
        }
        .site-header .ornament::before,
        .site-header .ornament::after {
            content: '';
            flex: 1;
            max-width: 60px;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
        }
        .site-header .subtitle {
            color: var(--text-muted);
            font-size: 0.88rem;
            letter-spacing: 4px;
        }

        /* ================================================================
           FEATURE HIGHLIGHTS
           ================================================================ */
        .features-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 16px;
        }
        .feature-item {
            text-align: center;
            padding: 14px 8px;
            background: var(--card-bg);
            border-radius: 12px;
            border: 1px solid var(--card-border);
            transition: border-color 0.3s ease, background 0.3s ease;
        }
        .feature-item .feature-icon {
            font-size: 1.6rem;
            margin-bottom: 6px;
            display: block;
        }
        .feature-item .feature-label {
            font-size: 0.78rem;
            color: var(--text-secondary);
            letter-spacing: 2px;
            line-height: 1.4;
        }
        .feature-item:hover {
            border-color: rgba(255, 215, 0, 0.25);
            background: rgba(255, 215, 0, 0.04);
        }

        /* ================================================================
           FORM CARD
           ================================================================ */
        .form-card {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 28px 24px;
            backdrop-filter: blur(12px);
            border: 1px solid var(--card-border);
            margin-bottom: 16px;
        }
        .form-card .form-header {
            text-align: center;
            margin-bottom: 24px;
        }
        .form-card .form-header .step-badge {
            display: inline-block;
            font-size: 0.72rem;
            color: var(--gold);
            letter-spacing: 3px;
            padding: 4px 14px;
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            background: rgba(255, 215, 0, 0.06);
            margin-bottom: 10px;
        }
        .form-card .form-header h3 {
            font-size: 1.15rem;
            color: var(--text-primary);
            letter-spacing: 3px;
            font-weight: 600;
        }

        .form-group {
            margin-bottom: 20px;
        }
        .form-group .field-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        .form-group .field-num {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: rgba(255, 215, 0, 0.12);
            color: var(--gold);
            font-size: 0.8rem;
            font-weight: 700;
            flex-shrink: 0;
        }
        .form-group label {
            color: #c8c8c8;
            font-size: 0.92rem;
            letter-spacing: 2px;
        }
        .form-group .field-hint {
            font-size: 0.74rem;
            color: var(--text-muted);
            margin-top: 2px;
            margin-left: 36px;
            letter-spacing: 1px;
        }
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 14px 16px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.04);
            color: #fff;
            font-size: 0.98rem;
            font-family: inherit;
            transition: all 0.3s ease;
            letter-spacing: 1px;
        }
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--gold);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.15), inset 0 0 0 1px rgba(255, 215, 0, 0.1);
            background: rgba(255, 255, 255, 0.06);
        }
        .form-group textarea {
            resize: vertical;
            min-height: 90px;
            line-height: 1.6;
        }
        .form-group input::placeholder,
        .form-group textarea::placeholder {
            color: #555;
        }

        /* ================================================================
           BUTTONS
           ================================================================ */
        .btn {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.35s ease;
            letter-spacing: 4px;
            font-family: inherit;
        }
        .btn-primary {
            background: linear-gradient(135deg, #e6c200 0%, #ffd700 30%, #ffaa00 100%);
            color: #1a1a2e;
            position: relative;
            overflow: hidden;
        }
        .btn-primary::after {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s ease;
        }
        .btn-primary:hover::after {
            left: 100%;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(255, 215, 0, 0.35);
        }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        .btn-secondary {
            background: rgba(255, 255, 255, 0.06);
            color: var(--text-primary);
            border: 1px solid var(--card-border);
            letter-spacing: 3px;
        }
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 215, 0, 0.3);
        }

        /* ================================================================
           LOADING
           ================================================================ */
        .loading {
            display: none;
            text-align: center;
            padding: 60px 40px;
        }
        .loading.show { display: block; }
        .loading-bagua {
            width: 72px;
            height: 72px;
            margin: 0 auto 28px;
            position: relative;
        }
        .loading-bagua .ring {
            position: absolute;
            inset: 0;
            border: 3px solid transparent;
            border-radius: 50%;
            animation: baguaSpin 3s linear infinite;
        }
        .loading-bagua .ring:nth-child(1) {
            border-top-color: var(--gold);
            border-right-color: var(--gold);
        }
        .loading-bagua .ring:nth-child(2) {
            inset: 10px;
            border-bottom-color: rgba(255, 215, 0, 0.5);
            border-left-color: rgba(255, 215, 0, 0.5);
            animation-direction: reverse;
            animation-duration: 2s;
        }
        .loading-bagua .center-dot {
            position: absolute;
            inset: 50%;
            width: 10px;
            height: 10px;
            background: var(--gold);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 18px var(--gold-glow);
        }
        @keyframes baguaSpin { to { transform: rotate(360deg); } }
        .loading .loading-text {
            color: var(--text-secondary);
            letter-spacing: 3px;
            font-size: 0.95rem;
            animation: fadeText 2s ease-in-out infinite;
        }
        .loading .loading-sub {
            color: var(--text-muted);
            font-size: 0.78rem;
            letter-spacing: 1px;
            margin-top: 6px;
        }
        @keyframes fadeText {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
        }

        /* ================================================================
           ERROR
           ================================================================ */
        .error {
            color: #ef5350;
            text-align: center;
            padding: 16px;
            background: rgba(244, 67, 54, 0.08);
            border: 1px solid rgba(244, 67, 54, 0.2);
            border-radius: 10px;
            display: none;
            margin-bottom: 12px;
            letter-spacing: 1px;
        }
        .error.show { display: block; }

        /* ================================================================
           RESULT AREA
           ================================================================ */
        .result { display: none; }
        .result.show { display: block; }

        .result-card {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 14px;
            backdrop-filter: blur(12px);
            border: 1px solid var(--card-border);
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .result-card.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* ---------- 1. 卦名头部 ---------- */
        .header-card {
            text-align: center;
            padding: 32px 24px;
            border: 1px solid rgba(255, 215, 0, 0.18);
            background: rgba(255, 215, 0, 0.04);
        }
        .header-card .pinyin {
            font-size: 0.9rem;
            color: var(--text-muted);
            letter-spacing: 3px;
            margin-bottom: 8px;
            font-style: italic;
        }
        .header-card .hex-name {
            font-size: 2.4rem;
            color: var(--gold);
            text-shadow: 0 0 30px rgba(255, 215, 0, 0.45);
            letter-spacing: 8px;
        }
        .header-card .hex-num {
            font-size: 0.88rem;
            color: var(--text-muted);
            letter-spacing: 2px;
            margin: 6px 0 14px;
        }

        .judgement-badge {
            display: inline-block;
            padding: 6px 28px;
            border-radius: 20px;
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: 4px;
            animation: glowPulse 2s ease-in-out infinite;
        }
        .judgement-badge.daji {
            background: rgba(76, 175, 80, 0.18);
            color: var(--judge-daji);
            border: 1px solid rgba(76, 175, 80, 0.4);
            box-shadow: 0 0 18px rgba(76, 175, 80, 0.2);
        }
        .judgement-badge.xiong {
            background: rgba(244, 67, 54, 0.18);
            color: var(--judge-xiong);
            border: 1px solid rgba(244, 67, 54, 0.4);
            box-shadow: 0 0 18px rgba(244, 67, 54, 0.2);
        }
        .judgement-badge.ping {
            background: rgba(255, 152, 0, 0.18);
            color: var(--judge-ping);
            border: 1px solid rgba(255, 152, 0, 0.4);
            box-shadow: 0 0 18px rgba(255, 152, 0, 0.2);
        }
        @keyframes glowPulse {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.25); }
        }

        /* ---------- 2. 八卦详情 ---------- */
        .trigram-detail {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 14px;
            align-items: center;
            text-align: center;
        }
        .trigram-block {
            padding: 16px;
            background: rgba(255, 255, 255, 0.025);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .trigram-block .tri-symbol {
            font-size: 2.8rem;
            color: var(--gold);
            text-shadow: 0 0 16px rgba(255, 215, 0, 0.3);
            line-height: 1.2;
        }
        .trigram-block .tri-name {
            font-size: 1.4rem;
            color: var(--text-primary);
            letter-spacing: 3px;
            margin: 4px 0;
        }
        .trigram-block .tri-info {
            font-size: 0.8rem;
            color: var(--text-muted);
            line-height: 1.6;
        }
        .wuxing-dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 3px;
        }
        .wuxing-dot.metal { background: var(--wuxing-metal); box-shadow: 0 0 6px var(--wuxing-metal); }
        .wuxing-dot.wood  { background: var(--wuxing-wood);  box-shadow: 0 0 6px var(--wuxing-wood);  }
        .wuxing-dot.water { background: var(--wuxing-water); box-shadow: 0 0 6px var(--wuxing-water); }
        .wuxing-dot.fire  { background: var(--wuxing-fire);  box-shadow: 0 0 6px var(--wuxing-fire);  }
        .wuxing-dot.earth { background: var(--wuxing-earth); box-shadow: 0 0 6px var(--wuxing-earth); }

        .trigram-divider {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }
        .trigram-divider .taiji-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: conic-gradient(from 90deg, #1a1a2e 0% 50%, var(--gold) 50% 100%);
            position: relative;
            opacity: 0.65;
        }
        .trigram-divider .taiji-icon::after {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 10px; height: 10px;
            border-radius: 50%;
            background: var(--gold);
            box-shadow: 0 0 8px rgba(255,215,0,0.5);
        }
        .wuxing-relation {
            font-size: 0.78rem;
            letter-spacing: 1px;
            padding: 3px 12px;
            border-radius: 12px;
        }
        .wuxing-relation.sheng {
            color: #66bb6a;
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.18);
        }
        .wuxing-relation.ke {
            color: #ef5350;
            background: rgba(244, 67, 54, 0.1);
            border: 1px solid rgba(244, 67, 54, 0.18);
        }

        /* ---------- 3. 六爻卦象 ---------- */
        .hexagram-visual {
            padding: 20px 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }
        .section-title {
            color: var(--gold);
            font-size: 0.9rem;
            letter-spacing: 4px;
            margin-bottom: 12px;
            text-align: center;
        }
        .yao-row {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            max-width: 320px;
        }
        .yao-label {
            width: 48px;
            text-align: right;
            font-size: 0.82rem;
            color: var(--text-muted);
            letter-spacing: 1px;
            flex-shrink: 0;
        }
        .yao-line {
            flex: 1;
            height: 14px;
            border-radius: 7px;
            position: relative;
            overflow: hidden;
        }
        .yao-line.yang {
            background: linear-gradient(90deg, #b8860b, #ffd700, #ffec8b, #ffd700, #b8860b);
            box-shadow: 0 0 12px rgba(255,215,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
            animation: drawYang 0.8s ease-out forwards;
            transform-origin: left center;
        }
        .yao-line.yin {
            display: flex;
            gap: 16px;
            justify-content: center;
            background: transparent;
        }
        .yao-line.yin::before,
        .yao-line.yin::after {
            content: '';
            flex: 1;
            max-width: calc(50% - 14px);
            height: 14px;
            border-radius: 7px;
            background: linear-gradient(90deg, #4a4a6a, #6a6a8a, #4a4a6a);
            box-shadow: 0 0 6px rgba(100,100,160,0.2);
            animation: drawYinHalf 0.6s ease-out forwards;
            transform-origin: left center;
        }
        .yao-line.yin::after { animation-delay: 0.1s; }
        @keyframes drawYang   { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }
        @keyframes drawYinHalf { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }

        /* ---------- 4. 卦辞象辞 ---------- */
        .guaci-card {
            border-left: 4px solid var(--gold);
            background: rgba(255, 215, 0, 0.035);
        }
        .guaci-card .section-label {
            font-size: 0.76rem;
            color: var(--gold);
            letter-spacing: 3px;
            margin-bottom: 6px;
        }
        .guaci-card .guaci-text {
            font-size: 1.1rem;
            color: var(--gold);
            font-style: italic;
            letter-spacing: 2px;
            margin-bottom: 10px;
            line-height: 1.8;
        }
        .guaci-card .xiangci-text {
            font-size: 0.92rem;
            color: var(--text-secondary);
            letter-spacing: 1px;
            line-height: 1.8;
        }
        .guaci-card .meaning-text {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(255,255,255,0.07);
            font-size: 0.88rem;
            color: var(--text-muted);
            line-height: 1.8;
        }

        /* ---------- 5. 爻辞列表 ---------- */
        .yaoci-list {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        .yaoci-item {
            display: flex;
            gap: 12px;
            padding: 10px 14px;
            background: rgba(255,255,255,0.015);
            border-radius: 8px;
            transition: background 0.2s ease;
            align-items: baseline;
        }
        .yaoci-item:hover { background: rgba(255,215,0,0.04); }
        .yaoci-item .yaoci-pos {
            color: var(--gold);
            font-size: 0.82rem;
            font-weight: 600;
            white-space: nowrap;
            letter-spacing: 1px;
            min-width: 38px;
        }
        .yaoci-item .yaoci-content {
            color: var(--text-secondary);
            font-size: 0.88rem;
            line-height: 1.6;
        }

        /* ---------- 6. AI解读 ---------- */
        .explanation-card {
            border-left: 4px solid var(--gold);
            background: rgba(255,215,0,0.045);
            position: relative;
            overflow: hidden;
        }
        .explanation-card::after {
            content: '\\262F';
            position: absolute;
            right: 14px;
            bottom: 14px;
            font-size: 3.5rem;
            color: rgba(255,215,0,0.035);
            pointer-events: none;
            line-height: 1;
        }
        .explanation-content {
            color: #d8d8d8;
            font-size: 0.93rem;
            line-height: 2;
            position: relative;
            z-index: 1;
            white-space: pre-wrap;
        }

        /* ================================================================
           FOOTER
           ================================================================ */
        .site-footer {
            text-align: center;
            margin-top: 24px;
            color: #4a4a5a;
            font-size: 0.76rem;
            letter-spacing: 2px;
            line-height: 1.8;
        }
        .site-footer .footer-ornament {
            color: rgba(255,215,0,0.15);
            margin-bottom: 6px;
            letter-spacing: 4px;
        }

        /* ================================================================
           RESPONSIVE
           ================================================================ */
        @media (max-width: 480px) {
            .container { padding: 14px 12px; }
            .site-header h1 { font-size: 1.8rem; letter-spacing: 6px; }
            .site-header .brand-icon { font-size: 2rem; }
            .features-row { gap: 6px; }
            .feature-item { padding: 10px 6px; }
            .feature-item .feature-icon { font-size: 1.3rem; }
            .feature-item .feature-label { font-size: 0.7rem; letter-spacing: 1px; }
            .form-card { padding: 20px 16px; }
            .header-card { padding: 24px 16px; }
            .header-card .hex-name { font-size: 2rem; letter-spacing: 6px; }
            .trigram-detail { grid-template-columns: 1fr; gap: 10px; }
            .trigram-divider { flex-direction: row; }
            .trigram-divider .taiji-icon { width: 28px; height: 28px; }
            .trigram-block .tri-symbol { font-size: 2.2rem; }
            .trigram-block .tri-name { font-size: 1.2rem; }
            .yao-row { max-width: 100%; }
            .yao-label { width: 38px; font-size: 0.74rem; }
            .yao-line { height: 12px; }
            .yao-line.yin::before,
            .yao-line.yin::after { height: 12px; max-width: calc(50% - 10px); }
            .guaci-card .guaci-text { font-size: 1rem; }
            .explanation-card::after { font-size: 2.5rem; right: 8px; bottom: 8px; }
        }
    </style>
</head>
<body>
<div class="container">

    <!-- ========== HEADER ========== -->
    <div class="site-header">
        <div class="brand-icon">☰ ☷</div>
        <h1>易 经 算 命</h1>
        <div class="ornament">✦</div>
        <p class="subtitle">静心凝神 · 洞察天机</p>
    </div>

    <!-- ========== FEATURES ========== -->
    <div class="features-row">
        <div class="feature-item">
            <span class="feature-icon">☯</span>
            <span class="feature-label">八卦起卦</span>
        </div>
        <div class="feature-item">
            <span class="feature-icon">📖</span>
            <span class="feature-label">周易六十四卦</span>
        </div>
        <div class="feature-item">
            <span class="feature-icon">🤖</span>
            <span class="feature-label">AI 智能解读</span>
        </div>
    </div>

    <!-- ========== FORM ========== -->
    <div class="form-card" id="formCard">
        <div class="form-header">
            <span class="step-badge">请 填 写 信 息</span>
            <h3>诚心发问，卦象自明</h3>
        </div>
        <form id="fortuneForm">
            <div class="form-group">
                <div class="field-header">
                    <span class="field-num">壹</span>
                    <label for="name">您的姓名</label>
                </div>
                <input type="text" id="name" name="name" placeholder="请输入您的姓名" autocomplete="name" required>
                <div class="field-hint">卦象将与您的姓名相应，以求天人感应</div>
            </div>
            <div class="form-group">
                <div class="field-header">
                    <span class="field-num">贰</span>
                    <label for="question">您想问的事情</label>
                </div>
                <textarea id="question" name="question" placeholder="事业前程、姻缘感情、财运走向、求学考试……" required></textarea>
                <div class="field-hint">心诚则灵，问题越具体，卦象越精准</div>
            </div>
            <div class="form-group">
                <div class="field-header">
                    <span class="field-num">叁</span>
                    <label for="birthTime">出生时辰</label>
                    <span style="color:var(--text-muted);font-size:0.76rem;letter-spacing:1px;">（可选）</span>
                </div>
                <input type="text" id="birthTime" name="birthTime" placeholder="子时 · 丑时 · 寅时 · 卯时 · 辰时 · 巳时 · 午时 · 未时 · 申时 · 酉时 · 戌时 · 亥时">
                <div class="field-hint">生辰八字有助精准断卦，不知时辰可留空</div>
            </div>
            <button type="submit" class="btn btn-primary" id="submitBtn">☯ 　开 始 算 命　 ☯</button>
        </form>
    </div>

    <!-- ========== LOADING ========== -->
    <div class="loading" id="loading">
        <div class="loading-bagua">
            <div class="ring"></div>
            <div class="ring"></div>
            <div class="center-dot"></div>
        </div>
        <p class="loading-text">大师正在为您起卦解卦</p>
        <p class="loading-sub">静候片刻，天机将现…</p>
    </div>

    <!-- ========== ERROR ========== -->
    <div class="error" id="error"></div>

    <!-- ========== RESULT ========== -->
    <div class="result" id="result">

        <!-- 1. 卦名头部 -->
        <div class="result-card header-card" id="resultHeader">
            <div class="pinyin" id="hexPinyin"></div>
            <div class="hex-name" id="hexName"></div>
            <div class="hex-num" id="hexNum"></div>
            <span class="judgement-badge" id="judgementBadge"></span>
        </div>

        <!-- 2. 八卦详情 -->
        <div class="result-card" id="trigramCard">
            <div class="trigram-detail">
                <div class="trigram-block">
                    <div class="tri-symbol" id="upperSymbol"></div>
                    <div class="tri-name" id="upperName"></div>
                    <div class="tri-info" id="upperInfo"></div>
                </div>
                <div class="trigram-divider">
                    <div class="taiji-icon"></div>
                    <div class="wuxing-relation" id="wuxingRelation"></div>
                </div>
                <div class="trigram-block">
                    <div class="tri-symbol" id="lowerSymbol"></div>
                    <div class="tri-name" id="lowerName"></div>
                    <div class="tri-info" id="lowerInfo"></div>
                </div>
            </div>
        </div>

        <!-- 3. 六爻卦象 -->
        <div class="result-card hexagram-visual" id="hexagramVisual">
            <div class="section-title">◇ 六 爻 卦 象 ◇</div>
            <div id="yaoRows"></div>
        </div>

        <!-- 4. 卦辞象辞 -->
        <div class="result-card guaci-card" id="guaciCard">
            <div class="section-label">【卦 辞】</div>
            <div class="guaci-text" id="guaciText"></div>
            <div class="section-label" style="margin-top:6px;">【象 辞】</div>
            <div class="xiangci-text" id="xiangciText"></div>
            <div class="meaning-text" id="meaningText"></div>
        </div>

        <!-- 5. 爻辞列表 -->
        <div class="result-card yaoci-card" id="yaociCard">
            <div class="section-title">◇ 六 爻 爻 辞 ◇</div>
            <div class="yaoci-list" id="yaociList"></div>
        </div>

        <!-- 6. AI解读 -->
        <div class="result-card explanation-card" id="explanationCard">
            <div class="section-title">✦ 大 师 解 读 ✦</div>
            <div class="explanation-content" id="explanationContent"></div>
        </div>

        <button class="btn btn-secondary" onclick="resetForm()" style="margin-bottom:20px;">再 算 一 卦</button>
    </div>

    <!-- ========== FOOTER ========== -->
    <div class="site-footer">
        <div class="footer-ornament">── ✦ ──</div>
        <p>基于周易六十四卦 · 梅花易数 · DeepSeek AI</p>
        <p>本系统仅供娱乐参考</p>
    </div>

</div>

<script>
    const WUXING_SHENG = { '木':'火','火':'土','土':'金','金':'水','水':'木' };
    const WUXING_KE    = { '木':'土','土':'水','水':'火','火':'金','金':'木' };
    const WUXING_COLOR_CLASS = { '金':'metal','木':'wood','水':'water','火':'fire','土':'earth' };

    function getWuxingRelation(el1, el2) {
        if (WUXING_SHENG[el1] === el2) return { text: el1+'生'+el2, cls: 'sheng' };
        if (WUXING_SHENG[el2] === el1) return { text: el2+'生'+el1, cls: 'sheng' };
        if (WUXING_KE[el1] === el2)    return { text: el1+'克'+el2, cls: 'ke' };
        if (WUXING_KE[el2] === el1)    return { text: el2+'克'+el1, cls: 'ke' };
        return { text: el1+'比和'+el2, cls: 'sheng' };
    }

    function getYaoLabels(lines) {
        var positions = ['初','二','三','四','五','上'];
        return lines.map(function(line, i) { return positions[i] + (line===1?'九':'六'); });
    }

    var form      = document.getElementById('fortuneForm');
    var formCard  = document.getElementById('formCard');
    var loading   = document.getElementById('loading');
    var result    = document.getElementById('result');
    var errorEl   = document.getElementById('error');
    var submitBtn = document.getElementById('submitBtn');

    function showLoading() {
        formCard.style.display = 'none';
        result.classList.remove('show');
        errorEl.classList.remove('show');
        loading.classList.add('show');
    }

    function showResult(data) {
        loading.classList.remove('show');
        result.classList.add('show');

        document.getElementById('hexPinyin').textContent = data.pinyin || '';
        document.getElementById('hexName').textContent = data.name;
        document.getElementById('hexNum').textContent = '第 ' + data.hexagram_num + ' 卦';

        var badge = document.getElementById('judgementBadge');
        badge.textContent = data.judgement;
        badge.className = 'judgement-badge';
        if (data.judgement === '大吉') badge.classList.add('daji');
        else if (data.judgement === '凶') badge.classList.add('xiong');
        else badge.classList.add('ping');

        document.getElementById('upperSymbol').textContent = data.upper_symbol;
        document.getElementById('upperName').textContent = data.upper;
        document.getElementById('lowerSymbol').textContent = data.lower_symbol;
        document.getElementById('lowerName').textContent = data.lower;

        var upperEl = data.upper_element || '';
        var lowerEl = data.lower_element || '';
        var upperCls = WUXING_COLOR_CLASS[upperEl] || '';
        var lowerCls = WUXING_COLOR_CLASS[lowerEl] || '';

        document.getElementById('upperInfo').innerHTML =
            '<span class="wuxing-dot '+upperCls+'"></span>'+upperEl+' · '+(data.upper_nature||'')+' · '+(data.upper_direction||'');
        document.getElementById('lowerInfo').innerHTML =
            '<span class="wuxing-dot '+lowerCls+'"></span>'+lowerEl+' · '+(data.lower_nature||'')+' · '+(data.lower_direction||'');

        if (upperEl && lowerEl) {
            var rel = getWuxingRelation(upperEl, lowerEl);
            var relEl = document.getElementById('wuxingRelation');
            relEl.textContent = rel.text;
            relEl.className = 'wuxing-relation ' + rel.cls;
            relEl.style.display = '';
        } else {
            document.getElementById('wuxingRelation').style.display = 'none';
        }

        var yaoRows = document.getElementById('yaoRows');
        yaoRows.innerHTML = '';
        var labels = getYaoLabels(data.lines);
        for (var i = data.lines.length-1; i >= 0; i--) {
            var row = document.createElement('div');
            row.className = 'yao-row';
            var labelSpan = document.createElement('span');
            labelSpan.className = 'yao-label';
            labelSpan.textContent = labels[i];
            var lineDiv = document.createElement('div');
            lineDiv.className = 'yao-line ' + (data.lines[i]===1?'yang':'yin');
            lineDiv.style.animationDelay = (data.lines.length-1-i)*0.12+'s';
            row.appendChild(labelSpan);
            row.appendChild(lineDiv);
            yaoRows.appendChild(row);
        }

        var gt = document.getElementById('guaciText');
        var xt = document.getElementById('xiangciText');
        gt.style.display = data.guaci   ? '' : 'none';
        xt.style.display = data.xiangci ? '' : 'none';
        if (data.guaci)   gt.textContent = '「'+data.guaci+'」';
        if (data.xiangci) xt.textContent = '「'+data.xiangci+'」';
        document.getElementById('meaningText').textContent = data.meaning || '';

        var yaociList = document.getElementById('yaociList');
        yaociList.innerHTML = '';
        var yaociCard = document.getElementById('yaociCard');
        if (data.zhiyao && data.zhiyao.length > 0) {
            yaociCard.style.display = '';
            data.zhiyao.forEach(function(item) {
                var div = document.createElement('div');
                div.className = 'yaoci-item';
                var idx = item.indexOf('：')!==-1 ? item.indexOf('：') : item.indexOf(':');
                var pos = '', content = item;
                if (idx > 0) { pos = item.substring(0,idx); content = item.substring(idx+1); }
                div.innerHTML = '<span class="yaoci-pos">'+pos+'</span><span class="yaoci-content">'+content+'</span>';
                yaociList.appendChild(div);
            });
        } else {
            yaociCard.style.display = 'none';
        }

        document.getElementById('explanationContent').textContent = data.explanation || '';

        var cards = document.querySelectorAll('.result-card');
        cards.forEach(function(card, index) {
            card.classList.remove('visible');
            void card.offsetWidth;
            setTimeout(function() {
                card.style.transitionDelay = (index*0.08)+'s';
                card.classList.add('visible');
            }, 30);
        });
    }

    function showError(message) {
        loading.classList.remove('show');
        errorEl.textContent = message;
        errorEl.classList.add('show');
        formCard.style.display = '';
    }

    function resetForm() {
        result.classList.remove('show');
        formCard.style.display = '';
        form.reset();
        document.querySelectorAll('.result-card').forEach(function(c) { c.classList.remove('visible'); });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = '解读中...';
        showLoading();
        const formData = {
            name: document.getElementById('name').value,
            question: document.getElementById('question').value,
            birthTime: document.getElementById('birthTime').value
        };
        try {
            const response = await fetch('/api/fortune', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || '算命服务出错');
            showResult(data);
        } catch (err) {
            showError(err.message || '网络错误，请稍后重试');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '☯ 　开 始 算 命　 ☯';
        }
    });
</script>
</body>
</html>
`;
