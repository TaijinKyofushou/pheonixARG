const HINT_WRONG_DIRECTION = `你搜这个干什么。

教三的传闻可太多了，大部分是编出来吓新生的。

换个方向试试。`

const HINT_RIGHT_DIRECTION = `方向对了，词不对。是更具体一些的东西。

再看看你手头的线索。`

const HINT_NO_SPOON_FEEDING = `他没办法帮你。

你得自己找到线索。`

const HINT_META_SELF = `……

你在找你自己吗？

等你把因果链摸透了，自然会知道自己该站在哪个位置。`

const HINT_WRONG_CHARACTER = `字不对。

也不知道古人为什么这么讲究，错一个字，仪式就完蛋。`

const HINT_KEYBOARD_MASH = `你认真的吗？

我就当你是手滑了。`

const HINT_RED_HERRING = `只是个比喻而已啦，别在意。`

const HINT_REALITY = `太现实了吧……`

const HINT_NO_SPOON_A_EN = `你找我？`
const HINT_NO_SPOON_A_ZH = `你找我？`

const HINT_NO_SPOON_D_EN = `谁？`
const HINT_NO_SPOON_D_ZH = `谁？`

const HINT_MISSING = `不该是这样的。`

const HINT_NO_SPOON_OTHER_EN = `他可没有牵扯进来。`
const HINT_NO_SPOON_OTHER_ZH = `他可没有牵扯进来。`


const KEYS_WRONG_DIRECTION = new Set(['鬼故事', '通灵', '幽灵', '跳楼', '保研率', '聊斋', '四零四', '自杀', '鬼', '诅咒', '见鬼', '厉鬼', '怨灵', '镇压'])

const KEYS_RIGHT_DIRECTION = new Set(['凤凰','还愿','许愿','薪火','爝火','教三','地下室',])

const KEYS_NO_SPOON_ZH = new Set(['梁宇', '张一然'])
const KEYS_NO_SPOON_EN = new Set(['bell', 'collide'])

const KEYS_NO_SPOON_A_EN = new Set(['april'])
const KEYS_NO_SPOON_A_ZH = new Set(['陈思哲', 'A队'])

const KEYS_NO_SPOON_D_EN = new Set(['deposit'])
const KEYS_NO_SPOON_D_ZH = new Set(['王博傲'])

const KEYS_NO_SPOON_OTHER_EN = new Set(['yosemite', 'summer', 'kale', 'aaaay'])
const KEYS_NO_SPOON_OTHER_ZH = new Set(['磊哥', '王磊', '阿杨'])

const KEYS_META = new Set(['环外人', '介入者', '破局', '破解', '方法', '办法', '攻略'])

const KEYS_RED_HERRING = new Set(['猴爪'])

const KEYS_REALITY = new Set(['大创', '路演', '大创路演', '补考', '数据结构', '大作业', '竞赛', '作业', '考试', '期末', '期中', '计组', '计算机组成原理', '六级', '四级', '绩点', '挂科', '挂了'])

const KEYS_MISSING = new Set(['锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛', '形神俱灭，世不存焉', '形神俱灭，世不存焉！'])

/** 含任一子串即视为写错 */
const WRONG_CHAR_SUBSTRINGS = ['嚼火', '爵火', '庚炁', '赓无', '庚无'] as const

function matchesWrongChar(k: string): boolean {
  return WRONG_CHAR_SUBSTRINGS.some((sub) => k.includes(sub))
}

/** 未输入或仅空格、乱敲键盘 / 乱试数字（子串） */
function matchesKeyboardMash(k: string): boolean {
  if (!k) return true
  if (k.includes('123') || k.includes('啊手动阀') || k.includes('啊士大夫')) return true
  return k.toLowerCase().includes('asdf') || k.toLowerCase().includes('qwer')
}

function matchesNoSpoon(k: string): boolean {
  if (KEYS_NO_SPOON_ZH.has(k)) return true
  if (/^[a-zA-Z]+$/.test(k) && KEYS_NO_SPOON_EN.has(k.toLowerCase())) return true
  return false
}

/** 未命中 CHAT_KEYWORD / FORUM_KEYWORD 时调用；有则返回提示文案，否则 null */
export function flavourSearchHint(raw: string): string | null {
  const k = raw.trim()

  if (matchesWrongChar(k)) return HINT_WRONG_CHARACTER
  if (matchesKeyboardMash(k)) return HINT_KEYBOARD_MASH
  if (KEYS_META.has(k)) return HINT_META_SELF
  if (matchesNoSpoon(k)) return HINT_NO_SPOON_FEEDING
  if (KEYS_RIGHT_DIRECTION.has(k)) return HINT_RIGHT_DIRECTION
  if (KEYS_WRONG_DIRECTION.has(k)) return HINT_WRONG_DIRECTION
  if (/^[a-zA-Z]+$/.test(k) && KEYS_NO_SPOON_A_EN.has(k.toLowerCase())) return HINT_NO_SPOON_A_EN
  if (KEYS_NO_SPOON_A_ZH.has(k)) return HINT_NO_SPOON_A_ZH
  if (/^[a-zA-Z]+$/.test(k) && KEYS_NO_SPOON_OTHER_EN.has(k.toLowerCase())) return HINT_NO_SPOON_OTHER_EN
  if (KEYS_NO_SPOON_OTHER_ZH.has(k)) return HINT_NO_SPOON_OTHER_ZH
  if (/^[a-zA-Z]+$/.test(k) && KEYS_NO_SPOON_D_EN.has(k.toLowerCase())) return HINT_NO_SPOON_D_EN
  if (KEYS_NO_SPOON_D_ZH.has(k)) return HINT_NO_SPOON_D_ZH
  if (KEYS_RED_HERRING.has(k)) return HINT_RED_HERRING
  if (KEYS_MISSING.has(k)) return HINT_MISSING
  if (KEYS_REALITY.has(k)) return HINT_REALITY
  return null
}
