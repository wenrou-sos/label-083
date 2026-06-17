import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { I18nProvider } from "@/i18n";

export default function App() {
  return (
    <I18nProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
        </Routes>
      </Router>
    </I18nProvider>
  );
}
