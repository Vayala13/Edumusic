import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Lessons from "./pages/Lessons";
import Practice from "./pages/Practice";
import Songs from "./pages/Songs";
import Challenges from "./pages/Challenges";
import Closet from "./pages/Closet";
import Profile from "./pages/Profile";
import Metronome from "./pages/metronome";
import GettingStarted from "./lessons/violin/Lesson1-GettingStarted";
import Tuning from "./lessons/violin/Lesson2-Tuning";
import OpenStrings from "./lessons/violin/Lesson3-OpenStrings";
import BasicBowing from "./lessons/violin/Lesson4-BasicBowing";
import FirstNotes from "./lessons/violin/Lesson5-FirstNotes";
import TrumpetGettingStarted from "./lessons/trumpet/Lesson1-GettingStarted";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/closet" element={<Closet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/metronome" element={<Metronome />} />
            <Route path="/lesson/violin/getting-started" element={<GettingStarted />} />
            <Route path="/lesson/violin/tuning" element={<Tuning />} />
            <Route path="/lesson/violin/open-strings" element={<OpenStrings />} />
            <Route path="/lesson/violin/basic-bowing" element={<BasicBowing />} />
            <Route path="/lesson/violin/first-notes" element={<FirstNotes />} />
            <Route path="/lesson/trumpet/getting-started" element={<TrumpetGettingStarted />} />
          
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;