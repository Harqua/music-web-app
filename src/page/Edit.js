import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { initialSample } from "../data/sample";
import Template from "../components/Template";

export default function Edit() {
  let { id } = useParams();
  let [sample] = initialSample.filter((sample) => sample.id === id);
  let { title, created } = sample;

  return (
    <Template title="Editing This Sample:">
      <div className="page-content">
        <section className="edit-title">
          <EditButtons Sample title={title} sample={sample} />
        </section>
      </div>
    </Template>
  );
}

function EditButtons({ title, sample }) {
  const handleClickPreview = (event) => { }

  const handleClickSave = (event) => {
    const timeDate = new Date();
    const time = timeDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const date = timeDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })

  }

  return (
    <>
      <form>
        <input type="text" name="sample-name" id="sampleTitle" defaultValue={title}></input>
        <nav className="sample-edit-button">
          <button onClick={handleClickPreview} className="content-button">Preview</button>
          <button onClick={handleClickSave} className="content-button2">Save</button>
        </nav>
      </form>

    </>
  )
}


function AddSample() {

}