import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { initialSample } from "../data/sample";
import Template from "../components/Template";

export default function Share() {
  let { id } = useParams();
  let [sample] = initialSample.filter((sample) => sample.id === id);

  let { title, created } = sample;

  return (
    <Template title="Share This Sample:">
      <div className="page-content" id = "shareTitle">
        <section className="share-title">
          <h3>{title}</h3>
          <time>{created}</time>
        </section>
        <nav>
          <button className="content-button">Preview</button>
        </nav>
      </div>
    </Template>
  );
}