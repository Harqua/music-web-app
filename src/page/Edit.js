import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { initialSample } from "../data/sample";
import Template from "../components/Template";
import { guitar, piano, frenchHorn, drum } from "../data/instruments.js";
import { toneObject, toneTransport, guitarTonePart, pianoTonePart, frenchHornTonePart, drumTonePart } from "../data/instruments.js";


let toneParts = [guitarTonePart, pianoTonePart, frenchHornTonePart, drumTonePart];

export default function Edit() {
  let { id } = useParams();
  let [sample] = initialSample.filter((sample) => sample.id === id);
  
  

  const [editSample, setEditSample] = useState({ id: `${sample.id}`, title: `${sample.title}`, created: `${sample.created}`, type: `${sample.type}` })
  const timeDate = new Date();
  const time = timeDate.toLocaleString('en-AU', { hour: 'numeric', minute: 'numeric', hour12: true });
  const date = timeDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  const dateTime = `${time} on ${date}`
  const handleClickPreview = (event) => { console.log("preview") }


  const [instrument, setInstrument] = useState(sample.type)
  const handleClickInstrument = (x)=>{setInstrument(x)}

  const handleClickSave = (event) => {
    event.preventDefault();
    initialSample[editSample.id - 1] = { ...editSample, type: instrument }

  }
  const saveOnChange = (event) => {
    event.preventDefault();
    setEditSample({ ...editSample, title: event.target.value, created: `${dateTime}`, type: instrument })
  }

  return (
    <Template title="Editing This Sample:">
      <div className="page-content">
        <section className="edit-title">
          <form onSubmit={handleClickSave}>
            <input type="text" name="title" id="sampleTitle" defaultValue={editSample.title} onChange={saveOnChange}></input>
            <nav className="sample-edit-button">
              <button onClick={handleClickPreview} className="content-button">Preview</button>
              <button type="submit" className="content-button2">Save</button>
            </nav>
          </form>
        </section>
        <InstrumentType instrument={instrument} setInstrument={setInstrument} handleClickInstrument={handleClickInstrument} />
        <Note />
      </div>
    </Template>
  );
}


function InstrumentType({instrument, setInstrument, handleClickInstrument}) {
  return (
    <div id="instrumentType">
      <b>Type</b>
      <table>
        <tr>
          <th className={`music-button ${instrument==="piano" && `active`}`} onClick={()=>handleClickInstrument("piano")}>Piano</th>
          <th className={`music-button ${instrument==="french-horn" && `active`}`} onClick={()=>handleClickInstrument("french-horn")}>French Horn</th>
          <th className={`music-button ${instrument==="guitar" && `active`}`} onClick={()=>handleClickInstrument("guitar")}>Guitar</th>
          <th className={`music-button ${instrument==="drums" && `active`}`} onClick={()=>handleClickInstrument("drums")}>Drums</th>
        </tr>
      </table>
    </div>
  )

}

function Note() {
  let notes = ["B", "A", "G", "F", "E", "D", "C"]
  return (
    <div id = "noteContent">
      {notes.map(note => <section className="each-note"><b>{note}</b></section>)}

    </div>
  )
}

function Bar({ barID, barEnabled, handleBarClick }) {

  function barSelected() {
      if (barEnabled) {
          return "selected";
      }
      return "";
  }

  return (
      <div className={`bar bar-${barID} ${barSelected()}`} onClick={handleBarClick}>
          {barID}
      </div>
  );

}

function Bars({ sequence, setSequence }) {
   
  function sortSequence(bar, otherBar) {
      if (bar.barID < otherBar.barID) {
          return -1;
      }
      if (bar.barID > otherBar.barID) {
          return 1;
      }
      return 0;
  }

  function handleBarClick(bar) {
      const now = toneObject.now();
      guitar.triggerAttackRelease("C3", "8n", now);
      let filteredSequence = sequence.filter((_bar) => _bar.barID !== bar.barID);
      setSequence([...filteredSequence, { ...bar, barEnabled: !bar.barEnabled }]);
  }

  return sequence.sort(sortSequence).map(bar => <Bar key={bar.barID} {...bar} handleBarClick={() => handleBarClick(bar)} />);
}

function Sequencer() {
  let initialSequence = [];
  for (let bar = 1; bar <= 16; bar++) {
      initialSequence.push({
          barID: bar,
          barEnabled: false,
          //barEnabled: bar % 2 == 1 ? true : false, // Pre-fill every second bar for testing
      });
  }
  const [sequence, setSequence] = useState(initialSequence);

  useEffect(() => {


      toneParts.forEach(tonePart => tonePart.clear());
      toneTransport.cancel();

      sequence.filter(bar => bar.barEnabled).forEach(bar => {
          toneParts.forEach(tonePart => tonePart.add((bar.barID - 1) / 4, "C3")); // Plays an C note on 3rd octave 0.25s apart
          
      });

  });

  return (
      <>
          <div className="sequencer">
              <Bars sequence={sequence} setSequence={setSequence} toneObject={toneObject} />
          </div>
      </>
  );
}
