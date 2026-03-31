import type { ChatPanelDef, ChatRoomLayoutDef, FullPageNode, StoryNode } from '@/types/story'

/** 解析正文中的 [[LINK:n]] 为可点击链接 */
export function splitContentWithLinks(text: string): Array<{ type: 'text' | 'link'; value: string; linkId?: number }> {
  const parts: Array<{ type: 'text' | 'link'; value: string; linkId?: number }> = []
  const re = /\[\[LINK:(\d+)\]\]/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({ type: 'text', value: text.slice(last, m.index) })
    }
    parts.push({ type: 'link', value: `分享链接${m[1]}`, linkId: Number(m[1]) })
    last = m.index + m[0].length
  }
  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) })
  }
  if (parts.length === 0) {
    parts.push({ type: 'text', value: text })
  }
  return parts
}

export const fullPageNodes: Record<number, FullPageNode> = {
  0: {
    id: 0,
    role: 'fullPage',
    kind: 'home',
    content: `游戏须知：玩家扮演网络黑客，可以通过搜索关键词获取历史聊天记录。玩家身份为大学生，想交计组大作业，发现这门课没有助教（实际助教是 D，已消失），想找教授王文礼的联系方式，阴差阳错发现了这个聊天室，抱着试一试的想法进入。`,
    timeline: '2026年4月6日',
  },
  1: {
    id: 1,
    role: 'fullPage',
    kind: 'initialChat',
    content: `Bell：我看了一整天手机了
Bell：眼睛都痛了
April：那你看电脑呗
Bell：？`,
    timeline: '2026年3月1日',
  },
  6: {
    id: 6,
    role: 'fullPage',
    kind: 'schoolNotice',
    content: `校学〔2026〕5号

各学院（部）、各有关单位：

2025年12月31日晚19时30分许，我校计算机学院学生April（学号：2023768845）、Bell（学号：2024582240）等三名同学，未经批准擅自闯入教学三号楼地下二层配电间及周边封闭区域。上述行为违反了《校园安全管理规定》第十二条及《学生违纪处分办法》第十七条，扰乱了正常校园秩序，且存在严重安全隐患。

事发后，经保卫处、学生工作处联合调查，上述三名同学均承认其违规行为。鉴于当事人认错态度良好，且未造成实际财产损失及人身伤害，根据《学生违纪处分条例》第二十一条，决定给予April、Bell等三名同学通报批评处分。

希望全体同学引以为戒，严格遵守校纪校规，不得擅自进入校园内明令禁止的区域。

如对处分决定有异议，可在收到本决定之日起10个工作日内，向学生申诉处理委员会提出书面申诉。

学生工作处

保卫处

2026年1月6日`,
    timeline: '2026年1月6日',
  },
  7: {
    id: 7,
    role: 'fullPage',
    kind: 'loginModal',
    loginVariant: 'chatApril',
  },
  8: {
    id: 8,
    role: 'fullPage',
    kind: 'chatRoom',
    timeline: '2026年2月28日',
  },
  10: {
    id: 10,
    role: 'fullPage',
    kind: 'forum',
    forumRequiresLogin: true,
    content: `【求教】教三地下室「凤凰还愿」有人去过吗？教三地下室流传着「凤凰还愿」的仪式传闻。`,
    timeline: '2025年12月20日',
    forumThread: {
      board: '校园生活 > 闲聊灌水',
      title: '【求教】教三地下室的“凤凰还愿”有人去过吗？真的灵吗？',
      author: '夜行松鼠',
      publishedAt: '2025-12-20 21:34',
      leadParagraphs: [
        '最近在好几个群里都看到有人在传教三地下室那个“凤凰还愿”的事，说什么许愿特别灵，尤其是考试、绩点、感情之类的。有人去过吗？真的假的？',
        '求去过的大佬讲讲怎么操作，想试试但又怕出事儿。',
      ],
      pinnedReplies: [
        {
          floor: 12,
          author: '匿名用户',
          lines: [
            '我来说一下吧，去年跟舍友去过一次，没敢弄，但当时有人给我们讲了大概的流程。',
            '地点：教三地下室最里面，左手边那个配电间，墙上有一块颜色不一样的砖。据说那儿以前是个什么神龛位。',
            '时间：最好傍晚去，日落前后。',
            '方法：用黄纸（文具店那种就行）写上你想实现的事，越具体越好，然后在那里烧掉，烧的时候心里想着这件事。',
            '据说烧完如果纸灰是完整的，没被风吹散，就算成了。',
            '别的就不清楚了，我们那次没敢烧，就看了一眼就跑了。',
          ],
        },
      ],
      replies: [
        {
          floor: 27,
          author: '铁锅炖自己',
          lines: [
            '楼上说的差不多，补充一句：好像要“还愿”，就是愿望实现了之后凤凰会在未来向你索要代价，你不能拒绝，会有不好的后果。具体啥后果没人说得清，反正传得挺邪乎的。',
          ],
        },
        {
          floor: 45,
          author: '深海鱼',
          lines: [
            '去过两次，第一次是陪朋友去的，他烧了之后第二天查成绩，一门本来觉得要挂的课居然刚好60分飘过。第二次我自己去的，想求绩点，结果那学期绩点反而降了......不知道是不是我方法不对。',
            '不过里面确实阴冷，去的时候最好多穿点，别一个人去。',
          ],
        },
        {
          floor: 78,
          author: '吃瓜群众',
          lines: [
            '楼上说的后果我倒是听过一个版本：如果拒绝还愿，那许的愿望会被反噬，不仅实现的东西会收回去，还会搭上别的。具体是啥没人说得准，感觉就是江湖传说。',
          ],
        },
        {
          floor: 102,
          author: '路人甲',
          lines: ['为啥叫“凤凰还愿”啊？有人知道来源吗？'],
          subReply: '不知道，好像是以前论坛上有人这么叫的，传着传着就这么叫了。',
        },
      ],
      opLastReply: {
        paragraphs: [
          '感谢楼上各位！看了一圈还是有点懵，感觉没人说得清到底啥来头。准备先跟朋友去探探路，不烧纸，就看看。',
        ],
      },
      footerStats: '共有 143 条回复 | 今日: 5 | 昨日: 12 | 最高: 356',
    },
  },
  11: {
    id: 11,
    role: 'fullPage',
    kind: 'forumLogin',
    loginVariant: 'forumDeposit',
  },
  12: {
    id: 12,
    role: 'fullPage',
    kind: 'forum',
    forumRequiresLogin: false,
    content: `【求助】跨年夜去了趟教三地下室出现怪事；另有发帖：跨年夜再去一次？、别信「只许一个愿」。`,
    timeline: '2026年2月12日',
    forumThread: {
      board: '我的发帖',
      title: '【求助】跨年夜去了趟教三地下室，真的出现怪事了',
      author: 'Deposit',
      publishedAt: '2026-02-12 22:15',
      leadParagraphs: [
        '跨年夜跟两个朋友去了趟教三地下室。当时就是看论坛里说“凤凰还愿”挺灵的，我有个朋友（叫A吧）最近状态一直不太好，感觉有点抑郁，我就想着去许个愿，希望他能开心起来。',
        '我们是晚上七点左右到的，按照帖子里说的，在配电间那块颜色不一样的砖前面，用黄纸写了“愿A天天开心”，然后烧了。烧的时候纸灰还挺完整的，没散，当时觉得应该是成了。',
        '但是从那之后，我就开始不对劲了。',
        '先是当天晚上回到宿舍，躺在床上总觉得身上发烫，像刚跑完八百那种燥热，但体温计测了又没发烧。室友说我脸色发红，手心也特别热。',
        '然后从第二天开始，我有时候会突然闻到一股很浓的烧焦味，像是塑料烧着了或者电线短路那种。问旁边的人，都说闻不到。最离谱的是昨天，我在图书馆坐着，眼前突然闪了一下火光，就像有人在我面前划了根火柴，然后整个视野里都是橘红色的，持续了大概两三秒。吓我一跳。',
        '今天上课的时候，我走神盯着窗外，恍惚间看到窗户玻璃上映出身后有一团黑烟，回头什么也没有。感觉我是不是出现幻觉了？',
        '有没有人遇到过类似的情况？这是许愿的后遗症吗？还是我身体出了什么问题？要不要去医院看看？',
        '另外，我许愿之后A的状态确实变好了，前几天还主动约我们出去吃饭，看着精神了不少。但他好像记性变差了，有时候刚说过的话转头就忘，不知道跟我许愿有没有关系......',
        '有没有懂的人给点建议？我现在很慌。',
      ],
      repliesSectionTitle: '热门回复',
      replies: [
        {
          floor: 2,
          author: '观火者_97',
          lines: [
            '你是不是没有先了解清楚就去了？你帮别人许愿，代价是要你自己来背的。你出现的那些症状，很像是“薪火焚身”——你现在烧的是你自己的“柴”。',
          ],
        },
        {
          floor: 3,
          author: '深海鱼',
          lines: [
            '去过两次，没有你这么严重。但我第一次去的时候也有一阵子总觉得后背热热的，后来就没事了。你是不是许愿的时候特别用力？或者纸灰形状有什么异常吗？',
          ],
        },
        {
          floor: 4,
          author: '夜行松鼠',
          lines: [
            '我的天，还好我上次只是去看看没敢烧。楼主你这描述太吓人了，要不要去校医院检查一下？就算是迷信，身体不舒服也得先看医生啊。',
          ],
        },
        {
          floor: 5,
          author: '匿名用户',
          lines: [
            '劝你别再去那个地下室了，也别再碰跟这个有关的东西。上一届有三个学长和两个韩国留学生一起搞了这个，结果本来好好的一群人关系突然破裂，最后闹到恩断义绝，大家都说他们是“沾了东西”。你这直接出幻觉了，感觉更严重。',
          ],
        },
        {
          floor: 8,
          author: '铁锅炖自己',
          lines: [
            '楼主你那个朋友A，他状态变好之后有没有什么反常的？除了记性差之外。我听说这个还愿有时候会让人付出的东西跑到别人身上去，你最好仔细观察一下。',
          ],
        },
        {
          floor: 9,
          author: 'Deposit（楼主）',
          lines: [
            '回楼上：A除了有点恍惚忘事之外，其他都还好，精神确实比以前好了。我现在比较担心我自己这些症状，身上发烫的频率越来越高，今天手心都红了。我准备明天先去校医院看看，然后找找有没有人懂这些。谢谢大家关心。',
          ],
        },
      ],
      footerStats:
        '发帖时间：2026-02-12 22:15 | 最后编辑：2026-02-12 23:04 | 共有 13 条回复',
    },
  },
  13: {
    id: 13,
    role: 'fullPage',
    kind: 'mysteryNote',
    content: `玄坛秘笺·卷十四·薪火章

夫薪火者，非人间爨下之火，乃先天一炁所化，寄于命宫，主人之生死寿夭、福祸业缘。昔有抱朴子言：“人禀炁而生，炁尽则亡。”然炁有厚薄，火有明灭，若以邪法盗移薪炁，则火不归位，反噬其主，名曰“焚身”。
焚身之兆：
初，觉胸中燔燠，如抱炽炭，皮肉虽凉，骨中若沸。继而目见赤光，鼻闻焦臭，旁人无所感，唯己独受。旬月之间，肌肤生红斑，状若火燎，搔之则痛彻心髓。重则魂神离体，昼见黑烟自七窍出，夜梦身陷火宅，百鬼啖其魂。此乃薪炁逆冲，三魂受灼之象。盖所盗之薪非己之物，强纳于命宫，如以油沃火，终成燎原之势，反焚其主。`,
  },
  14: {
    id: 14,
    role: 'fullPage',
    kind: 'mysteryNote',
    content: `玄坛秘笺·卷十九·爝火章

凤凰者，先天离炁所化也，司生死更迭、业果轮转；涅槃之仪，天道自然。薪尽则焚，烬冷则生，一死一生，不亏不盈。而"爝火赓炁"之术，乃以凡人之火效凤凰涅槃，强犯天和，僭越阴阳。如若业环成形，薪火互噬，非但不得涅槃重生，反将堕入业果：形神俱灭，不入轮回，永为劫灰。

今人不知敬畏，妄效凤凰，实则自投业火。若有缘见此笺者，速止速止，勿蹈覆辙！`,
  },
  15: {
    id: 15,
    role: 'fullPage',
    kind: 'mysteryNote',
    content: `403 FORBIDDEN

「速止速止，勿蹈覆辙！」

「庚寅年甲申月 重明龛前」`,
  },
  17: {
    id: 17,
    role: 'fullPage',
    kind: 'schoolNotice',
    content: `校保〔2010〕12号

全校师生员工：

2010年8月7日15时20分许，我校东校区家属区12号楼一单元三层发生火灾。火情发生后，保卫处、后勤管理处及属地消防部门迅速赶赴现场进行扑救。经全力处置，明火于15时50分许被完全扑灭。

经事后调查，起火原因为该单元302室（我校文学院张教授家庭住所）阳台线路老化短路引燃杂物。火灾发生时，张教授之子（我校附属小学学生Collide）正在卧室休息，因浓烟弥漫未能及时撤离，被困于室内。

在此次火灾中，Collide的同窗好友（非本校人员）发现火情后，不顾个人安危，两次冲入火场，成功将Collide从卧室救出并转移至安全地带。Collide因吸入过量浓烟及轻度烧伤，被送往市第三人民医院救治，后转入重症监护室，一度生命垂危；该名施救学生身体无碍，毫发未损。

此次火灾未造成其他人员伤亡。具体财产损失正在进一步统计中。

张教授家庭对施救学生的英勇行为深表感激。学校对该学生临危不惧、舍己救人的高尚品格予以充分肯定，并已向其所在学校致信感谢。

针对此次火灾暴露出的安全隐患，学校已启动老旧家属区电路改造工程，同时将在全校范围内开展消防安全专项检查，请各单位及全体师生员工提高防火意识，严格遵守用电安全规定。

特此通报。

保卫处

后勤管理处

2010年8月9日

（校内报警电话：66605110 | 后勤维修电话：62281234）`,
    timeline: '2010年8月9日',
  },
  18: {
    id: 18,
    role: 'fullPage',
    kind: 'loginModal',
    loginVariant: 'chatCollide',
  },
  19: {
    id: 19,
    role: 'fullPage',
    kind: 'chatRoom',
  },
  21: {
    id: 21,
    role: 'fullPage',
    kind: 'medicalRecord',
    content: `Collide 的病历单：病因未知，症状是内脏器官衰竭。`,
    timeline: '2026年4月1日',
  },
  22: {
    id: 22,
    role: 'fullPage',
    kind: 'loginModal',
    loginVariant: 'chatBell',
  },
  23: {
    id: 23,
    role: 'fullPage',
    kind: 'chatRoom',
  },
  24: {
    id: 24,
    role: 'fullPage',
    kind: 'voiceTranscript',
    content: `April：我直说了，10年的那场火灾，是你救了D吧。
Collide：你怎么知道的？
April：我和Deposit都许了愿，我们的因果衔接成环了。
Collide：你在说什么？
April：我去图书馆查了县志，查了关于凤凰、还愿、仪式的历史，结果还真的有记载。简单来说，我们都受到了愿望的反噬，那些愿望的代价因为形成了循环，会在我们身上不断叠加，直到其中一环消失。
April：你一定也许了关于Deposit的愿望，不然因果链无法闭环；而且这个愿望的代价一定非常沉重，所以你现在才会躺在这里。
April：我想来想去，也只有你们小时候的那场火灾了——你许愿让他活下来，代价是你自己的虚弱。我说的对吗？
Collide：……
Collide：你知道吗，Deposit跟我说他最近总能看到火场的幻觉，身上还有被灼烧的痛感。我许的那个愿望，它的效力正在不断流失，代价却在变本加厉地返还，再这样下去Deposit真的会死的！如果像你说的那样，是因为我们的愿望形成了环，那只要这个环断掉不就好了？反正我的身体也在不断衰竭，没人知道是怎么回事的。
Collide：——当然，只要你不要说出去。
Collide：你自己也在承受代价吧？你的失忆状况不是越来越严重了？只要我死了，一切都能解决。
April：你猜我为什么来这里？
April：我有其他方法，你放心好了。你和Deposit都会没事的。`,
    timeline: '2026年3月27日',
  },
  26: {
    id: 26,
    role: 'fullPage',
    kind: 'forum',
    forumRequiresLogin: false,
    content: `【慎入】教三地下室的"爝火重明"，揭示凤凰还愿的真实来历与凶险禁忌。`,
    timeline: '2025年9月15日',
    forumThread: {
      board: '灵异怪谈 > 旧帖精华',
      title: '【慎入】教三地下室的"爝火重明"',
      author: '观火者_97',
      publishedAt: '2025-09-15 23:47',
      leadParagraphs: [
        '又到了一年秋风起的时候，看到新生群里有人在问教三地下室为什么锁着，也有人在传什么凤凰还愿。作为曾经差点踩进去的人，我觉得有必要把这个事情说明白。你们现在听到的版本，大多是经过美化或者以讹传讹的，真正的水比你们想的要深得多。',
        '这事要从头说起。教三这栋楼，建于80年代，选址之前是一片烧毁的旧戏台旧址。当年设计的时候，就有人说地基打不稳，后来果然出了几次施工事故，据传是有工人看到了不该看的东西。这些暂且不表，只说这地下室。',
        '地下室原本是作为设备层设计的，但建成后没多久，就有人发现它的平面图存在一个"不可能的结构"——根据测绘，地下室的面积比地面上整栋楼的投影面积还要多出十几平米，多出来的空间更是找不到入口，好像幽灵一样。后来学校请了大师来看，说多出来的地方，是当年戏台的重明龛位，压着东西，不能动，也不能打通。那几年打倒牛鬼蛇神的风头正盛，学校就把墙挖开，把里面的重明龛当成了历史建筑摆在那里。本来二十多年来都没什么事，但2010年夏天学校突然起了一场火，整个地下室都被烧干净了，当时的校长觉得真有什么忌讳，于是就把重明龛重新用混凝土封死了，只在原位置留了一个配电间。',
        '而凤凰还愿的传说，是从2003年开始在校内小范围流传的。那年有个研究民俗学的研究生，不知从哪翻到了老校志，又结合了当地县志里关于"爝火重明"的记载，写了一篇论文，后来论文被毙了，他就把原稿扔在了实验室的书架上。我作为他的直系学弟，也是碰巧才翻到的这篇论文：',
        '所谓"凤凰还愿"，本名应该叫"爝火赓炁"。在本地县志的民俗卷里，这是一种极其古老的祈禳之法。旧时戏班子里，常有"拜火神"的习俗，而其中最隐秘的一支，信奉的是"重明鸟"的凶面——也就是凤凰中司掌业果的那一面。他们相信，人世的因果如柴薪，燃烧殆尽则命数终结。而"爝火赓炁"，就是借由特定的仪式，将一人未尽的"柴薪"引渡给另一人，从而延长后者在世间的"燃烧"。县志里记载了清代本地一个乡绅家族，为了救回病重的独子，连续三次动用此术，最终全家遭遇离奇灾祸，无一幸免。最后的记录只有八个字："形神俱灭，世不存焉。"',
        '但这法子有两大禁忌，几乎没有人敢真正去用。',
        '其一，曰"薪不越位"。',
        '许愿之人（称为"爝者"）与承受之人（称为"薪主"），必须有恩义联结，否则薪火不传，反噬自身。仪式中，爝者需在酉时三刻（日落前后，阴阳交界之时），于重明龛位之前，在黄纸上写下薪主之名与所求之事，然后点燃。若火焰直上，不偏不倚，且纸灰聚而不散，呈鸟形，则仪式成；若火焰歪斜，纸灰崩散，则仪式败，爝者将承担双倍业果。',
        '其二，曰"环不可结"。',
        '这是最凶险的一条。县志原文写得很晦涩："爝火递传，业果环成。环成则薪尽火灭，诸般业果，如坠无间。"我猜想是，如果许愿形成了传递，就会形成一个封闭的"业环"。在这个环里，每个人的"薪柴"都不再属于自己，而是被环本身所吞噬。愿望本身和承受的代价，都会在环中循环累加，最终引发一场"业火"——不是真的烧死你，而是把你生命中所有的东西，所有的因果，一件件烧成灰烬。',
        '至于你们听说的"凤凰还愿"这个说法，应该是后来的人觉得"爝火赓炁"太拗口又太晦气，又借了凤凰涅槃的典故，把仪式美化了。什么"许愿就能实现"，什么"凤凰会保佑你"，全是扯淡。那东西是凤凰的凶面，是业果的具象化，千万不要去碰。',
      ],
      replies: [],
      footerStats: '发帖时间：2025-09-15 23:47 | 最后编辑：2025-09-16 00:12',
    },
  },
  27: {
    id: 27,
    role: 'fullPage',
    kind: 'ending27',
    content: `April：相信你已经知道了一切的来龙去脉
April：很抱歉把你卷进来
April：只有在因果环之外的人，才能干涉因果，扭转结局
April：酉时三刻，按照我发你的内容去写，一字不能差，然后完成仪式
April：这样就能救下所有人
April：最后，不管你是谁
April：谢谢你`,
    timeline: '2025年4月6日',
  },
  28: {
    id: 28,
    role: 'fullPage',
    kind: 'narrative',
    content: `第二人称叙述：你出发去教三地下室，果然发现了一个狭窄的配电室和一块颜色明显不一样的砖块。搬开砖块，里面露出灰色的余烬。你拿出黄色符纸，开始书写。`,
    timeline: '2025年4月6日',
  },
  29: {
    id: 29,
    role: 'fullPage',
    kind: 'endingPuzzle',
    content: `凡人_人，干涉因果，禁锢业环。
爝者_，_年_月_日许愿，其愿为死而复生，薪主_。
爝者_，_年_月_日许愿，其愿为知足常乐，薪主_。
爝者_，_年_月_日许愿，其愿为金榜题名，薪主_。
爝者_，_年_月_日许愿，其愿为存在抹除，薪主_。
今尘埃已定，业果已成，敕令薪火归垣，涅槃重生。`,
    timeline: '2025年4月6日',
  },
  30: {
    id: 30,
    role: 'fullPage',
    kind: 'endingFake',
    content: `Collide：来瓦
Bell：上号
April：来了来了
April：@Collide 开吧
Collide：等一下，还有人没到呢
Bell：谁啊？
April：？
April：valorant什么时候可以四排了
Collide：对哦
Collide：好奇怪啊
Collide：那我开了`,
    timeline: '2025年4月7日',
  },
  31: {
    id: 31,
    role: 'fullPage',
    kind: 'endingTrue',
    content: `你：学长这是我的计组大作业
你：计组期中大作业.zip
Deposit：收到
你：对了学长
你：你认识___吗？（可选择 April/Bell/Collide）
Deposit：没听过
Deposit：这名字听起来（很聪明/人很好/很亲切）的样子
你：没事
你：我就问一下
你：谢谢学长`,
    timeline: '2025年4月7日',
  },
}

export const chatBlocks: Record<
  number,
  {
    keyword?: string
    content: string
    timeline?: string
  }
> = {
  2: {
    keyword: '王文礼',
    timeline: '2026年2月10日',
    content: `April：昨天课程报告怎么样
April：这回王文礼没有为难你了吧？
Bell：别提了TT
Bell：我熬到5点终于搞完的ppt，做完我就基本昏过去了
Bell：结果下午三点起床一看群里通知
Bell：计组提前到早八了TT
Bell：张杨给我打电话我也没听到
Bell：这下是彻底寄了
April：怎么会这样……
April：早知道你昨天不如陪我排位
April：我们五排五缺一就等你了
Bell：下次一定`,
  },
  3: {
    keyword: '张杨',
    timeline: '2026年1月24日',
    content: `Bell：@April 张杨喊你去健身
April：你自己不去陪他^^
Bell：autumn没跟你说吗 我要准备下周的美赛TT
April：哇噻BB大人真的是业务繁忙欸 天天都有竞赛要打^^
April：话说上周大创路演怎么样了
Bell：寄了。
April：？怎么又寄了
Bell：校内赛还是第三来着，一上台大家就紧张
Bell：然后轮到我的part的时候
Bell：忘词了
Bell：我只能在台上表演一个原地立正
April：那年十八，站着如喽啰.jpg`,
  },
  4: {
    keyword: '美赛',
    timeline: '2026年2月4日',
    content: `April：@Bell 出来双排
April：别告诉我你美赛也拉了
Bell：哈哈
Bell：别戳兄弟痛处
April：0.0
Bell：我是负责写论文提交的那个
Bell：专门定了10：20的闹钟
Bell：结果写完论文一看
Bell：10：44
Bell：闹钟定的是晚上10：20
April：我发现你最近考试运真的有够差
April：要不去教三地下室许个愿试试呢`,
  },
  5: {
    keyword: '教三地下室',
    timeline: '2026年1月5日',
    content: `Bell：[[LINK:1]]
Bell：被通报批评了TT
April：就说不应该陪你们一起去教三地下室的`,
  },
  9: {
    keyword: '凤凰还愿',
    timeline: '2025年12月31日',
    content: `锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：[[LINK:2]]
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：我们跨年夜去这探险吧
Bell：111
Collide：好无聊……到底谁在信这个😅
April：我有事
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：apgg求你了
Bell：apgg求你了
April：行行行我去还不行吗`,
  },
  16: {
    keyword: '重明龛',
    timeline: '2025年10月18日',
    content: `Bell：[[LINK:3]]
Bell：这个不会是你俩吧 @Collide @Deposit
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：被你发现了
Bell：我靠你简直是超人
April：怪不得电竞社活动一次也没见过Collide
Collide：我只是懒得出门而已
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：你还是别乱跑了 我真怕你噶了
Collide：我看Deposit你又皮痒了是吧
April：等下，所以张教授是你爹？@Collide
April：怪不得Deposit本科就能去做王文礼的助教
April：原来有人给他开后门了啊^^
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：不要污蔑我和Collide好吗
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：我俩是纯洁的py关系🥺
Bell：Deposit是好男孩吗🤔
April：别逗你Deposit哥笑了^^`,
  },
  20: {
    keyword: '北医三院',
    timeline: '2026年4月3日',
    content: `Bell：[[LINK:4]]
Bell：@Deposit 怎么回事，好端端的Collide就住院了
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：我在医院陪他，前几天April也来了
Bell：不是你们怎么都瞒着兄弟，什么意思啊
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：他没让我往出说
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：April也不知道怎么知道的
Bell：话说你那边能联系上April吗
Bell：我好久都没见到他了
Bell：电话也不接，发消息也不回
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：不知道
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：Collide进ICU了，我这几天都在医院
Bell：我靠
Bell：Collide没事吧
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：我不是家属进不去
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：但感觉不太好
Bell：你不觉得这一切都很诡异吗
Bell：绝对是哪里有问题`,
  },
  25: {
    keyword: '县志',
    timeline: '2026年4月5日',
    content: `Bell：找到了！关于那篇县志的记载！
Bell：[[LINK:6]]
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：所以Collide和April都想牺牲自己，断掉这个循环是吧
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：他妈的，自顾自在这里逞什么英雄
Bell：怎么办，我联系不上April……
Bell：他不会出事吧……
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：一切因我而起，也应该在我这里做个了结
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：走吧，陪我去教三地下室
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：你帮我许个愿
Bell：你把我当成什么人了
Bell：我不会去的
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：算我求你了
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：难道你就忍心牺牲掉April？
Bell：我相信他
Bell：他一定找到办法了
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：那Collide也等不到这个办法了！
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：他现在在ICU，每多活一秒都是奇迹
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：我这条命本来就是阴差阳错才留下来的
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：现在只不过是还回去罢了
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：走吧
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：再不走
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：酉时就要过了`,
  },
}

/**
 * 初始聊天室某段文案：优先 `chatBlocks`（关键词解锁段），否则回落到 `fullPageNodes`（如 block 1 仅定义在首页节点）。
 */
export function getInitialChatBlockData(bid: number): { timeline: string; content: string } {
  const block = chatBlocks[bid]
  if (block) {
    return { timeline: block.timeline ?? '', content: block.content }
  }
  const page = fullPageNodes[bid]
  if (page?.content) {
    return { timeline: page.timeline ?? '', content: page.content }
  }
  return { timeline: '', content: '' }
}

/** 私聊面板 → ChatBubbleThread 分段（支持 `segments` 多时间轴） */
export function panelToFeedSegments(panel: ChatPanelDef): Array<{ timeline: string; raw: string }> {
  if (panel.segments?.length) {
    return panel.segments.map((s) => ({
      timeline: s.timeline.trim(),
      raw: s.content,
    }))
  }
  return [{ timeline: panel.timeline?.trim() ?? '', raw: panel.content ?? '' }]
}

/**
 * 已登录聊天室主频道里「本房间叙事」分段（如节点 23）。
 * 仅当配置了 `mainSegments` 时追加在公共解锁段之后；节点 8 等未配置则不混入私聊。
 */
export function layoutMainChannelNarrativeSegments(
  lay: ChatRoomLayoutDef,
): Array<{ timeline: string; raw: string }> {
  if (!lay.mainSegments?.length) return []
  return lay.mainSegments.map((s) => ({
    timeline: s.timeline.trim(),
    raw: s.content,
  }))
}

/** 公共聊天室解锁段顺序（与初始 /node/1 主频道一致） */
export const INITIAL_CHAT_BLOCK_ORDER = [1, 2, 3, 4, 5, 9, 16, 20, 25] as const

export const chatRoomLayouts: Record<number, ChatRoomLayoutDef> = {
  8: {
    mainTimeline: '2026年2月28日',
    mainContent: `April：六级出分了
April：怎么样
April：这次发挥是不是好很多
Bell：这倒是，本来应该能上600的
April：？又怎么了
Bell：昨天吃饭的时候就跟你说过一次了
Bell：一点都不关心兄弟TT
Bell：答题卡涂串行了
April：不是吧……
April：我觉得那个凤凰还愿有问题
Bell：你去许愿了？
April：你课程报告前一天去的
Bell：A队你是帮我许的愿吗🥺
Bell：TT
April：本来想你计组不挂的……
April：这个不是重点
April：你听过猴爪的故事吗
Bell：什么猴爪，磊哥的手吗
April：猴爪能实现愿望，但会以最意想不到的方式实现
April：你不觉得这个凤凰还愿
April：很像猴爪吗`,
    panels: [
      {
        id: '8-ab',
        label: 'Bell',
        timeline: '2026年2月28日',
        content: `April：六级出分了
April：怎么样
April：这次发挥是不是好很多
Bell：这倒是，本来应该能上600的
April：？又怎么了
Bell：昨天吃饭的时候就跟你说过一次了
Bell：一点都不关心兄弟TT
Bell：答题卡涂串行了
April：不是吧……
April：我觉得那个凤凰还愿有问题
Bell：你去许愿了？
April：你课程报告前一天去的
Bell：A队你是帮我许的愿吗🥺
Bell：TT
April：本来想你计组不挂的……
April：这个不是重点
April：你听过猴爪的故事吗
Bell：什么猴爪，磊哥的手吗
April：猴爪能实现愿望，但会以最意想不到的方式实现
April：你不觉得这个凤凰还愿
April：很像猴爪吗`,
      },
      {
        id: '8-ac',
        label: 'Collide',
        timeline: '2026年3月27日 / 3月28日',
        segments: [
          {
            timeline: '2026年3月27日',
            content: `April：你在哪家医院来着
April：我去找你`,
          },
          {
            timeline: '2026年3月28日',
            content: `Collide：你所谓的方法就是玩失踪吗`,
          },
        ],
      },
    ],
  },
  19: {
    mainTimeline: '2026年1月2日',
    mainContent: `Collide：你给A许愿了？
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：他不是最近一直心情不太好
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：我想着就试试呗
Collide：你怎么样
Collide：身体还好吧
Collide：有没有哪里不舒服
Collide：都跟你说别去了
Collide：那地方不是我们小时候就被烧掉了
Collide：有什么好去的
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：哪里烧掉了
Collide：就那个神龛啊
Collide：叫什么重明龛
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：教三地下室不是只有配电间吗
Collide：……
Collide：我记错了
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：你是不是有事情瞒着我`,
    panels: [
      {
        id: '19-cd',
        label: '锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛',
        timeline: '2026年1月2日',
        content: `Collide：你给A许愿了？
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：他不是最近一直心情不太好
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：我想着就试试呗
Collide：你怎么样
Collide：身体还好吧
Collide：有没有哪里不舒服
Collide：都跟你说别去了
Collide：那地方不是我们小时候就被烧掉了
Collide：有什么好去的
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：哪里烧掉了
Collide：就那个神龛啊
Collide：叫什么重明龛
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：教三地下室不是只有配电间吗
Collide：……
Collide：我记错了
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：你是不是有事情瞒着我`,
      },
      {
        id: '19-ca',
        label: 'April',
        timeline: '2026年3月26日',
        content: `April：你住院了？
April：前几天不是还好好的
Collide：我身体一直这样
Collide：小时候火灾吸了太多烟
Collide：留下后遗症了
April：我看未必
Collide：你什么意思
April：你也知道「爝火赓炁」吧
April：我有个猜想，关乎到你的性命问题
April：你在哪家医院
Collide：……
Collide：北医三院，602病房`,
      },
    ],
  },
  23: {
    mainTimeline: '2026年3月25日 - 2026年4月3日',
    panels: [
      {
        id: '23-ba',
        label: 'April',
        timeline: '2026年3月25日 - 2026年4月3日',
        segments: [
          {
            timeline: '2026年3月25日',
            content: `April：帮我带个饭
April：我要吃山姆烤鸡
Bell：嗻`,
          },
          {
            timeline: '2026年3月27日',
            content: `Bell：双排吗
Bell：今天带你上分😎`,
          },
          {
            timeline: '2026年3月30日',
            content: `Bell：A队你知道吗我今天遇见了一件超级离谱的事`,
          },
          {
            timeline: '2026年3月31日',
            content: `Bell：111
Bell：上号`,
          },
          {
            timeline: '2026年4月1日',
            content: `Bell：为什么不回我消息TT
Bell：A队你不会是生我气了吧`,
          },
          {
            timeline: '2026年4月3日',
            content: `Bell：怎么电话都不接
Bell：就算是生我的气
Bell：能不能先报个平安TT`,
          },
        ],
      },
      {
        id: '23-bd',
        label: '锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛',
        timeline: '2026年4月4日',
        content: `锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：我拿到了医院的监控记录
Bell：这对吗
Bell：这合法吗
Bell：我们不会被警察抓走吧
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：你先别管这个
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：只有声音
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：你听一下
锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛：[[LINK:5]]`,
      },
    ],
  },
}

export function getFullPage(id: number): FullPageNode | undefined {
  return fullPageNodes[id]
}

export function getStoryNode(id: number): StoryNode | undefined {
  return fullPageNodes[id]
}
