import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const location = useLocation().pathname;
    return (
        <header className="page-header">
            <Link to="/">
                {location === "/" ? <h1>OgCiSum</h1> : <h1><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg> OgCiSum</h1>}
            </Link>
            <nav className="main-menu">
                <h3>Create & Share Samples, Listen in Mobile App!</h3>
            </nav>
        </header>
    );

}