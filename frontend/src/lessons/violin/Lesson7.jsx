import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
import { NOTES_WS_URL, isMatch, playedNote } from "../../utils/notes";
import "./Lesson7.css";

const SEQUENCE = ["D4", "A4", "D4", "A4", "D4", "A4"].map(note => ({
  name: note.slice(0, -1), octave: Number(note.slice(-1)),
  instruction: `Play ${note}.`, stringName: "Violin"
}));

export default function Lesson7() {
  const [mode, setMode] = useState("learn");
  const { instrument } = useInstrument();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();
  const handleComplete = () => { completeLesson(instrument, 7); navigate("/lessons"); };
  return <div className="app">
    <header className="top-bar">
        <div className="logo">
            Bow Control & String Crossing
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
            LESSON 7 OF 10 • VIOLIN
        </p>
        <h1>
            Bow Control & String Crossing
        </h1>
        <p>
            Make smooth bow changes and move between strings with control.
        </p>
      </section>
      <div className="lesson-modes">{["learn","practice","play"].map(m => 
      <button key={m} className={mode===m?"mode-button active":"mode-button"}
       onClick={()=>setMode(m)}>
       {m[0].toUpperCase()+m.slice(1)}
      </button>)}
      </div>
      {mode==="learn" ? <>
        <section className="lesson-content">
            <div className="instrument-display">
                <span>
                    🎻
                </span>
            </div>
          <div className="lesson-section">
            <h2>
                Cross Strings Smoothly
            </h2>
            <p>
                Change the right-arm level gently when moving between strings. Keep the bow straight and transitions unhurried.
            </p>
          </div>
          <div className="lesson-section">
            <h2>
                String Crossing
            </h2>
            <p>
                Changing strings should not sound harsh, slowly move the bow between strings trying to keep a good tone.
            </p>
            <div className="note-grid">{["G","G to D","D to A","A to E"].map((x,i)=>
                <div className="note-card" key={x}><strong>{x}</strong>
                <span>
                    {["Your bow arm is at the highest position","Lower bow arm slightly to play D from G","Lower bow arm slightly to play A from D","Lowest your bow arm should go when playing"][i]}
                </span>
                </div>)}
            </div>
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
                Cross Strings Smoothly
            </h2>
            <p>
                Change the right-arm level gently when moving between strings. Keep the bow straight and transitions unhurried.
            </p>
            <div className="practice-tip">
                💡 You should not be moving your whole arm to bow, just moving the forearm back and forth while elbow stays in place.
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
    if(socketRef.current)
        {socketRef.current.close();
        socketRef.current=null;}
  };

  const reset=()=>{
    close();
    setDetected(null);
    setStatus("ready");
  };
  useEffect(()=>()=>close(),[]);
  const startListening=()=>{
    close();setStatus("listening");
    const ws=new WebSocket(NOTES_WS_URL);
    socketRef.current=ws;

    ws.onmessage=e=>{let msg;try{msg=JSON.parse(e.data)}catch{return}if(msg.type!=="note")return;const d=playedNote(msg.note,instrument);setDetected(d);if(isMatch(d,target)){setStatus("correct");close()}else setStatus("incorrect")};
    ws.onerror=()=>setStatus("error");
  };
  const feedback={
    ready:"Play the note shown.",
    listening:"Listening...",
    correct:`Correct! ${current.name} played.`,
    incorrect:`Detected ${detected||"another note"}. Try again.`,
    error:"Detector connection failed. Check that the note server is running."}[status];

  return <section className="play-card">
    <p className="eyebrow">
        PLAY
    </p>
    <h2>
        Practice the Pattern
    </h2>
    <p>
        Play each note and advance after it is recognized.
    </p>
    <div className="play-sequence">{SEQUENCE.map((x,j)=>
        <span key={j} style={{opacity:index===j?1:.5}}>
            {x.name}
        </span>)}
    </div>
    <div className="practice-note">{current.name}
        </div>
        <p>{
        current.instruction
        }</p>
        <p className="play-status">{feedback}
            </p>
            <p> Note {index+1} of {SEQUENCE.length}
            </p>
    <div className="lesson-next">{status!=="correct"&&<button onClick={startListening}>{status==="listening"?"Listening...":"Start Listening"}</button>}
      <button disabled={status!=="correct"} onClick={()=>{reset();index===SEQUENCE.length-1?onComplete():setIndex(index+1)}}>{last?"Finish Lesson →":"Next Note →"}</button>
      <button className="mode-button" onClick={()=>
        {reset();setIndex(0)}}>Restart
        </button>
        </div>
    <div className="lesson-completion">
        <p>Complete every note correctly to finish this lesson.
            </p>
        </div>
    </section>;
}
