import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ConversationProvider } from "./context/conversationContext";

import Layout from "./components/Layout";

const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Onboarding = lazy(() => import("./pages/auth/Onboarding"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));

const Home = lazy(() => import("./pages/Home"));
const Diseases = lazy(() => import("./pages/Diseases"));
const CareNearBy = lazy(() => import("./pages/CareNearBy"));
const GetSummary = lazy(() => import("./pages/GetSummary"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Settings = lazy(() => import("./pages/Settings"));
const DiseaseDetail = lazy(() => import("./pages/DiseaseDetail"));
const DiseaseChat = lazy(() => import("./pages/DiseaseChat"));

const AboutUs = lazy(() => import("./pages/settings/AboutUs"));
const SupportInfo = lazy(() => import("./pages/settings/SupportInfo"));
const AiBehavior = lazy(() => import("./pages/settings/AiBehavior"));
const DataControl = lazy(() => import("./pages/settings/DataControl"));
const Permissions = lazy(() => import("./pages/settings/Permissions"));

const FAQs = lazy(() => import("./pages/settings/support-info/FAQs"));
const ReportProblem = lazy(
  () => import("./pages/settings/support-info/ReportProblem"),
);
const AiDisclaimer = lazy(
  () => import("./pages/settings/support-info/AiDisclaimer"),
);
const TermsPolicies = lazy(
  () => import("./pages/settings/support-info/TermsPolicies"),
);

const ManageConversation = lazy(
  () => import("./pages/settings/history-dataControl/ManageConversation"),
);
const ManageDiseases = lazy(
  () => import("./pages/settings/history-dataControl/ManageDiseases"),
);
const ManageSummary = lazy(
  () => import("./pages/settings/history-dataControl/ManageSummary"),
);
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConversationProvider>
          <Suspense
            fallback={
              <div className="flex h-screen items-center justify-center bg-zinc-900 text-white">
                <div className="animate-pulse">Loading...</div>
              </div>
            }
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

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

                <Route
                  path="/profile/settings/about-us"
                  element={<AboutUs />}
                />
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
          </Suspense>
        </ConversationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
