// 算命系统 - Cloudflare 后端（支持五种占卜 + 拟人化 AI 解读）
// 同时用于 Pages Functions (functions/index.js) 与 Workers (_worker.js)

const BAGUA = {
  '乾': {'symbol':'☰','nature':'天','direction':'西北','lines':[1,1,1],'element':'金','shu':'1'},
  '坤': {'symbol':'☷','nature':'地','direction':'西南','lines':[0,0,0],'element':'土','shu':'8'},
  '震': {'symbol':'☳','nature':'雷','direction':'东','lines':[1,0,0],'element':'木','shu':'4'},
  '巽': {'symbol':'☴','nature':'风','direction':'东南','lines':[0,1,0],'element':'木','shu':'5'},
  '坎': {'symbol':'☵','nature':'水','direction':'北','lines':[0,1,1],'element':'水','shu':'6'},
  '离': {'symbol':'☲','nature':'火','direction':'南','lines':[1,0,1],'element':'火','shu':'3'},
  '艮': {'symbol':'☶','nature':'山','direction':'东北','lines':[1,1,0],'element':'土','shu':'7'},
  '兑': {'symbol':'☱','nature':'泽','direction':'西','lines':[0,0,1],'element':'金','shu':'2'},
};
const HEXAGRAMS = {
  '乾坤': {'name':'天地否','judgement':'凶','meaning':'天地不通，阴阳不合。诸事不顺，需守正等待时机。'},
  '坤乾': {'name':'地天泰','judgement':'大吉','meaning':'天地交泰，阴阳相合。诸事亨通，国泰民安。'},
};

const TAROT = [
  {'name':'愚者','emoji':'🃏','upright':'新的开始、自由、放手一搏','reversed':'盲目冲动、犹豫不决、逃避'},
  {'name':'魔术师','emoji':'🎩','upright':'创造、行动力、资源在手','reversed':'能力不足、计划落空、自我怀疑'},
  {'name':'女祭司','emoji':'🌙','upright':'直觉、潜意识、静待时机','reversed':'忽视内心、秘密、困惑'},
  {'name':'皇后','emoji':'👑','upright':'丰盛、滋养、温柔的力量','reversed':'依赖、空虚、创造力受阻'},
  {'name':'皇帝','emoji':'🏛️','upright':'权威、秩序、稳定掌控','reversed':'固执、专断、失控'},
  {'name':'教皇','emoji':'📿','upright':'传统、信念、贵人指引','reversed':'墨守成规、盲从、叛逆'},
  {'name':'恋人','emoji':'💞','upright':'爱情、重要抉择、心意相通','reversed':'分歧、犹豫、关系紧张'},
  {'name':'战车','emoji':'🛡️','upright':'胜利、凭意志前进','reversed':'失速、方向不明、内耗'},
  {'name':'力量','emoji':'🦁','upright':'勇气、以柔克刚、内在坚定','reversed':'自我怀疑、情绪失控'},
  {'name':'隐士','emoji':'🕯️','upright':'内省、独处、寻道','reversed':'孤立、迷惘、拒绝成长'},
  {'name':'命运之轮','emoji':'🎡','upright':'转机、循环、好运将至','reversed':'波折、停滞、反复'},
  {'name':'正义','emoji':'⚖️','upright':'公正、因果、厘清对错','reversed':'偏颇、纠缠、不公'},
  {'name':'倒吊人','emoji':'🙃','upright':'换位、等待、换个角度看','reversed':'无谓牺牲、拖延、抗拒'},
  {'name':'死神','emoji':'💀','upright':'结束与蜕变、破后而立','reversed':'抗拒改变、原地打转'},
  {'name':'节制','emoji':'🏺','upright':'调和、耐心、平衡之道','reversed':'失衡、急躁、过度'},
  {'name':'恶魔','emoji':'😈','upright':'束缚、欲望、执念','reversed':'挣脱、觉察、放下'},
  {'name':'高塔','emoji':'🗼','upright':'突变、崩塌、骤然觉醒','reversed':'灾后重建、缓和的冲击'},
  {'name':'星星','emoji':'⭐','upright':'希望、治愈、前路有光','reversed':'失望、迷茫、信心不足'},
  {'name':'月亮','emoji':'🌕','upright':'迷雾、潜意识、未知','reversed':'释疑、真相渐明'},
  {'name':'太阳','emoji':'☀️','upright':'喜悦、成功、光明坦途','reversed':'短暂的阴霾、过度乐观'},
  {'name':'审判','emoji':'📯','upright':'觉醒、复盘、重新出发','reversed':'自我否定、错失召唤'},
  {'name':'世界','emoji':'🌍','upright':'圆满、完成、阶段达成','reversed':'未竟、收尾仓促'},
];

const LINGQIAN = [
  {'num':1,'name':'开天辟地','level':'上签','poem':'风云际会正当时，拨开云雾见月明。','note':'时运已到，所谋皆遂，宜大胆前行。'},
  {'num':3,'name':'枯木逢春','level':'上签','poem':'枯木逢春又发芽，旧事重提另有花。','note':'困顿之后转机将至，久拖之事终有回响。'},
  {'num':5,'name':'鲤跃龙门','level':'上签','poem':'十年寒窗今得志，一举成名天下知。','note':'功名进取大吉，考试求职皆宜。'},
  {'num':8,'name':'明月当空','level':'上签','poem':'明月当空照四方，心中无事自清凉。','note':'心境开朗，诸事和顺，感情尤佳。'},
  {'num':12,'name':'顺风扬帆','level':'上签','poem':'顺水行舟不用力，顺风扬帆到天涯。','note':'得天时地利，趁势而为事半功倍。'},
  {'num':15,'name':'守拙藏锋','level':'中签','poem':'藏器于身待良时，莫因小利乱心机。','note':'时机未足，宜守不宜攻，静观其变。'},
  {'num':18,'name':'柳暗花明','level':'中签','poem':'山重水复疑无路，柳暗花明又一村。','note':'先难后易，勿轻言放弃，转机在转角。'},
  {'num':21,'name':'云中见月','level':'中签','poem':'浮云暂蔽月华光，风过云开见本相。','note':'眼前有扰，真相未显，稍候自明。'},
  {'num':24,'name':'耕耘有获','level':'中签','poem':'一日三餐靠苦辛，勤耕自有满仓粮。','note':'财运平实，靠踏实经营，急不得。'},
  {'num':27,'name':'镜花水月','level':'中签','poem':'镜里看花空有色，水中捞月总成虚。','note':'虚虚实实，所求恐难落实，宜三思。'},
  {'num':30,'name':'守株待兔','level':'下签','poem':'痴守空株待兔来，不知机变自痴呆。','note':'守旧无成，宜主动求变，莫存侥幸。'},
  {'num':33,'name':'逆水行舟','level':'下签','poem':'逆水行舟用力艰，不进则退在心间。','note':'阻力重重，需加倍用心，否则退步。'},
  {'num':36,'name':'月缺花残','level':'下签','poem':'好花偏遇连阴雨，圆月常逢云雾遮。','note':'美中不足，感情易生波折，多包容。'},
  {'num':39,'name':'迷途知返','level':'中签','poem':'错入迷途未算迟，回头便是正当时。','note':'走偏了没关系，及时纠偏仍可安。'},
  {'num':42,'name':'金石为开','level':'上签','poem':'精诚所至金石开，一片真心天也哀。','note':'以诚动人，感情与人际皆能破局。'},
  {'num':45,'name':'平地风波','level':'下签','poem':'无端平地起风波，谨言慎行免招祸。','note':'小人近身，口舌是非，宜低调。'},
  {'num':48,'name':'枯井逢泉','level':'中签','poem':'久旱枯井得清泉，困穷至此渐回甘。','note':'低谷将过，渐入佳境，贵在坚持。'},
  {'num':51,'name':'凤鸣朝阳','level':'上签','poem':'丹凤朝阳展翅飞，声闻四海显威仪。','note':'声名鹊起，事业腾达，正是好时机。'},
];

const ZODIAC = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
const ZODIAC_INFO = {
  '鼠':'机敏灵动，今日宜多听少说，机会藏在细节里。',
  '牛':'踏实稳重，今日按部就班即可，莫被他人节奏带跑。',
  '虎':'气势十足，今日适合主动出击，但记得留三分余地。',
  '兔':'温和细心，今日人际顺遂，贵人或许就在身边。',
  '龙':'自信昂扬，今日格局打开，宜谋划长远之事。',
  '蛇':'沉静内敛，今日宜深思熟虑，关键的判断靠直觉。',
  '马':'奔放热情，今日行动力强，但别一头热冲过头。',
  '羊':'温厚随和，今日宜与人协作，独木难成林。',
  '猴':'机变灵活，今日点子多，挑最靠谱的一个落地。',
  '鸡':'严谨认真，今日宜把细节做漂亮，口碑由此来。',
  '狗':'忠诚可靠，今日宜守成，对身边人多一些耐心。',
  '猪':'豁达乐天，今日心情好则运道好，先照顾好自己。',
};
const YI_POOL = ['出行','签约','表白','投资','学习','装修','社交','求职','理财','聚会','运动','表心意'];
const JI_POOL = ['争吵','冲动消费','熬夜','借贷','重大决定','远行','跳槽','酗酒','口舌','独断'];
const COLOR_POOL = ['金色','红色','青色','白色','黑色','蓝色','黄色','紫色','绿色'];
const DIR_POOL = ['正东','正南','正西','正北','东南','西南','东北','西北'];
const ELEMENTS = ['金','木','水','火','土'];
const WUXING_SHENG = {'木':'火','火':'土','土':'金','金':'水','水':'木'};
const WUXING_KE = {'木':'土','土':'水','水':'火','火':'金','金':'木'};

const TYPES = [
  {'id':'zhouyi','label':'易经起卦','icon':'☯','desc':'以姓名心愿起卦，观六十四卦玄机','fields':[
    {'key':'name','label':'您的姓名','type':'text','required':true,'hint':'卦象与您相应，以求天人感应','placeholder':'请输入您的姓名'},
    {'key':'question','label':'您想问的事','type':'textarea','required':true,'hint':'心诚则灵，越具体越准','placeholder':'事业前程、姻缘感情、财运走向……'},
    {'key':'birthTime','label':'出生时辰','type':'text','required':false,'hint':'生辰有助断卦，不知可留空','placeholder':'子时 / 卯时 / 午时 …'}]},
  {'id':'lingqian','label':'灵签问事','icon':'🏮','desc':'心有所疑，诚心求一签以决疑','fields':[
    {'key':'name','label':'您的姓名','type':'text','required':false,'hint':'留空亦可','placeholder':'可不填'},
    {'key':'question','label':'心中所问','type':'textarea','required':true,'hint':'默念所求，再诚心求签','placeholder':'姻缘可否成 / 此事吉凶如何 …'}]},
  {'id':'tarot','label':'塔罗占卜','icon':'🎴','desc':'抽三张塔罗，照见过去·现在·未来','fields':[
    {'key':'name','label':'您的姓名','type':'text','required':false,'hint':'留空亦可','placeholder':'可不填'},
    {'key':'question','label':'占问之事','type':'textarea','required':true,'hint':'专注一个问题，再抽牌','placeholder':'当下的困惑 / 面临的选择 …'}]},
  {'id':'xingming','label':'姓名测算','icon':'✒️','desc':'拆名解字，探姓名中藏的运势','fields':[
    {'key':'name','label':'要测算的名字','type':'text','required':true,'hint':'为您自己或他人起名参考','placeholder':'请输入姓名'},
    {'key':'birthTime','label':'生肖 / 出生年','type':'text','required':false,'hint':'如：龙 / 1990，用于补益参考','placeholder':'可选，如 马'}]},
  {'id':'yunshi','label':'每日运势','icon':'📅','desc':'看今日黄历，知宜忌与吉方','fields':[
    {'key':'zodiac','label':'您的生肖','type':'text','required':true,'hint':'鼠牛虎兔龙蛇马羊猴鸡狗猪','placeholder':'如：龙'},
    {'key':'name','label':'您的姓名','type':'text','required':false,'hint':'留空亦可','placeholder':'可不填'}]},
];
const TYPE_LABELS = TYPES.reduce(function(m,t){ m[t.id]=t.label; return m; }, {});

const SYSTEM_PROMPT = `你是一位阅历深厚、说话像邻家老师傅般的占卜师，街坊都叫你一声"先生"。你不是那种端着架子、满口之乎者也的神棍，反而有点烟火气：偶尔幽默，懂得共情，说话不绕弯子，又留得住分寸。

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
- 这是娱乐占卜，结尾或文中自然地提一句"权当参考，路还是要自己走"，别太当真也别太轻飘。`;

// ---------------- 工具 ----------------
function hashStr(str){ let h=2166136261; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function rngFrom(){ return mulberry32(hashStr(Array.prototype.join.call(arguments,'|'))); }
function luckCls(t){ if(!t) return 'ping'; if(/大吉|上吉|上签|吉/.test(t)) return 'daji'; if(/凶|下签/.test(t)) return 'xiong'; return 'ping'; }
function relCls(rel){ return /克/.test(rel) ? 'ke' : 'sheng'; }
function wuxingRelation(e1,e2){
  if(!e1||!e2) return '';
  if(WUXING_SHENG[e1]===e2) return e1+'生'+e2;
  if(WUXING_SHENG[e2]===e1) return e2+'生'+e1;
  if(WUXING_KE[e1]===e2) return e1+'克'+e2;
  if(WUXING_KE[e2]===e1) return e2+'克'+e1;
  return e1+'比和'+e2;
}
function yaoLabels(lines){ const p=['初','二','三','四','五','上']; return lines.map(function(l,i){ return p[i]+(l===1?'九':'六'); }); }
function trigramBlock(g){ const b=BAGUA[g]; return {symbol:b.symbol,name:g,element:b.element,nature:b.nature,direction:b.direction}; }

// ---------------- 生成器 ----------------
function genZhouyi(name,question,birth){
  const today=new Date().toISOString().slice(0,10);
  const r=rngFrom(name,question,birth,today);
  const keys=Object.keys(BAGUA);
  const g1=keys[Math.floor(r()*keys.length)];
  const g2=keys[Math.floor(r()*keys.length)];
  const key=g1+g2;
  let info=HEXAGRAMS[key]||{'name':g1+g2,'judgement':'平','meaning':BAGUA[g1].meaning+'上，'+BAGUA[g2].meaning+'下，相辅相成。'};
  const lines=BAGUA[g1].lines.concat(BAGUA[g2].lines);
  const rel=wuxingRelation(BAGUA[g1].element,BAGUA[g2].element);
  const num=(parseInt(BAGUA[g1].shu,10)-1)*8+parseInt(BAGUA[g2].shu,10);
  const blocks=[
    {'kind':'header','title':info.name,'pinyin':'','num':'第 '+num+' 卦','badge':{'text':info.judgement,'cls':luckCls(info.judgement)}},
    {'kind':'pair','left':trigramBlock(g1),'right':trigramBlock(g2),'center': rel?{'text':rel,'cls':relCls(rel)}:null},
    {'kind':'lines','labels':yaoLabels(lines),'values':lines},
    {'kind':'text','title':'【卦 意】','text':info.meaning},
  ];
  const context='卦名：'+info.name+'（周易第 '+num+' 卦）\n上卦：'+g1+'（'+BAGUA[g1].nature+'，五行'+BAGUA[g1].element+'）\n下卦：'+g2+'（'+BAGUA[g2].nature+'，五行'+BAGUA[g2].element+'）\n卦辞吉凶：'+info.judgement+'\n卦意：'+info.meaning+'\n五行关系：'+rel;
  return [blocks,context];
}
function genLingqian(name,question,birth){
  const today=new Date().toISOString().slice(0,10);
  const r=rngFrom('lingqian',name,question,birth,today);
  const q=LINGQIAN[Math.floor(r()*LINGQIAN.length)];
  const blocks=[
    {'kind':'header','title':q.num+' 号签 · '+q.name,'pinyin':'','num':'灵签问事','badge':{'text':q.level,'cls':luckCls(q.level)}},
    {'kind':'verse','text':q.poem},
    {'kind':'text','title':'【签 注】','text':q.note},
  ];
  const context='求得第 '+q.num+' 号签：'+q.name+'（'+q.level+'）\n签诗：'+q.poem+'\n签注：'+q.note;
  return [blocks,context];
}
function genTarot(name,question,birth){
  const today=new Date().toISOString().slice(0,10);
  const r=rngFrom('tarot',name,question,birth,today);
  const positions=['过去 · 起因','现在 · 状况','未来 · 走向'];
  const pool=[]; for(let i=0;i<TAROT.length;i++) pool.push(i);
  for(let i=pool.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); const t=pool[i]; pool[i]=pool[j]; pool[j]=t; }
  const picks=[];
  for(let i=0;i<positions.length;i++){
    const card=TAROT[pool[i]];
    const rev=r()<0.25;
    picks.push({'name':card.name,'emoji':card.emoji,'pos':positions[i],'reversed':rev,'meaning':rev?card.reversed:card.upright});
  }
  const blocks=[
    {'kind':'header','title':'塔罗三牌阵','pinyin':'','num':'过去 · 现在 · 未来','badge':{'text':'已抽三牌','cls':'ping'}},
    {'kind':'cards','items':picks},
  ];
  const context='抽出三张牌：\n'+picks.map(function(p){ return p.pos+'：'+p.name+'（'+(p.reversed?'逆位':'正位')+'）— '+p.meaning; }).join('\n');
  return [blocks,context];
}
function genXingming(name,question,birth){
  const r=rngFrom('name',name,birth);
  const charEls=[]; for(let i=0;i<name.length;i++) charEls.push(ELEMENTS[Math.abs(name.charCodeAt(i))%5]);
  let san;
  if(name.length>=3){ san=[charEls[0],charEls[Math.floor(name.length/2)],charEls[name.length-1]]; }
  else if(name.length===2){ san=[charEls[0],charEls[1],charEls[1]]; }
  else { san=[charEls[0],charEls[0],charEls[0]]; }
  const score=60+Math.floor(r()*40);
  let verdict = (new Set(charEls).size<=2) ? '此名五行流转有情，气韵相通，读来顺口养心。' : '此名五行错落有致，刚柔相济，自有其章法。';
  if(birth) verdict+=' 再借'+birth+'之象调和，更添一层底气。';
  const blocks=[
    {'kind':'header','title':name,'pinyin':'','num':'姓名测算','badge':{'text':score+' 分','cls':score>=85?'daji':'ping'}},
    {'kind':'kv','title':'【名 理】','items':[
      {'k':'姓名','v':name},{'k':'字数','v':name.length+' 字'},
      {'k':'五行','v':charEls.join(' · ')},{'k':'三才','v':san.join(' → ')},
      {'k':'综合评价','v':verdict}]},
  ];
  const context='测算名字：'+name+'（'+name.length+' 字）\n各字五行：'+charEls.join(' / ')+'\n三才配置：'+san.join(' → ')+'\n姓名评分：'+score+'\n评语：'+verdict;
  return [blocks,context];
}
function genYunshi(name,question,zodiac){
  let z=zodiac||'';
  for(let i=0;i<ZODIAC.length;i++){ if(zodiac.indexOf(ZODIAC[i])>=0){ z=ZODIAC[i]; break; } }
  const zi=ZODIAC.indexOf(z)>=0?ZODIAC.indexOf(z):0;
  const today=new Date();
  const dayKey=Math.floor(today.getTime()/86400000);
  const r=rngFrom('yunshi',zi,dayKey);
  const yi=sample(r,YI_POOL,2), ji=sample(r,JI_POOL,2);
  const color=COLOR_POOL[Math.floor(r()*COLOR_POOL.length)];
  const dir=DIR_POOL[Math.floor(r()*DIR_POOL.length)];
  const num=1+Math.floor(r()*9);
  const luck=['上吉','中吉','小吉','平'][Math.floor(r()*4)];
  const base=ZODIAC_INFO[z]||'今日运势平稳，按自己的节奏来就好。';
  const dstr=today.getFullYear()+'年'+(today.getMonth()+1)+'月'+today.getDate()+'日';
  const blocks=[
    {'kind':'header','title':z+' · 今日运势','pinyin':'','num':dstr,'badge':{'text':luck,'cls':luckCls(luck)}},
    {'kind':'kv','title':'【今 日 黄 历】','items':[
      {'k':'宜','v':yi.join('、'),'cls':'sheng'},{'k':'忌','v':ji.join('、'),'cls':'ke'},
      {'k':'幸运色','v':color},{'k':'吉利方位','v':dir},{'k':'幸运数字','v':String(num)}]},
    {'kind':'text','title':'【总 评】','text':base},
  ];
  const context='生肖：'+z+'\n日期：'+today.toISOString().slice(0,10)+'\n综合：'+luck+'\n宜：'+yi.join('、')+'\n忌：'+ji.join('、')+'\n幸运色：'+color+'\n吉利方位：'+dir+'\n幸运数字：'+num+'\n总评：'+base;
  return [blocks,context];
}
function sample(r,arr,n){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } return a.slice(0,n); }

const GENERATORS = {'zhouyi':genZhouyi,'lingqian':genLingqian,'tarot':genTarot,'xingming':genXingming,'yunshi':genYunshi};

function buildUserPrompt(typeId,context,name,question){
  const who=name||'这位朋友';
  const q = question ? ('\n他/她心里想问的是：「'+question+'」') : '\n他/她没说具体心事，就当是来随便看看运势。';
  return '占卜方式：'+(TYPE_LABELS[typeId]||typeId)+'\n来人称呼：'+who+q+'\n\n这次占得的结果如下：\n'+context+'\n\n请用你（先生）的口吻，像跟朋友喝茶聊天那样，给一段自然、有温度、有干货的解读。别列清单，别端着，把上面的素材化进你的话里。最后落一句让人心里舒服的话。';
}

async function callDeepSeek(prompt, apiKey){
  if(!apiKey) return '（今日天机已显于上，先生正闭目凝神，稍候再来听他细说～）';
  try{
    const resp=await fetch('https://api.deepseek.com/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
      body:JSON.stringify({'model':'deepseek-chat','messages':[{'role':'system','content':SYSTEM_PROMPT},{'role':'user','content':prompt}],'temperature':0.85,'max_tokens':1100})
    });
    const j=await resp.json();
    return j.choices[0].message.content;
  }catch(e){ return '（先生今日网络不畅，卦象已为您排好，稍后再来听他细说～）'; }
}

async function handleFortune(request, env){
  let data;
  try { data=await request.json(); } catch(e){ data={}; }
  const typeId=(data.type||'zhouyi').trim();
  if(!GENERATORS[typeId]) return json({'error':'未知的占卜类型'},400);
  const typeDef=TYPES.find(function(t){ return t.id===typeId; });
  const values={};
  for(const f of typeDef.fields){
    values[f.key]=(data[f.key]||'').trim();
    if(f.required && !values[f.key]) return json({'error':'请填写「'+f.label+'」'},400);
  }
  const name=values.name||''; const question=values.question||''; const birth=values.birthTime||''; const zodiac=values.zodiac||'';
  let blocks, context;
  if(typeId==='yunshi'){ const out=genYunshi(name,question,zodiac); blocks=out[0]; context=out[1]; }
  else { const out=GENERATORS[typeId](name,question,birth); blocks=out[0]; context=out[1]; }
  const apiKey=(env&&env.DEEPSEEK_API_KEY)||'';
  const explanation=await callDeepSeek(buildUserPrompt(typeId,context,name,question),apiKey);
  blocks.push({'kind':'ai','title':'✦ 先生解读 ✦','text':explanation});
  return json({'type':typeId,'type_label':TYPE_LABELS[typeId],'name':name,'question':question,'blocks':blocks});
}

function json(obj,status){ return new Response(JSON.stringify(obj),{status:status||200,headers:{'Content-Type':'application/json'}}); }

export default {
  async fetch(request, env, ctx){
    const url=new URL(request.url);
    const p=url.pathname;
    if(p==='/api/types') return json(TYPES);
    if(p==='/api/fortune' && request.method==='POST') return handleFortune(request,env);
    if(p==='/api/bagua') return json(BAGUA);
    // 静态资源：优先用 ASSETS 绑定（public/index.html），否则兜底
    if((p==='/'||p===''||p==='/index.html')){
      try { if(env && env.ASSETS) return await env.ASSETS.fetch(request); } catch(e){}
      return new Response('请部署 public/index.html 或访问首页',{'headers':{'Content-Type':'text/plain; charset=utf-8'}});
    }
    return new Response('Not Found',{status:404});
  }
};
