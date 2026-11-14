import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useInstrument } from "../../context/useInstrument";
import { useProgress } from "../../context/useProgress";
import { NOTES_WS_URL, isMatch, playedNote } from "../../utils/notes";
import Shifting from "../../assets/images/violin/Shifting.png";
import ThirdPosition from "../../assets/images/violin/ThirdPosition.png";

import "./Lesson10.css";

const SEQUENCE = ["G4", "A4", "B4", "C5", "B4", "A4", "G4"].map(note => ({
  name: note.slice(0, -1), octave: Number(note.slice(-1)),
  instruction: `Play ${note}.`, stringName: "Violin"
}));

export default function Lesson10() {
  const [mode, setMode] = useState("learn");
  const { instrument } = useInstrument();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();
  const handleComplete = () => { completeLesson(instrument, 10); navigate("/lessons"); };
  return <div className="app">
    <header className="top-bar">
      <div className="logo">
        Shifting & Third Position</div>
        <div className="profile">
          <span>🎻</span>
          </div>
    </header>

    <main className="lesson-page">
      <Link to="/lessons" className="back-link">← Back to Lessons</Link>
      <section className="lesson-header">
        <p className="eyebrow">
          LESSON 10 OF 10 • VIOLIN
        </p>
          <h1>
            Shifting & Third Position
          </h1>
        <p>
          Learn how to shift and play notes in third position.
        </p>
      </section>

      <div className="lesson-modes">
        {["learn","practice","play"].map(m => 
        <button key={m} className={mode===m?"mode-button active":"mode-button"}
         onClick={()=>setMode(m)}>
          {m[0].toUpperCase()+m.slice(1)}
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
              Shifting
            </h2>
            <p>
              Shifting is the process of moving ("shifting") the entire left hand to a different position on the violin fingerboard.
              Shifting allows violinists to play higher notes without stretching their fingers excessively or without needing to cross strings.
              When shifting up or down, the hand should move smoothly all together.
            </p>
            <p>
              <img
                className="tuning-control-image"
                src={Shifting}
              />
            </p>
          </div>
          <div className="lesson-section">
            <h2>
              Third Position
            </h2>
            <p>
              When shifting to third position, your whole left hand shifts so that your first finger is now where your third finger is normally placed when playing in first position.
              For example, on the D string, the note G would usually be played using your third finger.
              Shifting to third position now makes it so that you can play that same G with your first finger on the D string.
            </p>
            <p>
              <img
                className="tuning-control-image"
                src={ThirdPosition}
              />
            </p>
          </div>
          <div className="lesson-section">
            <h2>
              Notes in this lesson
            </h2>
            <p>
              You will be expected to play the following notes in third position all on the D string.
            </p>
            <div className="note-grid">
              {["G","A","B","C"].map((x,i)=>
              <div className="note-card" key={x}><strong>{x}</strong>
              <span>
                {["1st finger","2nd finger","3rd finger","4th finger"][i]}
                </span>
              </div>
              )}
              </div>
          </div></section>
          <div className="lesson-next">
            <button onClick={()=>setMode("practice")}>Practice →
              </button></div>
      </> : mode==="practice" ? <>
        <section className="practice-card">
          <p className="eyebrow">PRACTICE</p>
          <h2>
            Third Position
          </h2>
          <p>
            Try finding the correct notes in third position on the D string
          </p>
            <div className="practice-tip">
              💡Keep your hand relaxed while shifting
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
    if(socketRef.current){socketRef.current.close();socketRef.current=null;}};
  const reset=()=>{
    close();setDetected(null);
    setStatus("ready");
    };

  useEffect(()=>()=>close(),[]);
  
  const startListening=()=>{
    close();setStatus("listening");

    const ws=new WebSocket(NOTES_WS_URL);socketRef.current=ws;

    ws.onmessage=e=>{
      let msg;try{
        msg=JSON.parse(e.data)
      }
      catch{return}
      
      if(msg.type!=="note")return;
      const d=playedNote(msg.note,instrument);
      setDetected(d);
      if(isMatch(d,target)){
        setStatus("correct");
        close()}else setStatus("incorrect")
      };
    ws.onerror=()=>setStatus("error");
  };
  const feedback={ready:"Play the note shown.",listening:"Listening...",correct:`Correct! ${current.name} played.`,incorrect:`Detected ${detected||"another note"}. Try again.`,error:"Detector connection failed. Check that the note server is running."}[status];
  return <section className="play-card"><p className="eyebrow">PLAY</p><h2>Play in Third Position</h2><p>Play each note in third position on the D string and advance after it is recognized.</p>
    <div className="play-sequence">{SEQUENCE.map((x,j)=>
      <span key={j} style={{opacity:index===j?1:.5}}>{x.name}
      </span>)}
    </div>
    <div className="practice-note">
      {current.name}
    </div>
    <p>
      {current.instruction}
    </p>
    <p 
      className="play-status">{feedback}
    </p>
    <p>
      Note {index+1} of {SEQUENCE.length}
    </p>
    <div className="lesson-next">{status!=="correct"&&
      <button onClick={startListening}>{
        status==="listening"?"Listening...":"Start Listening"
        }
      </button>}
      <button disabled={status!=="correct"} onClick={()=>{reset();
        index===SEQUENCE.length-1?onComplete():setIndex(index+1)}}>
          {last?"Finish Lesson →":"Next Note →"}
      </button>
      <button className="mode-button" onClick={()=>{reset();setIndex(0)}}>Restart</button></div>
    <div className="lesson-completion">
      <p> Complete every note correctly to finish this lesson.</p>
    </div>
  </section>;
}
