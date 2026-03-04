import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizEditor from "./pages/QuizEditor";
function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<QuizEditor />} />
        </Routes>  
    </BrowserRouter>
  );
}

export default App;
