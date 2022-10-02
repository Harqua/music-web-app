import { Link } from "react-router-dom";
import { useState } from "react";
import { initialSample } from "../data/sample";
import Template from "../components/Template";



function Sample({ id, title, created, type, notes }) {

  return (
    <div className="page-content">
      <ul>
        <li>
          <section className="content-title">
            <h3>{title}</h3>
            <time>{created}</time>
          </section>
          <nav>
            <Link to={`/Share/${id}`}><button className="content-button">Share</button></Link>
            <button className="content-button">Preview</button>
            <Link to={`/Edit/${id}`}><button className="content-button2">Edit</button></Link>
          </nav>
        </li>
      </ul>
    </div>
  );
}



export default function App() {

  const [samples, setSamples] = useState(initialSample);
  const currentId = samples.length;
  const addSample = (sample) => {
    setSamples([...samples, sample])
    initialSample.push(sample)
  };
  return (
    <Template title="Samples You've Created">
      {samples.map((sample) => (
        <Sample key={sample.id} id={sample.id} title={sample.title} created={sample.created} />
      ))}
      <CreateSample addSample={addSample} currentId={currentId} />
    </Template>
  );
}

function CreateSample({ addSample, currentId }) {

  const handleClick = (event) => {
    event.preventDefault();
    const timeDate = new Date();
    const time = timeDate.toLocaleString('en-AU', { hour: 'numeric', minute: 'numeric', hour12: true });
    const date = timeDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    const nextId = currentId + 1;
    const newId = nextId.toString();
    const sample = { id: `${newId}`, title: "New Sample", created: `${time} on ${date}`, type: "piano", notes:[
      { "B": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "A": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "G": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "F": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "E": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "D": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { "C": [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] }
    ] };
    addSample(sample);

  };


  return (
    <div className="create-sample">
        <button onClick={handleClick} className="content-button2">Create Sample</button>
    </div>
  )
}