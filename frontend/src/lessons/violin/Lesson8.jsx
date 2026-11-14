import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
import { NOTES_WS_URL, isMatch, playedNote } from "../../utils/notes";
import TrebleClefImage from "../../assets/images/violin/Treble-clef.png";
import TrebleClef1Image from "../../assets/images/violin/Treble-clef1.png";
import PracticePlay from "../../assets/images/violin/Lesson8Play.png";

import "./Lesson8.css";

const SEQUENCE = ["D4", "E4", "A4", "D5"].map(note => ({
  name: note.slice(0, -1), octave: Number(note.slice(-1)),
  instruction: `Play ${note}.`, stringName: "Violin"
}));

export default function Lesson8() {
  const [mode, setMode] = useState("learn");
  const { instrument } = useInstrument();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();
  const handleComplete = () => { completeLesson(instrument, 8); navigate("/lessons"); };
  return <div className="app">
    <header className="top-bar">
      <div className="logo">
        Reading Music
      </div>
      <div className="profile">
        <span>
          🎻
        </span>
      </div>
    </header>
    <main className="lesson-page">
      <Link to="/lessons" className="back-link">← Back to Lessons</Link>
      <section className="lesson-header">
        <p className="eyebrow">
          LESSON 8 OF 10 • VIOLIN
        </p>
        <h1>
          Reading Music
        </h1>
        <p>
          Read notes on a staff.
        </p>
      </section>

      <div className="lesson-modes">{["learn","practice","play"].map(m => 
        <button key={m} className={mode===m?"mode-button active":"mode-button"}
         onClick={()=>setMode(m)}>{m[0].toUpperCase()+m.slice(1)}
        </button>)
        }
      </div>
      {mode==="learn" ? <>
        <section className="lesson-content">
          <div className="instrument-display">
            <span>🎻</span>
          </div>
          <div className="lesson-section">
            <h2>
              Notes
            </h2>
            <p>
              Music is read from left to right just like reading a book.
              There are only 7 letter notes ranging from A to G.
               The notes loop after hitting G so it goes A,B,C,D,E,F,G,A,B,C and so on.
            </p>
            <p>
              <img
                className="tuning-control-image"
                src={TrebleClef1Image}
              />
            </p>
          </div>
          <div className="lesson-section">
            <h2>
              Musical Staff
            </h2>
            <p>
              A musical staff has 5 horizontal lines and 4 spaces between them, each line and space have their own corresponding notes.
              Notes higher on the staff represent higher pitches and vice versa.
              An easy way to remember which notes land on the lines is the phrase "Every Good Boy Does Fine" (E,G,B,D,F) and "FACE" for the notes that land in the spaces.
            </p>
            <p>
              <img
                className="tuning-control-image"
                src={TrebleClefImage}
              />
            </p>
            <p>
              As you can tell, the notes on violin go above and below the musical staff, most noteably on the G and E string.
              The short horizontal lines on these notes are called ledger lines and are only used when needed to improve readability.
            </p>
          </div>
        </section>
        <div className="lesson-next">
          <button onClick={()=>setMode("practice")}>
            Practice →
          </button>
        </div>
      </> : mode==="practice" ? <>
        <section className="practice-card">
          <p className="eyebrow">
            PRACTICE
          </p>
          <h2>
            Make sure you understand the main notes on the staff
          </h2>
          <p>
            Review "Every Good Boy Does Fine" and "FACE"
          </p>
          <div className="practice-tip">
            💡 Understanding these core notes is important
          </div>
        </section>
        <div className="lesson-next">
          <button onClick={()=>setMode("play")}>
            Try the Note Pattern →
          </button>
        </div>
      </> : <PlaySection onComplete={handleComplete} instrument={instrument}/>}
    </main><Navbar/>
  </div>;
}

function PlaySection({onComplete, instrument}) {
  const [index,setIndex]=useState(0),
        [status,setStatus]=useState("ready"),
        [detected,setDetected]=useState(null);

  const socketRef=useRef(null),
        current=SEQUENCE[index],
        last=index===SEQUENCE.length-1,
        target=`${current.name}${current.octave}`;

  const close=()=>{
    if(socketRef.current){
      socketRef.current.close();
      socketRef.current=null;}
  };

  const reset=()=>{
    close();
    setDetected(null);
    setStatus("ready");
  };

  useEffect(()=>()=>close(),[]);

  const startListening=()=>{
    close();
    setStatus("listening");
    const ws=new WebSocket(NOTES_WS_URL);
    socketRef.current=ws;

    ws.onmessage=e=>{
      let msg;
      try{
        msg=JSON.parse(e.data)
      }
        catch{return}
        if(msg.type!=="note")
          return;
        const d=playedNote(msg.note,instrument);
              setDetected(d);
              if(isMatch(d,target)){
                setStatus("correct");
                close()
              }
              else setStatus("incorrect")};

    ws.onerror=()=>setStatus("error");
  };
  const feedback={
    ready:"Play the note shown.",
    listening:"Listening...",
    correct:`Correct! ${current.name} played.`,
    incorrect:`Detected ${detected||"another note"}. Try again.`,
    error:"Detector connection failed. Check that the note server is running."
  }[status];

  return <section className="play-card">
    <p className="eyebrow">
      PLAY
    </p>
    <h2>
      Play the notes shown one at a time
    </h2>
    <p>
      Play each note and advance after it is recognized.
    </p>
    <div className="play-sequence">{
      <p>
        <img
          className="tuning-control-image"
          src={PracticePlay}
        />
      </p>
      }
    </div>
    
    
    <p className="play-status">
      {feedback}
      </p>
      <p>Note {index+1} of {SEQUENCE.length}</p>
    <div className="lesson-next">
      {status!=="correct"&&
      <button onClick={startListening}>
        {status==="listening"?"Listening...":"Start Listening"}
      </button>}
      <button disabled={status!=="correct"} 
        onClick={()=>{
          reset();
          index===SEQUENCE.length-1?onComplete():setIndex(index+1)}}>
            {last?"Finish Lesson →":"Next Note →"}
      </button>
      <button className="mode-button" 
        onClick={()=>{reset();
        setIndex(0)}}>
          Restart
        </button>
    </div>
    <div className="lesson-completion">
      <p>
        Complete every note correctly to finish this lesson.
      </p>
    </div>
  </section>;
}
