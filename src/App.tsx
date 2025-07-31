import { useState } from 'react'
import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            Responsible
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn how to use OpenAI's Response API through interactive examples
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <BasicExample />
        </div>
      </div>
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
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
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
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
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
              <div className="border-t border-gray-200 p-4">
                <div className="rounded-lg overflow-hidden">
                  <JSONPretty 
                    data={response}
                    theme={{
                      main: 'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
                      error: 'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
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

export default App
