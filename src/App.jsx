// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuizEditor from './pages/QuizEditor';
import QuizList from './pages/QuizList';
import QuizTake from './pages/QuizTake';
import QuizResult from './pages/QuizResult';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/quiz/editor" element={<QuizEditor />} />
        
        <Route path="/quiz/list" element={<QuizList />} />
        <Route path="/quiz/take/:id" element={<QuizTake />} />
        <Route path="/quiz/result/:id" element={<QuizResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;