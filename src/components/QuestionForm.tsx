import React, { useState, useEffect, RefObject } from 'react'
import { Send } from 'lucide-react'

interface QuestionFormProps {
  setError: (msg: string) => void
  inputRef: RefObject<HTMLInputElement>
}

const QuestionForm: React.FC<QuestionFormProps> = ({ setError, inputRef }) => {
  const [question, setQuestion] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) {
      setError('Kérlek töltsd ki a kérdés mezőt!')
      return
    }
    alert(`Küldött kérdés: ${question}`)
    setQuestion('')
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (question.trim()) {
      setError('')
    }
    return () => clearTimeout(timer)
  }, [question, setError])

  return (
    <div className="w-full flex flex-col items-center gap-4 relative">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg relative mt-4"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Kérdés"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Küldés
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}

export default QuestionForm
