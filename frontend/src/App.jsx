import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Lessons from "./pages/Lessons";
import Practice from "./pages/Practice";
import Songs from "./pages/Songs";
import SongPlay from "./pages/SongPlay";
import Challenges from "./pages/Challenges";
import Closet from "./pages/Closet";
import Profile from "./pages/Profile";
import Metronome from "./pages/metronome";
import GettingStarted from "./lessons/violin/Lesson1-GettingStarted";
import Tuning from "./lessons/violin/Lesson2-Tuning";
import OpenStrings from "./lessons/violin/Lesson3-OpenStrings";
import BasicBowing from "./lessons/violin/Lesson4-BasicBowing";
import FirstNotes from "./lessons/violin/Lesson5-FirstNotes";
import Lesson6 from "./lessons/violin/Lesson6";
import Lesson7 from "./lessons/violin/Lesson7";
import Lesson8 from "./lessons/violin/Lesson8";
import Lesson9 from "./lessons/violin/Lesson9";
import Lesson10 from "./lessons/violin/Lesson10";
import TrumpetGettingStarted from "./lessons/trumpet/Lesson1-GettingStarted";
import TrumpetBreathing from "./lessons/trumpet/Lesson2-Breathing";
import TrumpetFirstNotes from "./lessons/trumpet/Lesson3-FirstNotes";
import TrumpetBasicFingering from "./lessons/trumpet/Lesson4-BasicFingering";
import TrumpetFirstSong from "./lessons/trumpet/Lesson5-FirstSong";

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
            <Route path="/songs/:songId" element={<SongPlay />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/closet" element={<Closet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/metronome" element={<Metronome />} />
            <Route path="/lesson/violin/getting-started" element={<GettingStarted />} />
            <Route path="/lesson/violin/tuning" element={<Tuning />} />
            <Route path="/lesson/violin/open-strings" element={<OpenStrings />} />
            <Route path="/lesson/violin/basic-bowing" element={<BasicBowing />} />
            <Route path="/lesson/violin/first-notes" element={<FirstNotes />} />
            <Route path="/lesson/violin/Lesson6" element={<Lesson6 />} />
            <Route path="/lesson/violin/Lesson7" element={<Lesson7 />} />
            <Route path="/lesson/violin/Lesson8" element={<Lesson8 />} />
            <Route path="/lesson/violin/Lesson9" element={<Lesson9 />} />
            <Route path="/lesson/violin/Lesson10" element={<Lesson10 />} />
            <Route path="/lesson/trumpet/getting-started" element={<TrumpetGettingStarted />} />
            <Route path="/lesson/trumpet/getting-started" element={<TrumpetGettingStarted />} />
            <Route path="/lesson/trumpet/breathing" element={<TrumpetBreathing />} />
            <Route path="/lesson/trumpet/first-notes" element={<TrumpetFirstNotes />} />
            <Route path="/lesson/trumpet/basic-fingering" element={<TrumpetBasicFingering />} />
            <Route path="/lesson/trumpet/first-song" element={<TrumpetFirstSong />} />
          
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;