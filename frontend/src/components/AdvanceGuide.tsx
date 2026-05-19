import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AdvanceGuideProps {
  onTabChange?: (tab: string) => void
}

const guideTestItems = [
  '对方发一个快球，我经常只能挡一下或者直接漏掉',
  '打球时脚基本不动，站定在一个位置',
  '拉球经常下网或出台，不知道是拍面角度还是发力的问题',
  '不会判断来球旋转，经常吃发球',
  '打球时手臂酸痛，但腰和腿没什么感觉',
  '比赛时脑子里没有战术，只想着"把球打过去"',
  '对拉超过三板就开始失误',
]

const compareData = [
  { dimension: '正手攻球', beginner: '手臂挥动，身体不动；打得上但没力量', advanced: '转腰带动手臂，击球有"鞭打感"，球速明显提升' },
  { dimension: '反手推挡', beginner: '只能轻挡，来球快了就接不住', advanced: '能在上升期借力推挡，甚至加力推' },
  { dimension: '拉球（弧圈）', beginner: '经常下网或出台，没有弧线感', advanced: '能稳定拉起下旋球，弧线可控，知道拍面怎么调' },
  { dimension: '脚步移动', beginner: '站定不动，伸手够球', advanced: '球没到脚先到，打完一板自动垫步还原' },
  { dimension: '判断旋转', beginner: '看不出上旋下旋，凭感觉接', advanced: '能根据对方拍面方向和触球方式预判旋转' },
  { dimension: '战术意识', beginner: '"把球打过去就行"', advanced: '"打哪里让他难受"——有落点意识' },
  { dimension: '节奏控制', beginner: '只有一个速度', advanced: '会快慢变化，会轻重结合' },
  { dimension: '比赛心态', beginner: '怕失误，越紧张越出错', advanced: '接受失误，专注下一板' },
]

const bottleneckData = [
  {
    num: '01',
    title: '手臂发力 → 身体发力',
    subtitle: '最核心的转变',
    wrong: '手臂大幅度挥动，肩膀紧张，打完一板手臂酸痛。以为"用力=有质量"，实际上是手臂在做所有工作。',
    right: '手臂保持放松，转腰带动手臂自然甩出。感受重心从右脚转移到左脚的过程。打完球手臂不酸，腰部有热感——这才是对的。',
  },
  {
    num: '02',
    title: '站着打球 → 移动打球',
    subtitle: '最容易被忽视的转变',
    wrong: '脚像钉在地上，球来了弯腰伸手去够。球偏一点就变形动作去救。',
    right: '"脚不到，手不动"——先移动到位，再出手击球。每打完一板自动小碎步还原。',
  },
  {
    num: '03',
    title: '一种节奏 → 会变速变线',
    subtitle: '从"能打"到"会打"的标志',
    wrong: '来什么球都用同样的力量、同样的速度回过去。不区分该发力还是该过渡。',
    right: '学会"一挡一拉"：对方快你先挡，对方质量下降你再拉。学会有意识地改变落点、改变节奏。',
  },
]

const milestoneData = [
  {
    icon: '🏓',
    badge: '标志一',
    title: '身体会发力了',
    description: '打球时手臂不再是主力，你能感受到腰在转、重心在换。打完球腰部有热感而非手臂酸痛。\n\n徒手转腰挥拍100次，手臂不酸腰酸——这说明你找对了。',
  },
  {
    icon: '👣',
    badge: '标志二',
    title: '脚下自动在动了',
    description: '不需要刻意提醒自己"要动脚"，打完一板身体自动垫步还原。球稍微偏一点你也下意识先迈步再出手。\n\n你发现自己每分球至少移动了2-3次。',
  },
  {
    icon: '🎯',
    badge: '标志三',
    title: '能控制落点了',
    description: '不再是"球上台就行"，而是"这一板我打他反手位"或"这一板压中路"。你开始有方向和目的。\n\n固定线路对拉10板以上不掉。',
  },
  {
    icon: '🔄',
    badge: '标志四',
    title: '知道怎么调整了',
    description: '下网了你知道是拍面太压，下一板立起来一点。出台了你收小臂更快。不需要别人提醒，你自己就能诊断和修正。\n\n失误后下一板有明显改善。',
  },
]

const stageData = [
  {
    badge: 'P1',
    title: '第一阶段：纠正基础',
    time: '预计时间：1-3个月',
    goals: [
      { label: '核心目标：', text: '把"用手打球"改成"用身体打球"。' },
      { label: '每日练习：', text: '徒手转腰挥拍100次 + 原地垫步2分钟。' },
      { label: '上台检验：', text: '正手攻球连续20板不掉，每板都能感觉到腰在转。' },
    ],
  },
  {
    badge: 'P2',
    title: '第二阶段：建立体系',
    time: '预计时间：3-6个月',
    goals: [
      { label: '核心目标：', text: '把单个技术串联起来。正手攻球 + 还原 + 脚步移动形成连贯动作。' },
      { label: '每日练习：', text: '一挡一拉、固定线路对拉、多球喂球练习移动中击球。' },
      { label: '上台检验：', text: '能打固定线路斜线连续10板以上；来球有变化时脚步能跟上。' },
    ],
  },
  {
    badge: 'P3',
    title: '第三阶段：实战打磨',
    time: '预计时间：6个月以上',
    goals: [
      { label: '核心目标：', text: '把技术转化为战术。知道什么时候发力、什么时候过渡、什么时候变线。' },
      { label: '每日练习：', text: '实战 + 赛后复盘。每场比赛关注一个具体目标。' },
      { label: '上台检验：', text: '能根据对手弱点调整战术，能稳定发挥已掌握的技术。' },
    ],
  },
]

const diagOptions = [
  {
    icon: '🌱',
    title: '我刚开始打',
    desc: '球龄不到3个月，基本技术都没定型',
    resultTitle: '你的位置：第一阶段 — 打好地基',
    items: [
      '先别急着上球台对打，徒手练习比你想象的更重要',
      '每天100次徒手转腰挥拍，感受"腰带动手臂"的发力链条',
      '原地垫步2分钟，让脚习惯"永远在动"的状态',
      '对墙推挡，每打一拍垫一步，养成"打球必动脚"的习惯',
    ],
    linkText: '三周行动清单 · 第1周',
    linkTab: 'training',
  },
  {
    icon: '🌿',
    title: '我打了一段时间但总感觉不对',
    desc: '能对打但质量不高，知道动作有问题但不知从哪改',
    resultTitle: '你的位置：第一至第二阶段过渡 — 找出并纠正根因',
    items: [
      '你最需要的是一个"诊断者"——可以是教练，也可以是录像自检',
      '录一段自己打球的视频，回看时问：腰转了吗？脚动了吗？重心交换了吗？',
      '专门针对最弱的那个瓶颈（手臂发力/脚步不动/节奏单一）集中纠正',
      '上台练习时，一次只关注一个问题，不要贪多',
    ],
    linkText: '姿势纠正 · 四个核心问题',
    linkTab: 'training',
  },
  {
    icon: '🌳',
    title: '我基本能打但想更进一步',
    desc: '正手反手都能上台，比赛中也有一定竞争力',
    resultTitle: '你的位置：第二至第三阶段 — 从技术到战术',
    items: [
      '你的基本技术大概率没有大问题，缺的是"串联"和"应用"',
      '练习重点从单个动作转向组合：正手两点跑动、发球抢攻、一挡一拉',
      '比赛时给自己设定战术目标：比如"这一局只打对方反手位"',
      '每场比赛后复盘：哪些球处理得好？哪些球的决策可以更好？',
    ],
    linkText: '战术入门 · 从乱抡到有套路',
    linkTab: 'training',
  },
]

function loadGuideTest(): number[] {
  try {
    const saved = localStorage.getItem('pingpong_guide_test')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveGuideTest(indices: Set<number>) {
  localStorage.setItem('pingpong_guide_test', JSON.stringify([...indices]))
}

export default function AdvanceGuide({ onTabChange }: AdvanceGuideProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(
    () => new Set(loadGuideTest())
  )
  const [selectedDiag, setSelectedDiag] = useState<number | null>(null)

  useEffect(() => {
    saveGuideTest(checkedItems)
  }, [checkedItems])

  const toggleGuideTest = (index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const checkedCount = checkedItems.size
  const getResultClass = () => {
    if (checkedCount <= 2) return 'bg-success/10 border-success/30 text-success'
    if (checkedCount <= 5) return 'bg-warning/10 border-warning/30 text-warning'
    return 'bg-accent/10 border-accent/30 text-accent'
  }
  const getResultEmoji = () => {
    if (checkedCount <= 2) return '🟢'
    if (checkedCount <= 5) return '🟡'
    return '🔴'
  }
  const getResultText = () => {
    if (checkedCount <= 2) return '恭喜！你基本上已经脱离新手阶段。'
    if (checkedCount <= 5) return `你处于新手向进阶过渡阶段。${checkedCount}/7项符合。`
    return `你是比较典型的新手阶段。${checkedCount}/7项符合。`
  }

  return (
    <div className="container max-w-[1080px] mx-auto px-4 md:px-8">
      <div className="py-14 text-center">
        <div className="flex items-center gap-6 mb-5 justify-center">
          <span className="font-display text-2xl tracking-[2px] py-3 px-7 rounded-2xl bg-accent/10 text-text2 border border-border">
            新手
          </span>
          <span className="text-3xl text-accent animate-pulse">→</span>
          <span className="font-display text-2xl tracking-[2px] py-3 px-7 rounded-2xl bg-gradient-to-br from-accent to-accent2 text-white">
            进阶
          </span>
        </div>
        <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] tracking-[3px] leading-tight mb-3">
          我到底是什么<span className="text-accent">水平</span>？<br />
          下一步该<span className="text-accent">练什么</span>？
        </h1>
        <p className="text-text2 max-w-[520px] mx-auto text-balance">
          先认识自己在哪里，才知道往哪走。从"自我定位"到"找到方向"。
        </p>
      </div>

      <section className="py-20">
        <div className="mb-14">
          <div className="font-mono text-base font-bold tracking-[6px] text-accent mb-3.5 flex items-center gap-4">
            01
            <span className="flex-1 h-0.5 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] tracking-[3px] leading-tight">
            新手 <span className="text-accent">· 到底是什么水平？</span>
          </h2>
          <p className="mt-4 text-text2 text-base max-w-[620px]">
            先别急着否定自己，也别高估自己。我们说清楚"新手"到底是什么。
          </p>
        </div>

        <div className="bg-card border border-border rounded-[22px] p-8 mb-10 relative shadow-md before:absolute before:left-0 before:top-[18px] before:bottom-[18px] before:w-1 before:bg-accent before:rounded-r-[3px]">
          <div className="font-mono text-xs font-bold tracking-[4px] text-accent mb-2">
            一语中的
          </div>
          <div className="text-base font-bold text-text leading-relaxed flex flex-col gap-2">
            <span>乒乓新手不是"完全不会打"，而是"能打但对球没有控制力"。</span>
            <span>你能上台，但不知道球会落在哪；你能发力，但身体不知道力量从哪来。</span>
            <span>这个阶段所有人都经历过，而且完全可以走出来。</span>
          </div>
        </div>

        <div className="bg-card border-2 border-border rounded-[18px] p-9 mb-10">
          <h3 className="text-xl font-extrabold text-text mb-5">新手的定义（一句话）</h3>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3.5 items-start">
              <div className="w-9 h-9 min-w-[36px] rounded-lg bg-accent/10 flex items-center justify-center text-base">🏓</div>
              <div>
                <h4 className="text-base font-bold text-text mb-0.5">能回球，但没有质量</h4>
                <p className="text-sm text-text2 leading-relaxed">球能过网，但不是你想要的高度、速度、旋转。你是在"碰"球，不是在"打"球。</p>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <div className="w-9 h-9 min-w-[36px] rounded-lg bg-accent/10 flex items-center justify-center text-base">📍</div>
              <div>
                <h4 className="text-base font-bold text-text mb-0.5">能上台，但没有落点控制</h4>
                <p className="text-sm text-text2 leading-relaxed">你知道球会落在对方台面上，但你不知道具体落在哪个位置。对方回球后你经常被动。</p>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <div className="w-9 h-9 min-w-[36px] rounded-lg bg-accent/10 flex items-center justify-center text-base">⚡</div>
              <div>
                <h4 className="text-base font-bold text-text mb-0.5">能发力，但没有身体参与</h4>
                <p className="text-sm text-text2 leading-relaxed">你以为自己在"发力"，实际上是手臂在单独甩动。腰、腿、重心——这些真正的力量来源还没有被唤醒。</p>
              </div>
            </div>
            <div className="flex gap-3.5 items-start">
              <div className="w-9 h-9 min-w-[36px] rounded-lg bg-accent/10 flex items-center justify-center text-base">🧠</div>
              <div>
                <h4 className="text-base font-bold text-text mb-0.5">能打球，但没有战术意识</h4>
                <p className="text-sm text-text2 leading-relaxed">你打球靠的是"本能反应"而不是"主动决策"。球来了就接，接完了就看——没有预判、没有套路、没有节奏变化。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border-2 border-border rounded-[18px] p-8 mb-10">
          <h3 className="text-lg font-extrabold mb-1 text-text">快速自测：你是新手吗？</h3>
          <p className="text-sm text-muted mb-6">勾选所有符合你的描述（实事求是，每题都勾也没关系）</p>
          <div className="flex flex-col gap-3">
            {guideTestItems.map((item, i) => {
              const isChecked = checkedItems.has(i)
              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3.5 py-3.5 px-4.5 rounded-2xl cursor-pointer transition-all border',
                    isChecked
                      ? 'border-success/30 bg-success/5'
                      : 'border-transparent hover:border-accent/20 hover:bg-accent/5'
                  )}
                  onClick={() => toggleGuideTest(i)}
                >
                  <div
                    className={cn(
                      'w-6 h-6 min-w-[24px] rounded-md border-2 flex items-center justify-center transition-all duration-300',
                      isChecked
                        ? 'bg-success border-success'
                        : 'border-border'
                    )}
                  >
                    {isChecked && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className={cn('text-sm', isChecked ? 'text-muted line-through decoration-success decoration-2' : 'text-text')}>
                    {item}
                  </span>
                </div>
              )
            })}
          </div>
          {checkedCount > 0 && (
            <div className={cn('mt-5 py-4 px-5 rounded-2xl font-bold text-sm leading-relaxed border', getResultClass())}>
              {getResultEmoji()} {getResultText()}
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="mb-14">
          <div className="font-mono text-base font-bold tracking-[6px] text-accent mb-3.5 flex items-center gap-4">
            02
            <span className="flex-1 h-0.5 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] tracking-[3px] leading-tight">
            新手的 <span className="text-accent">· 真实画像</span>
          </h2>
          <p className="mt-4 text-text2 text-base max-w-[620px]">
            你可能在某些方面已经脱离了"纯新手"，但在另一些方面还停留在新手阶段。
          </p>
        </div>

        <div className="bg-card border border-border rounded-[22px] p-8 mb-10 relative shadow-md before:absolute before:left-0 before:top-[18px] before:bottom-[18px] before:w-1 before:bg-accent before:rounded-r-[3px]">
          <div className="font-mono text-xs font-bold tracking-[4px] text-accent mb-2">一语中的</div>
          <div className="text-base font-bold text-text leading-relaxed flex flex-col gap-2">
            <span>新手和新手之间差距也很大。</span>
            <span>有些人动作对但没质量，有些人有质量但动作错。</span>
            <span>关键是知道自己的短板在哪一项，不是笼统地觉得自己"不行"。</span>
          </div>
        </div>

        <div className="border border-border rounded-[18px] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-accent/5">
                <th className="py-4 px-5 text-sm font-bold text-text text-left border-b-2 border-border">能力维度</th>
                <th className="py-4 px-5 text-sm font-bold text-text text-left border-b-2 border-border">新手表现</th>
                <th className="py-4 px-5 text-sm font-bold text-text text-left border-b-2 border-border">脱离新手的标志</th>
              </tr>
            </thead>
            <tbody>
              {compareData.map((row, i) => (
                <tr key={i} className="hover:bg-accent/5 transition-colors">
                  <td className="py-3.5 px-5 text-sm font-semibold text-text whitespace-nowrap border-b border-border">
                    {row.dimension}
                  </td>
                  <td className="py-3.5 px-5 text-sm text-text2 leading-relaxed border-b border-border">
                    {row.beginner}
                  </td>
                  <td className="py-3.5 px-5 text-sm text-text2 leading-relaxed border-b border-border">
                    {row.advanced}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-20">
        <div className="mb-14">
          <div className="font-mono text-base font-bold tracking-[6px] text-accent mb-3.5 flex items-center gap-4">
            03
            <span className="flex-1 h-0.5 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] tracking-[3px] leading-tight">
            新手最容易 <span className="text-accent">· 卡住的三个瓶颈</span>
          </h2>
          <p className="mt-4 text-text2 text-base max-w-[620px]">
            大多数新手不是"没有进步"，而是在这三个点上反复撞墙。
          </p>
        </div>

        <div className="bg-card border border-border rounded-[22px] p-8 mb-10 relative shadow-md before:absolute before:left-0 before:top-[18px] before:bottom-[18px] before:w-1 before:bg-accent before:rounded-r-[3px]">
          <div className="font-mono text-xs font-bold tracking-[4px] text-accent mb-2">一语中的</div>
          <div className="text-base font-bold text-text leading-relaxed flex flex-col gap-2">
            <span>突破瓶颈不需要更努力，需要换一个方向努力。</span>
            <span>不是你练得不够多，而是你练的东西没碰到问题的根源。</span>
          </div>
        </div>

        {bottleneckData.map((bn) => (
          <div
            key={bn.num}
            className="bg-card border border-border rounded-[18px] p-7.5 border-l-[5px] border-l-accent mb-5 transition-all hover:border-accent/40 hover:shadow-lg"
          >
            <div className="flex items-center gap-3.5 mb-3.5">
              <div className="font-display text-[2.5rem] text-accent/10 leading-none">{bn.num}</div>
              <div>
                <h3 className="text-lg font-extrabold text-text">{bn.title}</h3>
                <span className="text-sm text-accent font-semibold border-b-2 border-dashed border-accent/30 inline-block pb-0.5">
                  {bn.subtitle}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h4 className="text-sm font-bold mb-1.5 tracking-[1px] text-accent">❌ 新手的做法</h4>
                <p className="text-sm text-text2 leading-relaxed">{bn.wrong}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1.5 tracking-[1px] text-success">✅ 突破的方向</h4>
                <p className="text-sm text-text2 leading-relaxed">{bn.right}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="py-20">
        <div className="mb-14">
          <div className="font-mono text-base font-bold tracking-[6px] text-accent mb-3.5 flex items-center gap-4">
            04
            <span className="flex-1 h-0.5 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] tracking-[3px] leading-tight">
            进阶的分水岭 <span className="text-accent">· 什么算"不再是新手"？</span>
          </h2>
          <p className="mt-4 text-text2 text-base max-w-[620px]">
            下面4个标志达标2个以上，你就已经跨过新手阶段了。
          </p>
        </div>

        <div className="bg-card border border-border rounded-[22px] p-8 mb-10 relative shadow-md before:absolute before:left-0 before:top-[18px] before:bottom-[18px] before:w-1 before:bg-accent before:rounded-r-[3px]">
          <div className="font-mono text-xs font-bold tracking-[4px] text-accent mb-2">一语中的</div>
          <div className="text-base font-bold text-text leading-relaxed flex flex-col gap-2">
            <span>"不再是新手"不代表你很厉害，而是你开始"有意识地在打球"。</span>
            <span>你会主动想"这一板我打哪个落点"，而不是"这一板别失误就行"。</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {milestoneData.map((ms, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-[18px] p-7 transition-all hover:border-success/40 hover:shadow-md"
            >
              <div className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-bold tracking-[1px] py-1 px-2.5 rounded-[20px] mb-3">
                {ms.icon} {ms.badge}
              </div>
              <h4 className="text-base font-extrabold text-text mb-1.5">{ms.title}</h4>
              <p className="text-sm text-text2 leading-relaxed whitespace-pre-line">{ms.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mb-14">
          <div className="font-mono text-base font-bold tracking-[6px] text-accent mb-3.5 flex items-center gap-4">
            05
            <span className="flex-1 h-0.5 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] tracking-[3px] leading-tight">
            从新手到进阶 <span className="text-accent">· 三阶段路径</span>
          </h2>
          <p className="mt-4 text-text2 text-base max-w-[620px]">
            这不是一条直线，而是一个螺旋上升的过程。
          </p>
        </div>

        <div className="bg-card border border-border rounded-[22px] p-8 mb-10 relative shadow-md before:absolute before:left-0 before:top-[18px] before:bottom-[18px] before:w-1 before:bg-accent before:rounded-r-[3px]">
          <div className="font-mono text-xs font-bold tracking-[4px] text-accent mb-2">一语中的</div>
          <div className="text-base font-bold text-text leading-relaxed flex flex-col gap-2">
            <span>第一阶段是打基础，第二阶段是建体系，第三阶段是磨细节。</span>
            <span>每个阶段的目标不同，不要用第三阶段的标准去要求第一阶段。</span>
          </div>
        </div>

        {stageData.map((stage) => (
          <div key={stage.badge} className="bg-card border border-border rounded-[18px] p-7.5 mb-5.5">
            <div className="flex items-center gap-4 mb-4">
              <div className="font-display text-xl bg-gradient-to-br from-accent to-accent2 text-white w-12 h-12 rounded-xl flex items-center justify-center tracking-[2px]">
                {stage.badge}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-text">{stage.title}</h3>
                <div className="text-sm text-muted">{stage.time}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {stage.goals.map((goal, gi) => (
                <div key={gi} className="flex items-baseline gap-2.5 py-2.5 px-3.5 bg-accent/5 rounded-[10px]">
                  <div className="w-1.5 h-1.5 min-w-[7px] rounded-full bg-accent mt-1.5" />
                  <p className="text-sm text-text2 leading-relaxed">
                    <strong>{goal.label}</strong>{goal.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="py-20">
        <div className="mb-14">
          <div className="font-mono text-base font-bold tracking-[6px] text-accent mb-3.5 flex items-center gap-4">
            06
            <span className="flex-1 h-0.5 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] tracking-[3px] leading-tight">
            你现在在哪 <span className="text-accent">· 下一步做什么？</span>
          </h2>
          <p className="mt-4 text-text2 text-base max-w-[620px]">
            点击最符合你现状的描述，获取针对性练习建议。
          </p>
        </div>

        <div className="bg-card border-2 border-border rounded-[18px] p-8 text-center">
          <h3 className="text-xl font-extrabold mb-2 text-text">选一个最像你的描述</h3>
          <p className="text-text2 mb-6 text-sm">不用想太多，选当下最能对号入座的那一个</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {diagOptions.map((option, i) => (
              <div
                key={i}
                className={cn(
                  'border-2 rounded-2xl p-6 cursor-pointer transition-all',
                  selectedDiag === i
                    ? 'border-accent bg-accent/8'
                    : 'border-border hover:border-accent hover:bg-accent/5'
                )}
                onClick={() => setSelectedDiag(i)}
              >
                <div className="text-3xl mb-2">{option.icon}</div>
                <h4 className="text-sm font-bold text-text mb-1">{option.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{option.desc}</p>
              </div>
            ))}
          </div>

          {selectedDiag !== null && (
            <div className="bg-accent/5 rounded-2xl p-6 text-left">
              <h4 className="text-base font-extrabold mb-3.5 text-text">
                {diagOptions[selectedDiag].resultTitle}
              </h4>
              <ul className="list-none p-0">
                {diagOptions[selectedDiag].items.map((item, ii) => (
                  <li
                    key={ii}
                    className="py-1.5 pl-5 relative text-sm text-text2 leading-relaxed before:absolute before:left-0 before:content-['→'] before:text-accent before:font-bold"
                  >
                    {item}
                  </li>
                ))}
                <li className="py-1.5 pl-5 relative text-sm leading-relaxed before:absolute before:left-0 before:content-['→'] before:text-accent before:font-bold">
                  参考 →{' '}
                  <button
                    onClick={() => onTabChange?.(diagOptions[selectedDiag].linkTab)}
                    className="text-accent font-bold hover:underline"
                  >
                    📖 {diagOptions[selectedDiag].linkText}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}