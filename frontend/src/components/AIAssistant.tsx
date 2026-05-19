import { useState, useRef, useEffect } from 'react'

const DIMENSIONS = ['发力链', '脚步移动', '控球能力', '预判读转', '节奏变化', '比赛心态']
const DEEPSEEK_KEY = 'sk-ccf4e3a2da854799aabbdcaa4e32e8f9'

interface TypeResult {
  code: string
  name: string
  desc: string
  strengths: string[]
  weaknesses: string[]
  advice: { title: string; desc: string }[]
}

interface ChatMessage {
  role: 'system' | 'user'
  content: string
  isLoading?: boolean
}

interface AIAssistantProps {
  testCompleted: boolean
  testTypeResult: TypeResult | null
  dimScores: number[]
  onTabChange?: (tab: string) => void
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
}

function renderTable(lines: string[]): string {
  const isSep = (l: string) => /^\|[\s\-:]+\|/.test(l)
  const sepIdx = lines.findIndex((l) => isSep(l.trim()))
  const sep = sepIdx < 0 ? 1 : sepIdx

  const headerLines = lines.slice(0, sep)
  const bodyLines = lines.slice(sep + 1).filter((l) => !isSep(l.trim()))

  const parseRow = (l: string) =>
    l
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => inlineMarkdown(c.trim()))

  const hCells = headerLines.flatMap(parseRow)
  const header = hCells.length
    ? `<thead><tr>${hCells.map((c) => `<th>${c}</th>`).join('')}</tr></thead>`
    : ''

  const body = bodyLines.length
    ? `<tbody>${bodyLines
        .map(
          (l) =>
            `<tr>${parseRow(l)
              .map((c) => `<td>${c}</td>`)
              .join('')}</tr>`
        )
        .join('')}</tbody>`
    : ''

  return `<table>${header}${body}</table>`
}

function renderMarkdown(text: string): string {
  const blocks = text.split(/(?:\n\s*\n)+/)

  return blocks
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''

      if (trimmed.startsWith('```')) {
        const code = trimmed
          .replace(/^```\w*\n?/, '')
          .replace(/```$/, '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        return `<pre><code>${code}</code></pre>`
      }

      const lines = trimmed.split('\n')
      if (lines.length >= 2 && lines.every((l) => l.trim().startsWith('|'))) {
        return renderTable(lines)
      }

      let html = ''
      let inList: string | null = null
      let inOrdered: string | null = null

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) {
          html += '<br>'
          continue
        }

        if (line.startsWith('### ')) {
          html += `<h4>${inlineMarkdown(line.slice(4))}</h4>`
          continue
        }
        if (line.startsWith('## ')) {
          html += `<h3>${inlineMarkdown(line.slice(3))}</h3>`
          continue
        }
        if (line.startsWith('# ')) {
          html += `<h2>${inlineMarkdown(line.slice(2))}</h2>`
          continue
        }

        const olMatch = line.match(/^(\d+)\.\s+(.+)/)
        if (olMatch) {
          if (inOrdered !== 'ol') {
            if (inList) html += '</ul>'
            html += '<ol>'
            inOrdered = 'ol'
            inList = null
          }
          html += `<li>${inlineMarkdown(olMatch[2])}</li>`
          continue
        }

        if (line.startsWith('- ') || line.startsWith('* ')) {
          if (inList !== 'ul') {
            if (inOrdered) html += '</ol>'
            inOrdered = null
            html += '<ul>'
            inList = 'ul'
          }
          html += `<li>${inlineMarkdown(line.slice(2))}</li>`
          continue
        }

        if (inList) {
          html += inList === 'ul' ? '</ul>' : '</ol>'
          inList = null
          inOrdered = null
        }
        if (inOrdered) {
          html += '</ol>'
          inOrdered = null
        }

        if (line.startsWith('---')) {
          html += '<hr>'
          continue
        }
        if (line.startsWith('> ')) {
          html += `<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`
          continue
        }

        html += `<p>${inlineMarkdown(line)}</p>`
      }

      if (inList) html += '</ul>'
      if (inOrdered) html += '</ol>'

      return html
    })
    .join('')
}

function buildAiContext(
  testTypeResult: TypeResult,
  dimScores: number[]
): string {
  const t = testTypeResult

  const dimDetail = DIMENSIONS.map((d, i) => {
    let detail = ''
    if (i === 0) detail = '衡量是否用腰腿发力还是只用手臂'
    else if (i === 1) detail = '衡量移动能力和打完还原的习惯'
    else if (i === 2) detail = '衡量击球稳定性和落点控制'
    else if (i === 3) detail = '衡量对旋转和来球方向的预判能力'
    else if (i === 4) detail = '衡量对比赛节奏的掌控和变化能力'
    else if (i === 5) detail = '衡量比赛中的心态调整和抗压能力'

    const lv =
      dimScores[i] <= 35
        ? '薄弱（需要重点突破）'
        : dimScores[i] <= 65
          ? '中等（巩固后即可进阶）'
          : '良好（可作为核心竞争力）'

    return `- ${d}：${dimScores[i]}% — ${lv} — ${detail}`
  }).join('\n')

  const adviceDetail = t.advice
    .map((a, i) => `${i + 1}. ${a.title}：${a.desc}`)
    .join('\n')

  return `【学员完整诊断报告】

## 球员类型
- 代码：${t.code}
- 名称：${t.name}
- 整体描述：${t.desc}

## 六维能力详细评分
${dimDetail}

## 已识别的优势
${t.strengths.map((s) => `- ${s}`).join('\n')}

## 已识别的短板
${t.weaknesses.map((w) => `- ${w}`).join('\n')}

## 系统已给出的针对性训练建议
${adviceDetail}`
}

export default function AIAssistant({
  testCompleted,
  testTypeResult,
  dimScores,
  onTabChange,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (testCompleted && testTypeResult && !initializedRef.current) {
      initializedRef.current = true
      const summary = DIMENSIONS.map((d, i) => {
        const lv =
          dimScores[i] <= 35 ? '薄弱' : dimScores[i] <= 65 ? '中等' : '良好'
        return `${d}: ${dimScores[i]}%（${lv}）`
      }).join(' | ')

      setMessages([
        {
          role: 'system',
          content: `**已加载你的诊断数据：**\n\n${testTypeResult.code} ${testTypeResult.name} | ${summary}\n\n你可以问我任何关于乒乓训练的问题，比如：\n· "针对我的短板，接下来两周应该怎么练？"\n· "我的发力链分数很低，具体怎么办？"\n· "帮我设计一个30分钟的训练计划"`,
        },
      ])
    }
  }, [testCompleted, testTypeResult, dimScores])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const msg = inputValue.trim()
    if (!msg || isSending || !testTypeResult) return

    const userMessage: ChatMessage = { role: 'user', content: msg }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsSending(true)

    const loadingMessage: ChatMessage = {
      role: 'system',
      content: 'AI思考中...',
      isLoading: true,
    }
    setMessages((prev) => [...prev, loadingMessage])

    const context = buildAiContext(testTypeResult!, dimScores)
    const systemPrompt = `你是一位拥有20年执教经验的专业乒乓球教练，专门帮助业余新手突破技术瓶颈。你已经对这位学员进行了全面的六维诊断分析，下面是你掌握的全部数据：

${context}

---
作为教练，请你注意：
1. **必须引用具体数据**：回答中要提到学员的具体分数（如"你的发力链只有X%，说明..."），不要笼统地给建议。
2. **必须结合已有的训练建议**：上面"系统已给出的针对性训练建议"中的内容是你已知的基础方案，请在此基础上做深化和个性化调整，而不是忽略它们。
3. **必须具体可执行**：给出具体的训练动作、次数、频率、阶段性目标，而不是泛泛而谈。
4. **必须结构化**：使用标题（##）、列表（-）和加粗（**）来组织回答，让学员容易阅读和执行。
5. **鼓励为主**：先指出做的好的部分，再给改进建议，让学员有信心。

请用中文回答，回答要专业、详细、有温度。`

    try {
      const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DEEPSEEK_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: msg },
          ],
          max_tokens: 2500,
          temperature: 0.7,
        }),
      })

      setMessages((prev) => prev.filter((m) => !m.isLoading))

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: { message: 'API请求失败' } }))
        throw new Error(err.error?.message || 'API请求失败')
      }

      const data = await resp.json()
      const reply = data.choices[0].message.content

      setMessages((prev) => [
        ...prev,
        { role: 'system', content: reply },
      ])
    } catch (e) {
      setMessages((prev) => prev.filter((m) => !m.isLoading))
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: `**出错了**：${e instanceof Error ? e.message : '未知错误'}\n\n请检查API Key是否正确、账户是否有余额。`,
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!testCompleted) {
    return (
      <div className="container max-w-[1080px] mx-auto px-4 md:px-8">
        <div className="py-14 text-center">
          <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] tracking-[3px] leading-tight mb-3">
            AI <span className="text-accent">智能分析</span>
          </h1>
          <p className="text-text2 max-w-[520px] mx-auto text-balance">
            基于你的诊断结果和DeepSeek大模型，获得个性化的深度分析和训练建议。
          </p>
        </div>

        <div className="py-10">
          <div className="text-center py-10 px-8 bg-card border border-border rounded-[18px] mb-6">
            <p className="text-muted text-sm mb-3">
              ⚠️ 还没有诊断结果。AI需要你的六维能力数据才能给出精准建议。
            </p>
            <button
              onClick={() => onTabChange?.('diagnostic')}
              className="font-body text-sm font-semibold py-2 px-6 rounded-[20px] border border-accent text-accent bg-transparent cursor-pointer transition-all hover:bg-accent hover:text-white"
            >
              先去诊断测试 →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-[1080px] mx-auto px-4 md:px-8">
      <div className="py-14 text-center">
        <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] tracking-[3px] leading-tight mb-3">
          AI <span className="text-accent">智能分析</span>
        </h1>
        <p className="text-text2 max-w-[520px] mx-auto text-balance">
          基于你的诊断结果和DeepSeek大模型，获得个性化的深度分析和训练建议。
        </p>
      </div>

      <div className="py-10">
        <div className="bg-card border border-border rounded-[18px] overflow-hidden shadow-md">
          <div className="py-4.5 px-6 bg-accent/5 border-b border-border flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-bold text-text">AI 乒乓教练 · DeepSeek</span>
          </div>

          <div
            ref={messagesContainerRef}
            className="px-6 py-5 max-h-96 overflow-y-auto flex flex-col gap-4 min-h-[120px]"
          >
            {messages.map((msg, idx) => {
              if (msg.isLoading) {
                return (
                  <div
                    key={idx}
                    className="max-w-[85%] self-start py-3.5 px-4.5 rounded-2xl bg-accent/5 text-muted text-sm leading-relaxed border border-dashed border-border"
                  >
                    {msg.content}
                  </div>
                )
              }

              if (msg.role === 'system') {
                return (
                  <div
                    key={idx}
                    className="ai-msg max-w-[85%] self-start py-3.5 px-4.5 rounded-2xl bg-accent/5 text-text2 text-sm leading-relaxed border border-border"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                )
              }

              return (
                <div
                  key={idx}
                  className="ai-msg max-w-[85%] self-end py-3.5 px-4.5 rounded-2xl bg-accent/10 text-text text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="py-4 px-6 border-t border-border flex gap-2.5">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题..."
              rows={1}
              disabled={isSending}
              className="flex-1 py-3 px-4 border border-border rounded-xl font-body text-sm text-text resize-none outline-none min-h-[44px] max-h-[120px] bg-white/50 transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(192,57,43,0.08)] leading-relaxed"
            />
            <button
              onClick={handleSend}
              disabled={isSending || !inputValue.trim()}
              className="font-body text-sm font-bold py-2.5 px-5 rounded-xl border-none bg-accent text-white cursor-pointer transition-all hover:bg-accent2 whitespace-nowrap self-end disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}