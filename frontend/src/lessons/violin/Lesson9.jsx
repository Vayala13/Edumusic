import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
import { NOTES_WS_URL, isMatch, playedNote } from "../../utils/notes";
import Rhythm from "../../assets/images/violin/Rhythm.png";
import Dynamics from "../../assets/images/violin/Dynamics.png";


import "./Lesson9.css";

const SEQUENCE = ["A4", "A4", "D4", "D4"].map(note => ({
  name: note.slice(0, -1), octave: Number(note.slice(-1)),
  instruction: `Play ${note}.`, stringName: "Violin"
}));

export default function Lesson9() {
  const [mode, setMode] = useState("learn");
  const { instrument } = useInstrument();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();
  const handleComplete = () => { completeLesson(instrument, 9); navigate("/lessons"); };
  return <div className="app">
    <header className="top-bar">
      <div className="logo">
        Rhythm & Dynamics
      </div>
      <div className="profile">
        <span>
          🎻
        </span>
      </div>
    </header>
    <main className="lesson-page">
      <Link to="/lessons" className="back-link">
      ← Back to Lessons
      </Link>
      <section className="lesson-header">
        <p className="eyebrow">
          LESSON 9 OF 10 • VIOLIN
        </p>
        <h1>
          Rhythm & Dynamics
        </h1>
        <p>
          Shape phrases with volume changes and expressive playing.
        </p>
      </section>

      <div className="lesson-modes">{
        ["learn","practice","play"].map(m => 
        <button key={m} className={mode===m?"mode-button active":"mode-button"} 
        onClick={()=>setMode(m)}>{m[0].toUpperCase()+m.slice(1)}
        </button>)
      }
      </div>
      {mode==="learn" ? <>
        <section className="lesson-content">
          <div className="instrument-display"><span>🎻</span></div>
          <div className="lesson-section">
            <h2>
              Rhythm
            </h2>
            <p>
              Music is organized into beats and notes can last different amounts of time.
              Knowing Rythm is important because it determines when a note begins and ends, keeping a steady beat allows musicians to play together.
            </p>
          </div>

          <div className="lesson-section">
            <h2>
              Note durations
            </h2>
            <p>
              Notes can vary in length, the main note durations for starters are whole notes, half notes, quarter notes, and eighth notes.
            </p>
            <p>
              <img
                className="tuning-control-image"
                src={Rhythm}
              />
            </p>
            <p>
              One whole note is equivalent to two half notes which are equivalent to four quarter notes which are equivalent to eight eighth notes
            </p>
          </div>

          <div className="lesson-section">
            <h2>
              Dynamics
            </h2>
            <p>
              Dynamics describe how to play music. The symbols are often placed either abover or below a note depending on where it lies on the staff.
              Soft playing requires a gentle bow contact while loud playing requires a more controlled energy.
              Bow Speed and Weight must work together to get the correct volume.
              More weight can increase the volume while less softens it.
              Placing the bow closer to the bridge while playing produces a stronger sound than if one were to play with the bow closer to the fingerboard.
            </p>
            <p>
              <img
                className="tuning-control-image"
                src={Dynamics}
              />
            </p>
            <p>
              It is important to note that loud does not equal pressing the bow down on the string as hard as you can.
            </p>
          </div>

        </section>
          <div className="lesson-next">
            <button onClick={()=>setMode("practice")}>
              Practice →
              </button></div>
      </> : mode==="practice" ? <>
        <section className="practice-card">
          <p className="eyebrow">
            PRACTICE
          </p>
          <h2>
            Play with Expression
          </h2>
          <p>
            Dynamics are changes in loudness. Use relaxed bow speed and weight to play softly and loudly without squeezing.
          </p>
          <div className="practice-tip">
            💡 Practice slowly first. Keep your shoulders, wrist, and fingers relaxed.
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
      Practice Dynamics
    </h2>
    <p>
      Try to start off playing softly and build up to strongly.
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
