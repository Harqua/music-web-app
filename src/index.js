import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./page/App";
import Edit from "./page/Edit";
import Share from "./page/Share";
import { guitar, piano, frenchHorn, drum } from "./data/instruments.js";
import { toneObject, toneTransport, guitarTonePart, pianoTonePart, frenchHornTonePart, drumTonePart } from "./data/instruments.js";

// toneObject.start().then(() => {
//     console.log("wahoo1")
//     toneObject.loaded().then(()=>console.log("wahoo2"))
// })

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/Edit/:id" element={<Edit toneObject={toneObject} toneTransport={toneTransport} guitarTonePart={guitarTonePart}/>} />
                <Route path="/Share/:id" element={<Share />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);