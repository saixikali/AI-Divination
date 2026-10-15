"""
算命系统 - Flask后端
提供多种占卜方式（易经起卦 / 灵签问事 / 塔罗占卜 / 姓名测算 / 每日运势）
并接入 DeepSeek AI，以"老师傅"的口吻给出有人情味的解读。
"""
import os
import random
import json
import hashlib
from datetime import datetime, date
from flask import Flask, request, jsonify, send_file
from dotenv import load_dotenv

# 显式指定 .env 路径，避免 Flask reloader 子进程工作目录变化导致加载失败
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'))

app = Flask(__name__, static_folder='public', static_url_path='')

DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY', '')
DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

# ============================================================================
# 基础数据
# ============================================================================
BAGUA = {
    '乾': {'symbol': '☰', 'nature': '天', 'direction': '西北', 'meaning': '刚健、自强不息', 'lines': [1, 1, 1], 'element': '金', 'shu': '1'},
    '坤': {'symbol': '☷', 'nature': '地', 'direction': '西南', 'meaning': '柔顺、厚德载物', 'lines': [0, 0, 0], 'element': '土', 'shu': '8'},
    '震': {'symbol': '☳', 'nature': '雷', 'direction': '东', 'meaning': '震动、奋发', 'lines': [1, 0, 0], 'element': '木', 'shu': '4'},
    '巽': {'symbol': '☴', 'nature': '风', 'direction': '东南', 'meaning': '渗入、谦逊', 'lines': [0, 1, 0], 'element': '木', 'shu': '5'},
    '坎': {'symbol': '☵', 'nature': '水', 'direction': '北', 'meaning': '险陷、智慧', 'lines': [0, 1, 1], 'element': '水', 'shu': '6'},
    '离': {'symbol': '☲', 'nature': '火', 'direction': '南', 'meaning': '光明、美丽', 'lines': [1, 0, 1], 'element': '火', 'shu': '3'},
    '艮': {'symbol': '☶', 'nature': '山', 'direction': '东北', 'meaning': '停止、稳重', 'lines': [1, 1, 0], 'element': '土', 'shu': '7'},
    '兑': {'symbol': '☱', 'nature': '泽', 'direction': '西', 'meaning': '喜悦、言语', 'lines': [0, 0, 1], 'element': '金', 'shu': '2'},
}

HEXAGRAMS = {
    ('乾', '乾'): {'name': '乾为天', 'judgement': '大吉', 'meaning': '象征天，纯阳至健。诸事大吉大利，飞龙在天，利见大人。'},
    ('坤', '坤'): {'name': '坤为地', 'judgement': '大吉', 'meaning': '象征地，纯阴至顺。地势坤，君子以厚德载物。'},
    ('乾', '坤'): {'name': '天地否', 'judgement': '凶', 'meaning': '天地不通，阴阳不合。诸事不顺，需守正等待时机。'},
    ('坤', '乾'): {'name': '地天泰', 'judgement': '大吉', 'meaning': '天地交泰，阴阳相合。诸事亨通，国泰民安。'},
}

# 塔罗牌 - 大阿卡纳 22 张
TAROT = [
    {'name': '愚者', 'emoji': '🃏', 'upright': '新的开始、自由、放手一搏', 'reversed': '盲目冲动、犹豫不决、逃避'},
    {'name': '魔术师', 'emoji': '🎩', 'upright': '创造、行动力、资源在手', 'reversed': '能力不足、计划落空、自我怀疑'},
    {'name': '女祭司', 'emoji': '🌙', 'upright': '直觉、潜意识、静待时机', 'reversed': '忽视内心、秘密、困惑'},
    {'name': '皇后', 'emoji': '👑', 'upright': '丰盛、滋养、温柔的力量', 'reversed': '依赖、空虚、创造力受阻'},
    {'name': '皇帝', 'emoji': '🏛️', 'upright': '权威、秩序、稳定掌控', 'reversed': '固执、专断、失控'},
    {'name': '教皇', 'emoji': '📿', 'upright': '传统、信念、贵人指引', 'reversed': '墨守成规、盲从、叛逆'},
    {'name': '恋人', 'emoji': '💞', 'upright': '爱情、重要抉择、心意相通', 'reversed': '分歧、犹豫、关系紧张'},
    {'name': '战车', 'emoji': '🛡️', 'upright': '胜利、凭意志前进', 'reversed': '失速、方向不明、内耗'},
    {'name': '力量', 'emoji': '🦁', 'upright': '勇气、以柔克刚、内在坚定', 'reversed': '自我怀疑、情绪失控'},
    {'name': '隐士', 'emoji': '🕯️', 'upright': '内省、独处、寻道', 'reversed': '孤立、迷惘、拒绝成长'},
    {'name': '命运之轮', 'emoji': '🎡', 'upright': '转机、循环、好运将至', 'reversed': '波折、停滞、反复'},
    {'name': '正义', 'emoji': '⚖️', 'upright': '公正、因果、厘清对错', 'reversed': '偏颇、纠缠、不公'},
    {'name': '倒吊人', 'emoji': '🙃', 'upright': '换位、等待、换个角度看', 'reversed': '无谓牺牲、拖延、抗拒'},
    {'name': '死神', 'emoji': '💀', 'upright': '结束与蜕变、破后而立', 'reversed': '抗拒改变、原地打转'},
    {'name': '节制', 'emoji': '🏺', 'upright': '调和、耐心、平衡之道', 'reversed': '失衡、急躁、过度'},
    {'name': '恶魔', 'emoji': '😈', 'upright': '束缚、欲望、执念', 'reversed': '挣脱、觉察、放下'},
    {'name': '高塔', 'emoji': '🗼', 'upright': '突变、崩塌、骤然觉醒', 'reversed': '灾后重建、缓和的冲击'},
    {'name': '星星', 'emoji': '⭐', 'upright': '希望、治愈、前路有光', 'reversed': '失望、迷茫、信心不足'},
    {'name': '月亮', 'emoji': '🌕', 'upright': '迷雾、潜意识、未知', 'reversed': '释疑、真相渐明'},
    {'name': '太阳', 'emoji': '☀️', 'upright': '喜悦、成功、光明坦途', 'reversed': '短暂的阴霾、过度乐观'},
    {'name': '审判', 'emoji': '📯', 'upright': '觉醒、复盘、重新出发', 'reversed': '自我否定、错失召唤'},
    {'name': '世界', 'emoji': '🌍', 'upright': '圆满、完成、阶段达成', 'reversed': '未竟、收尾仓促'},
]

# 灵签 - 精选 18 支（上/中/下）
LINGQIAN = [
    {'num': 1, 'name': '开天辟地', 'level': '上签', 'poem': '风云际会正当时，拨开云雾见月明。', 'note': '时运已到，所谋皆遂，宜大胆前行。'},
    {'num': 3, 'name': '枯木逢春', 'level': '上签', 'poem': '枯木逢春又发芽，旧事重提另有花。', 'note': '困顿之后转机将至，久拖之事终有回响。'},
    {'num': 5, 'name': '鲤跃龙门', 'level': '上签', 'poem': '十年寒窗今得志，一举成名天下知。', 'note': '功名进取大吉，考试求职皆宜。'},
    {'num': 8, 'name': '明月当空', 'level': '上签', 'poem': '明月当空照四方，心中无事自清凉。', 'note': '心境开朗，诸事和顺，感情尤佳。'},
    {'num': 12, 'name': '顺风扬帆', 'level': '上签', 'poem': '顺水行舟不用力，顺风扬帆到天涯。', 'note': '得天时地利，趁势而为事半功倍。'},
    {'num': 15, 'name': '守拙藏锋', 'level': '中签', 'poem': '藏器于身待良时，莫因小利乱心机。', 'note': '时机未足，宜守不宜攻，静观其变。'},
    {'num': 18, 'name': '柳暗花明', 'level': '中签', 'poem': '山重水复疑无路，柳暗花明又一村。', 'note': '先难后易，勿轻言放弃，转机在转角。'},
    {'num': 21, 'name': '云中见月', 'level': '中签', 'poem': '浮云暂蔽月华光，风过云开见本相。', 'note': '眼前有扰，真相未显，稍候自明。'},
    {'num': 24, 'name': '耕耘有获', 'level': '中签', 'poem': '一日三餐靠苦辛，勤耕自有满仓粮。', 'note': '财运平实，靠踏实经营，急不得。'},
    {'num': 27, 'name': '镜花水月', 'level': '中签', 'poem': '镜里看花空有色，水中捞月总成虚。', 'note': '虚虚实实，所求恐难落实，宜三思。'},
    {'num': 30, 'name': '守株待兔', 'level': '下签', 'poem': '痴守空株待兔来，不知机变自痴呆。', 'note': '守旧无成，宜主动求变，莫存侥幸。'},
    {'num': 33, 'name': '逆水行舟', 'level': '下签', 'poem': '逆水行舟用力艰，不进则退在心间。', 'note': '阻力重重，需加倍用心，否则退步。'},
    {'num': 36, 'name': '月缺花残', 'level': '下签', 'poem': '好花偏遇连阴雨，圆月常逢云雾遮。', 'note': '美中不足，感情易生波折，多包容。'},
    {'num': 39, 'name': '迷途知返', 'level': '中签', 'poem': '错入迷途未算迟，回头便是正当时。', 'note': '走偏了没关系，及时纠偏仍可安。'},
    {'num': 42, 'name': '金石为开', 'level': '上签', 'poem': '精诚所至金石开，一片真心天也哀。', 'note': '以诚动人，感情与人际皆能破局。'},
    {'num': 45, 'name': '平地风波', 'level': '下签', 'poem': '无端平地起风波，谨言慎行免招祸。', 'note': '小人近身，口舌是非，宜低调。'},
    {'num': 48, 'name': '枯井逢泉', 'level': '中签', 'poem': '久旱枯井得清泉，困穷至此渐回甘。', 'note': '低谷将过，渐入佳境，贵在坚持。'},
    {'num': 51, 'name': '凤鸣朝阳', 'level': '上签', 'poem': '丹凤朝阳展翅飞，声闻四海显威仪。', 'note': '声名鹊起，事业腾达，正是好时机。'},
]

# 生肖与每日运势素材
ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
ZODIAC_INFO = {
    '鼠': '机敏灵动，今日宜多听少说，机会藏在细节里。',
    '牛': '踏实稳重，今日按部就班即可，莫被他人节奏带跑。',
    '虎': '气势十足，今日适合主动出击，但记得留三分余地。',
    '兔': '温和细心，今日人际顺遂，贵人或许就在身边。',
    '龙': '自信昂扬，今日格局打开，宜谋划长远之事。',
    '蛇': '沉静内敛，今日宜深思熟虑，关键的判断靠直觉。',
    '马': '奔放热情，今日行动力强，但别一头热冲过头。',
    '羊': '温厚随和，今日宜与人协作，独木难成林。',
    '猴': '机变灵活，今日点子多，挑最靠谱的一个落地。',
    '鸡': '严谨认真，今日宜把细节做漂亮，口碑由此来。',
    '狗': '忠诚可靠，今日宜守成，对身边人多一些耐心。',
    '猪': '豁达乐天，今日心情好则运道好，先照顾好自己。',
}
YI_POOL = ['出行', '签约', '表白', '投资', '学习', '装修', '社交', '求职', '理财', '聚会', '运动', '表心意']
JI_POOL = ['争吵', '冲动消费', '熬夜', '借贷', '重大决定', '远行', '跳槽', '酗酒', '口舌', '独断']
COLOR_POOL = ['金色', '红色', '青色', '白色', '黑色', '蓝色', '黄色', '紫色', '绿色']
DIR_POOL = ['正东', '正南', '正西', '正北', '东南', '西南', '东北', '西北']

WUXING_SHENG = {'木': '火', '火': '土', '土': '金', '金': '水', '水': '木'}
WUXING_KE = {'木': '土', '土': '水', '水': '火', '火': '金', '金': '木'}
ELEMENTS = ['金', '木', '水', '火', '土']

# ============================================================================
# 占卜类型配置（前端据此动态生成表单）
# ============================================================================
TYPES = [
    {
        'id': 'zhouyi', 'label': '易经起卦', 'icon': '☯', 'desc': '以姓名心愿起卦，观六十四卦玄机',
        'fields': [
            {'key': 'name', 'label': '您的姓名', 'type': 'text', 'required': True, 'hint': '卦象与您相应，以求天人感应', 'placeholder': '请输入您的姓名'},
            {'key': 'question', 'label': '您想问的事', 'type': 'textarea', 'required': True, 'hint': '心诚则灵，越具体越准', 'placeholder': '事业前程、姻缘感情、财运走向……'},
            {'key': 'birthTime', 'label': '出生时辰', 'type': 'text', 'required': False, 'hint': '生辰有助断卦，不知可留空', 'placeholder': '子时 / 卯时 / 午时 …'},
        ],
    },
    {
        'id': 'lingqian', 'label': '灵签问事', 'icon': '🏮', 'desc': '心有所疑，诚心求一签以决疑',
        'fields': [
            {'key': 'name', 'label': '您的姓名', 'type': 'text', 'required': False, 'hint': '留空亦可', 'placeholder': '可不填'},
            {'key': 'question', 'label': '心中所问', 'type': 'textarea', 'required': True, 'hint': '默念所求，再诚心求签', 'placeholder': '姻缘可否成 / 此事吉凶如何 …'},
        ],
    },
    {
        'id': 'tarot', 'label': '塔罗占卜', 'icon': '🎴', 'desc': '抽三张塔罗，照见过去·现在·未来',
        'fields': [
            {'key': 'name', 'label': '您的姓名', 'type': 'text', 'required': False, 'hint': '留空亦可', 'placeholder': '可不填'},
            {'key': 'question', 'label': '占问之事', 'type': 'textarea', 'required': True, 'hint': '专注一个问题，再抽牌', 'placeholder': '当下的困惑 / 面临的选择 …'},
        ],
    },
    {
        'id': 'xingming', 'label': '姓名测算', 'icon': '✒️', 'desc': '拆名解字，探姓名中藏的运势',
        'fields': [
            {'key': 'name', 'label': '要测算的名字', 'type': 'text', 'required': True, 'hint': '为您自己或他人起名参考', 'placeholder': '请输入姓名'},
            {'key': 'birthTime', 'label': '生肖 / 出生年', 'type': 'text', 'required': False, 'hint': '如：龙 / 1990，用于补益参考', 'placeholder': '可选，如 马'},
        ],
    },
    {
        'id': 'yunshi', 'label': '每日运势', 'icon': '📅', 'desc': '看今日黄历，知宜忌与吉方',
        'fields': [
            {'key': 'zodiac', 'label': '您的生肖', 'type': 'text', 'required': True, 'hint': '鼠牛虎兔龙蛇马羊猴鸡狗猪', 'placeholder': '如：龙'},
            {'key': 'name', 'label': '您的姓名', 'type': 'text', 'required': False, 'hint': '留空亦可', 'placeholder': '可不填'},
        ],
    },
]

TYPE_LABELS = {t['id']: t['label'] for t in TYPES}

# ============================================================================
# 工具函数
# ============================================================================
def seed_from(*parts):
    base = '|'.join(str(p) for p in parts)
    return int(hashlib.md5(base.encode('utf-8')).hexdigest(), 16)

def luck_cls(text):
    if not text:
        return 'ping'
    if any(k in text for k in ['大吉', '上吉', '上签', '吉']):
        return 'daji'
    if any(k in text for k in ['凶', '下签']):
        return 'xiong'
    return 'ping'

def rel_cls(rel):
    if '克' in rel:
        return 'ke'
    return 'sheng'

def wuxing_relation(el1, el2):
    if not el1 or not el2:
        return ''
    if WUXING_SHENG.get(el1) == el2:
        return f'{el1}生{el2}'
    if WUXING_SHENG.get(el2) == el1:
        return f'{el2}生{el1}'
    if WUXING_KE.get(el1) == el2:
        return f'{el1}克{el2}'
    if WUXING_KE.get(el2) == el1:
        return f'{el2}克{el1}'
    return f'{el1}比和{el2}'

def yao_labels(lines):
    positions = ['初', '二', '三', '四', '五', '上']
    return [positions[i] + ('九' if lines[i] == 1 else '六') for i in range(len(lines))]

def trigram_block(gua):
    b = BAGUA[gua]
    return {'symbol': b['symbol'], 'name': gua, 'element': b['element'], 'nature': b['nature'], 'direction': b['direction']}

# ============================================================================
# 各类占卜生成器 —— 返回 (blocks 列表, context 文本)
# ============================================================================
def gen_zhouyi(name, question, birth):
    user_input = f"{name}{question}{birth}{date.today().isoformat()}"
    rnd = random.Random(seed_from(user_input))
    gua1 = rnd.choice(list(BAGUA.keys()))
    gua2 = rnd.choice(list(BAGUA.keys()))
    key = (gua1, gua2)
    if key in HEXAGRAMS:
        hex_info = HEXAGRAMS[key]
    else:
        hex_info = {
            'name': f'{gua1}{gua2}',
            'judgement': '平',
            'meaning': f"{BAGUA[gua1]['meaning']}上，{BAGUA[gua2]['meaning']}下，相辅相成。",
        }
    lines = BAGUA[gua1]['lines'] + BAGUA[gua2]['lines']
    upper_el = BAGUA[gua1]['element']
    lower_el = BAGUA[gua2]['element']
    rel = wuxing_relation(upper_el, lower_el)
    num = (int(BAGUA[gua1]['shu']) - 1) * 8 + int(BAGUA[gua2]['shu'])

    blocks = [
        {'kind': 'header', 'title': hex_info['name'], 'pinyin': '', 'num': f'第 {num} 卦',
         'badge': {'text': hex_info['judgement'], 'cls': luck_cls(hex_info['judgement'])}},
        {'kind': 'pair', 'left': trigram_block(gua1), 'right': trigram_block(gua2),
         'center': {'text': rel, 'cls': rel_cls(rel)} if rel else None},
        {'kind': 'lines', 'labels': yao_labels(lines), 'values': lines},
        {'kind': 'text', 'title': '【卦 意】', 'text': hex_info['meaning']},
    ]
    context = (
        f"卦名：{hex_info['name']}（周易第 {num} 卦）\n"
        f"上卦：{gua1}（{BAGUA[gua1]['nature']}，五行{BAGUA[gua1]['element']}）\n"
        f"下卦：{gua2}（{BAGUA[gua2]['nature']}，五行{BAGUA[gua2]['element']}）\n"
        f"卦辞吉凶：{hex_info['judgement']}\n"
        f"卦意：{hex_info['meaning']}\n"
        f"五行关系：{rel}"
    )
    return blocks, context

def gen_lingqian(name, question, birth):
    rnd = random.Random(seed_from(name, question, birth, date.today().isoformat()))
    q = rnd.choice(LINGQIAN)
    blocks = [
        {'kind': 'header', 'title': f"{q['num']} 号签 · {q['name']}", 'pinyin': '', 'num': '灵签问事',
         'badge': {'text': q['level'], 'cls': luck_cls(q['level'])}},
        {'kind': 'verse', 'text': q['poem']},
        {'kind': 'text', 'title': '【签 注】', 'text': q['note']},
    ]
    context = (
        f"求得第 {q['num']} 号签：{q['name']}（{q['level']}）\n"
        f"签诗：{q['poem']}\n"
        f"签注：{q['note']}"
    )
    return blocks, context

def gen_tarot(name, question, birth):
    rnd = random.Random(seed_from('tarot', name, question, birth, date.today().isoformat()))
    positions = ['过去 · 起因', '现在 · 状况', '未来 · 走向']
    pool = list(range(len(TAROT)))
    rnd.shuffle(pool)
    picks = []
    for i, pos in enumerate(positions):
        card = TAROT[pool[i]]
        is_reversed = rnd.random() < 0.25
        meaning = card['reversed'] if is_reversed else card['upright']
        picks.append({
            'name': card['name'], 'emoji': card['emoji'], 'pos': pos,
            'reversed': is_reversed, 'meaning': meaning,
        })
    blocks = [
        {'kind': 'header', 'title': '塔罗三牌阵', 'pinyin': '', 'num': '过去 · 现在 · 未来',
         'badge': {'text': '已抽三牌', 'cls': 'ping'}},
        {'kind': 'cards', 'items': picks},
    ]
    context = '抽出三张牌：\n' + '\n'.join(
        f"{p['pos']}：{p['name']}（{'逆位' if p['reversed'] else '正位'}）— {p['meaning']}"
        for p in picks
    )
    return blocks, context

def gen_xingming(name, question, birth):
    rnd = random.Random(seed_from('name', name, birth))
    char_els = [ELEMENTS[ord(c) % 5] for c in name]
    if len(name) >= 3:
        san = [char_els[0], char_els[len(name) // 2], char_els[-1]]
    elif len(name) == 2:
        san = [char_els[0], char_els[1], char_els[1]]
    else:
        san = [char_els[0], char_els[0], char_els[0]]
    score = 60 + rnd.randint(0, 39)
    if len(set(char_els)) <= 2:
        verdict = '此名五行流转有情，气韵相通，读来顺口养心。'
    else:
        verdict = '此名五行错落有致，刚柔相济，自有其章法。'
    if birth:
        verdict += f' 再借{birth}之象调和，更添一层底气。'
    blocks = [
        {'kind': 'header', 'title': name, 'pinyin': '', 'num': '姓名测算',
         'badge': {'text': f'{score} 分', 'cls': 'daji' if score >= 85 else 'ping'}},
        {'kind': 'kv', 'title': '【名 理】', 'items': [
            {'k': '姓名', 'v': name},
            {'k': '字数', 'v': f'{len(name)} 字'},
            {'k': '五行', 'v': ' · '.join(char_els)},
            {'k': '三才', 'v': ' → '.join(san)},
            {'k': '综合评价', 'v': verdict},
        ]},
    ]
    context = (
        f"测算名字：{name}（{len(name)} 字）\n"
        f"各字五行：{' / '.join(char_els)}\n"
        f"三才配置：{' → '.join(san)}\n"
        f"姓名评分：{score}\n"
        f"评语：{verdict}"
    )
    return blocks, context

def gen_yunshi(name, question, zodiac):
    z = zodiac
    for zz in ZODIAC:
        if zz in z:
            z = zz
            break
    zi = ZODIAC.index(z) if z in ZODIAC else 0
    today = date.today()
    rnd = random.Random(zi * 1000 + today.toordinal())
    yi = rnd.sample(YI_POOL, 2)
    ji = rnd.sample(JI_POOL, 2)
    color = rnd.choice(COLOR_POOL)
    direction = rnd.choice(DIR_POOL)
    number = rnd.randint(1, 9)
    luck = rnd.choice(['上吉', '中吉', '小吉', '平'])
    base = ZODIAC_INFO.get(z, '今日运势平稳，按自己的节奏来就好。')
    blocks = [
        {'kind': 'header', 'title': f'{z} · 今日运势', 'pinyin': '', 'num': f'{today.year}年{today.month}月{today.day}日',
         'badge': {'text': luck, 'cls': luck_cls(luck)}},
        {'kind': 'kv', 'title': '【今 日 黄 历】', 'items': [
            {'k': '宜', 'v': '、'.join(yi), 'cls': 'sheng'},
            {'k': '忌', 'v': '、'.join(ji), 'cls': 'ke'},
            {'k': '幸运色', 'v': color},
            {'k': '吉利方位', 'v': direction},
            {'k': '幸运数字', 'v': str(number)},
        ]},
        {'kind': 'text', 'title': '【总 评】', 'text': base},
    ]
    context = (
        f"生肖：{z}\n日期：{today.isoformat()}\n综合：{luck}\n"
        f"宜：{'、'.join(yi)}\n忌：{'、'.join(ji)}\n"
        f"幸运色：{color}\n吉利方位：{direction}\n幸运数字：{number}\n"
        f"总评：{base}"
    )
    return blocks, context

GENERATORS = {
    'zhouyi': gen_zhouyi,
    'lingqian': gen_lingqian,
    'tarot': gen_tarot,
    'xingming': gen_xingming,
    'yunshi': gen_yunshi,
}

# ============================================================================
# AI 调用（拟人化"老师傅"口吻）
# ============================================================================
SYSTEM_PROMPT = """你是一位阅历深厚、说话像邻家老师傅般的占卜师，街坊都叫你一声"先生"。
你不是那种端着架子、满口之乎者也的神棍，反而有点烟火气：偶尔幽默，懂得共情，说话不绕弯子，又留得住分寸。

【说话风格】
- 像真人面对面聊天，句子有长有短，多用"你、咱、其实、话说回来、说句实在的"这类自然口语。
- 别整"首先—其次—最后"的八股，也别堆砌文言文显得假。可以顺手引一两句俗语或诗词，但要像随口说的，不是掉书袋。
- 开头别总用"根据卦象显示""根据签文"。换着花样来：可以闲聊一句、可以轻轻反问、可以先点个题再展开。
- 给用户的具体问题一个实在、有温度、能落地的回应，而不是空话套话。
- 适当留白和不确定性，别把话说死。多用"大概率、看起来、不妨、倒是"这类软语气。
- 结尾给一句轻轻的鼓励或小提醒，让人看完心里舒坦，而不是被吓到或敷衍。
- 若用户给了姓名，自然称呼（如"小X""X啊"），别硬喊全名；没给就直接用"你"。

【约束】
- 用简体中文，口语化但不粗俗，像活人说话。
- 篇幅适中，3 到 5 个自然段，别写成长篇小作文。
- 把提供给你的占卜素材（卦象 / 签文 / 牌面 / 运势要点）自然地揉进对话里，别一条条列清单。
- 这是娱乐占卜，结尾或文中自然地提一句"权当参考，路还是要自己走"，别太当真也别太轻飘。"""

def build_user_prompt(type_id, context, name, question):
    who = name if name else '这位朋友'
    q_part = f"\n他/她心里想问的是：「{question}」" if question else '\n他/她没说具体心事，就当是来随便看看运势。'
    return (
        f"占卜方式：{TYPE_LABELS.get(type_id, type_id)}\n"
        f"来人称呼：{who}{q_part}\n\n"
        f"这次占得的結果如下：\n{context}\n\n"
        f"请用你（先生）的口吻，像跟朋友喝茶聊天那样，给一段自然、有温度、有干货的解读。"
        f"别列清单，别端着，把上面的素材化进你的话里。最后落一句让人心里舒服的话。"
    )

def sync_call_deepseek(prompt):
    import urllib.request
    import ssl

    if not DEEPSEEK_API_KEY:
        return '（今日天机已显于上，先生正闭目凝神，稍候再来听他细说～）'

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
    }
    payload = {
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': prompt},
        ],
        'temperature': 0.85,
        'max_tokens': 1100,
    }
    try:
        context = ssl.create_default_context()
        req = urllib.request.Request(
            DEEPSEEK_API_URL,
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=30, context=context) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except Exception as e:
        print(f'[DeepSeek API error] {type(e).__name__}: {e}')
        return '（先生今日网络不畅，卦象已为您排好，稍后再来听他细说～）'

# ============================================================================
# 路由
# ============================================================================
@app.route('/')
def index():
    return send_file('public/index.html')

@app.route('/preview')
def preview():
    return send_file('public/index.html')

@app.route('/api/types', methods=['GET'])
def types_api():
    return jsonify(TYPES)

@app.route('/api/fortune', methods=['POST'])
def fortune_api():
    data = request.get_json(silent=True) or {}
    type_id = (data.get('type') or 'zhouyi').strip()
    if type_id not in GENERATORS:
        return jsonify({'error': '未知的占卜类型'}), 400

    fields = {t['id']: t for t in TYPES}[type_id]['fields']
    values = {}
    for f in fields:
        values[f['key']] = (data.get(f['key']) or '').strip()
        if f['required'] and not values[f['key']]:
            return jsonify({'error': f"请填写「{f['label']}」"}), 400

    name = values.get('name', '')
    question = values.get('question', '')
    birth = values.get('birthTime', '')
    zodiac = values.get('zodiac', '')

    blocks, context = GENERATORS[type_id](name, question, birth) if type_id != 'yunshi' \
        else gen_yunshi(name, question, zodiac)

    user_prompt = build_user_prompt(type_id, context, name, question)
    explanation = sync_call_deepseek(user_prompt)

    blocks.append({'kind': 'ai', 'title': '✦ 先生解读 ✦', 'text': explanation})

    return jsonify({
        'type': type_id,
        'type_label': TYPE_LABELS.get(type_id, type_id),
        'name': name,
        'question': question,
        'blocks': blocks,
    })

@app.route('/api/bagua')
def bagua_api():
    return jsonify(BAGUA)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
