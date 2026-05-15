import { useState } from "react";
import preguntas from "../data/preguntas.json";

export default function useGame(triggerErrorFx) {
  const [equipoInicial, setEquipoInicial] = useState(1);
  const [puntosEnJuego, setPuntosEnJuego] = useState(0);
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [reveladas, setReveladas] = useState([]);
  const [errores, setErrores] = useState(0);
  const [equipo1, setEquipo1] = useState(0);
  const [equipo2, setEquipo2] = useState(0);
  const [equipoActivo, setEquipoActivo] = useState(1);
  const [stealMode, setStealMode] = useState(false);
  const [stealTeam, setStealTeam] = useState(null);
  const MAX_ERRORS = 3;

  const preguntaActual = preguntas[preguntaIndex];

  const sounds = {
    reveal: new Audio("/sounds/correct.mp3"),
    fail: new Audio("/sounds/incorrect.mp3"),
  };

  const playSound = (name) => {
    sounds[name].currentTime = 0;
    sounds[name].volume = 0.7;
    sounds[name].play();
  };

  const revelar = (index) => {
    if (reveladas.includes(index)) return;
    setReveladas((prev) => [...prev, index]);
    const puntos = preguntaActual.respuestas[index].puntos;
    setPuntosEnJuego((p) => p + puntos);
    playSound("reveal");
  };

  const error = () => {
    setErrores((e) => {
      const newErrors = e + 1;
      if (newErrors >= 3) {
        const roboEquipo = equipoActivo === 1 ? 2 : 1;
        setStealMode(true);
        setStealTeam(roboEquipo);
        setEquipoActivo(roboEquipo);
      }
      return newErrors;
    });
    playSound("fail");
    triggerErrorFx();
  };

  const cambiarEquipo = () => {
    setEquipoActivo((prev) => (prev === 1 ? 2 : 1));
  };

  const finalizarRonda = () => {
    setPuntosEnJuego(0);
    setErrores(0);
    setReveladas([]);
    setStealMode(false);
    setStealTeam(null);
  };

  const asignarTotalPuntos = () => {
    if (equipoActivo === 1) {
      setEquipo1((e) => e + puntosEnJuego);
    } else {
      setEquipo2((e) => e + puntosEnJuego);
    }

    finalizarRonda();
  }

  const responderRobo = (index) => {
    playSound("reveal");
    const respuesta = preguntaActual.respuestas[index];
    if (!respuesta) return;

    if (!reveladas.includes(index)) {
      setReveladas((prev) => [...prev, index]);
    }

    const puntos = preguntaActual.respuestas[index].puntos;
    setPuntosEnJuego((p) => p + puntos);
    setStealMode(false);

  };

  const fallarRobo = () => {
    playSound("fail");
    triggerErrorFx();

    const banco = puntosEnJuego;

    if (equipoActivo === 1) {
      setEquipo2((p) => p + banco);
    } else if (equipoActivo === 2) {
      setEquipo1((p) => p + banco);
    }

    finalizarRonda();
  };

  return {
    preguntaActual,
    preguntaIndex,
    preguntas,
    reveladas,
    errores,
    equipo1,
    equipo2,
    equipoActivo,
    revelar,
    error,
    stealMode,
    stealTeam,
    responderRobo,
    fallarRobo,
    cambiarEquipo,
    finalizarRonda,
    asignarTotalPuntos,
    puntosEnJuego,
  };
}