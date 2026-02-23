import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ConversationProvider } from "./context/conversationContext";

import Layout from "./components/Layout";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Home from "./pages/Home";
import Diseases from "./pages/Diseases";
import CareNearBy from "./pages/CareNearBy";
import GetSummary from "./pages/GetSummary";
import Uploads from "./pages/Uploads";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import DiseaseChat from "./pages/DiseaseChat";

import AboutUs from "./pages/settings/AboutUs";
import SupportInfo from "./pages/settings/SupportInfo";
import AiBehavior from "./pages/settings/AiBehavior";
import DataControl from "./pages/settings/DataControl";
import Permissions from "./pages/settings/Permissions";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConversationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/diseases" element={<Diseases />} />
              <Route path="/diseases/:id" element={<DiseaseChat />} />
              <Route path="/care-near-by" element={<CareNearBy />} />
              <Route path="/get-summary" element={<GetSummary />} />
              <Route path="/uploads" element={<Uploads />} />
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
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ConversationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
