import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';

// Guide Pages
import GuideMain from './pages/Guide/GuideMain';
import GuidePreference from './pages/Guide/GuidePreference';
import AddPreference from './pages/Guide/AddPreference';
import ViewPreference from './pages/Guide/ViewPreference';
import FilteredView from './pages/Guide/FilteredView';

// Notices Page
import Notices from './pages/Notices/Notices';

// Evaluation Pages
import AcademicYearSelection from './pages/Evaluation/AcademicYearSelection';
import DivisionSelection from './pages/Evaluation/DivisionSelection';
import UploadForm from './pages/Evaluation/UploadForm';
import EvaluationForm from './pages/Evaluation/EvaluationForm';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Guide Routes */}
            <Route path="/guide" element={<GuideMain />} />
            <Route path="/guide/preference" element={<GuidePreference />} />
            <Route path="/guide/preference/add" element={<AddPreference />} />
            <Route path="/guide/preference/view" element={<ViewPreference />} />
            <Route path="/guide/preference/view/:year" element={<FilteredView />} />

            {/* Notices Route */}
            <Route path="/notices" element={<Notices />} />

            {/* Evaluation Routes */}
            <Route path="/evaluation" element={<AcademicYearSelection />} />
            <Route path="/evaluation/:yearType" element={<AcademicYearSelection />} />
            <Route path="/evaluation/:yearType/:academicYear" element={<DivisionSelection />} />
            <Route path="/evaluation/:yearType/:academicYear/:division" element={<UploadForm />} />
            <Route path="/evaluation/:yearType/:academicYear/:division/evaluate" element={<EvaluationForm />} />

            {/* 404 Fallback Route (Optional) */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
