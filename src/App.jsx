import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ConversationProvider } from "./context/conversationContext";

import Layout from "./components/Layout";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Onboarding from "./pages/auth/Onboarding";

import Home from "./pages/Home";
import Diseases from "./pages/Diseases";
import CareNearBy from "./pages/CareNearBy";
import GetSummary from "./pages/GetSummary";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import DiseaseDetail from "./pages/DiseaseDetail";
import DiseaseChat from "./pages/DiseaseChat";

import AboutUs from "./pages/settings/AboutUs";
import SupportInfo from "./pages/settings/SupportInfo";
import AiBehavior from "./pages/settings/AiBehavior";
import DataControl from "./pages/settings/DataControl";
import Permissions from "./pages/settings/Permissions";

import FAQs from "./pages/settings/support-info/FAQs";
import ReportProblem from "./pages/settings/support-info/ReportProblem";
import AiDisclaimer from "./pages/settings/support-info/AiDisclaimer";
import TermsPolicies from "./pages/settings/support-info/TermsPolicies";

import ManageConversation from "./pages/settings/history-dataControl/ManageConversation";
import ManageDiseases from "./pages/settings/history-dataControl/ManageDiseases";
import ManageSummary from "./pages/settings/history-dataControl/ManageSummary";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConversationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/diseases" element={<Diseases />} />
              <Route path="/diseases/:id" element={<DiseaseDetail />} />
              <Route path="/diseases/:id/chat" element={<DiseaseChat />} />
              <Route path="/care-near-by" element={<CareNearBy />} />
              <Route path="/get-summary" element={<GetSummary />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/profile/settings" element={<Settings />} />

              <Route path="/profile/settings/about-us" element={<AboutUs />} />
              <Route
                path="/profile/settings/support-info"
                element={<SupportInfo />}
              />
              <Route
                path="/profile/settings/ai-behavior"
                element={<AiBehavior />}
              />
              <Route
                path="/profile/settings/data-control"
                element={<DataControl />}
              />
              <Route
                path="/profile/settings/permissions"
                element={<Permissions />}
              />

              {/* Support Info Sub-pages */}
              <Route
                path="/profile/settings/support-info/faqs"
                element={<FAQs />}
              />
              <Route
                path="/profile/settings/support-info/report-a-problem"
                element={<ReportProblem />}
              />
              <Route
                path="/profile/settings/support-info/ai-disclaimer"
                element={<AiDisclaimer />}
              />
              <Route
                path="/profile/settings/support-info/terms-policies"
                element={<TermsPolicies />}
              />

              {/* Data Control Sub-pages */}
              <Route
                path="/profile/settings/data-control/conversations"
                element={<ManageConversation />}
              />
              <Route
                path="/profile/settings/data-control/diseases"
                element={<ManageDiseases />}
              />
              <Route
                path="/profile/settings/data-control/summary"
                element={<ManageSummary />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ConversationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
