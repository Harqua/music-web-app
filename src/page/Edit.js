import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { initialSample } from "../data/sample";
import Template from "../components/Template";

export default function Edit() {
  let { id } = useParams();
  let [sample] = initialSample.filter((sample) => sample.id === id);
  let { title } = sample;

  return (
    <Template title="Editing This Sample:">
      <div className="page-content">
        <section className="edit-title">
          <EditButtons Sample sample={sample} />
        </section>
      </div>
    </Template>
  );
}

function EditButtons({ sample }) {

  const [editSample, setEditSample] = useState({ id: `${sample.id}`, title: `${sample.title}`, created: `${sample.created}` })
  const timeDate = new Date();
  const time = timeDate.toLocaleString('en-AU', { hour: 'numeric', minute: 'numeric', hour12: true });
  const date = timeDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  const dateTime = `${time} on ${date}`
  const handleClickPreview = (event) => { }

  const handleClickSave = (event) => {
    event.preventDefault();
    // initialSample[sample.id-1].title = event.target.defaultValue
    initialSample[editSample.id-1] = editSample
    

  }
  const saveOnChange = (event) => {
    event.preventDefault();
    setEditSample({...editSample, title: event.target.value, created: `${dateTime}`})
  }

  return (
    <>
      <form onSubmit={handleClickSave}>
        <input type="text" name="title" id="sampleTitle" defaultValue={editSample.title} onChange={saveOnChange}></input>
        <nav className="sample-edit-button">
          <button onClick={handleClickPreview} className="content-button">Preview</button>
          <button type="submit" className="content-button2">Save</button>
        </nav>
      </form>

    </>
  )
}


function AddSample() {

}