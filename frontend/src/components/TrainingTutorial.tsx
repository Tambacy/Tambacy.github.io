import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const principleCards = [
  {
    num: '01',
    icon: '🎯',
    title: '接纳失误',
    tag: '核心原则',
    keyMessage: '下网、出台、漏球 —— 都是身体在"调试"发力感觉的必经过程。不丢分就找不到正确的肌肉记忆。',
    description: '别因为失误就缩手缩脚，也别因为一板偶然上台就猛加力。稳定性比偶然的精彩更重要。',
    detail: '每一个失误背后都有一个信息：球拍角度偏了？发力方向错了？还是脚步没跟上？把每次失误当作一次"数据采集"。',
  },
  {
    num: '02',
    icon: '🎯',
    title: '降低预期',
    tag: '目标调整',
    keyMessage: '你现在还不是去"赢比赛"，而是去"练动作"。哪怕一局输了，只要打出3次用上腰的攻球，就是胜利。',
    description: '旧标准：赢了多少分 → 新标准：用上了几次腰？几次正确的脚步移动？',
    detail: '❌ 旧标准：这一局赢了多少分？\n✅ 新标准：这一局用上了几次腰？几次正确的脚步移动？',
  },
  {
    num: '03',
    icon: '🎯',
    title: '不怕快球',
    tag: '心态突破',
    keyMessage: '对面球快时不敢接，本质是怕失误丢脸。"我主动挡一板，比站着看球过去强十倍。"',
    description: '挡过去就有节奏变化，对方反而可能因为你的"软处理"而失误。快球是你练习反应的最好教材。',
    detail: '"我主动挡一板，比站着看球过去强十倍。"\n\n快球不是你的敌人，是你练习反应的最好教材。',
  },
  {
    num: '04',
    icon: '🎯',
    title: '允许自己"停下来"',
    tag: '节奏控制',
    keyMessage: '挥完一拍后不用急着立刻做下一拍动作。"我可以停顿半秒，先看球再动。"',
    description: '乒乓的节奏是：打一拍 → 停顿观察 → 移动 → 再打一拍。这个停顿不是偷懒。',
    detail: '很多新手的问题是"越急越乱"。乒乓的节奏是：打一拍 → 停顿观察 → 移动 → 再打一拍，而不是"打打打打"连成一片。',
  },
]

const accordionItems = [
  {
    icon: '👁️',
    title: '预判意识',
    subtitle: '解决"球快只能挡"',
    content: (
      <>
        <div className="bg-accent/5 rounded-2xl p-5 border-l-4 border-l-accent">
          <h4 className="text-sm font-bold text-accent mb-2">核心技巧：看对方击球瞬间</h4>
          <p className="text-sm text-text2 leading-relaxed mb-2">对方击球那一刻，你要盯住两个关键信息：</p>
          <ul className="list-none p-0">
            <li className="py-1.5 pl-5 relative text-sm text-text2 leading-relaxed before:absolute before:left-0 before:content-['→'] before:text-accent before:font-bold">
              <strong>拍面方向：</strong>拍面朝左 → 球往你右边走；拍面朝右 → 球往你左边走
            </li>
            <li className="py-1.5 pl-5 relative text-sm text-text2 leading-relaxed before:absolute before:left-0 before:content-['→'] before:text-accent before:font-bold">
              <strong>发力方向：</strong>拍面朝下切球 → 下旋（慢、沉）；拍面向前平击 → 快速不转；拍面向上摩擦 → 上旋（快、拱）
            </li>
          </ul>
        </div>
        <div className="bg-accent/5 rounded-2xl p-5 border-l-4 border-l-accent">
          <h4 className="text-sm font-bold text-accent mb-2">关键时间点</h4>
          <p className="text-sm text-text2 leading-relaxed">
            球一过网，你的脚就应该已经到达击球位置了。<strong>不是等球落到本方台面再动</strong>。
          </p>
        </div>
      </>
    ),
  },
  {
    icon: '🔄',
    title: '还原意识',
    subtitle: '解决"机械重复不调整"',
    content: (
      <>
        <div className="bg-accent/5 rounded-2xl p-5 border-l-4 border-l-accent">
          <h4 className="text-sm font-bold text-accent mb-2">口诀："打一、还一、看一"</h4>
          <ul className="list-none p-0">
            <li className="py-1.5 pl-5 relative text-sm text-text2 leading-relaxed before:absolute before:left-0 before:content-['→'] before:text-accent before:font-bold">
              <strong>打一拍：</strong>完成击球动作
            </li>
            <li className="py-1.5 pl-5 relative text-sm text-text2 leading-relaxed before:absolute before:left-0 before:content-['→'] before:text-accent before:font-bold">
              <strong>还原半步：</strong>立刻用小碎步跳回准备姿势
            </li>
            <li className="py-1.5 pl-5 relative text-sm text-text2 leading-relaxed before:absolute before:left-0 before:content-['→'] before:text-accent before:font-bold">
              <strong>看一眼：</strong>观察对方的回球动作和来球方向
            </li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-accent/8 to-accent2/5 border border-accent/15 rounded-2xl p-5">
          <p className="text-sm text-text font-semibold leading-relaxed">
            把"打完→还原"练成条件反射，而不是"挥完→盯着球看→再挥"。每打完一板，脚必须动一下。
          </p>
        </div>
      </>
    ),
  },
  {
    icon: '📏',
    title: '距离意识',
    subtitle: '解决"不会判断远近"',
    content: (
      <>
        <div className="bg-accent/5 rounded-2xl p-5 border-l-4 border-l-accent">
          <h4 className="text-sm font-bold text-accent mb-2">巧妙技巧：用非持拍手当"标尺"</h4>
          <p className="text-sm text-text2 leading-relaxed">
            准备时，非持拍手在胸前自然伸直：球超过前臂长度=远球要迈步；小于前臂长度=近球要撤步留空间。
          </p>
        </div>
        <div className="bg-accent/5 rounded-2xl p-5 border-l-4 border-l-accent">
          <h4 className="text-sm font-bold text-accent mb-2">黄金法则：每球都动脚</h4>
          <p className="text-sm text-text2 leading-relaxed">
            哪怕球就在手边，也迈一步去击球。久而久之，远近判断就会变成身体的直觉。
          </p>
        </div>
      </>
    ),
  },
]

const tacticCards = [
  {
    num: '01',
    title: '固定线路练习',
    description: '只打对方反手位斜线。这样你不需要判断太多方向，可以专心体会身体发力和还原。把大脑的计算资源从"方向判断"中解放出来。',
    tip: '💡 线路越固定，进步越快。先专精一条线。',
  },
  {
    num: '02',
    title: '一挡一拉',
    description: '对方快时第一板用挡或带（不发力，只借力），回球到中路或反手位。对方第二板质量下降，你再尝试轻轻拉一板。上台率远高于直接硬拉。',
    tip: '💡 第一板不发力，第二板再发力。',
  },
  {
    num: '03',
    title: '下网怎么办？',
    description: '说明摩擦太薄或拍面太压。下一板不要加力，把拍面稍微立起来（约80度），向上多擦一点。心里想："摩擦球的后面，把球带起来"。',
    tip: '💡 连续下网时，心想"摩擦球的顶部"——弧线上抬。',
  },
  {
    num: '04',
    title: '出台怎么办？',
    description: '说明撞击过多或拍面太亮。下一板收小臂要快，触球瞬间手腕由后向前内收，制造弧线。心里想："把球扫一个拱桥弧线"。',
    tip: '💡 连续出台时，心想"把球扫一个拱桥弧线"。',
  },
]

const postureProblems = [
  {
    label: '⚡ 问题 1',
    title: '不会用身体发力',
    cause: '根源：手臂代偿腰腿发力',
    description: '很多新手以为乒乓球是"用手打"，实际上核心发力源是腰和腿。手臂只是最后的传导工具。',
    solution: {
      title: '✅ 解决方案',
      content: '· 脚跟微离地：膝盖弯曲，重心在前脚掌。这样腰一转力量才能传到脚。\n\n· 手先不动，只转腰（徒手练习）：两脚比肩宽，右肩转向右后方，腰快速向左转，手臂完全放松，像鞭子一样被甩出去。\n\n· 击球时"顶胯"：触球瞬间，右胯向前上方一顶，重心自然从右腿转移到左腿。',
    },
  },
  {
    label: '⚡ 问题 2',
    title: '脚下定死怎么破？',
    cause: '根源：挥完不调整 + 不会判断远近',
    description: '乒乓不是打木桩，脚不动的球手怎么都救不回来。',
    solution: {
      title: '✅ 解决方案',
      content: '· 原地垫步练习（在家就能练）：双脚像踩在热炭上，每秒2-3次轻跳。\n\n· 近台球的处理：球离身体近时，不是弯腰伸手够，而是右脚向右后方撤一步，留出空间再挥拍。记住："脚不到，手不动"。',
    },
  },
  {
    label: '⚡ 问题 3',
    title: '球快只会挡或看',
    cause: '根源：重心后仰 + 被动反应',
    description: '越怕球快，你越容易缩手、重心后仰。这恰恰导致反应更慢。',
    solution: {
      title: '✅ 解决方案',
      content: '· 姿势上必须"迎前"：重心压低，拍子在身前，主动向前迎球，在上升期轻轻一碰（借力挡）。\n\n· 盯着球不接的强制训练：每次对方击球后，大声说出"左"或"右"，然后必须移动一步。哪怕接不到也要移动。',
    },
  },
  {
    label: '⚡ 问题 4',
    title: '拉球下网 / 出台',
    cause: '根源：拍面角度不合适 + 重心没交换',
    description: '这是最常见也最容易纠正的问题。核心在于拍面角度和重心的配合。',
    solution: {
      title: '✅ 解决方案',
      content: '· 调整拍面角度：拉下旋球（慢、转）→ 拍面约80度，从后面向上摩擦；拉上旋球（快、拱）→ 拍面约70度，向前摩擦顶部。\n\n· 重心要交换：下网→重心太高，蹲低，击球瞬间身体向上蹬；出台→重心后仰，强迫自己拉球后胸口朝向球台。',
    },
  },
]

const weekData = [
  {
    week: '1',
    badge: 'W1',
    title: '第1周：打好基础',
    desc: '徒手练习 · 建立身体感觉 · 不需要球台',
    items: [
      { id: 'w1-1', title: '1. 徒手转腰挥拍 × 100次', desc: '手不动，只转腰。两脚比肩宽，右肩转向右后方，腰快速左转，手臂像鞭子一样被甩出去。' },
      { id: 'w1-2', title: '2. 原地垫步 + 左右并步移动 × 2分钟', desc: '双脚像踩在热炭上，每秒2-3次轻跳。加入左右并步：左脚蹬、右脚跨，反之亦然。' },
      { id: 'w1-3', title: '3. 对墙轻轻推挡，每打一拍垫一步', desc: '离墙约1.5米，用球拍轻轻推挡。每碰一次球，脚必须垫一步。目标是"打球必动脚"。' },
    ],
  },
  {
    week: '2',
    badge: 'W2',
    title: '第2周：上球台实战',
    desc: '挡一板 → 还原 → 垫步 · 有球练习',
    items: [
      { id: 'w2-1', title: '1. 一人喂球，只练"挡一板→还原→垫步"', desc: '同伴发中等速度球到固定位置，只做轻挡。挡完后立刻脚下垫步、身体还原。连续20次不失误过关。' },
      { id: 'w2-2', title: '2. 打多球时，故意把球让到身体侧面，练习撤步击球', desc: '让同伴喂球到身体中路或偏近身位置。不伸手够，右脚撤一步让出空间再挥拍。"脚比手先动"。' },
    ],
  },
  {
    week: '3',
    badge: 'W3',
    title: '第3周：实战应用',
    desc: '固定线路 · 主动调整 · 实战检验',
    items: [
      { id: 'w3-1', title: '1. 固定线路拉球（下旋起板）', desc: '只拉斜线到对方反手位。下网了→拍面立一点；出台了→收臂快一点。目标连续拉5板上台。' },
      { id: 'w3-2', title: '2. 实战中强制自己：每分球至少移动3次脚', desc: '打比赛时不在乎输赢，只在乎"这一分我动了几次脚"。每分球结束后默数：1、2、3……不够就提醒自己。' },
    ],
  },
]

function loadChecklist(): string[] {
  try {
    const saved = localStorage.getItem('pingpong_checklist')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveChecklist(ids: string[]) {
  localStorage.setItem('pingpong_checklist', JSON.stringify(ids))
}

export default function TrainingTutorial() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [openAccordion, setOpenAccordion] = useState<Set<number>>(new Set())
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set(loadChecklist()))

  useEffect(() => {
    saveChecklist([...checkedIds])
  }, [checkedIds])

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index)
  }

  const toggleAccordion = (index: number) => {
    setOpenAccordion((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const toggleChecklist = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const getWeekProgress = (items: { id: string }[]) => {
    const checked = items.filter((item) => checkedIds.has(item.id)).length
    const total = items.length
    return { checked, total, pct: total > 0 ? (checked / total) * 100 : 0 }
  }

  return (
    <div className="container max-w-[1080px] mx-auto px-4 md:px-8">
      <div className="py-14 text-center">
        <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] tracking-[3px] leading-tight mb-3">
          从<span className="text-accent">"乱抡"</span>到<span className="text-accent">"有数"</span>
        </h1>
        <p className="text-text2 max-w-[520px] mx-auto text-balance">
          每一板都有目的，每一步都有意义。乒乓不是打赢对手，是学会控制自己的身体。
        </p>
      </div>

      <section className="py-20">
        <div className="mb-14">
          <div className="font-mono text-base font-bold tracking-[6px] text-accent mb-3.5 flex items-center gap-4">
            01
            <span className="flex-1 h-0.5 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] tracking-[3px] leading-tight">
            心态 <span className="text-accent">· 先学会"每一板都有数"</span>
          </h2>
          <p className="mt-4 text-text2 text-base max-w-[620px]">
            别急着"拉死对方"，身体需要时间来建立肌肉记忆。心态对了，动作自然对。
          </p>
        </div>

        <div className="bg-card border border-border rounded-[22px] p-8 mb-10 relative shadow-md before:absolute before:left-0 before:top-[18px] before:bottom-[18px] before:w-1 before:bg-accent before:rounded-r-[3px]">
          <div className="font-mono text-xs font-bold tracking-[4px] text-accent mb-2">一语中的</div>
          <div className="text-base font-bold text-text leading-relaxed flex flex-col gap-2">
            <span>每一次失误都是身体在采集数据。不丢分，就找不到正确的肌肉记忆。</span>
            <span>把"赢比赛"的念头暂时放下，先学会"每一板都知道自己在干什么"。</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {principleCards.map((card, i) => {
            const isExpanded = expandedCard === i
            return (
              <div
                key={i}
                className={cn(
                  'bg-card border border-border rounded-[18px] p-8 cursor-pointer transition-all relative overflow-hidden',
                  isExpanded
                    ? 'bg-card border-accent shadow-lg -translate-y-1'
                    : 'hover:bg-card hover:border-accent hover:-translate-y-1 hover:shadow-xl'
                )}
                onClick={() => toggleCard(i)}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent2 transition-transform duration-500"
                  style={{ transform: `scaleX(${isExpanded ? 1 : 0})`, transformOrigin: 'left' }}
                />
                <div className="font-display text-[4rem] leading-[0.8] text-accent/10 absolute top-3 right-4.5 pointer-events-none">
                  {card.num}
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4.5 bg-accent/10">
                  {card.icon}
                </div>
                <h3 className="text-lg font-extrabold mb-1 text-text tracking-[1px]">{card.title}</h3>
                <div className="font-mono text-xs font-bold tracking-[3px] uppercase text-accent mb-4">
                  {card.tag}
                </div>
                <div className="text-sm font-semibold text-text leading-relaxed mb-3.5 pb-3.5 border-b border-border text-pretty">
                  {card.keyMessage.split('。').map((part, pi) => (
                    part ? <span key={pi}>{pi > 0 ? '。' : ''}{part.replace(/\*\*(.+?)\*\*/g, '**')}</span> : null
                  ))}
                </div>
                <p className="text-sm text-text2 leading-relaxed">{card.description}</p>

                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: isExpanded ? '300px' : '0', marginTop: isExpanded ? '14px' : '0' }}
                >
                  <div className="pt-3.5 border-t border-border text-sm text-text2 leading-relaxed whitespace-pre-line">
                    {card.detail}
                  </div>
                </div>

                <div className={cn('text-xs mt-3 flex items-center gap-1.5 transition-colors', isExpanded ? 'text-accent' : 'text-muted hover:text-accent')}>
                  点击{isExpanded ? '收起' : '展开'}详细
                  <span className={cn('inline-block transition-transform', isExpanded && 'rotate-180')}>↓</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="py-20">
        <div className="mb-14">
          <div className="font-mono text-base font-bold tracking-[6px] text-accent mb-3.5 flex items-center gap-4">
            02
            <span className="flex-1 h-0.5 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] tracking-[3px] leading-tight">
            意识 <span className="text-accent">· 提前想、盯住球、算落点</span>
          </h2>
          <p className="mt-4 text-text2 text-base max-w-[620px]">
            手快不如脑快。在你挥拍之前，意识已经决定了这一板的质量。
          </p>
        </div>

        <div className="bg-card border border-border rounded-[22px] p-8 mb-10 relative shadow-md before:absolute before:left-0 before:top-[18px] before:bottom-[18px] before:w-1 before:bg-accent before:rounded-r-[3px]">
          <div className="font-mono text-xs font-bold tracking-[4px] text-accent mb-2">一语中的</div>
          <div className="text-base font-bold text-text leading-relaxed">
            眼睛盯对方拍面，脚下先于球落位。预判 + 还原 + 距离感 = 你能接住80%的来球。
          </div>
        </div>

        <div className="flex flex-col gap-4.5">
          {accordionItems.map((item, i) => {
            const isOpen = openAccordion.has(i)
            return (
              <div
                key={i}
                className={cn(
                  'bg-card border border-border rounded-[18px] overflow-hidden transition-all',
                  'hover:border-accent/30'
                )}
              >
                <button
                  className="w-full bg-none border-none text-text font-body text-lg font-bold py-6 px-7 cursor-pointer flex items-center justify-between text-left gap-4"
                  onClick={() => toggleAccordion(i)}
                >
                  <div className="w-11 h-11 min-w-[44px] rounded-xl flex items-center justify-center text-2xl bg-accent/10">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    {item.title}
                    <span className="text-sm text-muted font-normal block">{item.subtitle}</span>
                  </div>
                  <div
                    className={cn(
                      'w-7.5 h-7.5 min-w-[30px] rounded-full flex items-center justify-center transition-all text-xs border border-border',
                      isOpen
                        ? 'rotate-180 bg-accent/15 text-accent border-accent/40'
                        : 'text-muted'
                    )}
                  >
                    ▼
                  </div>
                </button>
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: isOpen ? '2000px' : '0' }}
                >
                  <div className="px-7 pb-7 flex flex-col gap-4">
                    {item.content}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="py-20">
        <div className="mb-14">
          <div className="font-mono text-base font-bold tracking-[6px] text-accent mb-3.5 flex items-center gap-4">
            03
            <span className="flex-1 h-0.5 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] tracking-[3px] leading-tight">
            战术 <span className="text-accent">· 从"乱抡"到"有套路"</span>
          </h2>
          <p className="mt-4 text-text2 text-base max-w-[620px]">
            针对你目前的水平，不要打"全台进攻"，而是打<strong>"一个落点，两个节奏"</strong>。
          </p>
        </div>

        <div className="bg-card border border-border rounded-[22px] p-8 mb-10 relative shadow-md before:absolute before:left-0 before:top-[18px] before:bottom-[18px] before:w-1 before:bg-accent before:rounded-r-[3px]">
          <div className="font-mono text-xs font-bold tracking-[4px] text-accent mb-2">一语中的</div>
          <div className="text-base font-bold text-text leading-relaxed flex flex-col gap-2">
            <span>固定线路练动作，一挡一拉控节奏。下网就立拍面，出台就收小臂。</span>
            <span>战术不是耍花招，是把有限的注意力集中到对的地方。</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tacticCards.map((tactic) => (
            <div
              key={tactic.num}
              className="bg-card border border-border rounded-[18px] p-7.5 transition-all hover:border-accent/30 hover:shadow-md relative"
            >
              <div className="font-display text-[3.5rem] text-accent/10 absolute top-2.5 right-4.5 pointer-events-none leading-none">
                {tactic.num}
              </div>
              <h4 className="text-base font-extrabold mb-2.5 text-text tracking-[1px]">{tactic.title}</h4>
              <p className="text-sm text-text2 leading-relaxed">{tactic.description}</p>
              <div className="mt-3.5 py-3 px-4 bg-accent/8 rounded-[10px] text-sm text-accent font-semibold">
                {tactic.tip}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mb-14">
          <div className="font-mono text-base font-bold tracking-[6px] text-accent mb-3.5 flex items-center gap-4">
            04
            <span className="flex-1 h-0.5 bg-gradient-to-r from-border to-transparent" />
          </div>
          <h2 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] tracking-[3px] leading-tight">
            姿势 <span className="text-accent">· 把"挥臂"变成"转体发力"</span>
          </h2>
          <p className="mt-4 text-text2 text-base max-w-[620px]">
            这是整个教程最核心的部分。姿势对了，球自然上台；姿势不对，再多练习也是白费。
          </p>
        </div>

        <div className="bg-card border border-border rounded-[22px] p-8 mb-10 relative shadow-md before:absolute before:left-0 before:top-[18px] before:bottom-[18px] before:w-1 before:bg-accent before:rounded-r-[3px]">
          <div className="font-mono text-xs font-bold tracking-[4px] text-accent mb-2">一语中的</div>
          <div className="text-base font-bold text-text leading-relaxed flex flex-col gap-2">
            <span>手臂只是鞭梢，腰胯才是鞭杆。脚不到，手不动；重心交换，弧线自来。</span>
            <span>所有问题的根源都是：你用手打球，而不是用身体打球。</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {postureProblems.map((problem, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-[18px] p-7.5 transition-all hover:border-accent/30"
            >
              <div className="flex items-start gap-3.5 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-accent2/10 text-accent2 text-xs font-bold tracking-[1px] py-1 px-3 rounded-[20px] whitespace-nowrap">
                  {problem.label}
                </span>
                <div>
                  <h4 className="text-lg font-extrabold text-text tracking-[1px]">{problem.title}</h4>
                  <span className="text-sm text-accent font-semibold border-b-2 border-dashed border-accent/30 inline-block pb-0.5">
                    {problem.cause}
                  </span>
                </div>
              </div>
              <p className="text-sm text-text2 leading-relaxed mb-5">{problem.description}</p>
              <div className="bg-success/8 rounded-2xl p-5 border-l-4 border-l-success">
                <h5 className="text-sm font-extrabold text-success mb-2 tracking-[1px]">{problem.solution.title}</h5>
                <p className="text-sm text-text2 leading-relaxed whitespace-pre-line">{problem.solution.content}</p>
              </div>
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
            三周行动清单 <span className="text-accent">· 每天只需15分钟</span>
          </h2>
          <p className="mt-4 text-text2 text-base max-w-[620px]">
            不需要球台也能练。点击每个任务标记完成，浏览器会自动保存你的进度。
          </p>
        </div>

        <div className="bg-card border border-border rounded-[22px] p-8 mb-10 relative shadow-md before:absolute before:left-0 before:top-[18px] before:bottom-[18px] before:w-1 before:bg-accent before:rounded-r-[3px]">
          <div className="font-mono text-xs font-bold tracking-[4px] text-accent mb-2">一语中的</div>
          <div className="text-base font-bold text-text leading-relaxed flex flex-col gap-2">
            <span>第1周在家徒手练，第2周上台练节奏，第3周实战练调整。</span>
            <span>每天15分钟，三周后你会看到一个不一样的自己。</span>
          </div>
        </div>

        <div className="flex flex-col gap-7">
          {weekData.map((week) => {
            const progress = getWeekProgress(week.items)
            const allDone = progress.checked === progress.total && progress.total > 0

            return (
              <div key={week.week} className="bg-card border border-border rounded-[18px] overflow-hidden">
                <div className="py-7 px-7.5 bg-accent/5 border-b border-border flex items-center gap-4.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-display text-2xl font-bold text-white">
                    {week.badge}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-text tracking-[1px]">{week.title}</h3>
                    <div className="text-sm text-muted">{week.desc}</div>
                  </div>
                </div>
                <div className="py-7 px-7.5 flex flex-col gap-3.5">
                  {week.items.map((item) => {
                    const isChecked = checkedIds.has(item.id)
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'flex items-start gap-3.5 py-4 px-5 rounded-2xl cursor-pointer transition-all border',
                          isChecked
                            ? 'bg-success/5 border-success/30'
                            : 'border-transparent hover:bg-accent/5 hover:border-accent/20'
                        )}
                        onClick={() => toggleChecklist(item.id)}
                      >
                        <div
                          className={cn(
                            'w-6.5 h-6.5 min-w-[26px] rounded-md border-2 flex items-center justify-center transition-all duration-300',
                            isChecked ? 'bg-success border-success' : 'border-border'
                          )}
                        >
                          {isChecked && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className={cn('text-sm font-bold mb-1 transition-all', isChecked ? 'text-muted line-through decoration-success decoration-2' : 'text-text')}>
                            {item.title}
                          </h5>
                          <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center gap-3.5 py-3.5 px-7.5 border-t border-border">
                  <div className="flex-1 h-2 bg-border rounded-[10px] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent2 rounded-[10px] transition-all duration-500"
                      style={{ width: `${progress.pct}%` }}
                    />
                  </div>
                  <span className={cn('font-mono text-sm font-semibold min-w-[50px] text-right', allDone ? 'text-success' : 'text-muted')}>
                    {progress.checked}/{progress.total}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}