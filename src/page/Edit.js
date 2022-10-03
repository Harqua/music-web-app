import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Template from "../components/Template";
import { guitar, piano, frenchHorn, drum } from "../data/instruments.js";
import { toneObject, toneTransport, guitarTonePart, pianoTonePart, frenchHornTonePart, drumTonePart } from "../data/instruments.js";



export default function Edit() {

  const initialSample = []
  let { id } = useParams();
  const [samples, setSamples] = useState(initialSample);

  // let [sample] = samples.filter((sample) => sample.id === id);
  const [editSample, setEditSample] = useState()

  const initialPreviewing = false;
  const [previewing, setPreviewing] = useState(initialPreviewing);
  const [instrument, setInstrument] = useState()
  const [sampleNotes, setSampleNotes] = useState()
  
  const init = async () => {
    const readInitialSampleResponse = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=read&endpoint=samples", {
      method: "GET",
    })
    
    const readSample = await readInitialSampleResponse.json()
    const allSample = [...readSample.samples]
    setSamples(allSample)
    let [sample] = allSample.filter((sample) => sample.id === id);
    setEditSample({ id: `${sample.id}`, name: `${sample.name}`, datetime: `${sample.datetime}`, type: `${sample.type}`, recording_data: sample.recording_data })
    setInstrument(sample.type)
    setSampleNotes(sample.recording_data)
  
  }


  useEffect(() => {

    init()
  }, [])

  if (!editSample){
    return <p>Loading</p>
  }

  if (!sampleNotes){
    return <p>Loading</p>
  }
 
  const timeDate = new Date();
  const time = timeDate.toLocaleString('en-AU', { hour: 'numeric', minute: 'numeric', hour12: true });
  const date = timeDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  const dateTime = `${time} on ${date}`


  

  const handleClickPreview = (event) => {
    toneObject.start()
    toneTransport.stop()
    toneTransport.cancel();
    if (previewing) {
      setPreviewing(false);
    }
    else {
      setPreviewing(true);
      toneTransport.start();
    }
  }


  
  const handleClickInstrument = (x) => { setInstrument(x) }

  

  const handleClickSave = async (event) => {
    event.preventDefault();

    // initialSample[editSample.id - 1] = { ...editSample, datetime: `${dateTime}`, type: instrument, recording_data: sampleNotes }
    const parseRecordingData = (typeof sampleNotes === 'string') ? JSON.parse(sampleNotes) : sampleNotes
    const createSampleResponse = await fetch(`http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=update&endpoint=samples&sampleType=${instrument}&sampleName=${editSample.name}&id=${editSample.id}`, {
      method: "POST",
      body: JSON.stringify(parseRecordingData),
    });

  }
  const saveOnChange = (event) => {
    event.preventDefault();
    setEditSample({ ...editSample, name: event.target.value, datetime: `${dateTime}`, type: instrument })
  }

  return (
    <Template title="Editing This Sample:">
      <div className="page-content">
        <section className="edit-title">
          <form onSubmit={handleClickSave}>
            <input type="text" name="title" id="sampleTitle" defaultValue={editSample.name} onChange={saveOnChange}></input>
            <nav className="sample-edit-button">
              <Preview handleClickPreview={handleClickPreview} previewing={previewing}/>
              <button type="submit" className="content-button2">Save</button>
            </nav>
          </form>
        </section>
        <InstrumentType instrument={instrument} setInstrument={setInstrument} handleClickInstrument={handleClickInstrument} />
        <Note instrument={instrument} sampleNotes={sampleNotes} setSampleNotes={setSampleNotes} previewing={previewing} setPreviewing={setPreviewing} />
      </div>
    </Template>
  );
}

function Preview({handleClickPreview, previewing}){
  return <button onClick={handleClickPreview} className="content-button">{previewing ? "Stop Previewing" : "Preview"}</button>

}

function InstrumentType({ instrument, setInstrument, handleClickInstrument }) {
  return (
    <div id="instrumentType">
      <b>Type</b>
      <table id="musicTable">
        <tbody>
          <tr>
            <th className={`music-button ${instrument === "piano" && `active`}`} onClick={() => handleClickInstrument("piano")}>Piano</th>
            <th className={`music-button ${instrument === "french_horn" && `active`}`} onClick={() => handleClickInstrument("french_horn")}>French Horn</th>
            <th className={`music-button ${instrument === "guitar" && `active`}`} onClick={() => handleClickInstrument("guitar")}>Guitar</th>
            <th className={`music-button ${instrument === "drums" && `active`}`} onClick={() => handleClickInstrument("drums")}>Drums</th>
          </tr>
        </tbody>
      </table>
    </div>
  )

}

function Note({ sampleNotes, setSampleNotes, previewing, setPreviewing, instrument }) {
  let notes = ["B", "A", "G", "F", "E", "D", "C"]
  return (
    <div id="noteContent">
      {notes.map(note => <section key={note} className="each-note"><b>{note}</b><Sequencer instrument={instrument} note={note} sampleNotes={sampleNotes} setSampleNotes={setSampleNotes} previewing={previewing} setPreviewing={setPreviewing}/></section>)}
    </div>
  )
}

function Bar({ barID, barEnabled, handleBarClick, note }) {

  // function barSelected() {
  //   if (barEnabled) {
  //     return "selected";
  //   }
  //   return "";
  // }

  return (
    <div className={`bar bar-${barID}-${note} ${barEnabled && 'selected'}`} onClick={handleBarClick}>
    </div>
  );

}

function Bars({ sequence, setSequence, note, instrument }) {

  function sortSequence(bar, otherBar) {
    if (bar.barID < otherBar.barID) {
      return -1;
    }
    if (bar.barID > otherBar.barID) {
      return 1;
    }
    return 0;
  }

  function handleBarClick(bar,instrument) {
    const now = toneObject.now();
    if (instrument==="piano"){
      piano.triggerAttackRelease(`${note}3`, "8n", now);
    }
    else if (instrument==="french_horn"){
      frenchHorn.triggerAttackRelease(`${note}3`, "8n", now);
    }
    else if (instrument==="guitar"){
      guitar.triggerAttackRelease(`${note}3`, "8n", now);
    }
    else if (instrument==="drums"){
      drum.triggerAttackRelease(`${note}3`, "8n", now);
    }
    bar.barEnabled = !bar.barEnabled
    setSequence([...sequence].map((b) => {
      return b.barID === bar.barID ? bar : b;
    }))
  }

  return sequence.sort(sortSequence).map(bar => <Bar note={note} key={bar.barID} barID={bar.barID} barEnabled={bar.barEnabled} handleBarClick={() => handleBarClick(bar,instrument)} />);
}

function Sequencer({ note, sampleNotes, setSampleNotes, previewing, setPreviewing, instrument }) {


  const parseSampleNotes = (typeof sampleNotes === 'string') ? JSON.parse(sampleNotes) : sampleNotes
  const findNotesIndex = parseSampleNotes.findIndex(sampleNote => {
    const include = Object.keys(sampleNote)
    return include.includes(note)
  })

  const findNotes = parseSampleNotes[findNotesIndex]
  const notesArray = findNotes[note]

  
  let initialSequence = [];
  for (let bar = 1; bar <= 16; bar++) {
    initialSequence.push({
      barID: bar,
      barEnabled: notesArray[bar-1],
    });
  }



  const [sequence, _setSequence] = useState(initialSequence);
  const setSequence = (newSeq) => {
    _setSequence(newSeq)
    findNotes[note] = newSeq.map((x) => x.barEnabled)
    setSampleNotes([...parseSampleNotes])
  }
  useEffect(() => {

    const sequenceFilter = sequence.filter(bar => findNotes[note][bar.barID-1])
    
    sequenceFilter.forEach(bar => {

      if (instrument==="piano"){
        pianoTonePart.add((bar.barID - 1) / 4, `${note}3`);
      }
      else if (instrument==="french_horn"){
        frenchHornTonePart.add((bar.barID - 1) / 4, `${note}3`);
      }
      else if (instrument==="guitar"){
        guitarTonePart.add((bar.barID - 1) / 4, `${note}3`);
      }
      else if (instrument==="drums"){
        drumTonePart.add((bar.barID - 1) / 4, `${note}3`);
      }
    });

    toneTransport.schedule(time => {
      setPreviewing(false);
    }, 16 / 4);

  });

  return (
    <>
      <div className="sequencer">
        <Bars instrument={instrument} sequence={sequence} setSequence={setSequence} toneObject={toneObject} note={note} />
      </div>
    </>
  );
}
