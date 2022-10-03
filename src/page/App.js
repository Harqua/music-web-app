import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import { initialSample } from "../data/sample";
import Template from "../components/Template";
import { toneObject, toneTransport, guitarTonePart, pianoTonePart, frenchHornTonePart, drumTonePart } from "../data/instruments.js";



function Sample({ id, name, datetime, recording_data, type }) {

  const [share, setShare] = useState("notShared")
  let contentButtonClass = "";
  let shareButton = "";
  const initialPreviewing = false;
  const [previewing, setPreviewing] = useState(initialPreviewing);

  const checkStatus = async () => {


    const readInitialSampleToLocation = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=read&endpoint=samples_to_locations", {
      method: "GET",
    })
    const sampleToLocation = await readInitialSampleToLocation.json()
    if (sampleToLocation.samples_to_locations) {
      const sampleLocation = sampleToLocation.samples_to_locations
      const filteredSampleLocation = sampleLocation.filter((x) => x.samples_id === id)
      if (filteredSampleLocation.length !== 0) {
        setShare("shared")
      }
      else {
        setShare("notShared")
      }
    }

  }

  if (share === "notShared") {
    contentButtonClass = "content-button"
    shareButton = "Share"
  }
  else if (share === "shared") {
    contentButtonClass = "content-button3";
    shareButton = "Shared";
  }


  async function Notes(note) {
    

    const parseSampleNotes = (typeof recording_data === 'string') ? JSON.parse(recording_data) : recording_data.recording_data
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
        barEnabled: notesArray[bar - 1],
      });
    }

    const [sequence, _setSequence] = useState(initialSequence);
    const setSequence = (newSeq) => {
      _setSequence(newSeq)
      findNotes[note] = newSeq.map((x) => x.barEnabled)
    }

    useEffect(() => {


      const sequenceFilter = sequence.filter(bar => findNotes[note][bar.barID - 1])

      sequenceFilter.forEach(bar => {


        if (type === "piano") {
          pianoTonePart.add((bar.barID - 1) / 4, `${note}3`);
        }
        else if (type === "french_horn") {
          frenchHornTonePart.add((bar.barID - 1) / 4, `${note}3`);
        }
        else if (type === "guitar") {
          guitarTonePart.add((bar.barID - 1) / 4, `${note}3`);
        }
        else if (type === "drums") {
          drumTonePart.add((bar.barID - 1) / 4, `${note}3`);
        }
      });

      toneTransport.schedule(time => {
        setPreviewing(false);
      }, 16 / 4);

    });
  }

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

  let notes = ["B", "A", "G", "F", "E", "D", "C"]
  let eachNote = notes.map((note) => {
    Notes(note)

  })

  useEffect(() => {
    checkStatus()
  })

  const timeFormat = new Date(datetime)
  const newtime = timeFormat.toLocaleString('en-AU', { hour: 'numeric', minute: 'numeric', hour12: true });
  const newdate = timeFormat.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  const newTimeFormat = `${newtime} on ${newdate}`
  return (
    <div className="page-content">
      <ul>
        <li>
          <section className="content-title">
            <h3>{name}</h3>
            <time>{newTimeFormat}</time>
          </section>
          <nav>
            <Link to={`/Share/${id}`}><button className={contentButtonClass}>{shareButton}</button></Link>
            {/* <button className="content-button">Preview</button> */}
            <Preview handleClickPreview={handleClickPreview} previewing={previewing} />
            <Link to={`/Edit/${id}`}><button className="content-button2">Edit</button></Link>
          </nav>
        </li>
      </ul>
    </div>
  );
}

function Preview({ handleClickPreview, previewing }) {
  return <button onClick={handleClickPreview} className="content-button">{previewing ? "Stop Previewing" : "Preview"}</button>

}


export default function App() {

  const initialSample = []
  const [samples, setSamples] = useState(initialSample);
  const x = async () => {
    const readInitialSampleResponse = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=read&endpoint=samples", {
      method: "GET",
    })

    const readSample = await readInitialSampleResponse.json()
    if (readSample) {
      setSamples([...readSample.samples])
    }
  }

  const addSample = async () => {
    const datetime = new Date();
    const time = `${datetime.getHours()}:${datetime.getMinutes()}:00`
    const date = `${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()}`
    const recording_data = [
      { "B": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "A": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "G": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "F": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "E": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "D": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "C": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] }
    ]
    const createSampleResponse = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=create&endpoint=samples&sampleType=piano&sampleName=NewSample", {
      method: "POST",
      body: JSON.stringify(recording_data),
    });
    const createSample = await createSampleResponse.json();
    const newSample = {
      id: createSample.insertedID, name: "NewSample", datetime: `${date} ${time}`, type: "piano", recording_data: { recording_data }

    }
    setSamples([...samples, newSample])
  };

  useEffect(() => {

    x()
  }, [])

  return (
    <Template title="Samples You've Created">
      {samples.map((sample) => (
        <Sample key={sample.id} id={sample.id} name={sample.name} datetime={sample.datetime} type={sample.type} recording_data={sample.recording_data} />
      ))}
      <CreateSample addSample={addSample} />
    </Template>
  );
}

function CreateSample({ addSample }) {


  const handleClick = async (event) => {
    event.preventDefault();
    await addSample()
  };


  return (
    <div className="create-sample">
      <button onClick={handleClick} className="content-button2">Create Sample</button>
    </div>
  )
}
