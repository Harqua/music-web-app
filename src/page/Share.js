import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
// import { initialSample } from "../data/sample";
import Template from "../components/Template";
import { toneObject, toneTransport, guitarTonePart, pianoTonePart, frenchHornTonePart, drumTonePart } from "../data/instruments.js";

// const uqLocations = ["Great Court, UQ", "General Purpose South, UQ", "Near UQ Lakes Bus Station, UQ", "UQU Shops, UQ", "UQ Sport Courts, UQ"]

export default function Share() {
  const initialSample = []
  let { id } = useParams();
  const [samples, setSamples] = useState(initialSample);
  const [sampleData, setSampleData] = useState()

  const [location, setLocations] = useState()

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
    setSampleData({ id: `${sample.id}`, name: `${sample.name}`, datetime: `${sample.datetime}`, type: `${sample.type}`, recording_data: sample.recording_data })
    setInstrument(sample.type)
    setSampleNotes(sample.recording_data)


    const readInitialLocationResponse = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=read&endpoint=locations", {
      method: "GET",
    })
    const readLocation = await readInitialLocationResponse.json()
    const allLocations = [...readLocation.locations]
    const uqLocations = allLocations.filter(uq => uq.location.includes("UQ"))
    setLocations(uqLocations)

  }

  useEffect(() => {
    init()
  }, [])



  if (!location) {
    return <p>Please Wait...</p>
  }

  const sampleName = (!sampleData) ? "Loading" : sampleData.name
  const sampleDatetime = (!sampleData) ? "" : sampleData.datetime

  const timeFormat = new Date(sampleDatetime)
  const newtime = timeFormat.toLocaleString('en-AU', { hour: 'numeric', minute: 'numeric', hour12: true });
  const newdate = timeFormat.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  const newTimeFormat = `${newtime} on ${newdate}`
  return (
    <Template title="Share This Sample:">
      <div className="page-content" id="shareTitle">
        <ShareTitle sampleNotes={sampleNotes} previewing={previewing} setPreviewing={setPreviewing} sampleName={sampleName} newTimeFormat={newTimeFormat} instrument={instrument}/>
      </div>
      <div id="locationList">
        <Location location={location} sampleData={sampleData} />
      </div>
    </Template>
  );
}

function ShareTitle({sampleNotes, previewing, setPreviewing, sampleName, newTimeFormat, instrument}) {

  async function Notes(note) {


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


        if (instrument === "piano") {
          pianoTonePart.add((bar.barID - 1) / 4, `${note}3`);
        }
        else if (instrument === "french_horn") {
          frenchHornTonePart.add((bar.barID - 1) / 4, `${note}3`);
        }
        else if (instrument === "guitar") {
          guitarTonePart.add((bar.barID - 1) / 4, `${note}3`);
        }
        else if (instrument === "drums") {
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
  return (
    <>
      <section className="share-title">
        <h3>{sampleName}</h3>
        <time>{newTimeFormat}</time>
      </section>
      <nav>
        {/* <button className="content-button">Preview</button> */}
        <Preview handleClickPreview={handleClickPreview} previewing={previewing} />
      </nav>
    </>
  )
}


function Location({ location, sampleData }) {
  return (
    location.map(location =>
      <div key={location.id} id={location.id} className="each-location">
        <section>
          {location.location}
        </section>
        <nav>
          <table id="shareTable">
            <tbody>
              <ShareStatus location={location} sampleData={sampleData} />
            </tbody>
          </table>
        </nav>
      </div>
    )
  )
}

function Preview({ handleClickPreview, previewing }) {
  return <button onClick={handleClickPreview} className="content-button">{previewing ? "Stop Previewing" : "Preview"}</button>

}

function ShareStatus({ location, sampleData }) {
  const [share, setShare] = useState("notShared")

  const checkStatus = async () => {
    const readInitialSampleToLocation = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=read&endpoint=samples_to_locations", {
      method: "GET",
    })
    const sampleToLocation = await readInitialSampleToLocation.json()
    if (!sampleToLocation.samples_to_locations) {
      setShare("notShared")
    }
    else {
      const sampleLocation = sampleToLocation.samples_to_locations
      const filteredSampleLocation = sampleLocation.filter((x) => x.locations_id === location.id && x.samples_id === sampleData.id)
      if (filteredSampleLocation.length !== 0) {
        setShare("shared")
      }
    }
  }


  useEffect(() => {
    checkStatus()
  }, [])


  async function handleClickShare(locationID, sampleID) {
    setShare("shared")
    const createShare = await fetch(`http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=create&endpoint=samples_to_locations&sampleID=${sampleID}&locationID=${locationID}`, {
      method: "GET",
    });
  }

  async function handleClickUnshare(locationID, sampleID) {
    setShare("notShared")
    const readSampleToLocation = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=read&endpoint=samples_to_locations", {
      method: "GET",
    })
    const sampleToLocation = await readSampleToLocation.json()
    const sampleLocation = sampleToLocation.samples_to_locations
    const filteredSampleLocation = sampleLocation.filter((x) => x.locations_id === location.id && x.samples_id === sampleData.id)

    if (filteredSampleLocation.length !== 0) {
      const deleteShare = await fetch(`http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=delete&endpoint=samples_to_locations&id=${filteredSampleLocation[0].id}`, {
        method: "GET",
      });
    }

  }


  return (
    <tr>
      <th className={`share-button ${share === "notShared" && `active`}`} onClick={() => handleClickUnshare(location.id, sampleData.id)}>Not Shared</th>
      <th className={`share-button ${share === "shared" && `active`}`} onClick={() => handleClickShare(location.id, sampleData.id)}>Shared</th>
    </tr>
  )
}