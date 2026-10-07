import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Paperclip, Send, Sparkles } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Avatar, Badge, Button, Card, CardBody, EmptyState, Field, Textarea } from '@/components/ui'
import { initials } from '@/lib/utils'
import { dateTime, relative } from '@/lib/format'
import type { MessageAuthor } from '@/types'

export const Route = createFileRoute('/app/messages')({
  component: MessagesPage,
  head: () => ({ meta: [{ title: 'Messagerie — ALLNEEDS' }] }),
})

export function MessagesPage() {
  const { state, dispatch, orgId, user } = useDemo()
  const [selected, setSelected] = useState(state.threads.find((t) => t.orgId === orgId)?.id ?? '')
  const [text, setText] = useState('')

  const threads = state.threads
    .filter((t) => t.orgId === orgId)
    .sort((a, b) => b.lastAt.localeCompare(a.lastAt))

  const messages = state.messages
    .filter((m) => m.threadId === selected && m.orgId === orgId)
    .sort((a, b) => a.at.localeCompare(b.at))

  function send() {
    if (!selected || !text.trim()) return
    dispatch({ type: 'MESSAGE_SEND', threadId: selected, body: text.trim(), author: 'client', authorName: user.name })
    setText('')
  }

  return (
    <>
      <PageHeader
        eyebrow="Communication"
        title="Messagerie"
        description="Chaque conversation reste rattachée à un sujet, un dossier ou une mission : la messagerie fait partie du workflow, elle ne remplace pas WhatsApp."
      />

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] xl:grid-cols-[0.7fr_1.3fr]">
        <Card className="flex flex-col overflow-hidden">
          <div className="border-b border-ink-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Conversations</p>
          </div>
          <div className="flex-1 divide-y divide-ink-50">
            {threads.length === 0 ? (
              <CardBody>
                <EmptyState
                  title="Aucune conversation"
                  description="Un échange est créé automatiquement au fil de vos besoins et missions."
                />
              </CardBody>
            ) : null}
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-ink-50/70 ${
                  selected === t.id ? 'bg-ink-50' : ''
                }`}
              >
                <Avatar name={t.topic.includes('Mission') ? 'NB' : 'ALLNEEDS'} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-ink-900">{t.subject}</p>
                    <span className="shrink-0 text-xs text-ink-400">{relative(t.lastAt, new Date(state.now).getTime())}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-500">{t.topic}</p>
                  {t.unread > 0 ? (
                    <Badge tone="brand" className="mt-2">
                      {t.unread} non lu{t.unread > 1 ? 's' : ''}
                    </Badge>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex h-[640px] flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-5 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink-950">
                    {threads.find((t) => t.id === selected)?.subject}
                  </p>
                  <p className="text-xs text-ink-500">
                    Contexte : {threads.find((t) => t.id === selected)?.topic} · dernière activité{' '}
                    {relative(threads.find((t) => t.id === selected)?.lastAt ?? state.now, new Date(state.now).getTime())}
                  </p>
                </div>
                <Sparkles className="h-4 w-4 text-ink-400" />
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-ink-50/40 px-5 py-4">
                {messages.map((m) => {
                  const isClient = m.author === 'client'
                  return (
                    <div key={m.id} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${isClient ? 'bg-brand-700 text-white' : 'bg-white text-ink-900'}`}>
                        <div className="mb-1 flex items-center justify-between gap-4">
                          <span className={`text-[0.7rem] font-semibold uppercase tracking-wide ${isClient ? 'text-white/80' : 'text-ink-500'}`}>
                            {m.authorName}
                          </span>
                          <span className={`text-[0.7rem] ${isClient ? 'text-white/70' : 'text-ink-400'}`}>
                            {dateTime(m.at)}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.body}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-ink-100 bg-white px-5 py-3">
                <Field label="" hint="Vos échanges restent dans cette conversation, rattachés à votre établissement.">
                  <div className="flex gap-2">
                    <Textarea
                      rows={2}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Écrire un message à ALLNEEDS..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          send()
                        }
                      }}
                    />
                    <div className="flex flex-col justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={send} disabled={!text.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Field>
              </div>
            </>
          ) : (
            <EmptyState
              title="Sélectionnez une conversation"
              description="Choisissez un fil pour afficher l’historique des échanges."
            />
          )}
        </Card>
      </div>
    </>
  )
}
