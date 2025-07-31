# Session 05: Function Calling Example

## What You Asked For

> Awesome here we go! I have added a new endpoint called /api/examples/create/function-calling. It will return back the output text and example responses. I'd like to show them in collapsible API Views too. This also returns the result from the function call, let's show that informationally. Let's make a new demo. It accepts feedback and then submits it. POST `feedback` to it and then it gives a contextual response.

## What I Implemented

### 1. **FunctionCallingExample Component**
- **Emerald/green gradient theme** with checkmark icon for visual distinction
- **Feedback submission system** demonstrating function calling capabilities
- **Full-width layout** positioned prominently below the 2x2 grid
- **Three-tier result display** with comprehensive information presentation

#### Key Features:
- **Feedback textarea** with contextual placeholder showing example input
- **AI-powered data extraction** from unstructured feedback text
- **Function execution** with structured parameter passing
- **Loading states** with "Processing..." spinner during API calls

### 2. **Advanced Response Display System**
- **Main Response Display** - AI's contextual feedback confirmation
- **Function Call Result Box** - Structured information from function execution:
  - Success status indicator
  - Assigned team member
  - Unique submission ID (UUID format)
- **Dual Collapsible API Viewers**:
  - First API Response (Function Call)
  - Final API Response (After Function)

### 3. **Complete Function Calling Workflow**
Demonstrates the full OpenAI function calling process:

1. **User Input**: Unstructured feedback text
2. **AI Extraction**: Parses NPS score, positives, and improvements
3. **Function Execution**: Calls `submitFeedback` with structured parameters
4. **Context Integration**: AI uses function result for final response
5. **User Confirmation**: Contextual response with submission details

## Technical Implementation Details

### Frontend Integration:
```typescript
const res = await fetch('/api/examples/create/function-calling', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ feedback }),
})
```

### Backend Function Calling:
- **Strict mode function definition** with typed parameters
- **Two-step API process**: Initial function call → Function execution → Final response
- **Function result integration** back into conversation context
- **Structured data extraction** from natural language

### Function Schema:
```typescript
{
  nps: number,           // 0-10 recommendation score
  whatWorked: string,    // Positive feedback
  whatCouldBeImproved: string  // Improvement suggestions
}
```

### Response Structure:
- `firstResponse` - Contains the function call details
- `finalResponse` - AI's contextual response using function results
- `outputText` - Final user-facing message
- `result` - Actual function execution result

## Visual Design Elements

### Color Scheme:
- **Emerald/green gradients** for buttons and accents
- **Blue information boxes** for function call results
- **Green success boxes** for main responses
- **Consistent dark JSON themes** for API viewers

### Layout Strategy:
- **Full-width component** for emphasis and completeness
- **Hierarchical information display** with clear visual separation
- **Progressive disclosure** through collapsible sections
- **Responsive design** maintaining functionality across screen sizes

## Educational Value

This example demonstrates:
- **Function calling mechanics** in OpenAI's Response API
- **Structured data extraction** from natural language
- **Multi-step API workflows** with context preservation
- **Real-world application** of AI function integration
- **Complete development cycle** from user input to system response

## Key Files Modified

- `src/App.tsx` - Added FunctionCallingExample component and full-width layout
- Layout now features 2x2 grid plus prominent function calling demonstration

## Result

A comprehensive educational app showcasing five distinct OpenAI Response API patterns:

1. **BasicExample** - Standard text generation
2. **StreamingExample** - Real-time token streaming
3. **WordGameExample** - Conversation continuity with stored responses
4. **CodeInterpreterExample** - Code execution for analysis
5. **FunctionCallingExample** - Structured data extraction and function execution

The app now provides complete coverage of OpenAI Response API capabilities, from basic text generation to advanced function calling and system integration, making it a comprehensive educational resource for developers learning the API.