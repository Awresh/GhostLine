import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./Chat/Chat";
import Home from "./Chat/Home";
import Chat1 from "./Chat/Chat1";

export default function App() {
  return (
    <BrowserRouter>
     {/* <Home/> */}
     <Chat1/>
    </BrowserRouter>
  );
}
