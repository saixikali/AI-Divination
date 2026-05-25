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
    <meta name="description" content="易经算命系统，基于DeepSeek AI智能解读卦象">
    <title>易经算命 | 卦象解读</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            color: #e8e8e8;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 2rem; color: #ffd700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.3); margin-bottom: 8px; }
        .header p { color: #a0a0a0; font-size: 0.9rem; }
        .card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 8px; color: #c0c0c0; font-size: 0.9rem; }
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 14px 16px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        .form-group input:focus, .form-group textarea:focus {
            outline: none;
            border-color: #ffd700;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
        }
        .form-group textarea { resize: vertical; min-height: 80px; }
        .form-group input::placeholder, .form-group textarea::placeholder { color: #666; }
        .btn {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
            color: #1a1a2e;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .result { display: none; }
        .result.show { display: block; }
        .hexagram-display { text-align: center; margin-bottom: 24px; }
        .hexagram-symbols { display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 16px; }
        .trigram { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .trigram-symbol { font-size: 3rem; color: #ffd700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.4); }
        .trigram-name { font-size: 1.2rem; color: #e0e0e0; }
        .trigram-nature { font-size: 0.85rem; color: #888; }
        .divider { font-size: 2rem; color: rgba(255, 255, 255, 0.3); }
        .hexagram-lines { display: flex; flex-direction: column; align-items: center; gap: 4px; margin-top: 16px; }
        .hexagram-lines .line { display: flex; gap: 4px; }
        .hexagram-lines .yao { width: 40px; height: 8px; border-radius: 4px; }
        .hexagram-lines .yao.yang { background: linear-gradient(90deg, #ffd700, #ffaa00); }
        .hexagram-lines .yao.yin { background: linear-gradient(90deg, #4a4a6a, #3a3a5a); position: relative; }
        .hexagram-lines .yao.yin::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 16px; height: 2px; background: #1a1a2e; border-radius: 1px; }
        .hexagram-name-result { font-size: 1.5rem; color: #ffd700; margin: 16px 0 8px; }
        .hexagram-num { font-size: 0.9rem; color: #888; margin-bottom: 8px; }
        .judgement { display: inline-block; padding: 4px 16px; border-radius: 20px; font-size: 0.9rem; margin-bottom: 16px; }
        .judgement.daji { background: rgba(76, 175, 80, 0.2); color: #81c784; border: 1px solid rgba(76, 175, 80, 0.3); }
        .judgement.xiong { background: rgba(244, 67, 54, 0.2); color: #e57373; border: 1px solid rgba(244, 67, 54, 0.3); }
        .judgement.ping { background: rgba(255, 193, 7, 0.2); color: #ffd54f; border: 1px solid rgba(255, 193, 7, 0.3); }
        .guaci-box { background: rgba(255, 215, 0, 0.08); border-left: 3px solid #ffd700; padding: 12px 16px; margin-bottom: 12px; border-radius: 0 8px 8px 0; }
        .guaci-label { color: #ffd700; font-size: 0.85rem; margin-bottom: 4px; }
        .guaci-text { color: #d0d0d0; font-style: italic; font-size: 0.9rem; }
        .meaning { color: #b0b0b0; font-size: 0.95rem; line-height: 1.8; padding: 16px; background: rgba(255, 255, 255, 0.03); border-radius: 10px; margin-bottom: 16px; }
        .zhiyao-list { margin-bottom: 16px; }
        .zhiyao-title { color: #ffd700; font-size: 0.95rem; margin-bottom: 10px; }
        .zhiyao-item { padding: 8px 12px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; margin-bottom: 6px; font-size: 0.85rem; color: #c0c0c0; }
        .explanation { color: #d0d0d0; font-size: 0.95rem; line-height: 1.9; padding: 20px; background: rgba(255, 215, 0, 0.05); border-radius: 10px; border-left: 3px solid #ffd700; }
        .explanation-title { color: #ffd700; font-size: 1rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .loading { display: none; text-align: center; padding: 40px; }
        .loading.show { display: block; }
        .loading-spinner { width: 50px; height: 50px; border: 3px solid rgba(255, 215, 0, 0.2); border-top-color: #ffd700; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading p { color: #a0a0a0; }
        .error { color: #e57373; text-align: center; padding: 16px; background: rgba(244, 67, 54, 0.1); border-radius: 10px; display: none; }
        .error.show { display: block; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.8rem; }
        @media (max-width: 480px) {
            .container { padding: 16px; }
            .header h1 { font-size: 1.6rem; }
            .card { padding: 18px; }
            .trigram-symbol { font-size: 2.5rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>☰ 易经算命 ☷</h1>
            <p>静心凝神，洞察天机</p>
        </div>
        <div class="card" id="formCard">
            <form id="fortuneForm">
                <div class="form-group">
                    <label for="name">您的姓名</label>
                    <input type="text" id="name" name="name" placeholder="请输入姓名" required>
                </div>
                <div class="form-group">
                    <label for="question">您想问的事情</label>
                    <textarea id="question" name="question" placeholder="例如：事业发展、感情运势、财运走向..." required></textarea>
                </div>
                <div class="form-group">
                    <label for="birthTime">出生时辰（可选）</label>
                    <input type="text" id="birthTime" name="birthTime" placeholder="例如：子时、卯时">
                </div>
                <button type="submit" class="btn btn-primary" id="submitBtn">开始算命</button>
            </form>
        </div>
        <div class="loading" id="loading">
            <div class="loading-spinner"></div>
            <p>大师正在为您解读卦象...</p>
        </div>
        <div class="error" id="error"></div>
        <div class="card result" id="result">
            <div class="hexagram-display">
                <div class="hexagram-symbols">
                    <div class="trigram">
                        <span class="trigram-symbol" id="upperSymbol">☰</span>
                        <span class="trigram-name" id="upperName">乾</span>
                        <span class="trigram-nature" id="upperNature">天 · 西北</span>
                    </div>
                    <span class="divider">☰</span>
                    <div class="trigram">
                        <span class="trigram-symbol" id="lowerSymbol">☷</span>
                        <span class="trigram-name" id="lowerName">坤</span>
                        <span class="trigram-nature" id="lowerNature">地 · 西南</span>
                    </div>
                </div>
                <div class="hexagram-lines" id="hexagramLines"></div>
                <div class="hexagram-num" id="hexagramNum"></div>
                <div class="hexagram-name-result" id="hexagramName"></div>
                <span class="judgement" id="judgement"></span>
                <div id="guaciBox"></div>
                <div class="meaning" id="meaning"></div>
                <div class="zhiyao-list" id="zhiyaoList"></div>
            </div>
            <div class="explanation">
                <div class="explanation-title">✦ 大师解读 ✦</div>
                <div id="explanation"></div>
            </div>
            <button class="btn btn-primary" onclick="resetForm()" style="margin-top: 20px;">再次算命</button>
        </div>
        <div class="footer"><p>本系统仅供娱乐参考</p></div>
    </div>
    <script>
        const form = document.getElementById('fortuneForm');
        const formCard = document.getElementById('formCard');
        const loading = document.getElementById('loading');
        const result = document.getElementById('result');
        const errorEl = document.getElementById('error');
        const submitBtn = document.getElementById('submitBtn');

        function showLoading() {
            formCard.style.display = 'none';
            result.classList.remove('show');
            errorEl.classList.remove('show');
            loading.classList.add('show');
        }

        function showResult(data) {
            loading.classList.remove('show');
            result.classList.add('show');
            document.getElementById('upperSymbol').textContent = data.upper_symbol;
            document.getElementById('upperName').textContent = data.upper;
            document.getElementById('upperNature').textContent = data.upper_nature + ' · ' + data.upper_direction + ' · ' + data.upper_element;
            document.getElementById('lowerSymbol').textContent = data.lower_symbol;
            document.getElementById('lowerName').textContent = data.lower;
            document.getElementById('lowerNature').textContent = data.lower_nature + ' · ' + data.lower_direction + ' · ' + data.lower_element;
            document.getElementById('hexagramName').textContent = data.name;
            document.getElementById('hexagramNum').textContent = '第' + data.hexagram_num + '卦';
            document.getElementById('meaning').textContent = data.meaning;

            const judgementEl = document.getElementById('judgement');
            judgementEl.textContent = data.judgement;
            judgementEl.className = 'judgement';
            if (data.judgement === '大吉') judgementEl.classList.add('daji');
            else if (data.judgement === '凶') judgementEl.classList.add('xiong');
            else judgementEl.classList.add('ping');

            const guaciBox = document.getElementById('guaciBox');
            if (data.guaci) {
                guaciBox.innerHTML = `<div class="guaci-label">卦辞</div><div class="guaci-text">${data.guaci}</div>`;
            } else {
                guaciBox.innerHTML = '';
            }

            const linesContainer = document.getElementById('hexagramLines');
            linesContainer.innerHTML = '';
            data.lines.forEach(line => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'line';
                const yao = document.createElement('div');
                yao.className = 'yao ' + (line === 1 ? 'yang' : 'yin');
                lineDiv.appendChild(yao);
                linesContainer.appendChild(lineDiv);
            });

            const zhiyaoList = document.getElementById('zhiyaoList');
            if (data.zhiyao && data.zhiyao.length > 0) {
                zhiyaoList.innerHTML = '<div class="zhiyao-title">爻辞</div>' + data.zhiyao.map(item => `<div class="zhiyao-item">${item}</div>`).join('');
            } else {
                zhiyaoList.innerHTML = '';
            }

            document.getElementById('explanation').textContent = data.explanation;
        }

        function showError(message) {
            loading.classList.remove('show');
            errorEl.textContent = message;
            errorEl.classList.add('show');
            formCard.style.display = 'block';
        }

        function resetForm() {
            result.classList.remove('show');
            formCard.style.display = 'block';
            form.reset();
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
                submitBtn.textContent = '开始算命';
            }
        });
    </script>
</body>
</html>`;