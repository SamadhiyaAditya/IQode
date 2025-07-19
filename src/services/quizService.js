const mockQuestions = {
  javascript: [
    {
      id: "js1",
      text: "What is the output of: console.log(typeof NaN)?",
      options: ["undefined", "object", "number", "NaN"],
      correctAnswer: "number",
      difficulty: "medium",
      tags: ["typeof", "NaN", "data-types"],
    },
    {
      id: "js2",
      text: "Which method is used to add an element to the end of an array?",
      options: ["push()", "pop()", "unshift()", "shift()"],
      correctAnswer: "push()",
      difficulty: "easy",
      tags: ["arrays", "methods"],
    },
    {
      id: "js3",
      text: "What does the '===' operator do?",
      options: ["Compares values only", "Compares types only", "Compares both value and type", "None of the above"],
      correctAnswer: "Compares both value and type",
      difficulty: "easy",
      tags: ["operators", "comparison"],
    },
    {
      id: "js4",
      text: "Which of the following is not a JavaScript data type?",
      options: ["string", "boolean", "float", "undefined"],
      correctAnswer: "float",
      difficulty: "easy",
      tags: ["data-types"],
    },
    {
      id: "js5",
      text: "What is a closure in JavaScript?",
      options: [
        "A way to secure your code",
        "A function that has access to variables in its outer scope",
        "A method to close browser windows",
        "A way to end a loop",
      ],
      correctAnswer: "A function that has access to variables in its outer scope",
      difficulty: "hard",
      tags: ["closures", "scope", "functions"],
    },
    {
      id: "js6",
      text: "What will console.log(0.1 + 0.2 === 0.3) output?",
      options: ["true", "false", "undefined", "NaN"],
      correctAnswer: "false",
      difficulty: "medium",
      tags: ["floating-point", "precision"],
    },
    {
      id: "js7",
      text: "Which keyword is used to declare a block-scoped variable?",
      options: ["var", "let", "const", "function"],
      correctAnswer: "let",
      difficulty: "easy",
      tags: ["variables", "scope", "ES6"],
    },
    {
      id: "js8",
      text: "What is the result of: [1, 2, 3].map(x => x * 2)?",
      options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "6"],
      correctAnswer: "[2, 4, 6]",
      difficulty: "medium",
      tags: ["arrays", "map", "higher-order-functions"],
    },
  ],
  react: [
    {
      id: "react1",
      text: "What is JSX?",
      options: [
        "A JavaScript library",
        "A syntax extension for JavaScript that looks like HTML",
        "A new programming language",
        "A database query language",
      ],
      correctAnswer: "A syntax extension for JavaScript that looks like HTML",
      difficulty: "easy",
      tags: ["JSX", "syntax"],
    },
    {
      id: "react2",
      text: "Which hook is used to perform side effects in a function component?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correctAnswer: "useEffect",
      difficulty: "easy",
      tags: ["hooks", "useEffect", "side-effects"],
    },
    {
      id: "react3",
      text: "What is the virtual DOM?",
      options: [
        "A lightweight copy of the actual DOM",
        "A new browser feature",
        "A type of component",
        "A JavaScript library",
      ],
      correctAnswer: "A lightweight copy of the actual DOM",
      difficulty: "medium",
      tags: ["virtual-dom", "performance"],
    },
    {
      id: "react4",
      text: "Which of the following is NOT a React Hook?",
      options: ["useState", "useEffect", "useHistory", "useCallback"],
      correctAnswer: "useHistory",
      difficulty: "medium",
      tags: ["hooks", "react-router"],
    },
    {
      id: "react5",
      text: "What is the purpose of React.memo?",
      options: [
        "To create a memoized version of a component",
        "To remember user input",
        "To store data in local storage",
        "To create a new component",
      ],
      correctAnswer: "To create a memoized version of a component",
      difficulty: "hard",
      tags: ["memo", "optimization", "performance"],
    },
  ],
  "htmlcss": [
    {
      id: "html1",
      text: "Which HTML tag is used to create a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      correctAnswer: "<a>",
      difficulty: "easy",
      tags: ["HTML", "links"],
    },
    {
      id: "html2",
      text: "Which CSS property is used to change the text color?",
      options: ["text-color", "font-color", "color", "text-style"],
      correctAnswer: "color",
      difficulty: "easy",
      tags: ["CSS", "text", "color"],
    },
    {
      id: "html3",
      text: "What does CSS stand for?",
      options: ["Creative Style Sheets", "Computer Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
      correctAnswer: "Cascading Style Sheets",
      difficulty: "easy",
      tags: ["CSS", "acronym"],
    },
    {
      id: "html4",
      text: "Which HTML attribute is used to define inline styles?",
      options: ["class", "styles", "style", "font"],
      correctAnswer: "style",
      difficulty: "easy",
      tags: ["HTML", "attributes", "inline-styles"],
    },
    {
      id: "html5",
      text: "Which CSS property is used to make text bold?",
      options: ["font-weight", "text-weight", "bold", "text-style"],
      correctAnswer: "font-weight",
      difficulty: "easy",
      tags: ["CSS", "font", "text-formatting"],
    },
  ],
  dsa: [
    {
      id: "dsa1",
      text: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
      correctAnswer: "O(log n)",
      difficulty: "medium",
      tags: ["binary-search", "time-complexity"],
    },
    {
      id: "dsa2",
      text: "Which data structure follows the LIFO principle?",
      options: ["Queue", "Stack", "Linked List", "Tree"],
      correctAnswer: "Stack",
      difficulty: "easy",
      tags: ["stack", "LIFO", "data-structures"],
    },
    {
      id: "dsa3",
      text: "What is the worst-case time complexity of quicksort?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
      correctAnswer: "O(n²)",
      difficulty: "hard",
      tags: ["quicksort", "time-complexity", "sorting"],
    },
    {
      id: "dsa4",
      text: "Which of the following is not a sorting algorithm?",
      options: ["Bubble Sort", "Merge Sort", "Binary Sort", "Insertion Sort"],
      correctAnswer: "Binary Sort",
      difficulty: "easy",
      tags: ["sorting", "algorithms"],
    },
    {
      id: "dsa5",
      text: "What data structure would you use to implement a priority queue?",
      options: ["Array", "Linked List", "Heap", "Stack"],
      correctAnswer: "Heap",
      difficulty: "medium",
      tags: ["heap", "priority-queue", "data-structures"],
    },
  ],
  backend: [
    {
      id: "backend1",
      text: "What is REST in the context of APIs?",
      options: [
        "Remote Execution Service Technology",
        "Representational State Transfer",
        "Reactive Element State Transfer",
        "Remote Element Service Technology",
      ],
      correctAnswer: "Representational State Transfer",
      difficulty: "medium",
      tags: ["REST", "API", "web-services"],
    },
    {
      id: "backend2",
      text: "Which HTTP method is used to update a resource?",
      options: ["GET", "POST", "PUT", "DELETE"],
      correctAnswer: "PUT",
      difficulty: "easy",
      tags: ["HTTP", "methods", "REST"],
    },
    {
      id: "backend3",
      text: "What is a middleware in Express.js?",
      options: [
        "A database connector",
        "A function that has access to the request and response objects",
        "A front-end framework",
        "A type of database",
      ],
      correctAnswer: "A function that has access to the request and response objects",
      difficulty: "medium",
      tags: ["Express.js", "middleware", "Node.js"],
    },
    {
      id: "backend4",
      text: "Which of the following is NOT a NoSQL database?",
      options: ["MongoDB", "Cassandra", "PostgreSQL", "Redis"],
      correctAnswer: "PostgreSQL",
      difficulty: "easy",
      tags: ["databases", "NoSQL", "SQL"],
    },
    {
      id: "backend5",
      text: "What is the purpose of JWT (JSON Web Tokens)?",
      options: [
        "To encrypt database connections",
        "To securely transmit information between parties",
        "To format JSON data",
        "To compress data for faster transmission",
      ],
      correctAnswer: "To securely transmit information between parties",
      difficulty: "medium",
      tags: ["JWT", "authentication", "security"],
    },
  ],
  coding: [
    {
      id: "coding1",
      text: "What is the Big O notation for a simple for loop?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: "O(n)",
      difficulty: "easy",
      tags: ["big-o", "complexity", "loops"],
    },
    {
      id: "coding2",
      text: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
      correctAnswer: "Merge Sort",
      difficulty: "medium",
      tags: ["sorting", "algorithms", "complexity"],
    },
  ],
}

export const getQuizQuestions = async (category, difficulty = null, limit = 10) => {
  try {
    console.log(`Loading questions for category: ${category}`)

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get questions for the category
    const formattedCategory = category.toLowerCase()
    let categoryQuestions = mockQuestions[formattedCategory] || []

    console.log(`Found ${categoryQuestions.length} questions for ${formattedCategory}`)

    // no questions found, empty array
    if (categoryQuestions.length === 0) {
      console.warn(`No questions found for category: ${category}`)
      return []
    }

    // Filter by difficulty
    if (difficulty) {
      categoryQuestions = categoryQuestions.filter((q) => q.difficulty === difficulty)
    }

    // Shuffle questions for variation
    const shuffled = categoryQuestions.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(limit, shuffled.length))

    console.log(`Returning ${selected.length} questions`)
    return selected
  } catch (error) {
    console.error("Error getting quiz questions:", error)
    throw error
  }
}

export const getAllCategories = async () => {
  try {
    return Object.keys(mockQuestions).map((key) => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/[/_]/g, " "),
      questionCount: mockQuestions[key].length,
      description: getCategoryDescription(key),
      icon: getCategoryIcon(key),
    }))
  } catch (error) {
    console.error("Error getting categories:", error)
    return []
  }
}

const getCategoryDescription = (category) => {
  const descriptions = {
    javascript: "Test your knowledge of JavaScript fundamentals, ES6 features, and more.",
    react: "Challenge yourself with questions about React components, hooks, and state management.",
    "htmlcss": "Prove your skills in HTML5 elements, CSS selectors, and responsive design.",
    dsa: "Tackle questions on data structures, algorithms, and problem-solving techniques.",
    backend: "Test your knowledge of server-side technologies, APIs, and databases.",
    coding: "Solve real coding challenges and test your programming skills.",
  }
  return descriptions[category] || "Test your technical knowledge in this category."
}

const getCategoryIcon = (category) => {
  const icons = {
    javascript: "🟨",
    react: "⚛️",
    "htmlcss": "🎨",
    dsa: "🧮",
    backend: "🖥️",
    coding: "👨‍💻",
  }
  return icons[category] || "📚"
}
