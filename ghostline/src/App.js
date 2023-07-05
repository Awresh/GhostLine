import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./Chat/Chat";

export default function App() {
  return (
    <BrowserRouter>
    <Chat/>
    </BrowserRouter>
  );
}
