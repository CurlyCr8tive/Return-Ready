// frontend/app/(staff)/bot/page.tsx
// Team Bot page — staff-facing "What Would Joanna Do?" assistant
// Uses RAG over leave doc + Q&A transcript embeddings in ChromaDB
// Accessible to authenticated staff members

import { TeamBot } from '@/components/bots/TeamBot'

export default function TeamBotPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-navy mb-2">Team Bot</h1>
      <p className="text-gray mb-6">
        Ask me what Joanna would do — I&apos;ve read her leave handoff doc and Q&A.
      </p>
      <TeamBot />
    </div>
  )
}
