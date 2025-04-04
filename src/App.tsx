import React, { useState, useEffect, useRef } from 'react'
import { Moon, Sun, MessageCircle } from 'lucide-react'
import QuestionForm from './components/QuestionForm'
import supabase from './supabaseClient'

interface OutputRecord {
  id: number
  content: string
  created_at: string
}

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [error, setError] = useState('')
  const [outputs, setOutputs] = useState<OutputRecord[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | null>(null)

  const handleSetError = (msg: string) => {
    setError(msg)
    if (msg && inputRef.current) {
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('output_table').select('id').limit(1)
        if (error) {
          console.error('Kapcsolódási hiba:', error)
          setConnectionStatus('error')
        } else {
          setConnectionStatus('success')
        }
      } catch (err) {
        console.error('Kapcsolódási kivétel:', err)
        setConnectionStatus('error')
      }
    }

    const fetchOutputs = async () => {
      const { data, error } = await supabase
        .from('output_table')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        handleSetError('Hiba az output adatok betöltésekor')
        console.error(error)
      } else if (data) {
        setOutputs(data as OutputRecord[])
      }
    }

    checkConnection()
    fetchOutputs()
  }, [])

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Connection status popup */}
      {connectionStatus && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-300 dark:border-gray-700">
            <p className="text-lg font-semibold mb-4 text-center">
              {connectionStatus === 'success'
                ? 'Sikeres kapcsolódás a Supabase-hez!'
                : 'Nem sikerült kapcsolódni a Supabase-hez!'}
            </p>
            <button
              onClick={() => setConnectionStatus(null)}
              className="block mx-auto mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}

      {/* Global error banner */}
      <div
        className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 ${
          error ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="bg-red-500 text-white text-center py-3 font-semibold shadow-lg">
          {error}
        </div>
      </div>

      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-8 transition-colors duration-500
        bg-gradient-to-b from-white to-gray-300 dark:from-gray-900 dark:to-gray-700"
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:scale-110 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-gray-800" size={20} />
            )}
          </button>
        </div>

        <div className="flex flex-col items-center gap-8 w-full">
          <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-2xl p-8 shadow-2xl w-full max-w-3xl flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <MessageCircle size={32} className="text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kérdésküldő</h1>
            </div>
            <p className="text-center text-gray-700 dark:text-gray-300">
              Írd be a kérdésedet az alábbi mezőbe, majd kattints a Küldés gombra.
            </p>
            <QuestionForm setError={handleSetError} inputRef={inputRef} />
          </div>

          <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-2xl p-8 shadow-2xl w-[95%] mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Output adatok</h2>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Tartalom</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Dátum</th>
                </tr>
              </thead>
              <tbody>
                {outputs.map((output) => (
                  <tr key={output.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{output.id}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{output.content}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{new Date(output.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
