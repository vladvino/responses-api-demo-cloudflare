import { useState } from 'react'
import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 px-6 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            Responsible
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn how to use OpenAI's Response API through interactive examples
          </p>
        </header>

        <div className="max-w-7xl mx-auto space-y-8 pb-32">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <BasicExample />
            <StreamingExample />
          </div>
          <WordGameExample />
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

function BasicExample() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showJson, setShowJson] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/examples/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Basic Text Generation</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Enter a prompt and see how OpenAI's Response API generates structured output.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Your Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write a haiku about programming..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500"
            rows={4}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Response'
          )}
        </button>
      </form>

      {response && (
        <div className="mt-8 space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Generated Text:</h3>
            <p className="text-green-700 whitespace-pre-wrap">{response.outputText}</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg">
            <button
              onClick={() => setShowJson(!showJson)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors bg-transparent"
            >
              <span className="font-semibold text-gray-700">Full API Response</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${showJson ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showJson && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="rounded-lg overflow-hidden bg-gray-800">
                  <JSONPretty 
                    data={response}
                    theme={{
                      main: 'line-height:1.3;color:#66d9ef;background:transparent;overflow:auto;padding:16px;',
                      error: 'line-height:1.3;color:#66d9ef;background:transparent;overflow:auto;',
                      key: 'color:#f92672;',
                      string: 'color:#a6e22e;',
                      value: 'color:#ae81ff;',
                      boolean: 'color:#ae81ff;',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StreamingExample() {
  const [prompt, setPrompt] = useState('')
  const [streamedText, setStreamedText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setStreamedText('')
    
    try {
      const response = await fetch('/api/examples/create/streaming', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        setStreamedText(prev => prev + chunk)
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-full p-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m5 0v16l-2-1-2 1-2-1-2 1-2-1-2 1V4h12z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Streaming Text Generation</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Watch the AI response stream in real-time, token by token.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="streaming-prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Your Prompt
          </label>
          <textarea
            id="streaming-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tell me a short story about a robot learning to paint..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-gray-900 placeholder-gray-500"
            rows={4}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-gradient-to-r from-orange-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Streaming...
            </span>
          ) : (
            'Start Streaming'
          )}
        </button>
      </form>

      {(streamedText || loading) && (
        <div className="mt-8">
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg min-h-[100px]">
            <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <span>Streamed Response:</span>
              {loading && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </h3>
            <div className="text-orange-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {streamedText}
              {loading && <span className="inline-block w-2 h-5 bg-orange-500 ml-1 animate-pulse"></span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function WordGameExample() {
  const [sentence, setSentence] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState('')
  const [loading, setLoading] = useState(false)
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null)
  const [lastResponse, setLastResponse] = useState<any>(null)
  const [showJson, setShowJson] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentWord.trim()) return

    setLoading(true)
    
    try {
      const response = await fetch('/api/examples/create/stored', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          word: currentWord.trim(), 
          previous_response_id: previousResponseId 
        }),
      })
      const data = await response.json()
      
      setSentence(prev => [...prev, currentWord.trim(), data.word])
      setPreviousResponseId(data.previous_response_id)
      setLastResponse(data)
      setCurrentWord('')
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const resetGame = () => {
    setSentence([])
    setCurrentWord('')
    setPreviousResponseId(null)
    setLastResponse(null)
    setShowJson(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Interactive Word Game</h2>
        </div>
        
        {sentence.length > 0 && (
          <button
            onClick={resetGame}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
          >
            Reset Game
          </button>
        )}
      </div>
      
      <p className="text-gray-600 mb-6">
        Build a story one word at a time with the AI. You add a word, then the AI adds a word. Watch the story unfold!
      </p>

      {previousResponseId && (
        <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="text-sm font-medium text-indigo-800">
            Previous Response ID: <span className="font-mono text-indigo-600">{previousResponseId}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {sentence.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Story So Far:</h3>
            <div className="text-lg leading-relaxed">
              {sentence.map((word, index) => (
                <span
                  key={index}
                  className={`mr-2 px-2 py-1 rounded ${
                    index % 2 === 0 
                      ? 'bg-blue-100 text-blue-800' // User words
                      : 'bg-purple-100 text-purple-800' // AI words
                  }`}
                >
                  {word}
                </span>
              ))}
              {loading && (
                <span className="inline-flex items-center gap-2 ml-2 text-gray-500">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI is thinking...
                </span>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="word-input" className="block text-sm font-medium text-gray-700 mb-2">
              {sentence.length === 0 ? 'Start the story with your first word:' : 'Add your next word:'}
            </label>
            <div className="flex gap-3">
              <input
                id="word-input"
                type="text"
                value={currentWord}
                onChange={(e) => setCurrentWord(e.target.value)}
                placeholder={sentence.length === 0 ? "Once..." : "..."}
                className="flex-1 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !currentWord.trim()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Waiting...' : 'Add Word'}
              </button>
            </div>
          </div>
        </form>

        {lastResponse && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg">
            <button
              onClick={() => setShowJson(!showJson)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors bg-transparent"
            >
              <span className="font-semibold text-gray-700">Latest API Response</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${showJson ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showJson && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="rounded-lg overflow-hidden bg-gray-800">
                  <JSONPretty 
                    data={lastResponse}
                    theme={{
                      main: 'line-height:1.3;color:#66d9ef;background:transparent;overflow:auto;padding:16px;',
                      error: 'line-height:1.3;color:#66d9ef;background:transparent;overflow:auto;',
                      key: 'color:#f92672;',
                      string: 'color:#a6e22e;',
                      value: 'color:#ae81ff;',
                      boolean: 'color:#ae81ff;',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6 px-6 sticky bottom-0">
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-gray-600 mb-2">
          Built with 🧡 on{' '}
          <a 
            href="https://workers.cloudflare.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-600 hover:text-orange-700 font-medium underline decoration-dotted underline-offset-2 hover:underline-offset-4 transition-all"
          >
            Cloudflare Workers
          </a>
          {' '}&& {' '}
          <a 
            href="https://developers.cloudflare.com/workers-ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium underline decoration-dotted underline-offset-2 hover:underline-offset-4 transition-all"
          >
            Workers AI
          </a>
          {' '}&& {' '}
          <a 
            href="https://platform.openai.com/docs/api-reference/responses" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 font-medium underline decoration-dotted underline-offset-2 hover:underline-offset-4 transition-all"
          >
            OpenAI Responses API
          </a>
        </div>
        <div className="text-gray-500 text-sm">
          👀{' '}
          <a 
            href="https://github.com/anthropics/responsible" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 font-medium underline decoration-dotted underline-offset-2 hover:underline-offset-4 transition-all"
          >
            the code
          </a>
        </div>
      </div>
    </footer>
  )
}

export default App
