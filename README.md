# IQode - Interactive Technical Quiz Platform

IQode is a modern, feature-rich quiz application designed for developers to test their knowledge, challenge peers, and share their own quizzes. Built with React and Firebase, it offers a seamless and engaging experience for learning and assessment.

## 🚀 Features

### 🎓 Quiz Experience
- **Diverse Categories**: Test your skills in JavaScript, React, HTML/CSS, DSA, Backend, Python, DevOps, Cloud, Mobile, and Databases.
- **Two Quiz Types**:
  - **Built-in Quizzes**: Curated selection of questions for each category.
  - **Community Quizzes**: User-created quizzes approved by admins.
- **Interactive Interface**: Timer-based quizzes with immediate feedback and detailed explanations.
- **Search System**: Find quizzes by title, category, or tags.

### 🛠️ Content Creation
- **Quiz Creator**: Intuitive interface for users to create their own quizzes.
- **Rich Comparisons**: Support for multiple-choice and true/false questions.
- **Customization**: Set difficulty levels, time limits, and tags.

### 👤 User Features
- **Profile System**: Track your progress, total score, and quiz history.
- **Gamification**: Earn XP, level up, and compete on the global leaderboard.
- **Authentication**: Secure login/signup via Email/Password or Google Sign-In.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing.

### 🛡️ Administration
- **Admin Panel**: Dedicated dashboard for admins to review, approve, or reject user-submitted quizzes.
- **Content Management**: Ensure quality control of community content.

## 💻 Tech Stack

- **Frontend**: React 19, Vite, React Router 7
- **Backend & Database**: Firebase Authentication, Firebase Firestore
- **Styling**: Modern CSS3 with responsive design variables
- **State Management**: React Context API

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/iqode.git
   cd iqode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a project in [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password, Google).
   - Enable Firestore Database.
   - Create a file named `src/firebase/config.js` (or use existing env setup) with your firebase config:
     ```javascript
     import { initializeApp } from "firebase/app";
     // ... other imports

     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };

     // ... export app, auth, db
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📝 Usage

- **Take a Quiz**: Navigate to Home, select a category or search for a topic, and click "Take Quiz".
- **Create a Quiz**: Go to "My Quizzes" and click "Create New Quiz". Submit it for admin approval.
- **Admin Review**: (If Admin) Go to the Admin Panel to approve submitted quizzes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
