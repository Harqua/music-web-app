import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import { initialSample } from "../data/sample";
import Template from "../components/Template";



function Sample({ id, name, datetime }) {

  const [share, setShare] = useState("notShared")
  let contentButtonClass = "";
  let shareButton="";

  const checkStatus = async () => {


    const readInitialSampleToLocation = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=read&endpoint=samples_to_locations", {
      method: "GET",
    })
    const sampleToLocation = await readInitialSampleToLocation.json()
    if (!sampleToLocation.samples_to_locations) {
      
    }
    else {
      const sampleLocation = sampleToLocation.samples_to_locations
      const filteredSampleLocation = sampleLocation.filter((x) => x.samples_id === id)
      if (filteredSampleLocation.length !== 0) {
        setShare("shared")
      }
    }
  }

  if (share ==="notShared"){
    contentButtonClass= "content-button"
    shareButton = "Share"
  }
  else if (share ==="shared"){
    contentButtonClass= "content-button3";
    shareButton = "Shared";
  }

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
            <button className="content-button">Preview</button>
            <Link to={`/Edit/${id}`}><button className="content-button2">Edit</button></Link>
          </nav>
        </li>
      </ul>
    </div>
  );
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
        <Sample key={sample.id} id={sample.id} name={sample.name} datetime={sample.datetime} />
      ))}
      <CreateSample addSample={addSample} />
    </Template>
  );
}

function CreateSample({ addSample }) {


  const handleClick = async (event) => {
    event.preventDefault();
    await addSample()
    // const createSampleResponse = await fetch("http://wmp.interaction.courses/api/v1/?apiKey=S6g0c0vp&mode=create&endpoint=samples&sampleType=piano&sampleName=NewSample", {
    //   method: "POST",
    //   body: JSON.stringify(recording_data),

    // });
    // const createdSample = await createSampleResponse.json()

    // const timeDate = new Date();
    // const time = timeDate.toLocaleString('en-AU', { hour: 'numeric', minute: 'numeric', hour12: true });
    // const date = timeDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

    // const sample = {
    //   id: `${newId}`, title: "New Sample", created: `${time} on ${date}`, type: "piano", recording_data: [
    //     { "B": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
    //     { "A": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
    //     { "G": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
    //     { "F": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
    //     { "E": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
    //     { "D": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
    //     { "C": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] }
    //   ]
    // };


  };


  return (
    <div className="create-sample">
      <button onClick={handleClick} className="content-button2">Create Sample</button>
    </div>
  )
}