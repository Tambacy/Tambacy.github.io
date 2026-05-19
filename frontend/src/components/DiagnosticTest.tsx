import { useState, useEffect, useCallback, useRef } from 'react'

const DIMENSIONS = ['发力链', '脚步移动', '控球能力', '预判读转', '节奏变化', '比赛心态']

const questions = [
  { dim: 0, q: '正手攻球时，你的手臂和身体是怎样的关系？', opts: ['手臂大幅度挥动，身体基本不动，肩膀有点紧张', 0, '身体会转一点，但主要还是手臂在发力', 1, '腰先转带动手臂，手臂是放松跟随的，重心会从右脚换到左脚', 2] },
  { dim: 0, q: '打完一板正手攻球后，你的腰部有什么感觉？', opts: ['腰部没什么感觉，主要是手臂和肩膀酸', 0, '腰部有一点点感觉，但说不上来是不是真转了', 1, '能明显感觉腰部转动和收紧，手臂反而没什么负担', 2] },
  { dim: 0, q: '对方回球质量不高（球慢、弧线高），你会怎么处理？', opts: ['还是正常推挡回去，不太敢发力', 0, '想发力但经常失误，控制不好力度', 1, '能果断抓住机会加力或轻拉一板，上台率还可以', 2] },
  { dim: 1, q: '对方把球打到你正手位偏外的位置，你通常怎么做？', opts: ['站在原地弯腰伸手去够', 0, '勉强迈一步，但手脚配合别扭，回球质量很差', 1, '快速并步移动到位，站稳后再出手', 2] },
  { dim: 1, q: '打完一板球之后，你的脚在做什么？', opts: ['停在原地，看着球飞过去等对方回球', 0, '偶尔会动一下，但多数时候还是站在原地', 1, '自动垫一小步回到准备姿势，随时准备下一板', 2] },
  { dim: 1, q: '一局比赛中，你大概移动了几次？', opts: ['基本不移动，遇到偏球就伸手够', 0, '球明显偏了才会动，大概动一两次', 1, '每分球至少移动2-3次，球偏一点就下意识迈步', 2] },
  { dim: 2, q: '你和球友对练正手斜线，通常能连续打多少板不出界/不下网？', opts: ['3板以内就开始失误', 0, '5-8板左右，状态好时能到10板', 1, '10板以上比较稳定，偶尔能二三十板', 2] },
  { dim: 2, q: '你想把球打到对方反手位，结果怎么样？', opts: ['基本是碰运气，能上台就行不管什么位置', 0, '大概方向是对的，但落点飘忽不定', 1, '有意识在控制方向，成功率超过一半', 2] },
  { dim: 2, q: '拉球时，你经常下网还是出台？', opts: ['下网和出台都频繁，不知道怎么调', 0, '知道大概原因，但调整起来很慢', 1, '偶尔失误，但下一板基本能调过来', 2] },
  { dim: 3, q: '对手发球前，你会观察什么？', opts: ['基本不观察，只盯着球看', 0, '偶尔会注意对方的站位，但看不出什么名堂', 1, '看对方的拍面方向、触球位置和发力方向', 2] },
  { dim: 3, q: '对手发了一个你没见过的旋转球，你的第一反应是？', opts: ['慌了，随便碰一下，大概率吃发球', 0, '本能地接，就算上台也是凭感觉', 1, '根据对方拍面动作尝试判断旋转性质，然后调整拍面去接', 2] },
  { dim: 3, q: '对方击球的一瞬间，你能判断来球大概方向吗？', opts: ['不能，等球落到我方台面才知道去哪', 0, '大概能判断左右，但具体落点判断不了', 1, '能根据对方拍面方向提前预判，脚已开始移动', 2] },
  { dim: 4, q: '在比赛中，你的回球节奏是怎样的？', opts: ['只有一个速度——来什么球都以同样节奏回', 0, '有时会有意加快，但经常控制不好就失误', 1, '能区分该快还是该慢，知道什么时候发力什么时候过渡', 2] },
  { dim: 4, q: '对方突然加快节奏连续进攻，你怎么办？', opts: ['慌了，跟着对方节奏乱挥，几板就失误', 0, '尽量挡几板，但节奏完全被对方掌控', 1, '先慢挡一板破坏对方节奏，再找机会反击', 2] },
  { dim: 4, q: '你会在一局中主动变换回球的轻重快慢吗？', opts: ['从来没有这个意识', 0, '知道应该变，但比赛中想不起来', 1, '会有意识地用变化来打乱对方节奏', 2] },
  { dim: 5, q: '比赛中你刚失误了一分，下一分你会？', opts: ['还在想刚才那个失误，犹豫不敢出手', 0, '告诉自己别想，但动作还是有点保守', 1, '立刻放下，专注下一板该怎么打', 2] },
  { dim: 5, q: '遇到水平明显比你高的对手，你的心态是？', opts: ['紧张、怕丢脸，动作变形更严重', 0, '有点放不开，但还能打出一些正常球', 1, '当成学习机会，该怎么打就怎么打', 2] },
  { dim: 5, q: '一整场比赛下来，你对"赢"的态度接近哪个？', opts: ['特别想赢，失误了就很沮丧、责怪自己', 0, '想赢但能接受输，偶尔还是会懊恼', 1, '结果不重要，关注的是自己有没有打出想打的东西', 2] },
]

type PlayerType = {
  code: string
  name: string
  desc: string
  strengths: string[]
  weaknesses: string[]
  advice: { title: string; desc: string }[]
  links?: { text: string; tab: string }[]
}

const types: Record<string, PlayerType> = {
  'IST': {
    code: 'IST', name: '本能挥拍者',
    desc: '你处于最典型的新手阶段，几乎所有方面都还在依靠本能而非技术来打球。这完全正常，每个人都有这个阶段。像一张白纸，没有坏习惯需要纠正。',
    strengths: ['心态开放，还没有形成错误的肌肉记忆', '对乒乓有热情，愿意投入时间学习', '没有"坏习惯"比有"坏习惯"更容易进步'],
    weaknesses: ['几乎所有技术维度都偏低', '打球完全靠本能反应，没有系统方法', '容易被各种信息干扰，不知从何练起'],
    advice: [
      { title: '从徒手练习开始', desc: '不要急着上球台对打。每天100次徒手转腰挥拍，感受"腰带动手臂"的感觉。这是整个进阶的基础，这一步对了后面全对。' },
      { title: '脚下要先"醒过来"', desc: '每天2分钟原地垫步——双脚像踩在热炭上，每秒2-3次轻跳。让脚习惯"永远在动"的状态。' },
      { title: '对墙推挡，每打一拍垫一步', desc: '不需要球台和对手，一面墙就够。重点是：每碰一次球，脚垫一步。目标是养成"打球必动脚"的条件反射。' },
      { title: '固定一个简单目标', desc: '接下来3周，不要想着"变厉害"，只关注一件事——比如"这一周我每次打球都先动脚再出手"。一次只盯一个目标。' },
    ],
    links: [{ text: '三周行动清单 · 第1周', tab: 'training' }],
  },
  'PWF': {
    code: 'PWF', name: '站桩攻击手',
    desc: '你有力量、敢发力，但脚下像钉了钉子。正手攻球有模有样，但球稍微偏一点就变形动作去够。手臂有感觉，脚下还没跟上。',
    strengths: ['正手发力有初步的感觉', '敢于主动进攻，不怯场', '有基本的击球质量意识'],
    weaknesses: ['脚步几乎不动，偏球只能伸手够', '打完一板就定在原地看结果', '重心交换不完整，力量传不到球上'],
    advice: [
      { title: '核心矛盾：脚下定死', desc: '你的手臂已经"超前发展"了，但脚还停在新手阶段。现在要做的不是继续练发力，而是把脚"解锁"。' },
      { title: '练习：故意把球让到身体侧面', desc: '让同伴喂球到你身体中路或稍偏的位置。你右脚向右后方撤一步，让出空间再挥拍。记住"脚不到，手不动"。' },
      { title: '强制垫步还原', desc: '每打完一板，嘴巴数"一"的同时脚下垫一小步。把这个"打一、垫一"的节奏刻进肌肉记忆。' },
      { title: '降低发力，专注脚步', desc: '暂时不要想着发多大力，先把"移动到位再出手"练成习惯。力量可以以后再补，但脚步不补永远卡住。' },
    ],
    links: [{ text: '姿势纠正 · 问题2：脚下定死', tab: 'training' }],
  },
  'GTP': {
    code: 'GTP', name: '温柔推挡者',
    desc: '你能把球回过去，但永远不敢发力。球能上台，但像在"摸"球而不是"打"球。防守有一定稳定性，但缺乏主动得分手段。',
    strengths: ['球感不错，基本能上台', '推挡有一定稳定性', '不轻易失误，能打多回合'],
    weaknesses: ['缺乏主动发力意识和能力', '不敢在机会球时加力', '节奏单一，永远是同一个轻推节奏'],
    advice: [
      { title: '核心矛盾：不敢发力', desc: '你不是"不能发力"，而是"不敢发力"。怕失误的心态让你一直停留在舒适区。需要从轻拉到加力，循序渐进。' },
      { title: '一挡一拉练习', desc: '对方快球你先轻挡（你擅长的），对方回球质量下降后，第二板尝试轻轻摩擦拉起。不要追求一板打死，先追求上台。' },
      { title: '固定线路拉球练习', desc: '让同伴喂下旋球到固定位置，你只拉斜线。不要求力量和速度，只要求"转腰+上台"。连续拉上5板为合格。' },
      { title: '心态突破', desc: '告诉自己：发力失误10次，也比永远推挡100次进步快。每一次发力失误都是在调试身体感觉。' },
    ],
    links: [{ text: '战术入门 · 一挡一拉', tab: 'training' }],
  },
  'WSP': {
    code: 'WSP', name: '乱抡冒险家',
    desc: '你有力量、敢打敢拼，但控制和稳定性严重不足。球速可能令人印象深刻，但失误率也高得惊人。像一把没有准星的枪——猛是猛，就是不知道子弹会飞去哪。',
    strengths: ['发力意愿强，不怕打出界', '有攻击性，比赛中有威胁', '身体发力感觉可能已经有了雏形'],
    weaknesses: ['上台率低，暴力但失误率高', '缺乏对落点的控制意识', '心态急躁，失误后容易继续猛抡'],
    advice: [
      { title: '核心矛盾：有力量没控制', desc: '你的问题不是"力量不够"，而是"力量没有用对地方"。现在要做减法：先保证上台，再谈质量。' },
      { title: '先降力，再提准', desc: '用70%的力量打球。你可能会觉得"太软了"，但你会惊讶地发现上台率大幅提升。先用70%力量连续打10板不失误，再慢慢加力。' },
      { title: '固定线路练习', desc: '只打斜线到对方反手位。方向和落点固定后，你的大脑分配资源的压力减轻，可以专心体会"如何控制力量"。' },
      { title: '心态：冒进者的陷阱', desc: '连续失误时别想着"下一板我一定要打死他"，而是想"下一板我只要上台就好"。先止住失误流，再谈进攻。' },
    ],
    links: [{ text: '战术入门 · 固定线路', tab: 'training' }, { text: '心态篇 · 不怕失误', tab: 'training' }],
  },
  'RWF': {
    code: 'RWF', name: '眼高手低型',
    desc: '你能看懂球但身体跟不上。预判能力突出，能看出旋转、判断方向，但脚步移动跟不上大脑。像高性能雷达装在老旧汽车上。',
    strengths: ['预判和读转能力在同水平中较强', '脑子快，能想到该怎么做', '对比赛的理解力比一般新手好'],
    weaknesses: ['脚步严重拖后腿，想到了但跑不到', '身体反应比大脑慢一拍', '容易产生挫败感——"明明知道却做不到"'],
    advice: [
      { title: '核心矛盾：脑快脚慢', desc: '你的优势是意识和判断，这其实是很难后天培养的。你的短板是脚步——这是最容易被忽视、也最容易通过练习改善的。' },
      { title: '单人脚步练习', desc: '并步、交叉步、小碎步，在家对着镜子练。不看球，只看自己的脚步。目标是让脚步快过你自己现在的反应速度。' },
      { title: '多球喂球+移动练习', desc: '让同伴用多球喂到你正手位和反手位交替的位置，你必须在移动中击球。不求打得多好，先求"每次球到之前脚已到位"。' },
      { title: '利用你的预判优势', desc: '既然你能提前判断方向，就在判断后立刻启动脚步。不要等球过网再动——判断一出，脚先走。' },
    ],
    links: [{ text: '意识篇 · 预判训练', tab: 'training' }, { text: '姿势篇 · 脚步问题', tab: 'training' }],
  },
  'UBS': {
    code: 'UBS', name: '偏科瓶颈者',
    desc: '某些维度表现优异但另一些维度严重拖后腿。短板不是不够好而是严重缺失，直接拉低整体水平。你是那种"练好了发力但脚步完全没练"的典型。',
    strengths: ['在某个（或某些）维度已有明显突破', '训练中有明显可感知的进步方向', '整体处于从新手到进阶的过渡期'],
    weaknesses: ['短板极其明显，严重制约整体发挥', '容易被长板迷惑忽视补短板', '比赛中会被对手抓住弱点反复攻击'],
    advice: [
      { title: '核心矛盾：长板够长，短板太短', desc: '你的策略很明确——暂时放下你最擅长的东西，集中火力攻克最弱的一项。因为你最弱的一项才是决定你上限的因素。' },
      { title: '诊断：找到你的最短板', desc: '看上面的维度图，找出最低的那一项。未来2-4周，你的训练目标只有一个：把这一项提上来。其他都可以先放一放。' },
      { title: '专项突破', desc: '如果最低的是脚步→每天15分钟垫步+并步练习。如果最低的是控球→每天固定线路对练。如果最低的是发力链→每天100次徒手转腰。' },
      { title: '实战中刻意练习短板', desc: '打比赛时，不关心输赢，只关心"我的短板有没有用到"。比如脚步差的人，每分球给自己设目标：至少移动3次。' },
    ],
    links: [{ text: '进阶指南 · 新手真实画像', tab: 'guide' }],
  },
  'STP': {
    code: 'STP', name: '稳健过渡者',
    desc: '恭喜！你没有致命短板，整体比较均衡，正处于"量变到质变"的关键积蓄期。',
    strengths: ['各维度比较均衡，没有明显硬伤', '基本功有一定基础', '具备从技术训练转向战术训练的条件'],
    weaknesses: ['没有特别突出的武器', '可能在某个维度刚好卡在临界值', '需要找到突破口来再上一个台阶'],
    advice: [
      { title: '核心状态：均衡但欠亮点', desc: '你已经不需要"补短板"了，而是需要"造长板"——在保持均衡的基础上，选择一个方向深度打磨，形成自己的武器。' },
      { title: '选择一个主攻方向', desc: '从六个维度中挑一个你最有感觉的，接下来一个月深度练习这一项。比如：把正手弧圈练成你的拿分武器，或把脚步练到自动化的水平。' },
      { title: '加入战术训练', desc: '你的基本功已经可以支撑战术练习了。开始练习组合：发球抢攻、一挡一拉、正手两点跑动连续拉。' },
      { title: '实战中给自己设"软目标"', desc: '不在乎输赢，在乎"这一局我打出了几次自己想要的东西"。比如"我主动变线了3次"、"我脚步到位率提高了"。' },
    ],
    links: [{ text: '三周行动清单 · 第3周', tab: 'training' }, { text: '战术篇 · 从乱抡到有套路', tab: 'training' }],
  },
  'CIP': {
    code: 'CIP', name: '意识先行者',
    desc: '战术意识和比赛阅读能力突出，知道该怎么做但技术基础还不够扎实。像有战术头脑的教练，身体还在学员阶段。',
    strengths: ['战术意识突出，知道什么时候该做什么', '比赛中有自己的想法和判断', '具备成为用脑子打球型选手的潜质'],
    weaknesses: ['技术基础跟不上意识水平', '发力链和脚步可能还存在新手特征', '有时会因想太多而在执行上犹豫'],
    advice: [
      { title: '核心矛盾：意识超前身体滞后', desc: '你的优势——意识——是很难教的。你的短板——技术——是可以通过训练弥补的。别焦虑，你只是在走"先长脑、后长手"的路线。' },
      { title: '补齐技术基础', desc: '你的意识已经够了，现在老老实实回到最基础的技术训练：正手攻球的转腰发力、反手的稳定性、脚步的移动还原。把基础动作练到自动化。' },
      { title: '上球台不要再"想"了', desc: '训练时关闭你的"战术大脑"，专注于身体感觉。你的问题不是缺少战术，而是想得太多干扰了动作执行。' },
      { title: '用你的意识优势做一件事', desc: '赛后复盘。你比别人更善于分析，那就把分析放在赛后，把执行放在赛中。比赛时只管打，打完再想。' },
    ],
    links: [{ text: '进阶指南 · 三大瓶颈', tab: 'guide' }],
  },
}

function determineType(s: number[]): PlayerType {
  const avg = s.reduce((a, b) => a + b, 0) / 6
  const [p, f, c, r, rh, m] = s
  if (avg < 25) return types['IST']
  if (r >= 55 && f < 30) return types['RWF']
  if (p >= 55 && f < 28) return types['PWF']
  if (c >= 40 && p < 28 && rh < 28) return types['GTP']
  if (p >= 50 && c < 28 && m < 28) return types['WSP']
  if (r + rh > p + f + 30 && f < 45) return types['CIP']
  if (s.some(v => v >= 70) && s.some(v => v <= 22)) return types['UBS']
  if (avg >= 45 && avg <= 70 && s.every(v => v >= 20)) return types['STP']
  if (r >= 50 && rh >= 45 && p < 45) return types['CIP']
  if (avg < 35) return types['IST']
  return types['STP']
}

type ViewState = 'start' | 'question' | 'result'

interface DiagnosticTestProps {
  onTabChange?: (tab: string) => void
  onTestComplete?: (completed: boolean, typeResult: PlayerType | null, scores: number[]) => void
}

export default function DiagnosticTest({ onTabChange, onTestComplete }: DiagnosticTestProps) {
  const [view, setView] = useState<ViewState>('start')
  const [curQ, setCurQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(18).fill(-1))
  const [dimScores, setDimScores] = useState<number[]>(new Array(6).fill(0))
  const [typeResult, setTypeResult] = useState<PlayerType | null>(null)
  const [animBars, setAnimBars] = useState(false)
  const [qAnimKey, setQAnimKey] = useState(0)
  const resultRef = useRef<HTMLDivElement>(null)

  const startTest = useCallback(() => {
    setCurQ(0)
    setAnswers(new Array(18).fill(-1))
    setDimScores(new Array(6).fill(0))
    setTypeResult(null)
    setAnimBars(false)
    setView('question')
  }, [])

  const restartTest = useCallback(() => {
    setCurQ(0)
    setAnswers(new Array(18).fill(-1))
    setDimScores(new Array(6).fill(0))
    setTypeResult(null)
    setAnimBars(false)
    setView('start')
  }, [])

  const selectOption = useCallback((optIndex: number) => {
    setAnswers(prev => {
      const next = [...prev]
      next[curQ] = optIndex
      return next
    })
  }, [curQ])

  const prevQuestion = useCallback(() => {
    if (curQ > 0) {
      setCurQ(prev => prev - 1)
      setQAnimKey(k => k + 1)
    }
  }, [curQ])

  const calcResult = useCallback(() => {
    const scores = new Array(6).fill(0)
    const dc = new Array(6).fill(0)
    questions.forEach((q, i) => {
      const a = answers[i]
      if (a >= 0) {
        scores[q.dim] += q.opts[a * 2 + 1] as number
        dc[q.dim]++
      }
    })
    const finalScores: number[] = []
    for (let i = 0; i < 6; i++) {
      const m = dc[i] * 2
      finalScores.push(m > 0 ? Math.round((scores[i] / m) * 100) : 0)
    }
    setDimScores(finalScores)
    const t = determineType(finalScores)
    setTypeResult(t)
    setView('result')
    setAnimBars(false)
    setTimeout(() => setAnimBars(true), 300)
    onTestComplete?.(true, t, finalScores)
  }, [answers, onTestComplete])

  const nextQuestion = useCallback(() => {
    if (answers[curQ] === -1) return
    if (curQ < 17) {
      setCurQ(prev => prev + 1)
      setQAnimKey(k => k + 1)
    } else {
      calcResult()
    }
  }, [curQ, answers, calcResult])

  useEffect(() => {
    if (view === 'result' && animBars) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [view, animBars])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view === 'question') {
        if (e.key === 'ArrowLeft') prevQuestion()
        else if (e.key === 'ArrowRight') nextQuestion()
        else if (e.key === '1') selectOption(0)
        else if (e.key === '2') selectOption(1)
        else if (e.key === '3') selectOption(2)
      }
      if (e.key === 'Escape') {
        setAnimBars(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [view, prevQuestion, nextQuestion, selectOption])

  const q = questions[curQ]
  const progressPct = Math.round((curQ / 18) * 100)
  const isLastQ = curQ === 17
  const hasAnswer = answers[curQ] !== -1

  const barLevel = (v: number) => (v <= 35 ? 'low' : v <= 65 ? 'mid' : 'high')

  return (
    <div>
      <div className="py-[60px] px-6 text-center">
        <h1 className="font-display text-[clamp(2.6rem,6vw,3.8rem)] tracking-[3px] leading-none mb-3">
          找到你的<span className="text-accent">球员类型</span>
        </h1>
        <p className="text-base text-text2 max-w-[520px] mx-auto">
          18道场景题，像MBTI一样精准诊断乒乓短板。<br />
          <span className="whitespace-nowrap">基于六维模型：发力链、脚步移动、控球能力、预判读转、节奏变化、比赛心态。</span>
        </p>
      </div>

      {view === 'start' && (
        <div className="flex flex-col items-center justify-center text-center py-14">
          <div className="flex gap-5 my-2 mb-5 text-[0.82rem] text-muted">
            <span>📝 18题</span>
            <span>⏱ 约5分钟</span>
            <span>🎯 8种类型</span>
          </div>
          <button
            onClick={startTest}
            className="inline-flex items-center gap-2.5 bg-[linear-gradient(135deg,#c0392b,#8b3a2a)] text-white font-body text-base font-bold py-4 px-10 rounded-[30px] cursor-pointer tracking-[1px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(192,57,43,0.3)] border-none"
          >
            开始诊断
          </button>
        </div>
      )}

      {view === 'question' && (
        <div>
          <div className="bg-border rounded-[10px] h-2 mb-2.5 overflow-hidden">
            <div
              className="h-full bg-[linear-gradient(90deg,#c0392b,#8b3a2a)] rounded-[10px] transition-[width] duration-500 ease-in-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[0.8rem] text-muted mb-8 font-mono font-semibold tracking-[2px]">
            <span>{curQ + 1}</span>
            <span>/ 18</span>
          </div>

          <div key={qAnimKey} className="animate-[qSlideIn_0.4s_ease]">
            <div className="bg-card border border-border rounded-[20px] p-9 shadow-[0_4px_20px_rgba(139,58,42,0.08)]">
              <div className="font-mono text-[0.7rem] font-bold tracking-[4px] text-accent mb-2.5">
                {DIMENSIONS[q.dim].toUpperCase()} · 维度评估
              </div>
              <div className="text-[1.1rem] font-bold text-text mb-6 leading-[1.6]">
                {q.q}
              </div>
              <div className="flex flex-col gap-2.5">
                {q.opts
                  .filter((_, i) => i % 2 === 0)
                  .map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => selectOption(i)}
                      className={`text-left font-body text-[0.93rem] py-4 px-5 rounded-[14px] cursor-pointer transition-all duration-[0.25s] leading-[1.6] border-2 ${
                        answers[curQ] === i
                          ? 'border-accent bg-[rgba(192,57,43,0.06)] text-text'
                          : 'border-border bg-[rgba(255,255,255,0.4)] text-text2 hover:border-accent hover:bg-[rgba(192,57,43,0.03)]'
                      }`}
                    >
                      {opt as string}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={prevQuestion}
              disabled={curQ === 0}
              className="font-body text-[0.88rem] font-semibold py-2.5 px-6 rounded-3xl border border-border bg-card text-text2 cursor-pointer transition-all duration-[0.25s] hover:border-accent hover:text-accent disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-text2"
            >
              ← 上一题
            </button>
            <button
              onClick={nextQuestion}
              disabled={!hasAnswer}
              className="font-body text-[0.88rem] font-semibold py-2.5 px-6 rounded-3xl border-none bg-accent text-white cursor-pointer transition-all duration-[0.25s] hover:bg-accent2 disabled:opacity-35 disabled:cursor-not-allowed"
            >
              {isLastQ ? (hasAnswer ? '查看诊断结果 →' : '请先选择答案') : '下一题 →'}
            </button>
          </div>
        </div>
      )}

      {view === 'result' && typeResult && (
        <div ref={resultRef}>
          <div className="text-center mb-10">
            <div className="font-display text-[4.5rem] tracking-[6px] text-accent leading-none">
              {typeResult.code}
            </div>
            <div className="text-[1.3rem] font-extrabold text-text my-1.5">
              {typeResult.name}
            </div>
            <div className="text-[0.92rem] text-text2 max-w-[500px] mx-auto">
              {typeResult.desc}
            </div>
          </div>

          <div className="bg-card border border-border rounded-[20px] p-8 mb-6 shadow-[0_4px_20px_rgba(139,58,42,0.08)]">
            <h3 className="text-[1.05rem] font-extrabold mb-5 text-text tracking-[1px]">
              六维能力图谱
            </h3>
            <div className="flex flex-col gap-3">
              {DIMENSIONS.map((d, i) => (
                <div key={d} className="flex items-center gap-3">
                  <div className="w-[90px] min-w-[90px] text-right text-[0.82rem] font-semibold text-text">
                    {d}
                  </div>
                  <div className="flex-1 h-5 bg-[rgba(192,57,43,0.05)] rounded-[20px] overflow-hidden">
                    <div
                      className={`h-full rounded-[20px] transition-[width] duration-1000 ease-out delay-300 ${
                        barLevel(dimScores[i]) === 'low'
                          ? 'bg-[linear-gradient(90deg,#d4a08a,#c9826a)]'
                          : barLevel(dimScores[i]) === 'mid'
                            ? 'bg-[linear-gradient(90deg,#d4904a,#c0783a)]'
                            : 'bg-[linear-gradient(90deg,#6a9b4c,#4a7b2c)]'
                      }`}
                      style={{ width: animBars ? `${dimScores[i]}%` : '0%' }}
                    />
                  </div>
                  <div className="w-10 font-mono text-[0.82rem] font-bold text-text2">
                    {dimScores[i]}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div className="bg-card border border-border rounded-[20px] p-[26px_24px] border-l-4 border-l-success">
              <h4 className="text-[0.9rem] font-extrabold mb-3 tracking-[1px] text-success">
                ✅ 你的优势
              </h4>
              <ul className="list-none p-0">
                {typeResult.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="py-1.5 pl-[18px] relative text-[0.85rem] text-text2 leading-[1.7] before:content-['•'] before:absolute before:left-1 before:text-success"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-[20px] p-[26px_24px] border-l-4 border-l-accent">
              <h4 className="text-[0.9rem] font-extrabold mb-3 tracking-[1px] text-accent">
                ⚠️ 需要提升
              </h4>
              <ul className="list-none p-0">
                {typeResult.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className="py-1.5 pl-[18px] relative text-[0.85rem] text-text2 leading-[1.7] before:content-['•'] before:absolute before:left-1 before:text-accent"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-card border-2 border-border rounded-[20px] p-8 mb-6">
            <h3 className="text-[1.05rem] font-extrabold mb-[18px] text-text tracking-[1px]">
              🎯 针对性训练建议
            </h3>
            <div className="flex flex-col gap-3.5">
              {typeResult.advice.map((a, i) => (
                <div key={i} className="flex gap-3.5 items-start">
                  <div className="w-8 h-8 min-w-8 rounded-lg bg-[rgba(192,57,43,0.08)] text-accent font-mono text-[0.95rem] font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-[0.88rem] font-bold text-text mb-[3px]">
                      {a.title}
                    </h4>
                    <p className="text-[0.83rem] text-text2 leading-[1.7]">
                      {a.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {typeResult.links && typeResult.links.length > 0 && (
              <div className="mt-5 pt-4 border-t border-border">
                {typeResult.links.map((l, i) => (
                  <span key={i}>
                    {i > 0 && ' · '}
                    <button
                      onClick={() => onTabChange?.(l.tab)}
                      className="text-accent font-bold text-[0.88rem] hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                      📖 {l.text}
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="text-center py-6">
            <button
              onClick={restartTest}
              className="font-body text-[0.88rem] font-semibold py-2.5 px-7 rounded-3xl border border-border bg-card text-text2 cursor-pointer transition-all duration-[0.25s] hover:border-accent hover:text-accent"
            >
              重新测试
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes qSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}