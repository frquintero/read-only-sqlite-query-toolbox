# Read-Only SQLite Query Toolbox

A web-based tool for interacting with SQLite databases in the browser. Upload SQLite database files, explore schemas, run read-only SELECT queries, and use AI assistance to generate SQL from natural language.

## Features

- **Database Upload**: Load SQLite database files directly in the browser
- **Schema Exploration**: View table structures and column details
- **Query Execution**: Run read-only SELECT queries safely
- **AI-Powered SQL Generation**: Convert natural language questions to SQL queries using Google Gemini AI
- **Result Visualization**: Display query results in an interactive table format
- **Project Verification**: Built-in checklist for development workflow tracking

## Prerequisites

- Node.js (v14 or higher)
- Google Gemini API key (for natural language to SQL conversion)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/frquintero/read-only-sqlite-query-toolbox.git
   cd read-only-sqlite-query-toolbox
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```

   > **Note:** Replace `your_gemini_api_key_here` with your actual Google Gemini API key. The `VITE_` prefix ensures it's exposed to the client-side code.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Usage

1. **Upload a Database**: Click the file uploader to select a `.db` or `.sqlite` file
2. **View Schema**: The left panel will display all tables and their columns
3. **Run Queries**:
   - Write SQL directly in the query editor
   - Or use natural language: "Show me all customers from New York"
4. **View Results**: Query results appear in a table below the editor

## Security

- Only read-only SELECT queries are allowed
- All processing happens locally in the browser
- Database files are not uploaded to any server

## Technologies

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **SQL.js** - SQLite database engine in WebAssembly
- **Google Generative AI** - Natural language to SQL conversion
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
