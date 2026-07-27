import { useState, useEffect } from "react";

interface TutorialOverlayProps {
  onClose: () => void;
}

const STEPS = [
  {
    title: "Bienvenido a Merchant Quest",
    emoji: "⚔️",
    content: "Eres un joven comerciante en un mundo lleno de culturas, tesoros y aventuras. Tu objetivo: comerciar, aprender y convertirte en la leyenda del mercado.",
    tip: "Cada zona del mapa representa una cultura diferente con sus propias reglas del comercio.",
  },
  {
    title: "El Mapa del Mundo",
    emoji: "🗺️",
    content: "El mapa muestra 8 zonas culturales. Haz clic en una zona para viajar a ella. Algunas zonas están bloqueadas hasta que subas de nivel.",
    tip: "Arrastra el mapa con el ratón para explorar. Usa las flechas para moverte.",
  },
  {
    title: "Personajes (NPCs)",
    emoji: "👤",
    content: "Cada zona tiene personajes especiales. Haz clic en un NPC para hablar con ellos. Pueden ofrecerte comerciar o enseñarte lecciones de su cultura.",
    tip: "Los NPC con el ícono 📜 pueden enseñarte lecciones y darte insignias.",
  },
  {
    title: "Comerciar",
    emoji: "🤝",
    content: "Al hablar con un NPC mercader, puedes comerciar. Selecciona un item, indica la cantidad y confirma. Cada comercio te da XP y un token de validación.",
    tip: "Los tokens prueban que la transacción fue real. Puedes verificarlos con el botón 🔍 Token.",
  },
  {
    title: "Monedas y Nivel",
    emoji: "💰",
    content: "Ganas oro y XP con cada comercio. Al acumular suficiente XP, subes de nivel y desbloqueas nuevas zonas. Tu panel de jugador muestra tu progreso.",
    tip: "Tu panel de jugador a la izquierda muestra tu nivel, oro e inventario.",
  },
  {
    title: "Insignias y Logros",
    emoji: "🏆",
    content: "Habla con NPC profesores para aprender lecciones. Responde un quiz sobre la cultura para ganar insignias. Cada insignia da oro y XP extra.",
    tip: "Abre el panel de 🏆 Insignias para ver todas las que has ganado.",
  },
  {
    title: "Tu Avatar",
    emoji: "🎭",
    content: "Personaliza tu personaje con diferentes avatares. Algunos se desbloquean al subir de nivel, otros se compran con oro.",
    tip: "Haz clic en 🭢 Avatar en la barra superior para cambiar tu apariencia.",
  },
  {
    title: "¡Listo para la Aventura!",
    emoji: "🚀",
    content: "Empieza viajando al Village Market y habla con Doña Mercadera. Ella te dará tu primera lección sobre el comercio. ¡Buena suerte, comerciante!",
    tip: "Usa el botón ❓ en cualquier momento si necesitas ver esta guía de nuevo.",
  },
];

export default function TutorialOverlay({ onClose }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const current = STEPS[step];

  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [step]);

  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <div style={overlayStyle}>
      <div style={containerStyle}>
        {/* Progress bar */}
        <div style={progressBarBg}>
          <div style={{ ...progressBarFill, width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        {/* Step counter */}
        <div style={{ textAlign: "center", fontSize: 11, color: "#666", marginTop: 8 }}>
          Paso {step + 1} de {STEPS.length}
        </div>

        {/* Content */}
        <div style={{ ...contentStyle, opacity: fadeIn ? 1 : 0, transition: "opacity 0.3s" }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>{current.emoji}</div>
          <h2 style={{ color: "#ffd700", margin: "0 0 12px", fontSize: 22 }}>{current.title}</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{current.content}</p>

          {/* Tip */}
          <div style={tipStyle}>
            <span style={{ color: "#4a9", fontWeight: "bold" }}>💡 Consejo: </span>
            <span style={{ color: "#8f8", fontSize: 13 }}>{current.tip}</span>
          </div>
        </div>

        {/* Navigation buttons */}
        <div style={navStyle}>
          {!isFirst && (
            <button onClick={() => setStep(step - 1)} style={navBtnStyle}>
              ← Atrás
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button
            onClick={isLast ? onClose : () => setStep(step + 1)}
            style={{
              ...navBtnStyle,
              background: isLast ? "linear-gradient(135deg, #ffd700, #cc9900)" : "linear-gradient(135deg, #4a7c59, #3a6b49)",
              color: isLast ? "#1a1a2e" : "#fff",
              fontWeight: "bold",
              minWidth: 140,
            }}
          >
            {isLast ? "¡Empezar a Jugar!" : "Siguiente →"}
          </button>
        </div>

        {/* Skip link */}
        {!isLast && (
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 12, marginTop: 8, textAlign: "center", width: "100%" }}
          >
            Saltar tutorial
          </button>
        )}
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "#000000ee",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const containerStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a1a 100%)",
  border: "2px solid #ffd700",
  borderRadius: 16,
  padding: "0 28px 24px",
  width: 520,
  maxWidth: "92vw",
  boxShadow: "0 0 60px #ffd70033, 0 20px 40px #00000088",
};

const progressBarBg: React.CSSProperties = {
  height: 4,
  background: "#333",
  borderRadius: "16px 16px 0 0",
  overflow: "hidden",
};

const progressBarFill: React.CSSProperties = {
  height: "100%",
  background: "linear-gradient(90deg, #4a9, #ffd700)",
  borderRadius: 4,
  transition: "width 0.4s ease",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const tipStyle: React.CSSProperties = {
  background: "#111",
  border: "1px solid #333",
  borderRadius: 8,
  padding: "10px 14px",
  marginTop: 16,
  textAlign: "left" as const,
  fontSize: 13,
  lineHeight: 1.5,
};

const navStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 8,
};

const navBtnStyle: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  background: "#333",
  color: "#ddd",
  fontSize: 14,
  cursor: "pointer",
  transition: "all 0.2s",
};
