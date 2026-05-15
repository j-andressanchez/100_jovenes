import { useState } from "react";
import useGame from "./hooks/useGame";

export default function App() {
  const [showErrorFx, setShowErrorFx] = useState(false);
  const triggerErrorFx = () => {
    setShowErrorFx(true);
    setTimeout(() => setShowErrorFx(false), 1800);
  };
  const game = useGame(triggerErrorFx);
  const btnBase = "font-bold rounded-lg text-xs sm:text-sm transition-all duration-150 shadow-md active:scale-95 hover:scale-[1.03]";
  const team1Active = "opacity-100 shadow-[0_0_25px_rgba(59,130,246,0.8)] ring-2 ring-blue-400 transition-all duration-300";
  const team2Active = "opacity-100 shadow-[0_0_25px_rgba(168,85,247,0.8)] ring-2 ring-purple-400 transition-all duration-300";
  
  return (
    <div className="h-screen overflow-hidden bg-black text-white px-3 sm:px-6 md:px-10 py-2 flex flex-col">
      
      <div className="flex flex-col gap-3 overflow-visible">
  
        {/* MAIN LAYOUT */}
        <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[320px_720px] justify-center gap-4 overflow-visible">

          {/* SCOREBOARD (IZQUIERDA) */}
          <div className="flex flex-col gap-6 lg:gap-5">

            <img
              src="/images/title_image.png"
              alt="100 jóvenes dijeron"
              className="w-60 mx-auto animate-[glowPulse_6s_ease-in-out_infinite]"
            />

            <div className="bg-yellow-500 text-black font-black text-center p-2 rounded-xl shadow-lg">
              <h2 className="text-sm">PUNTOS EN JUEGO</h2>
              <p className="text-2xl">{game.puntosEnJuego}</p>
            </div>

            <div className="flex justify-center gap-3 sm:gap-4 text-2xl sm:text-3xl md:text-4xl min-h-[40px] items-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i}> {i < game.errores ? "❌" : "⭕"} </span>
              ))}
            </div>
  
            <div className={`bg-blue-900 p-2 rounded-xl text-center transition-all duration-300 ${ game.equipoActivo === 1 ? team1Active : "opacity-60" }`}>
              <h2 className="text-sm">Equipo 1</h2>
              <p className="text-3xl text-yellow-300 font-bold">{game.equipo1}</p>
            </div>

            <div className={`bg-purple-900 p-2 rounded-xl text-center transition-all duration-300 ${ game.equipoActivo === 2 ? team2Active : "opacity-60" }`}>
              <h2 className="text-sm">Equipo 2</h2>
              <p className="text-3xl text-yellow-300 font-bold">{game.equipo2}</p>
            </div>

          </div>

          {/* JUEGO (DERECHA) */}
          <div className="flex flex-col gap-3 overflow-hidden pt-6 max-w-2xl mx-auto w-full">
            
            {/* PREGUNTA */}
            <div className="bg-gray-900 p-4 rounded-2xl border border-blue-600">
              <h3 className="text-xl sm:text-2xl md:text-2xl font-black text-center text-white/80">
                {game.preguntaActual.pregunta}
              </h3>
            </div>

            {/* RESPUESTAS */}
            <div className="bg-gray-900 p-4 rounded-2xl border border-blue-600 flex flex-col gap-2"> {game.preguntaActual.respuestas.map((r, i) => (
              <div key={i}
                className={`grid grid-cols-[1fr_80px] items-center px-3 py-2 rounded-lg bg-blue-950 transition-all duration-300 ${
                  game.reveladas.includes(i) ? "animate-[revealCard_0.4s_ease-out]" : "opacity-70"
                }`}
              >
                <span className="pl-3 sm:pl-5 text-base sm:text-lg md:text-xl font-semibold tracking-wide text-white/80">
                  {game.reveladas.includes(i) ? r.texto : " - "}
                </span>

                <span className="text-yellow-300 font-black text-2xl sm:text-3xl md:text-3xl text-center drop-shadow">
                  {game.reveladas.includes(i) ? r.puntos : "?"}
                </span>

              </div>
            ))}</div>

            {/* CONTROLES (FOOTER) */}
            <div className="w-full flex justify-center mt-3">
              <div className="grid grid-cols-4 grid-rows-2 gap-2">
                
                {game.preguntaActual.respuestas.map((_, i) => (
                  <button key={i} onClick={() => game.revelar(i)} className={`${btnBase} bg-indigo-600 hover:bg-indigo-500 text-white p-2`}>
                    Revelar {i + 1}
                  </button>
                ))}

                <button onClick={game.cambiarEquipo} className={`${btnBase} bg-slate-600 hover:bg-slate-500 text-white p-2`}>
                  Cambiar equipo
                </button>

                <button onClick={game.error} className={`${btnBase} bg-red-700 px-3 hover:bg-red-600 py-2 rounded-lg text-xs sm:text-sm`}>
                  ❌ Error
                </button>

                <button onClick={game.asignarTotalPuntos} className={`${btnBase} bg-emerald-600 hover:bg-slate-500 text-white p-2`}>
                  🏁 Terminar
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* OVERLAY DE ERROR */}
      {showErrorFx && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">

          {/* fondo rojo flash */}
          <div className="absolute inset-0 bg-red-800 opacity-30 animate-[flash_0.3s_ease-out]" />

          {/* X gigante */}
          <div className="text-red-500 text-[200px] font-black animate-[xPop_1.8s_ease-in-out] drop-shadow-[0_0_40px_rgba(255,0,0,1)]">
            ❌
          </div>

        </div>
      )}

      {/* OVERLAY STEAL MODE */}
      {game.stealMode && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">

          <div className="text-center animate-[revealCard_0.4s_ease-out]">

            <h1 className="text-yellow-400 text-4xl font-black mb-6 animate-pulse">
              💡 OPORTUNIDAD DE ROBO
            </h1>

            <p className="text-white mb-4">
              Equipo {game.equipoActivo} puede robar los puntos
            </p>

            <div className="flex gap-4 justify-center flex-wrap">

              {game.preguntaActual.respuestas.map((r, i) => {

                // ✅ ya revelada
                if (game.reveladas.includes(i)) {
                  return (
                    <div
                      key={i}
                      className="bg-emerald-700 border border-emerald-300 px-5 py-2 rounded-xl font-black tracking-wide text-white shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                    >
                      {r.texto}
                    </div>
                  );
                }

                // ❓ aún oculta
                return (
                  <button
                    key={i}
                    onClick={() => game.responderRobo(i)}
                    className="bg-blue-950 border border-yellow-400 hover:bg-blue-800 px-5 py-2 rounded-xl text-yellow-300 font-bold"
                  >
                    Respuesta {i + 1}
                  </button>
                );

              })}

            </div>

            <button
              onClick={game.fallarRobo}
              className="mt-6 bg-red-600 px-4 py-2 rounded-lg"
            >
              ❌ Fallar robo
            </button>

          </div>

        </div>
      )}
     
    </div>
  );
}