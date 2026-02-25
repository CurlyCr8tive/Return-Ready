'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { botAPI } from '@/lib/api'

interface Source {
  source: string
  chunk_index: number
  score: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

const SUGGESTED_QUESTIONS = [
  'How should we handle a vendor dispute?',
  'What approval is needed for budget decisions?',
  "How does Joanna prefer to run team meetings?",
  'Who should I escalate HR issues to?',
]

export function TeamBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [staffEmail, setStaffEmail] = useState('')
  const [staffName, setStaffName] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setStaffEmail(data.user.email ?? '')
        setStaffName(
          data.user.user_metadata?.full_name ??
          data.user.user_metadata?.name ??
          data.user.email ??
          ''
        )
      }
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (question?: string) => {
    const text = (question ?? input).trim()
    if (!text || isLoading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setIsLoading(true)

    try {
      const res = await botAPI.askTeam(text, staffEmail, staffName)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer,
          sources: res.sources as Source[],
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I couldn't reach the bot right now. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[640px]">
      {/* Message thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-6">
            <p className="text-navy font-medium mb-1">What Would Joanna Do?</p>
            <p className="text-gray text-sm mb-6">
              I&apos;ve read Joanna&apos;s leave handoff doc. Ask me anything.
            </p>
            <div className="flex flex-col gap-2 max-w-sm mx-auto">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="px-4 py-2.5 bg-lightgray text-gray text-sm rounded-lg hover:bg-medgray transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue text-white'
                    : 'bg-lightgray text-gray-900'
                }`}
              >
                {msg.content}
              </div>
            </div>

            {/* Sources */}
            {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
              <div className="ml-1 mt-1.5 flex flex-wrap gap-1">
                {msg.sources.map((src, j) => (
                  <span
                    key={j}
                    className="text-xs bg-lightblue text-navy px-2 py-0.5 rounded"
                  >
                    {src.source || `chunk ${src.chunk_index}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-lightgray rounded-xl px-4 py-3 text-sm text-gray">
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 p-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="What would Joanna do?"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 bg-blue text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-navy transition-colors"
        >
          Ask
        </button>
      </div>
    </div>
  )
}
