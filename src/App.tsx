import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { DailyLessons } from './pages/DailyLessons';
import { AnnualPlan } from './pages/AnnualPlan';
import { DidacticSequence } from './pages/DidacticSequence';
import { Assessments } from './pages/Assessments';
import { Reports } from './pages/Reports';
import { Library } from './pages/Library';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="daily-lessons" element={<DailyLessons />} />
          <Route path="annual-plan" element={<AnnualPlan />} />
          <Route path="didactic-sequence" element={<DidacticSequence />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="library" element={<Library />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
