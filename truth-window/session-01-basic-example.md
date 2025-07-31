# Session 01: Basic Example Implementation

## What You Asked For

> This is an educational app that shows off how to use the OpenAI responses API. It currently has some boilerplate in the src directory. Please get rid of all of that. The app is called Responsible. I'd love to create separate little examples that take inputs and then call APIs. The first one should be a text box and the user will enter a prompt. It will get POSTED to /api/examples/create which is defined in worker/index.ts. I'd love for the response to come back on this one and have it prettified and color coded JSON but collapsed. Show the output text. First example is not streaming...others may. There will be more examples so try and make components where necessary. It is using Tailwind and I'd like a fun feeling educational app.

## What I Implemented

### 1. **Removed Boilerplate**
- Cleared out all existing React boilerplate components
- Cleaned up App.css to work with Tailwind
- Updated root element styling

### 2. **Created Educational App Structure**
- **Main App Component**: Beautiful gradient background with centered layout
- **App Title**: "Responsible" with gradient text effect
- **Educational Description**: Clear subtitle explaining the app's purpose

### 3. **Built BasicExample Component**
- **Interactive Form**: Large textarea for prompt input
- **Loading States**: Animated spinner during API calls
- **Dual Output Display**:
  - Generated text in highlighted green success box
  - Collapsible JSON response viewer

### 4. **Enhanced JSON Display**
- Added `react-json-pretty` library for syntax highlighting
- **Color-coded JSON** with dark Monokai theme:
  - Keys in pink/red
  - Strings in green
  - Values in purple
  - Dark background for readability

### 5. **Design Features**
- **Fun, Educational Feel**: Gradients, rounded corners, shadows
- **Responsive Layout**: Works across different screen sizes
- **Interactive Elements**: Hover effects, smooth transitions
- **Icon Integration**: Lightning bolt icon for the example section

### 6. **API Integration**
- Connected to existing `/api/examples/create` endpoint
- Proper error handling and loading states
- Clean data flow from form submission to display

## Key Files Modified

- `src/App.tsx` - Complete rewrite with educational UI
- `src/App.css` - Simplified for Tailwind integration
- `package.json` - Added react-json-pretty dependency
- `worker/index.ts` - Verified API endpoint structure

## Result

A polished educational app that demonstrates OpenAI's Response API with:
- Clean, modern interface
- Interactive prompt input
- Beautiful JSON syntax highlighting
- Expandable response viewer
- Ready foundation for additional examples