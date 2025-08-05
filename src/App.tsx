import { useState, useEffect, useRef } from 'react'
import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'
import Markdown from 'markdown-to-jsx'
import cytoscape from 'cytoscape'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 w-full px-6 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            Responsible
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn how to use <a href="https://platform.openai.com/docs/api-reference/responses" target="_blank">OpenAI's Responses API</a> through interactive examples
          </p>
        </header>

        <div className="max-w-7xl mx-auto space-y-8 pb-32">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <BasicExample />
            <StreamingExample />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <WordGameExample />
            <CodeInterpreterExample />
          </div>
          <ReasoningExample />
          <FunctionCallingExample />
          <RelationshipViewer />
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
        Enter a prompt and see how OpenAI's Response API creates a new Response object.
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
            <div className="text-lg leading-relaxed flex flex-wrap gap-2">
              {sentence.map((word, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded inline-block ${
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

function CodeInterpreterExample() {
  const [story, setStory] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showJson, setShowJson] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!story.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/examples/create/code-interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story }),
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full p-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Code Interpreter Analysis</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Tell a story about time spent working, and AI will calculate your minimum wage earnings using code interpretation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-2">
            Your Story
          </label>
          <textarea
            id="story"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="I worked on my project for 3 hours yesterday, then spent another 2 hours debugging today..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-gray-900 placeholder-gray-500"
            rows={4}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !story.trim()}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating...
            </span>
          ) : (
            'Calculate Wages'
          )}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-4">
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
            <h3 className="font-semibold text-teal-800 mb-2">Wage Analysis:</h3>
            <p className="text-teal-700 whitespace-pre-wrap">{result.outputText}</p>
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
                    data={result}
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

function ReasoningExample() {
  const [topic, setTopic] = useState('')
  const [effort, setEffort] = useState<'low' | 'medium' | 'high'>('medium')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showJson, setShowJson] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/examples/create/reasoning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, effort }),
      })
      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-violet-400 to-rose-500 rounded-full p-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Reasoning Lesson Plan</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Generate a detailed lesson plan for any topic with customizable effort levels using AI reasoning.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'Introduction to Machine Learning'"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label htmlFor="effort" className="block text-sm font-medium text-gray-700 mb-2">
            Effort Level
          </label>
          <select
            id="effort"
            value={effort}
            onChange={(e) => setEffort(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900"
          >
            <option value="low">Low - Basic overview with key points</option>
            <option value="medium">Medium - Detailed plan with activities</option>
            <option value="high">High - Comprehensive plan with assessments</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="bg-gradient-to-r from-violet-600 to-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:from-violet-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Lesson Plan...
            </span>
          ) : (
            'Generate Lesson Plan'
          )}
        </button>
      </form>

      {response && (
        <div className="mt-8 space-y-4">
          <div className="bg-violet-50 border border-violet-200 p-4 rounded-lg">
            <h3 className="font-semibold text-violet-800 mb-2">Lesson Plan:</h3>
            <div className="text-violet-700 prose prose-sm max-w-none">
              <Markdown>{response.outputText}</Markdown>
            </div>
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

function FunctionCallingExample() {
  const [feedback, setFeedback] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showFirstResponse, setShowFirstResponse] = useState(false)
  const [showFinalResponse, setShowFinalResponse] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/examples/create/function-calling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-full p-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Function Calling Demo</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Submit feedback about this demo and watch AI extract structured data and call functions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
            Your Feedback
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="I really loved the streaming example! It was super cool to see the text appear in real-time. The UI could be a bit more colorful though. I'd rate this demo an 8 out of 10!"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-gray-900 placeholder-gray-500"
            rows={4}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !feedback.trim()}
          className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
            <h3 className="font-semibold text-emerald-800 mb-2">Response:</h3>
            <p className="text-emerald-700 whitespace-pre-wrap">{result.outputText}</p>
          </div>

          {result.result && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Function Call Result:</h3>
              <div className="text-blue-700 text-sm space-y-1">
                <div><strong>Success:</strong> {result.result.success ? 'Yes' : 'No'}</div>
                <div><strong>Assigned To:</strong> {result.result.assignee}</div>
                <div><strong>Submission ID:</strong> <span className="font-mono">{result.result.submissionId}</span></div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg">
              <button
                onClick={() => setShowFirstResponse(!showFirstResponse)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors bg-transparent"
              >
                <span className="font-semibold text-gray-700">First API Response (Function Call)</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${showFirstResponse ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showFirstResponse && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="rounded-lg overflow-hidden bg-gray-800">
                    <JSONPretty 
                      data={result.firstResponse}
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

            <div className="bg-gray-50 border border-gray-200 rounded-lg">
              <button
                onClick={() => setShowFinalResponse(!showFinalResponse)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors bg-transparent"
              >
                <span className="font-semibold text-gray-700">Final API Response (After Function)</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${showFinalResponse ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showFinalResponse && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="rounded-lg overflow-hidden bg-gray-800">
                    <JSONPretty 
                      data={result.finalResponse}
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
        </div>
      )}
    </div>
  )
}

function RelationshipViewer() {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [relationships, setRelationships] = useState<any>(null)
  const [loadingSample, setLoadingSample] = useState(false)
  const [loadingGraph, setLoadingGraph] = useState(false)
  const [showJson, setShowJson] = useState(false)
  const cyRef = useRef<HTMLDivElement>(null)
  const cyInstance = useRef<any>(null)

  const generateSample = async () => {
    if (!title.trim()) return

    setLoadingSample(true)
    try {
      const res = await fetch('/api/examples/create/character-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })
      const data = await res.json()
      setText(data.outputText)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoadingSample(false)
  }

  const analyzeRelationships = async () => {
    if (!text.trim()) return

    setLoadingGraph(true)
    try {
      const res = await fetch('/api/examples/parse/relationships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      setRelationships(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoadingGraph(false)
  }

  useEffect(() => {
    if (relationships && cyRef.current) {
      if (cyInstance.current) {
        cyInstance.current.destroy()
      }

      const nodes = relationships.nodes.map((node: any) => ({
        data: { id: node.id, label: node.label }
      }))

      const edges = relationships.edges.map((edge: any, index: number) => ({
        data: {
          id: `edge-${index}`,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: edge.type
        }
      }))

      cyInstance.current = cytoscape({
        container: cyRef.current,
        elements: [...nodes, ...edges],
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#4f46e5',
              'label': 'data(label)',
              'color': '#ffffff',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': '10px',
              'font-weight': 'bold',
              'font-family': 'system-ui, -apple-system, sans-serif',
              'text-wrap': 'wrap',
              'text-max-width': '50px',
              'width': '60px',
              'height': '60px',
              'border-width': '2px',
              'border-color': '#3730a3',
              'text-outline-width': '1px',
              'text-outline-color': '#3730a3',
              'text-outline-opacity': 0.8
            }
          },
          {
            selector: 'edge',
            style: {
              'line-color': (ele: cytoscape.EdgeSingular) => {
                const type = ele.data('type')
                switch (type) {
                  case 'family': return '#ef4444'
                  case 'romantic': return '#ec4899'
                  case 'friend': return '#10b981'
                  case 'professional': return '#3b82f6'
                  case 'antagonist': return '#dc2626'
                  default: return '#6b7280'
                }
              },
              'target-arrow-color': (ele: cytoscape.EdgeSingular) => {
                const type = ele.data('type')
                switch (type) {
                  case 'family': return '#ef4444'
                  case 'romantic': return '#ec4899'
                  case 'friend': return '#10b981'
                  case 'professional': return '#3b82f6'
                  case 'antagonist': return '#dc2626'
                  default: return '#6b7280'
                }
              },
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': '10px',
              'text-rotation': 'autorotate',
              'text-margin-y': -10,
              'width': '3px'
            }
          }
        ],
        layout: {
          name: 'cose',
          animate: true,
          animationDuration: 1000,
          nodeOverlap: 20,
          idealEdgeLength: 100,
          edgeElasticity: 100,
          nestingFactor: 5,
          gravity: 80,
          numIter: 1000,
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1.0
        }
      })
    }
  }, [relationships])

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full p-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Relationship Viewer</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Generate character relationships from text and visualize them as an interactive graph using structured output.
      </p>

      <div className="space-y-6">
        {/* Character Sample Helper */}
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
          <h3 className="font-semibold text-indigo-800 mb-3">Step 1: Generate Character Sample (Optional)</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a book, movie, or show title (e.g., 'Game of Thrones')"
              className="flex-1 p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={generateSample}
              disabled={loadingSample || !title.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              {loadingSample ? 'Generating...' : 'Generate Sample'}
            </button>
          </div>
        </div>

        {/* Main Text Input */}
        <div>
          <label htmlFor="relationship-text" className="block text-sm font-medium text-gray-700 mb-2">
            Step 2: Character Relationship Text
          </label>
          <textarea
            id="relationship-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe characters and their relationships. For example: 'Jon Snow is the bastard son of Ned Stark. He joins the Night's Watch and becomes friends with Samwell Tarly. Daenerys Targaryen is his aunt and they have a romantic relationship...'"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-900 placeholder-gray-500"
            rows={6}
          />
        </div>
        
        <button
          onClick={analyzeRelationships}
          disabled={loadingGraph || !text.trim()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loadingGraph ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze Relationships'
          )}
        </button>

        {relationships && (
          <div className="space-y-4">
            {/* Graph Visualization */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Relationship Graph:</h3>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div ref={cyRef} style={{ width: '100%', height: '400px' }}></div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                <div className="flex flex-wrap gap-4">
                  <span><span className="inline-block w-3 h-3 bg-red-500 rounded mr-1"></span>Family</span>
                  <span><span className="inline-block w-3 h-3 bg-pink-500 rounded mr-1"></span>Romantic</span>
                  <span><span className="inline-block w-3 h-3 bg-green-500 rounded mr-1"></span>Friend</span>
                  <span><span className="inline-block w-3 h-3 bg-blue-500 rounded mr-1"></span>Professional</span>
                  <span><span className="inline-block w-3 h-3 bg-red-600 rounded mr-1"></span>Antagonist</span>
                  <span><span className="inline-block w-3 h-3 bg-gray-500 rounded mr-1"></span>Other</span>
                </div>
              </div>
            </div>

            {/* JSON Viewer */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg">
              <button
                onClick={() => setShowJson(!showJson)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors bg-transparent"
              >
                <span className="font-semibold text-gray-700">Structured Output (Nodes & Edges)</span>
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
                      data={relationships}
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
    </div>
  )
}

function Footer() {
  return (
    <footer className="w-full bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6 px-6 sticky bottom-0">
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-gray-600 mb-2">
          Built with 🧡 on{' '}
          <a 
            href="https://developers.cloudflare.com" 
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
            href="https://github.com/craigsdennis/responses-api-workers" 
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
