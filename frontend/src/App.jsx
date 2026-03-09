import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";


const App = () => {
  const [isDark, setIsDark] = useState(false); // GLOBAL STATE

  return (
    <Router>

        <Routes>
          hello world
        </Routes>
    
    </Router>
  );
};

export default App;
