import { useParams } from "react-router-dom";
// import { useState } from "react";
import { initialSample } from "../data/sample";
import Template from "../components/Template";

const uqLocations = ["Great Court, UQ", "General Purpose South, UQ", "Near UQ Lakes Bus Station, UQ", "UQU Shops, UQ", "UQ Sport Courts, UQ"]

export default function Share() {
  let { id } = useParams();
  let [sample] = initialSample.filter((sample) => sample.id === id);

  let { title, created } = sample;

  return (
    <Template title="Share This Sample:">
      <div className="page-content" id="shareTitle">
        <section className="share-title">
          <h3>{title}</h3>
          <time>{created}</time>
        </section>
        <nav>
          <button className="content-button">Preview</button>
        </nav>
      </div>
      <div id="locationList">
        <Location />
      </div>
    </Template>
  );
}

function Location() {
  return (
    uqLocations.map(location =>
      <div className="each-location">
        <section>
          {location}
        </section>
        <nav>
          <table id="shareTable">
            <tbody>
              <tr>
                <th className={`share-button`}>Shared</th>
                <th className={`share-button`}>Not Shared</th>
              </tr>
            </tbody>
          </table>
        </nav>
      </div>
    )
  )
}