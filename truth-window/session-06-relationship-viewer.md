# Session 06: Relationship Viewer with Structured Output

## What You Asked For

> Great! Now for the next one. I want to add a new demo that shows off Structured Output. What I'd like to do is create a relationship viewer. You give it a chunk of text and the relationships are shown. I've built the backend api at /api/examples/parse/relationships and it returns edges and nodes. Rumor has it that Cytoscape makes it easy to display things this way. Also, since I figure people might have a hard time coming up with ideas let's add a little helper to this demo that let's the user enter a "title" of content that we can use to POST to /api/examples/create/character-sample to get a character synopsis of a show or book first. This should populate the text field with the response. So again text field talks about characters and relationships, API returns edges and nodes, front-end displays the graph. make sense?

## What I Implemented

### 1. **RelationshipViewer Component**
- **Indigo/purple gradient theme** with link icon for visual distinction
- **Two-step workflow** with clear instructional design
- **Full-width layout** for comprehensive graph visualization
- **Professional UI/UX** with step-by-step guidance

#### Key Features:
- **Character Sample Helper** - Optional content generation tool
- **Structured Output Analysis** - Text to graph conversion
- **Interactive Graph Visualization** - Cytoscape.js implementation
- **Collapsible JSON Viewer** - Educational structured output display

### 2. **Two-Step User Workflow**

#### Step 1: Character Sample Generation (Optional)
- **Title input field** for books, movies, or TV shows
- **API integration** with `/api/examples/create/character-sample`
- **Auto-population** of main text field with generated content
- **Loading states** with "Generating..." feedback

#### Step 2: Relationship Analysis (Required)
- **Large textarea** for character relationship descriptions
- **API integration** with `/api/examples/parse/relationships`
- **Structured output parsing** with JSON schema validation
- **Loading states** with "Analyzing..." feedback

### 3. **Interactive Graph Visualization**

#### Cytoscape.js Implementation:
- **Installed Cytoscape** dependency for graph rendering
- **400px height container** with responsive width
- **Animated COSE layout** for natural node positioning
- **Professional node styling** with indigo color scheme

#### Relationship Type Color Coding:
- **Family**: Red (#ef4444)
- **Romantic**: Pink (#ec4899)
- **Friend**: Green (#10b981)
- **Professional**: Blue (#3b82f6)
- **Antagonist**: Dark Red (#dc2626)
- **Other**: Gray (#6b7280)

#### Graph Features:
- **Directed edges** with arrows and labels
- **Node labels** showing character names with improved text wrapping
- **Curved edges** with bezier styling
- **Auto-rotating edge labels** for readability
- **Color legend** for relationship type identification
- **Compact text styling** with 10px font size and text wrapping for better fit

### 4. **Technical Implementation Details**

#### Structured Output Schema:
```typescript
{
  nodes: Array<{
    id: string,        // Machine-friendly identifier
    label: string      // Human-readable name
  }>,
  edges: Array<{
    source: string,    // Source node ID
    target: string,    // Target node ID
    label: string,     // Relationship description
    type: enum         // Categorized relationship type
  }>
}
```

#### React Hooks Usage:
- **useState** for component state management
- **useEffect** for graph rendering lifecycle
- **useRef** for DOM element and Cytoscape instance references

#### API Integration:
```typescript
// Character sample generation
POST /api/examples/create/character-sample
{ title: string } → { outputText: string }

// Relationship parsing
POST /api/examples/parse/relationships  
{ text: string } → { nodes: [], edges: [] }
```

### 5. **Educational Value**

#### Demonstrates Structured Output:
- **JSON Schema validation** for consistent data structure
- **Enumerated relationship types** for categorization
- **Machine-readable IDs** with human-readable labels
- **Complex data visualization** from unstructured text

#### API Pattern Examples:
- **Content generation** with contextual instructions
- **Structured parsing** with JSON schema constraints
- **Data transformation** from text to graph format
- **Multi-step workflows** with dependent API calls

## Visual Design Elements

### Color Scheme:
- **Indigo/purple gradients** for buttons and accents
- **Step-based organization** with clear visual hierarchy
- **Color-coded relationships** for intuitive understanding
- **Professional graph styling** with consistent theming

### Layout Strategy:
- **Full-width prominence** for complex visualization
- **Sequential step design** with optional first step
- **Expandable sections** for detailed information
- **Responsive graph container** with fixed height

## Key Files Modified

- `src/App.tsx` - Added RelationshipViewer component with Cytoscape integration
- `package.json` - Added cytoscape dependency for graph visualization
- Layout includes full-width relationship analysis below existing examples

## Result

A comprehensive educational app showcasing six distinct OpenAI Response API patterns:

1. **BasicExample** - Standard text generation
2. **StreamingExample** - Real-time token streaming  
3. **WordGameExample** - Conversation continuity with stored responses
4. **CodeInterpreterExample** - Code execution for analysis
5. **FunctionCallingExample** - Structured data extraction and function execution
6. **RelationshipViewer** - Structured output with graph visualization

### New Capabilities Demonstrated:
- **Structured Output** with JSON schema validation
- **Complex data visualization** using Cytoscape.js
- **Multi-step workflows** with helper functions
- **Graph theory concepts** applied to relationship mapping
- **Professional data visualization** techniques

The app now provides complete educational coverage of OpenAI Response API capabilities, from basic text generation to advanced structured output with complex visualizations, making it a comprehensive resource for developers learning modern AI API integration patterns.