import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./Chat/Chat";
import Home from "./Chat/Home";

export default function App() {
  return (
    <BrowserRouter>
     <Home/>
    </BrowserRouter>
  );
}
