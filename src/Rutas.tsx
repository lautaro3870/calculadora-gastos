import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CalculoReporte from "./components/Calculoreporte";
import Calculadora from "./components/Calculadora";
import Barra from "./components/Barra";
import Grafico from "./components/Grafico";

export default function Rutas() {
  return (
    <BrowserRouter>
      <Barra />
      <Routes>
        <Route path="/" element={<Navigate to="/calculadora" />} />
        <Route path="/calculadora" element={<Calculadora />} />
        <Route path="/reporte" element={<CalculoReporte />} />
        <Route path="/grafico" element={<Grafico />} />
      </Routes>
    </BrowserRouter>
  );
}
