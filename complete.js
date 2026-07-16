const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clone=x=>JSON.parse(JSON.stringify(x));

const NEUTRAL=[
 {id:'N1',name:'边境民兵',cost:1,atk:2,hp:1,effect:'none',text:'无特殊效果。'},
 {id:'N2',name:'旧盾卫兵',cost:2,atk:2,hp:3,effect:'none',text:'无特殊效果。'},
 {id:'N3',name:'短弓手',cost:2,atk:2,hp:2,effect:'strike',text:'部署：对位敌人造成1点伤害。'},
 {id:'N4',name:'战地医师',cost:3,atk:2,hp:4,effect:'heal',text:'部署：治疗英雄2点。'},
 {id:'N5',name:'老练斗士',cost:4,atk:4,hp:5,effect:'none',text:'无特殊效果。'},
 {id:'N6',name:'荒原巨像',cost:5,atk:6,hp:6,effect:'none',text:'无特殊效果。'}
];

const HEROES={
 forge:{id:'forge',name:'铸炉者',title:'护盾与成长',glyph:'炉',color:'#df9b43',maxHp:26,skill:'炉心守护',skillIcon:'◇',skillDesc:'友方单位护盾+2',intro:'让单位活过两轮，炉火会替你赢下战线。',cards:[
  {id:'F1',name:'铁屑侍从',cost:1,atk:1,hp:2,effect:'shield',text:'部署：自身获得1点护盾。'},
  {id:'F2',name:'灼热锻工',cost:2,atk:2,hp:2,effect:'shield',text:'部署：自身获得1点护盾。'},
  {id:'F3',name:'反火甲虫',cost:2,atk:1,hp:3,effect:'thorns',text:'荆棘1：受击后反伤。'},
  {id:'F4',name:'炉门卫士',cost:3,atk:2,hp:5,effect:'shield',text:'部署：自身获得1点护盾。'},
  {id:'F5',name:'熔渣投手',cost:4,atk:3,hp:4,effect:'strike2',text:'部署：对位敌人造成2点伤害。'},
  {id:'F6',name:'炉心巨像',cost:5,atk:5,hp:7,effect:'shield2',text:'部署：自身获得2点护盾。'}]},
 spore:{id:'spore',name:'孢子之母',title:'中毒与死亡',glyph:'孢',color:'#8da95c',maxHp:24,skill:'瘟疫播种',skillIcon:'✺',skillDesc:'所有敌军中毒1',intro:'死亡不是损失，而是下一轮菌群爆发的燃料。',cards:[
  {id:'S1',name:'孢子幼体',cost:1,atk:1,hp:2,effect:'deathheal',text:'遗言：治疗英雄1点。'},
  {id:'S2',name:'腐烂仆从',cost:2,atk:2,hp:2,effect:'poison',text:'攻击后使对位敌人中毒1。'},
  {id:'S3',name:'毒囊虫',cost:2,atk:1,hp:4,effect:'thorns',text:'荆棘1：受击后反伤。'},
  {id:'S4',name:'疫病喷子',cost:3,atk:3,hp:3,effect:'poison2',text:'攻击后使对位敌人中毒2。'},
  {id:'S5',name:'尸爆花',cost:4,atk:3,hp:5,effect:'deathblast',text:'遗言：对敌方英雄造成2点伤害。'},
  {id:'S6',name:'菌群母兽',cost:5,atk:5,hp:7,effect:'deathheal2',text:'遗言：治疗英雄2点。'}]},
 shadow:{id:'shadow',name:'逐影者',title:'空线与突袭',glyph:'影',color:'#38c7bc',maxHp:22,skill:'暗巷穿行',skillIcon:'✦',skillDesc:'若有空线，对英雄造成2点',intro:'不断调动压力，抓住空线直接刺向敌方英雄。',cards:[
  {id:'H1',name:'暗巷探子',cost:1,atk:2,hp:1,effect:'sneak',text:'偷袭1：攻击英雄时额外伤害。'},
  {id:'H2',name:'影步学徒',cost:2,atk:2,hp:2,effect:'sneak',text:'偷袭1：攻击英雄时额外伤害。'},
  {id:'H3',name:'锁链飞刃',cost:2,atk:2,hp:2,effect:'strike',text:'部署：对位敌人造成1点伤害。'},
  {id:'H4',name:'夜觅者',cost:3,atk:3,hp:2,effect:'sneak2',text:'偷袭2：攻击英雄时额外伤害。'},
  {id:'H5',name:'穿墙猎手',cost:4,atk:4,hp:3,effect:'pierce',text:'穿透：溢出伤害打击英雄。'},
  {id:'H6',name:'无面行者',cost:5,atk:6,hp:4,effect:'sneak2',text:'偷袭2：攻击英雄时额外伤害。'}]}
};

const HERO_SPELLS={
 forge:[{id:'FS1',name:'回火结界',cost:1,type:'spell',effect:'spell_shield_all',text:'法术：所有友军获得1点护盾；若没有友军，为下个部署单位保留2点护盾。'}],
 spore:[{id:'SS1',name:'腐孢云',cost:1,type:'spell',effect:'spell_poison_all',text:'法术：所有敌军获得1层中毒。'}],
 shadow:[{id:'HS1',name:'影隙突袭',cost:1,type:'spell',effect:'spell_shadow',text:'法术：若敌方有空战线，对敌方英雄造成2点伤害；否则抽1张牌。'}]
};

const HERO_STARTERS={
 forge:['F1','F2','F3','F4','FS1','N1','N2','N3'],
 spore:['S1','S2','S3','S4','SS1','N1','N2','N3'],
 shadow:['H1','H2','H3','H4','HS1','N1','N2','N3']
};

const FOES={
 rats:{name:'灰烬鼠群',glyph:'鼠',hp:15,color:'#a98d69',cards:[{name:'裂齿鼠',cost:1,atk:2,hp:1,effect:'none',text:'无特殊效果。'},{name:'鼠巢守卫',cost:2,atk:2,hp:3,effect:'none',text:'无特殊效果。'},{name:'疫毛鼠',cost:3,atk:3,hp:3,effect:'poison',text:'攻击后施加中毒。'}]},
 cult:{name:'炉渣教团',glyph:'烬',hp:18,color:'#ce704b',cards:[{name:'灰衣信徒',cost:1,atk:1,hp:2,effect:'shield',text:'部署获得护盾。'},{name:'烙印执事',cost:2,atk:3,hp:2,effect:'none',text:'无特殊效果。'},{name:'熔火祭司',cost:3,atk:3,hp:4,effect:'strike',text:'部署造成伤害。'},{name:'炉渣巨汉',cost:4,atk:5,hp:5,effect:'none',text:'无特殊效果。'}]},
 fungus:{name:'腐化菌群',glyph:'菌',hp:19,color:'#8da95c',cards:[{name:'游荡孢子',cost:1,atk:1,hp:2,effect:'none',text:'无特殊效果。'},{name:'腐化卫士',cost:2,atk:2,hp:3,effect:'poison',text:'攻击后施加中毒。'},{name:'毒囊虫',cost:2,atk:1,hp:4,effect:'thorns',text:'荆棘1。'},{name:'菌毯巨兽',cost:4,atk:4,hp:6,effect:'poison',text:'攻击后施加中毒。'}]},
 knight:{name:'失控铸甲',glyph:'甲',hp:23,color:'#d3a855',elite:true,cards:[{name:'活化头盔',cost:1,atk:2,hp:2,effect:'shield',text:'部署获得护盾。'},{name:'空心骑士',cost:2,atk:3,hp:3,effect:'none',text:'无特殊效果。'},{name:'反火重甲',cost:3,atk:3,hp:5,effect:'thorns',text:'荆棘1。'},{name:'破城钻机',cost:4,atk:5,hp:5,effect:'pierce',text:'伤害会穿透。'}]},
 boss:{name:'深炉看守者',glyph:'王',hp:32,color:'#df9b43',boss:true,cards:[{name:'看守者之眼',cost:1,atk:2,hp:3,effect:'shield',text:'部署获得护盾。'},{name:'熔铁猎犬',cost:2,atk:3,hp:3,effect:'strike',text:'部署造成伤害。'},{name:'刑具构装',cost:3,atk:4,hp:5,effect:'thorns',text:'荆棘1。'},{name:'深炉之拳',cost:4,atk:6,hp:5,effect:'pierce',text:'伤害会穿透。'},{name:'王座残骸',cost:5,atk:7,hp:8,effect:'shield2',text:'部署获得2点护盾。'}]}
};

const ROOMS=[
 {type:'battle',title:'灰烬巢穴',sub:'普通战斗',icon:'⚔',color:'#dc6858',foe:'rats'},
 {type:'event',title:'低语回廊',sub:'未知事件',icon:'?',color:'#38c7bc'},
 {type:'battle',title:'渣火礼拜堂',sub:'普通战斗',icon:'⚔',color:'#dc6858',foe:'cult'},
 {type:'camp',title:'无主营火',sub:'恢复或强化',icon:'♨',color:'#df9b43'},
 {type:'elite',title:'失控铸甲',sub:'精英战斗 · 遗物',icon:'✦',color:'#b88cff',foe:'knight'},
 {type:'battle',title:'菌毯深井',sub:'普通战斗',icon:'⚔',color:'#dc6858',foe:'fungus'},
 {type:'boss',title:'深炉王座',sub:'区域首领',icon:'♛',color:'#df9b43',foe:'boss'}
];

const EVENTS=[
 {title:'沉睡的铸造台',body:'一台古老机器仍在微微发热。齿轮间卡着一枚完整的规则核心。',choices:[{title:'投入20晶尘',desc:'获得一张随机稀有卡',tag:'冒险',action:'buyCard'},{title:'拆走零件',desc:'获得25晶尘，但失去3点生命',tag:'贪婪',action:'scrap'},{title:'安静离开',desc:'什么也不发生',tag:'稳妥',action:'leave'}]},
 {title:'会说话的菌毯',body:'墙上的菌丝拼出了你的名字，并承诺用记忆交换力量。',choices:[{title:'交出一段记忆',desc:'移除最弱卡牌，最大生命+2',tag:'献祭',action:'memory'},{title:'割下一片菌毯',desc:'获得一张带毒卡，失去2点生命',tag:'收获',action:'poisonCard'},{title:'用火驱散',desc:'获得12晶尘',tag:'强硬',action:'burn'}]},
 {title:'倒悬的商队',body:'一辆被铁链吊在天花板上的货车。箱中传来规律的敲击声。',choices:[{title:'打开货箱',desc:'50%获得遗物，50%受到5点伤害',tag:'赌运',action:'chest'},{title:'割断铁链',desc:'获得18晶尘并恢复2点生命',tag:'技巧',action:'cut'},{title:'不碰它',desc:'安全离开',tag:'稳妥',action:'leave'}]}
];

const storage={get(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
let meta=storage.get('forge_meta',{dust:0,clears:0,best:0,custom:null});
let selectedHero='forge',includeCustomCard=!!meta.custom,forgeReturnView='home-view',run=storage.get('forge_run',null),battle=null;
const forgeEffectValues={shield:1,strike:1,thorns:1,none:0};
const FORGE_EFFECT_CONFIG={
 shield:{label:'护盾数值',hint:'部署后自身获得的护盾',rate:1,rule:n=>`部署：自身获得${n}点护盾。`},
 strike:{label:'直伤数值',hint:'部署时对位敌人受到的伤害',rate:2,rule:n=>`部署：对位敌人造成${n}点伤害。`},
 thorns:{label:'荆棘数值',hint:'受击后返还给攻击者的伤害',rate:2,rule:n=>`荆棘${n}：受击后对攻击者造成${n}点伤害。`},
 none:{label:'无效果',hint:'此卡没有额外规则',rate:0,rule:()=>`无特殊效果。`}
};

const ART_ATLASES={
 hero:'assets/card-art-atlas-v1.png',
 player:'assets/card-art-player-v2.png',
 enemy:'assets/card-art-neutral-enemy-v2.png',
 boss:'assets/card-art-boss-v2.png'
};

// Every implemented card owns a fixed atlas cell. IDs take priority so cards
// with the same display name in different factions still keep distinct art.
const CARD_ART={
 F1:['player',0],F2:['player',1],F3:['player',2],F4:['player',3],
 F5:['player',4],F6:['player',5],S1:['player',6],S2:['player',7],
 S3:['player',8],S4:['player',9],S5:['player',10],S6:['player',11],
 H1:['player',12],H2:['player',13],H3:['player',14],H4:['player',15],
 H5:['enemy',0],H6:['enemy',1],N1:['enemy',2],N2:['enemy',3],
 N3:['enemy',4],N4:['enemy',5],N5:['enemy',6],N6:['enemy',7],
 CUSTOM:['enemy',15],FS1:['boss',14],SS1:['boss',13],HS1:['boss',15],
 '裂齿鼠':['enemy',8],'鼠巢守卫':['enemy',9],'疫毛鼠':['enemy',10],
 '灰衣信徒':['enemy',11],'烙印执事':['enemy',12],'熔火祭司':['enemy',13],'炉渣巨汉':['enemy',14],
 '游荡孢子':['boss',0],'腐化卫士':['boss',1],'毒囊虫':['boss',2],'菌毯巨兽':['boss',3],
 '活化头盔':['boss',4],'空心骑士':['boss',5],'反火重甲':['boss',6],'破城钻机':['boss',7],
 '看守者之眼':['boss',8],'熔铁猎犬':['boss',9],'刑具构装':['boss',10],'深炉之拳':['boss',11],'王座残骸':['boss',12]
};
const PORTRAIT_ART={
 forge:['hero',0],spore:['hero',1],shadow:['hero',2],
 '铸炉者':['hero',0],'孢子之母':['hero',1],'逐影者':['hero',2],
 '灰烬鼠群':['enemy',10],'炉渣教团':['enemy',13],'腐化菌群':['boss',3],
 '失控铸甲':['boss',5],'深炉看守者':['boss',12]
};
function cardArtRef(c){
 const id=c?.id||'',name=c?.name||'';
 return CARD_ART[id]||CARD_ART[name]||PORTRAIT_ART[id]||PORTRAIT_ART[name]||['hero',3];
}
function artStyle(c){
 const [atlas,n]=cardArtRef(c),x=n%4,y=Math.floor(n/4);
 const image=ART_ATLASES[atlas];
 return `--art-image:url('${image}');background-image:url('${image}')!important;background-position:${x*33.333}% ${y*33.333}%`;
}

const CARD_FLAVOR={
 F1:'它从废料堆里站起，只认得炉锤的声音。',F2:'每一道火星，都是他签下的名字。',
 F3:'背甲越红，靠近它的人越后悔。',F4:'炉门合拢之前，它绝不后退半步。',
 F5:'废渣落地时，仍记得火焰的温度。',F6:'沉睡的铸炉，终于长出了双足。',
 S1:'它还不会说话，却已经学会了繁殖。',S2:'腐败夺走名字，却留下了服从。',
 S3:'鼓胀的毒囊里，装着整片沼泽的恶意。',S4:'它喷出的不是雾，而是一场缓慢的葬礼。',
 S5:'死亡只是它最后一次盛放。',S6:'无数微小生命，共用一颗饥饿的心。',
 H1:'他总能找到灯火照不到的那条路。',H2:'第一课：影子比脚步更快。',
 H3:'锁链的尽头，从不需要第二次瞄准。',H4:'当你听见屋瓦轻响，他已经离开。',
 H5:'墙壁只会阻挡相信墙壁的人。',H6:'没人见过它的脸，也没人活着描述过。',
 N1:'边境没有英雄，只有按时换岗的人。',N2:'盾上的每道凹痕，都替别人挡过一次死亡。',
 N3:'他只带十二支箭，因为从不需要第十三支。',N4:'她缝合伤口，也缝合溃散的勇气。',
 N5:'活到今天，就是他最响亮的战绩。',N6:'荒原把岩石磨成了会行走的灾难。',
 FS1:'炉火写下的命令，会在铁甲上持续燃烧。',SS1:'一页孢粉落下，整条战线开始缓慢呼吸。',
 HS1:'真正的袭击，总从守卫以为安全的缝隙开始。',
 CUSTOM:'炉火记住了创造者留下的每一个选择。',
 '裂齿鼠':'它啃过铁链，也啃过握着铁链的手。','鼠巢守卫':'巢穴的入口，用牙齿和尸骨筑成。',
 '疫毛鼠':'每一撮脱落的毛，都带着新的病种。','灰衣信徒':'灰袍之下，只剩被炉火烧空的眼睛。',
 '烙印执事':'他的信仰刻在皮肤上，从不允许愈合。','熔火祭司':'祷词结束时，总有人开始燃烧。',
 '炉渣巨汉':'教团给了他锁链，也给了他挥舞锁链的理由。','游荡孢子':'它随风寻找一具愿意呼吸的身体。',
 '腐化卫士':'盔甲里没有人，只有不断生长的菌丝。','毒囊虫':'它的腹部越明亮，周围就越安静。',
 '菌毯巨兽':'地面隆起时，已经来不及逃跑。','活化头盔':'空洞的面甲里，回荡着旧主人的命令。',
 '空心骑士':'盔甲记得战斗，却忘了为何而战。','反火重甲':'每一次击打，都让它变得更加炽热。',
 '破城钻机':'它原本用来打开城门，后来学会了打开一切。','看守者之眼':'它从不眨眼，因为炉火不需要睡眠。',
 '熔铁猎犬':'它循着体温追猎，从未失去过目标。','刑具构装':'每个关节，都为一种痛苦而设计。',
 '深炉之拳':'王座的意志，通过这只铁拳发言。','王座残骸':'它已经毁灭，却仍拒绝承认统治结束。'
};
function flavorText(c){return c?.flavor||CARD_FLAVOR[c?.id]||CARD_FLAVOR[c?.name]||'它的故事仍在地牢深处延续。'}
function rulesText(c){return c?.effect==='none'?'无特殊效果。':c?.text||'无特殊效果。'}
function effectAmount(c,fallback=1){const n=Number(c?.effectValue);return Number.isFinite(n)&&n>0?Math.min(9,Math.floor(n)):fallback}
function cardType(c){return c?.type==='spell'?'spell':'unit'}

function effectPresentation(c){
 const e=c?.effect||'none';
 if(cardType(c)==='spell')return{key:'spell',glyph:'✧',label:'法术'};
 if(e.includes('shield'))return{key:'shield',glyph:'◇',label:'护盾'};
 if(e.includes('poison'))return{key:'poison',glyph:'✺',label:'中毒'};
 if(e.includes('sneak'))return{key:'sneak',glyph:'✦',label:'偷袭'};
 if(e.includes('death'))return{key:'death',glyph:'✹',label:'遗言'};
 if(e==='thorns')return{key:'thorns',glyph:'⌁',label:'荆棘'};
 if(e==='pierce')return{key:'pierce',glyph:'➤',label:'穿透'};
 if(e==='heal')return{key:'heal',glyph:'✚',label:'治疗'};
 if(e.includes('strike'))return{key:'strike',glyph:'◆',label:'部署'};
 return{key:'unit',glyph:'●',label:'单位'};
}
function cardFace(c,variant=''){
 const shield=c.shield||0,poison=c.poison||0,fx=effectPresentation(c);
 return `<div class="standard-card ${variant} effect-${fx.key} ${cardType(c)==='spell'?'type-spell':''}">
  <div class="standard-card-art art-atlas" style="${artStyle(c)}"></div>
  <span class="standard-cost" aria-label="${c.cost}点费用"><b>${c.cost}</b></span>
  <div class="standard-title">${c.name}${c.upgraded?' +':''}</div>
  <div class="standard-rule"><div class="standard-effect-copy"><span class="standard-effect-tag"><i>${fx.glyph}</i>${fx.label}</span><span class="standard-effect-text">${rulesText(c)}</span></div><div class="standard-flavor">“${flavorText(c)}”</div></div>
  <div class="standard-status">${shield?`<i class="status-shield">◇${shield}</i>`:''}${poison?`<i class="status-poison">✺${poison}</i>`:''}</div>
  ${cardType(c)==='spell'?'<div class="standard-spell-mark"><i>✧</i><b>一次性法术</b></div>':`<div class="standard-stats"><span class="standard-stat standard-atk"><i>⚔</i><b>${c.atk}</b></span><span class="standard-stat standard-hp"><i>♥</i><b>${c.hp}</b></span></div>`}
 </div>`
}

function keywordDetails(c){
 const out=[];
 if(cardType(c)==='spell')out.push(['法术','选择后直接锁定即可施放。结算后进入本场战斗的弃牌区，不会占据战线。']);
 if((c.text||'').includes('部署')||['shield','shield2','strike','strike2','heal'].includes(c.effect))out.push(['部署','打出并进入战线后立即触发。若对位目标不存在，指定目标效果可能落空。']);
 if((c.effect||'').includes('shield')||c.shield)out.push(['护盾','受到伤害时先扣除护盾，剩余伤害才会减少生命；护盾可以跨回合保留。']);
 if(c.effect==='thorns'||c.thorns)out.push(['荆棘',`受到敌方单位的战斗伤害后，对攻击者造成${c.thorns||effectAmount(c,1)}点反伤；即使本次死亡仍会触发。`]);
 if((c.effect||'').includes('poison')||c.poison)out.push(['中毒','回合结束时受到层数对应的伤害，随后层数减少1。']);
 if((c.effect||'').includes('sneak'))out.push(['偷袭','攻击空线并命中敌方英雄时，造成额外伤害。']);
 if(c.effect==='pierce')out.push(['穿透','对单位造成的伤害超过其护盾与生命时，溢出部分会打击敌方英雄。']);
 if((c.text||'').includes('遗言')||(c.effect||'').includes('death'))out.push(['遗言','该单位死亡并离场后触发；被撤防替换不算死亡。']);
 if((c.text||'').includes('治疗')||c.effect==='heal')out.push(['治疗','恢复英雄生命，但不会超过本次远征的最大生命。']);
 if(!out.length)out.push(['单位','部署到一条战线。同线单位互相攻击，敌方空线时直接攻击英雄。']);
 return out;
}

function showCardInspector(c){
 $('#inspector-card').innerHTML=cardFace(c,'inspected-card');
 $('#keyword-list').innerHTML=keywordDetails(c).map(([k,v])=>`<div class="keyword-item"><b>${k}</b><p>${v}</p></div>`).join('');
 $('#card-inspector').classList.add('open');
 $('#card-inspector').setAttribute('aria-hidden','false');
}
function closeCardInspector(){$('#card-inspector').classList.remove('open');$('#card-inspector').setAttribute('aria-hidden','true')}
function bindCardHold(el,c){
 let timer=null,sx=0,sy=0;
 const cancel=()=>{if(timer){clearTimeout(timer);timer=null}};
 el.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;sx=e.clientX;sy=e.clientY;cancel();timer=setTimeout(()=>{el._suppressCardClick=true;showCardInspector(c);navigator.vibrate?.(18);timer=null},380)});
 el.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-sx)>10||Math.abs(e.clientY-sy)>10)cancel()});
 el.addEventListener('pointerup',cancel);el.addEventListener('pointercancel',cancel);
 el.addEventListener('contextmenu',e=>{e.preventDefault();el._suppressCardClick=true;showCardInspector(c)});
}

function show(id){$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));scrollTo(0,0)}
function persist(){storage.set('forge_meta',meta);storage.set('forge_run',run);renderMeta()}
function renderMeta(){$('#home-dust').textContent=meta.dust;$('#forge-dust').textContent=meta.dust;$('#clear-count').textContent=meta.clears;$('#best-depth').textContent=meta.best;$('#continue-btn').hidden=!run||run.finished}
function hero(){return HEROES[run?.hero||selectedHero]}
function shuffle(a){a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t.timer);t.timer=setTimeout(()=>t.classList.remove('show'),1700)}
function sheet(html){$('#sheet-content').innerHTML=html;$('#sheet').classList.add('open')}
function closeSheet(){$('#sheet').classList.remove('open')}

function heroCardPool(h){return [...h.cards,...(HERO_SPELLS[h.id]||[])]}
function deckStats(cards){return{units:cards.filter(c=>cardType(c)==='unit').length,spells:cards.filter(c=>cardType(c)==='spell').length,avg:(cards.reduce((n,c)=>n+c.cost,0)/Math.max(1,cards.length)).toFixed(1)}}
function startingDeck(h,withCustom=includeCustomCard){const pool=[...heroCardPool(h),...NEUTRAL],cards=HERO_STARTERS[h.id].map(id=>pool.find(c=>c.id===id)).filter(Boolean).map(clone);if(withCustom&&meta.custom)cards.push(clone(meta.custom));return cards}

function updateHeroBrief(){
 const h=HEROES[selectedHero],cards=startingDeck(h,includeCustomCard),s=deckStats(cards);
 $('#selected-hero-brief').innerHTML=`<small>当前选择</small><b>${h.name} · ${cards.length}张 · ${s.units}单位 / ${s.spells}法术</b>`;
 $('#embark-btn').innerHTML=`以${h.name}开始出征 <span>→</span>`
}

function renderCustomStartSlot(){
 const root=$('#custom-start-slot');
 if(!meta.custom){
  root.innerHTML=`<div class="custom-slot-heading"><span>自铸牌槽 · 可选</span><b>未铸造</b></div><p>这不是开局必经步骤。你可以直接使用英雄的8张初始牌，也可以先打造一张额外起始牌。</p><button class="custom-slot-action" id="custom-slot-forge">前往自由铸卡</button>`;
  $('#custom-slot-forge').onclick=()=>openForge('hero-view');
  return
 }
 const c=meta.custom;
 root.innerHTML=`<div class="custom-slot-heading"><span>自铸牌槽 · 可选</span><b class="${includeCustomCard?'equipped':''}">${includeCustomCard?'本次携带':'本次不携带'}</b></div><div class="custom-slot-card"><button class="custom-card-peek" id="custom-card-peek"><span class="deck-art art-atlas" style="${artStyle(c)}"><i>${c.cost}</i></span><span><b>${c.name}</b><small>${rulesText(c)}</small></span><em>⚔${c.atk} ♥${c.hp}</em></button><div class="custom-slot-actions"><button class="custom-slot-toggle ${includeCustomCard?'active':''}" id="custom-slot-toggle">${includeCustomCard?'移出本次牌组':'加入本次牌组'}</button><button class="custom-slot-edit" id="custom-slot-edit">修改</button></div></div>`;
 $('#custom-card-peek').onclick=()=>showCardInspector(c);
 $('#custom-slot-toggle').onclick=()=>{includeCustomCard=!includeCustomCard;renderHeroes();renderCustomStartSlot()};
 $('#custom-slot-edit').onclick=()=>openForge('hero-view')
}

function renderHeroes(){
 $('#hero-picker').innerHTML=Object.values(HEROES).map(h=>{const cards=startingDeck(h,includeCustomCard),s=deckStats(cards);return `<article class="hero-choice ${selectedHero===h.id?'selected':''}" style="--hero-color:${h.color}"><button class="hero-option ${selectedHero===h.id?'selected':''}" data-hero="${h.id}" role="option" aria-selected="${selectedHero===h.id}"><div class="hero-art art-atlas" style="${artStyle(h)}"><span>${h.glyph}</span></div><div class="hero-option-copy"><h3>${h.name}</h3><p>${h.intro}</p><small>${h.title} · ${h.maxHp}生命</small></div></button><button class="hero-deck-preview" data-preview="${h.id}"><span>▦ 预览初始牌组</span><small>${cards.length}张 · ${s.units}单位 · ${s.spells}法术</small></button></article>`}).join('');
 $$('.hero-option').forEach(b=>b.onclick=()=>{selectedHero=b.dataset.hero;renderHeroes();renderCustomStartSlot()});
 $$('.hero-deck-preview').forEach(b=>b.onclick=()=>{selectedHero=b.dataset.preview;renderHeroes();renderCustomStartSlot();showStartingDeck(b.dataset.preview)});
 updateHeroBrief();
 if($('#hero-view').classList.contains('active'))requestAnimationFrame(()=>$('.hero-choice.selected')?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}))
}

function showStartingDeck(heroId=selectedHero){
 const h=HEROES[heroId],cards=startingDeck(h,includeCustomCard),s=deckStats(cards);
 sheet(`<div class="starter-deck-sheet"><p class="kicker">STARTING DECK</p><h2>${h.name}的初始牌组</h2><div class="starter-deck-summary"><span><b>${cards.length}</b>张牌</span><span><b>${s.units}</b>单位</span><span><b>${s.spells}</b>法术</span><span><b>${s.avg}</b>均费</span></div><p>${meta.custom&&includeCustomCard?'已包含1张自铸牌。':'8张英雄基础起始牌。'}长按或点击任意卡牌查看完整规则。</p><div class="starter-deck-grid">${cards.map((c,i)=>`<button class="starter-card" data-starter-card="${i}" aria-label="查看${c.name}">${cardFace(c,'starter-face')}${c.custom?'<em>自铸</em>':''}</button>`).join('')}</div></div>`);
 $$('[data-starter-card]').forEach(b=>{const c=cards[+b.dataset.starterCard];bindCardHold(b,c);b.onclick=()=>{if(b._suppressCardClick){b._suppressCardClick=false;return}showCardInspector(c)}})
}

function openHeroSelect(){if(run&&!run.finished)selectedHero=run.hero;renderHeroes();renderCustomStartSlot();show('hero-view');requestAnimationFrame(()=>$('.hero-choice.selected')?.scrollIntoView({block:'nearest',inline:'center'}))}
function newRun(){const h=HEROES[selectedHero];run={hero:h.id,hp:h.maxHp,maxHp:h.maxHp,depth:0,deck:startingDeck(h,includeCustomCard),customIncluded:!!(includeCustomCard&&meta.custom),dust:0,relics:[],done:[],finished:false};persist();renderMap();show('map-view')}
function embark(){if(run&&!run.finished){sheet(`<div class="result-sheet"><div class="result-mark">⚠</div><h2>覆盖当前远征？</h2><p>你在第 ${run.depth+1} 个房间还有一场未完成的远征。开始新远征会覆盖它。</p><button class="btn primary" id="confirm-embark">确认开始新远征</button><button class="btn ghost sheet-close-inline">保留当前远征</button></div>`);setTimeout(()=>$('#confirm-embark').onclick=()=>{closeSheet();newRun()},0);return}newRun()}
function renderMap(){if(!run)return;const h=hero();$('#floor-num').textContent=Math.min(7,run.depth+1);$('#map-hp').textContent=run.hp;$('#map-portrait').textContent='';$('#map-portrait').classList.add('art-atlas');$('#map-portrait').style.cssText=`border-color:${h.color};${artStyle(h)}`;$('#map-hero-name').textContent=h.name;$('#deck-count').textContent=run.deck.length;$('#relic-count').textContent=run.relics.length;$('#run-dust').textContent=run.dust;$('#dungeon-path').innerHTML=ROOMS.map((r,i)=>`<button class="path-node ${i<run.depth?'done':i===run.depth?'current':'locked'}" style="--node-color:${r.color}" data-room="${i}" ${i!==run.depth?'disabled':''}><span class="path-icon">${i<run.depth?'✓':r.icon}</span><span><b>${r.title}</b><small>${r.sub}</small></span><em>${i===run.depth?'进入':i<run.depth?'完成':'未探索'}</em></button>`).join('');$$('.path-node.current').forEach(b=>b.onclick=()=>enterRoom(+b.dataset.room))}
function enterRoom(i){const r=ROOMS[i];if(r.type==='battle'||r.type==='elite'||r.type==='boss')startBattle(r);else if(r.type==='event')startEvent();else show('camp-view')}
function completeRoom(){if(!run.done.includes(run.depth))run.done.push(run.depth);run.depth++;meta.best=Math.max(meta.best,run.depth);persist();renderMap();show('map-view')}

function makeUnit(c,enemy=false){const amount=effectAmount(c,1);return {...clone(c),maxHp:c.hp,shield:c.effect==='shield'?amount:c.effect==='shield2'?2:0,thorns:c.effect==='thorns'?amount:0,poison:0,enemy}}
function startBattle(room){const foe=FOES[room.foe];const deck=shuffle(run.deck.map(clone)),opening=run.relics.includes('回响齿轮')?5:4;let hand=deck.splice(0,opening);if(!hand.some(c=>c.cost===1&&cardType(c)==='unit')){const i=deck.findIndex(c=>c.cost===1&&cardType(c)==='unit');if(i>=0)hand[hand.length-1]=deck.splice(i,1,hand[hand.length-1])[0]}battle={room,foe,round:1,maxRound:foe.boss?6:4,playerHp:run.hp,enemyHp:foe.hp,energy:1,deck,hand,discard:[],lanes:[null,null,null],enemyLanes:[null,null,null],selected:null,target:null,reserveShield:0,skillUsed:false,resolving:false,forgePassive:false,relicTriggered:false,sporeDeaths:0};$('#lock-btn').disabled=false;$$('.lane').forEach(x=>x.style.outline='');planEnemy();renderBattle();show('battle-view')}
function planEnemy(){const affordable=battle.foe.cards.filter(c=>c.cost<=battle.round);battle.enemyPlan={lane:Math.floor(Math.random()*3),card:clone(affordable[Math.floor(Math.random()*affordable.length)])}}
function renderBattle(){const h=hero(),f=battle.foe;$('#round').textContent=battle.round;$('#max-round').textContent=battle.maxRound;$('#player-name').textContent=h.name;$('#player-portrait').textContent='';$('#player-portrait').style.cssText=`border-color:${h.color};${artStyle(h)}`;$('#player-hp').textContent=Math.max(0,battle.playerHp);$('#player-max-hp').textContent=run.maxHp;$('#player-hp-bar').style.width=`${Math.max(0,battle.playerHp)/run.maxHp*100}%`;$('#enemy-name').textContent=f.name;$('#enemy-portrait').textContent='';$('#enemy-portrait').style.cssText=`border-color:${f.color};${artStyle(f)}`;$('#enemy-hp').textContent=Math.max(0,battle.enemyHp);$('#enemy-max-hp').textContent=f.hp;$('#enemy-hp-bar').style.width=`${Math.max(0,battle.enemyHp)/f.hp*100}%`;$('#intent-text').textContent=`${['左翼','中央','右翼'][battle.enemyPlan.lane]} · ${battle.enemyPlan.card.name}`;$('#energy').textContent=battle.energy;$('#energy-max').textContent=battle.round;$('#skill-icon').textContent=h.skillIcon;$('#skill-name').textContent=h.skill;$('#skill-desc').textContent=h.skillDesc;$('#skill-btn').classList.toggle('used',battle.skillUsed);$('#lock-btn').disabled=battle.resolving;renderHand();renderBoard()}
function renderHand(){const root=$('#hand');root.innerHTML='';battle.hand.forEach((c,i)=>{const b=document.createElement('button');b.className=`hand-card ${battle.selected===i?'selected':''} ${c.cost>battle.energy?'disabled':''}`;b.innerHTML=cardFace(c,'hand-face');bindCardHold(b,c);b.onclick=()=>{if(b._suppressCardClick){b._suppressCardClick=false;return}selectCard(i)};root.appendChild(b)})}
function selectCard(i){if(battle.resolving)return;const c=battle.hand[i];if(c.cost>battle.energy)return toast('当前能量不足');battle.selected=battle.selected===i?null:i;battle.target=null;renderHand();renderBoard();toast(battle.selected===null?'已取消选择':cardType(c)==='spell'?'法术已准备，直接锁定即可施放':'再点击一条战线')}
function unitHtml(u){return u?`<div class="unit ${u.enemy?'foe-unit':''}">${cardFace(u,'board-face')}</div>`:''}
function renderBoard(){const unitSelected=battle.selected!==null&&cardType(battle.hand[battle.selected])==='unit';$$('.lane').forEach((el,i)=>{el.classList.toggle('ready',unitSelected);el.style.outline=battle.target===i?'2px solid #ffe28a':'';$('.foe',el).innerHTML=unitHtml(battle.enemyLanes[i]);$('.ally',el).innerHTML=unitHtml(battle.lanes[i]);const foeUnit=$('.foe .unit',el),allyUnit=$('.ally .unit',el);if(foeUnit)bindCardHold(foeUnit,battle.enemyLanes[i]);if(allyUnit)bindCardHold(allyUnit,battle.lanes[i]);$('.ally',el).onclick=e=>{if(allyUnit?._suppressCardClick){allyUnit._suppressCardClick=false;return}chooseLane(i)}})}
function chooseLane(i){if(battle.resolving)return;if(battle.selected===null)return toast('先选择一张手牌');if(cardType(battle.hand[battle.selected])==='spell')return toast('这张法术无需选线，直接锁定即可');battle.target=i;renderBoard();toast(`${battle.hand[battle.selected].name} → ${['左翼','中央','右翼'][i]}`)}
function hurt(u,n){const block=Math.min(u.shield||0,n);u.shield-=block;u.hp-=n-block}
function deployEffect(u,other,side){if(u.effect==='strike'&&other)hurt(other,effectAmount(u,1));if(u.effect==='strike2'&&other)hurt(other,2);if(u.effect==='heal')battle[side==='player'?'playerHp':'enemyHp']=Math.min(side==='player'?run.maxHp:battle.foe.hp,battle[side==='player'?'playerHp':'enemyHp']+2)}
function castSpell(c){let msg='法术已经结算。';if(c.effect==='spell_shield_all'){const allies=battle.lanes.filter(Boolean);if(allies.length){allies.forEach(u=>u.shield++);msg=`${allies.length}名友军各获得1点护盾`}else{battle.reserveShield+=2;msg='结界将为下个部署单位提供2点护盾'}}if(c.effect==='spell_poison_all'){const foes=battle.enemyLanes.filter(Boolean);foes.forEach(u=>u.poison++);msg=`${foes.length}名敌军获得1层中毒`}if(c.effect==='spell_shadow'){if(battle.enemyLanes.some(x=>!x)){battle.enemyHp-=2;msg='影隙命中敌方英雄，造成2点伤害'}else if(battle.deck.length&&battle.hand.length<6){battle.hand.push(battle.deck.shift());msg='战线封闭，改为抽取1张牌'}else msg='战线封闭，但牌库已经空了'}battle.discard.push(c);toast(msg)}
function deploy(){let spell=null;if(battle.selected!==null){const chosen=battle.hand[battle.selected];if(cardType(chosen)==='spell'||battle.target!==null){const c=battle.hand.splice(battle.selected,1)[0];battle.energy-=c.cost;if(cardType(c)==='spell')spell=c;else{const u=makeUnit(c);if(battle.reserveShield){u.shield+=battle.reserveShield;battle.reserveShield=0}if(hero().id==='forge'&&!battle.forgePassive){u.shield++;battle.forgePassive=true}if(run.relics.includes('余烬棱镜')&&!battle.relicTriggered){u.atk++;battle.relicTriggered=true}battle.lanes[battle.target]=u;deployEffect(u,battle.enemyLanes[battle.target],'player')}}}const p=battle.enemyPlan,u=makeUnit(p.card,true);battle.enemyLanes[p.lane]=u;deployEffect(u,battle.lanes[p.lane],'enemy');if(spell)castSpell(spell);battle.selected=null;battle.target=null;cleanupDeaths()}
function onDeath(u,isPlayer){if(!u)return;if(isPlayer&&(u.effect==='deathheal'||u.effect==='deathheal2'))battle.playerHp=Math.min(run.maxHp,battle.playerHp+(u.effect==='deathheal2'?2:1));if(isPlayer&&u.effect==='deathblast')battle.enemyHp-=2;if(!isPlayer&&u.effect==='deathblast')battle.playerHp-=2}
function cleanupDeaths(){[battle.lanes,battle.enemyLanes].forEach((side,si)=>side.forEach((u,i)=>{if(u&&u.hp<=0){onDeath(u,si===0);side[i]=null}}))}
function attack(){let pd=0,ed=0;const snaps=[0,1,2].map(i=>({i,p:battle.lanes[i],e:battle.enemyLanes[i],pa:battle.lanes[i]?.atk||0,ea:battle.enemyLanes[i]?.atk||0}));snaps.forEach(({p,e,pa,ea})=>{if(p&&e){const ehBefore=e.hp+(e.shield||0),phBefore=p.hp+(p.shield||0);hurt(e,pa);hurt(p,ea);if(e.thorns)hurt(p,e.thorns);if(p.thorns)hurt(e,p.thorns);if(p.effect==='poison')e.poison++;if(p.effect==='poison2')e.poison+=2;if(e.effect==='poison')p.poison++;if(e.effect==='poison2')p.poison+=2;if(p.effect==='pierce'&&pa>ehBefore)ed+=pa-ehBefore;if(e.effect==='pierce'&&ea>phBefore)pd+=ea-phBefore}else if(p&&!e)ed+=pa+(p.effect==='sneak'?1:p.effect==='sneak2'?2:0)+(hero().id==='shadow'?1:0);else if(e&&!p)pd+=ea+(e.effect==='sneak'?1:e.effect==='sneak2'?2:0)});battle.playerHp-=pd;battle.enemyHp-=ed;[battle.lanes,battle.enemyLanes].forEach((side,si)=>side.forEach((u,i)=>{if(!u)return;if(u.poison){hurt(u,u.poison);u.poison=Math.max(0,u.poison-1)}if(u.hp<=0){onDeath(u,si===0);side[i]=null}}));return{pd,ed}}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function damagePopup(target,value,blocked=false,heroHit=false){if(!target||value<=0)return;const p=document.createElement('span');p.className=`damage-pop ${blocked?'blocked':''} ${heroHit?'hero-damage-pop':''}`;p.textContent=`-${value}`;target.appendChild(p)}
async function playCombatFx(){
 const snapshots=[0,1,2].map(i=>({i,p:battle.lanes[i],e:battle.enemyLanes[i]}));
 snapshots.forEach(({i,p,e})=>{const lane=$$('.lane')[i],pu=$('.ally .unit',lane),eu=$('.foe .unit',lane);lane.classList.add('fx-running');if(p&&e){pu?.classList.add('clash-from-ally');eu?.classList.add('clash-from-foe')}else if(p){pu?.classList.add('charge-from-ally')}else if(e){eu?.classList.add('charge-from-foe')}});
 await wait(285);
 snapshots.forEach(({i,p,e})=>{const lane=$$('.lane')[i],pu=$('.ally .unit',lane),eu=$('.foe .unit',lane);if(p&&e){const burst=document.createElement('i');burst.className='clash-burst';lane.appendChild(burst);const toPlayer=e.atk+(e.thorns||0),toEnemy=p.atk+(p.thorns||0);damagePopup(pu,toPlayer,(p.shield||0)>=toPlayer);damagePopup(eu,toEnemy,(e.shield||0)>=toEnemy)}else if(p){const amount=p.atk+(p.effect==='sneak'?1:p.effect==='sneak2'?2:0)+(hero().id==='shadow'?1:0);$('.opponent').classList.add('direct-impact');damagePopup($('.opponent'),amount,false,true)}else if(e){const amount=e.atk+(e.effect==='sneak'?1:e.effect==='sneak2'?2:0);$('.player').classList.add('direct-impact');damagePopup($('.player'),amount,false,true)}});
 const result=attack();
 await wait(440);
 $$('.lane').forEach(l=>l.classList.remove('fx-running'));$$('.clash-burst,.damage-pop').forEach(x=>x.remove());$('.opponent').classList.remove('direct-impact');$('.player').classList.remove('direct-impact');
 return result;
}
async function lockTurn(){if(battle.resolving)return;if(battle.selected!==null&&cardType(battle.hand[battle.selected])==='unit'&&battle.target===null)return toast('还没有选择部署战线');battle.resolving=true;$('#lock-btn').disabled=true;$('#phase').textContent='双方行动锁定';await wait(330);$('#phase').textContent='行动揭示';deploy();renderBattle();await wait(420);if(battle.playerHp<=0||battle.enemyHp<=0){if(endCheck())return}$('#phase').textContent='三线交锋';const d=await playCombatFx();renderBattle();if(d.pd||d.ed)toast(`英雄伤害：你 ${d.pd} · 敌 ${d.ed}`);await wait(160);if(endCheck())return;battle.round++;battle.energy=battle.round;if(battle.deck.length&&battle.hand.length<6)battle.hand.push(battle.deck.shift());planEnemy();battle.resolving=false;$('#lock-btn').disabled=false;$('#phase').textContent='规划行动';renderBattle()}
function boardScore(side){return side.filter(Boolean).reduce((n,u)=>n+u.atk+u.hp+(u.shield||0),0)}
function endCheck(){if(battle.playerHp>0&&battle.enemyHp>0&&battle.round<battle.maxRound)return false;let win;if(battle.enemyHp<=0)win=true;else if(battle.playerHp<=0)win=false;else{const p=[battle.playerHp,battle.lanes.filter(Boolean).length,boardScore(battle.lanes)],e=[battle.enemyHp,battle.enemyLanes.filter(Boolean).length,boardScore(battle.enemyLanes)];win=p[0]!==e[0]?p[0]>e[0]:p[1]!==e[1]?p[1]>e[1]:p[2]>=e[2]}battle.resolving=true;if(win)battleWin();else battleLose();return true}
function useSkill(){if(battle.skillUsed||battle.resolving)return;const id=hero().id;if(id==='forge'){const ids=battle.lanes.map((u,i)=>u?i:-1).filter(i=>i>=0);if(!ids.length)return toast('场上没有友方单位');const i=ids.sort((a,b)=>battle.lanes[a].hp-battle.lanes[b].hp)[0];battle.lanes[i].shield+=2;toast(`${battle.lanes[i].name} 获得2点护盾`)}else if(id==='spore'){const foes=battle.enemyLanes.filter(Boolean);if(!foes.length)return toast('敌方场上没有单位');foes.forEach(u=>u.poison++);toast('所有敌军中毒1')}else{if(!battle.enemyLanes.some(x=>!x))return toast('敌方没有暴露空线');battle.enemyHp-=2;toast('逐影者穿过空线造成2点伤害')}battle.skillUsed=true;renderBattle();endCheck()}
function awardEliteRelic(){const pool=['铸甲碎片','回响齿轮','余烬棱镜'].filter(x=>!run.relics.includes(x)),r=pool[Math.floor(Math.random()*pool.length)]||'铸甲碎片';run.relics.push(r);if(r==='铸甲碎片'){run.maxHp+=3;run.hp+=3}toast(`获得遗物：${r}`)}
function battleWin(){run.hp=Math.max(1,battle.playerHp);const base=battle.foe.boss?60:battle.foe.elite?30:15;run.dust+=base;if(battle.foe.elite)awardEliteRelic();persist();if(battle.foe.boss){run.finished=true;meta.dust+=run.dust;meta.clears++;meta.best=7;persist();sheet(`<div class="result-sheet"><div class="result-mark">♛</div><p class="kicker">DUNGEON CLEARED</p><h2>深炉已经屈服</h2><p>你带着 ${run.dust} 晶尘和 ${run.relics.length} 件遗物回到地表。这次构筑成功穿过了全部七个房间。</p><button class="btn primary" id="victory-home">带着战利品回城</button></div>`);setTimeout(()=>$('#victory-home').onclick=()=>{closeSheet();run=null;persist();show('home-view')},0)}else{prepareReward(base);show('reward-view')}}
function battleLose(){const carried=Math.floor(run.dust*.55);meta.dust+=carried;run.finished=true;persist();sheet(`<div class="result-sheet"><div class="result-mark">◆</div><p class="kicker">THE RUN ENDS</p><h2>远征止步于第 ${run.depth+1} 个房间</h2><p>你没能继续深入，但仍抢救回 ${carried} 晶尘。下一次可以换英雄或重新铸一张起始牌。</p><button class="btn primary" id="lose-home">返回地表</button><button class="btn ghost" id="retry-run">同一英雄再试一次</button></div>`);setTimeout(()=>{$('#lose-home').onclick=()=>{closeSheet();run=null;persist();show('home-view')};$('#retry-run').onclick=()=>{const h=run.hero;closeSheet();run=null;selectedHero=h;newRun()}},0)}

function rewardPool(){return shuffle([...heroCardPool(hero()),...NEUTRAL]).slice(0,3).map(clone)}
function prepareReward(dust){$('#reward-dust').textContent=dust;const cards=rewardPool();$('#reward-cards').innerHTML=cards.map((c,i)=>`<button class="reward-card" data-reward="${i}" aria-label="选择${c.name}">${cardFace(c,'reward-face')}</button>`).join('');$$('.reward-card').forEach(b=>{const c=cards[+b.dataset.reward];bindCardHold(b,c);b.onclick=()=>{if(b._suppressCardClick){b._suppressCardClick=false;return}run.deck.push(c);finishReward()}})}
function finishReward(){persist();completeRoom()}
function startEvent(){const e=EVENTS[Math.floor(Math.random()*EVENTS.length)];$('#event-title').textContent=e.title;$('#event-body').textContent=e.body;$('#event-choices').innerHTML=e.choices.map(c=>`<button class="choice" data-event="${c.action}"><span><b>${c.title}</b><span>${c.desc}</span></span><em>${c.tag}</em></button>`).join('');$$('[data-event]').forEach(b=>b.onclick=()=>resolveEvent(b.dataset.event));show('event-view')}
function addRandomCard(effect){let pool=[...heroCardPool(hero()),...NEUTRAL].filter(c=>!effect||c.effect.includes(effect));if(!pool.length&&effect)pool=[...heroCardPool(HEROES.spore)].filter(c=>c.effect.includes(effect));run.deck.push(clone(pool[Math.floor(Math.random()*pool.length)]))}
function removeWeak(){if(run.deck.length<=5)return null;let i=run.deck.reduce((best,c,n)=>c.cost<run.deck[best].cost?n:best,0);return run.deck.splice(i,1)[0]}
function resolveEvent(a){let msg='';if(a==='buyCard'){if(run.dust>=20){run.dust-=20;addRandomCard();msg='铸造台吐出一张完整卡牌。'}else{run.hp=Math.max(1,run.hp-2);msg='晶尘不足，机器抽走了2点生命。'}}if(a==='scrap'){run.dust+=25;run.hp=Math.max(1,run.hp-3);msg='你带走25晶尘，锋利零件划伤了手。'}if(a==='memory'){const c=removeWeak();run.maxHp+=2;run.hp+=2;msg=`${c?.name||'一段记忆'}消失了，最大生命+2。`}if(a==='poisonCard'){addRandomCard('poison');run.hp=Math.max(1,run.hp-2);msg='一张带毒卡牌加入牌组。'}if(a==='burn'){run.dust+=12;msg='菌毯尖叫着化为12晶尘。'}if(a==='chest'){if(Math.random()<.5){run.relics.push('倒悬齿轮');run.maxHp+=3;run.hp+=3;msg='获得遗物「倒悬齿轮」：最大生命+3。'}else{run.hp=Math.max(1,run.hp-5);msg='货箱里只有一只饥饿怪物，你受到了5点伤害。'}}if(a==='cut'){run.dust+=18;run.hp=Math.min(run.maxHp,run.hp+2);msg='商队残骸落地，找到18晶尘。'}if(a==='leave')msg='你保持警惕，安全离开。';persist();sheet(`<div class="result-sheet"><div class="result-mark">◆</div><h2>选择已生效</h2><p>${msg}</p><button class="btn primary" id="event-next">继续深入</button></div>`);setTimeout(()=>$('#event-next').onclick=()=>{closeSheet();completeRoom()},0)}
function camp(a){let msg='';if(a==='heal'){const n=Math.ceil(run.maxHp*.35);run.hp=Math.min(run.maxHp,run.hp+n);msg=`恢复了 ${n} 点生命。`}if(a==='upgrade'){const candidates=run.deck.filter(c=>cardType(c)==='unit'&&!c.upgraded);const c=candidates[Math.floor(Math.random()*candidates.length)]||run.deck.find(c=>cardType(c)==='unit');if(c){c.atk++;c.hp++;c.upgraded=true;c.name+=' +';msg=`${c.name} 获得 +1/+1。`}else msg='牌组里没有可以锻打的单位牌。'}if(a==='remove'){const c=removeWeak();msg=c?`已从牌组移除 ${c.name}。`:'牌组太薄，无法继续移除。'}persist();sheet(`<div class="result-sheet"><div class="result-mark">♨</div><h2>营火渐渐熄灭</h2><p>${msg}</p><button class="btn primary" id="camp-next">继续深入</button></div>`);setTimeout(()=>$('#camp-next').onclick=()=>{closeSheet();completeRoom()},0)}

function showDeck(){const s=deckStats(run.deck);sheet(`<p class="kicker">CURRENT DECK</p><h2>${hero().name}的远征牌组</h2><p>${run.deck.length}张牌 · ${s.units}单位 / ${s.spells}法术。带“+”的是营火强化牌。</p><div class="deck-list">${run.deck.slice().sort((a,b)=>a.cost-b.cost).map(c=>`<div class="deck-row"><span class="deck-art art-atlas" style="${artStyle(c)}"><i>${c.cost}</i></span><span><b>${c.name}</b><small>${rulesText(c)}</small></span><em>${cardType(c)==='spell'?'✧ 法术':`⚔${c.atk} ♥${c.hp}`}</em></div>`).join('')}</div>`)}

const LIBRARY_META={forge:{name:'铸炉者',glyph:'炉',color:'#df9b43'},spore:{name:'孢子之母',glyph:'孢',color:'#8da95c'},shadow:{name:'逐影者',glyph:'影',color:'#38c7bc'},spell:{name:'法术牌',glyph:'术',color:'#b88cff'},neutral:{name:'中立',glyph:'中',color:'#b9a891'},enemy:{name:'敌方单位',glyph:'敌',color:'#dc6858'}};
function allLibraryCards(){
 const cards=[];
 Object.values(HEROES).forEach(h=>heroCardPool(h).forEach(c=>cards.push({...clone(c),category:h.id})));
 NEUTRAL.forEach(c=>cards.push({...clone(c),category:'neutral'}));
 Object.entries(FOES).forEach(([fid,f])=>f.cards.forEach((c,i)=>cards.push({...clone(c),id:`E-${fid}-${i}`,category:'enemy',source:f.name})));
 return cards;
}
function renderLibrary(filter='all'){
 const all=allLibraryCards(),shown=filter==='all'?all:filter==='spell'?all.filter(c=>cardType(c)==='spell'):all.filter(c=>c.category===filter),meta=filter==='all'?null:LIBRARY_META[filter];
 $('#library-count').textContent=all.length;
 $('#library-summary').textContent=filter==='all'?`共 ${all.length} 张 · 选择分类浏览，点击卡牌查看完整规则`:`${meta.name} · ${shown.length} 张已实现卡牌`;
 $('#library-grid').innerHTML='';
 shown.forEach(c=>{const m=LIBRARY_META[c.category],b=document.createElement('button');b.className='collection-card';b.style.setProperty('--cat-color',m.color);b.innerHTML=`${cardFace(c,'collection-face')}<span class="collection-category">${m.glyph}</span>`;bindCardHold(b,c);b.onclick=()=>{if(b._suppressCardClick){b._suppressCardClick=false;return}showCardInspector(c)};$('#library-grid').appendChild(b)});
 $$('#library-filters button').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
}

function forgeUpdate(){
 const cost=+$('#forge-cost-input').value;
 const atk=+$('#forge-atk').value;
 const hp=+$('#forge-hp').value;
 const e=$('.forge-effects .active').dataset.effect;
 const config=FORGE_EFFECT_CONFIG[e];
 const amount=e==='none'?0:Math.max(1,Math.min(4,forgeEffectValues[e]||1));
 forgeEffectValues[e]=amount;
 const max={1:3,2:6,3:9,4:13}[cost];
 const used=atk+hp+amount*config.rate;
 const card={id:'CUSTOM',name:$('#forge-name').value||'未命名',cost,atk,hp,effect:e,effectValue:amount,text:config.rule(amount),custom:true};
 const valueRow=$('#forge-effect-value-row');
 valueRow.hidden=e==='none';
 $('#forge-effect-value-name').textContent=config.label;
 $('#forge-effect-value-hint').textContent=e==='none'?config.hint:`${config.hint} · 每点占${config.rate}预算`;
 $('#forge-effect-value').textContent=amount;
 $('#forge-effect-minus').disabled=e==='none'||amount<=1;
 $('#forge-effect-plus').disabled=e==='none'||amount>=4;
 $('#forge-preview').innerHTML=cardFace(card,'forge-face');
 $('#used-budget').textContent=used;
 $('#max-budget').textContent=max;
 $('#budget-bar').style.width=`${Math.min(100,used/max*100)}%`;
 $('#budget-bar').style.background=used>max?'#dc6858':'linear-gradient(90deg,#38c7bc,#df9b43)';
 $('#save-forge').disabled=used>max;
 return card
}

function returnFromForge(){if(forgeReturnView==='hero-view'){includeCustomCard=!!meta.custom;renderHeroes();renderCustomStartSlot();show('hero-view')}else show('home-view')}
function openForge(returnView='home-view'){
 forgeReturnView=returnView;
 if(meta.custom){
  const saved=meta.custom,e=FORGE_EFFECT_CONFIG[saved.effect]?saved.effect:'shield';
  $('#forge-name').value=saved.name||'';
  $('#forge-cost-input').value=saved.cost;
  $('#forge-atk').value=saved.atk;
  $('#forge-hp').value=saved.hp;
  $$('.forge-effects button').forEach(b=>b.classList.toggle('active',b.dataset.effect===e));
  if(e!=='none')forgeEffectValues[e]=Math.min(4,effectAmount(saved,1));
 }
 forgeUpdate();
 $('#forge-back').onclick=returnFromForge;
 show('forge-view')
}

$('#new-run-btn').onclick=openHeroSelect;$('#embark-btn').onclick=embark;$('#continue-btn').onclick=()=>{renderMap();show('map-view')};$('#open-forge-btn').onclick=()=>openForge();
$('#open-library-btn').onclick=()=>{renderLibrary('all');show('library-view')};$$('#library-filters button').forEach(b=>b.onclick=()=>renderLibrary(b.dataset.filter));
$$('[data-home]').forEach(b=>b.onclick=()=>show('home-view'));$$('[data-map]').forEach(b=>b.onclick=()=>{renderMap();show('map-view')});
$('#lock-btn').onclick=lockTurn;$('#skill-btn').onclick=useSkill;$('#deck-peek').onclick=showDeck;$('#skip-reward').onclick=()=>{run.dust+=10;finishReward()};
$$('[data-camp]').forEach(b=>b.onclick=()=>camp(b.dataset.camp));
$('#battle-help').onclick=()=>sheet(`<p class="kicker">HOW TO PLAY</p><h2>三线同步战斗</h2><p>每回合至多打出一张牌：单位牌需要选择战线，法术牌选择后可直接锁定。敌我行动同时揭示，同线单位互相攻击，空线单位直击英雄。普通战斗和精英战斗最多4回合，首领战最多6回合；时间结束后依次比较英雄生命、占线数与场面分。</p><button class="btn primary sheet-close-inline">明白了</button>`);
$('.sheet-close').onclick=closeSheet;$('#sheet').onclick=e=>{if(e.target===$('#sheet'))closeSheet()};document.addEventListener('click',e=>{if(e.target.classList.contains('sheet-close-inline'))closeSheet()});
$('#inspector-backdrop').onclick=closeCardInspector;$('#inspector-close').onclick=closeCardInspector;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCardInspector()});
$$('#forge-name,#forge-cost-input,#forge-atk,#forge-hp').forEach(x=>x.addEventListener('input',forgeUpdate));
$$('.forge-effects button').forEach(b=>b.onclick=()=>{$$('.forge-effects button').forEach(x=>x.classList.remove('active'));b.classList.add('active');forgeUpdate()});
$('#forge-effect-minus').onclick=()=>{const e=$('.forge-effects .active').dataset.effect;if(e==='none')return;forgeEffectValues[e]=Math.max(1,(forgeEffectValues[e]||1)-1);forgeUpdate()};
$('#forge-effect-plus').onclick=()=>{const e=$('.forge-effects .active').dataset.effect;if(e==='none')return;forgeEffectValues[e]=Math.min(4,(forgeEffectValues[e]||1)+1);forgeUpdate()};
$('#save-forge').onclick=()=>{meta.custom=forgeUpdate();includeCustomCard=true;persist();const label=forgeReturnView==='hero-view'?'返回远征准备':'返回地表';sheet(`<div class="result-sheet"><div class="result-mark">✦</div><h2>${meta.custom.name} 已保存</h2><p>它会出现在远征准备页的自铸牌槽中；你可以为每次新远征决定是否携带。</p><button class="btn primary" id="forge-home">${label}</button></div>`);setTimeout(()=>$('#forge-home').onclick=()=>{closeSheet();returnFromForge()},0)};

renderHeroes();renderMeta();if(run&&!run.finished)$('#continue-btn').hidden=false;
