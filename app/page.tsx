// VERSION 3.1 — FINAL FIX (REMOVE BORDER CONFLICT COMPLETELY)

"use client";

import { useState, useRef } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [view, setView] = useState<{ [k: number]: "before" | "after" }>({});
  const [loading, setLoading] = useState<{ [k: number]: boolean }>({});
  const [uploading, setUploading] = useState(false);

  const openFile = () => inputRef.current?.click();

const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const fileList = e.target.files;
  if (!fileList) return;

  const arr: File[] = Array.from(fileList);

  if (!arr.length) return;

  setUploading(true);

  setTimeout(() => {
    setFiles(arr);
    setImages(arr.map((f) => URL.createObjectURL(f)));
    setUploading(false);
  }, 300);
};

  const generate = () => {
    if (!files.length) return;

    const l: any = {};
    files.forEach((_, i) => (l[i] = true));
    setLoading(l);

    setTimeout(() => {
      const v: any = {};
      files.forEach((_, i) => (v[i] = "after"));
      setView(v);
      setLoading({});
    }, 8000);
  };

  const startRelic = (i: number) => {
    setLoading((prev) => ({ ...prev, [i]: true }));

    setTimeout(() => {
      setLoading((prev) => ({ ...prev, [i]: false }));
      setView((prev) => ({ ...prev, [i]: "after" }));
    }, 8000);
  };

  const clear = () => {
    setFiles([]);
    setImages([]);
    setView({});
    setLoading({});
  };

  const toggle = (i: number, mode: "before" | "after") => {
    setView((prev) => ({
      ...prev,
      [i]: mode,
    }));
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>
        GUITAR <span style={styles.blue}>AGING STUDIO</span>
      </h1>

      <div style={styles.drop} onClick={openFile}>
        Drop billeder her eller klik

        {uploading && (
          <div style={styles.progressWrap}>
            <div style={styles.progressBar} />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
        style={{ display: "none" }}
      />

      <div style={styles.buttons}>
        <Circle text="Browse" color="#3b82f6" onClick={openFile} />
        <Circle text="Generate" color="#22c55e" onClick={generate} />
        <Circle text="Clear" color="#ef4444" onClick={clear} />
      </div>

      <div style={styles.grid}>
        {images.map((img, i) => {
          const original = files[i]
            ? URL.createObjectURL(files[i])
            : img;

          const mode = view[i] || "before";

          return (
            <div key={i} style={styles.card}>
              <div style={styles.imageWrap}>
                <img
                  src={mode === "before" ? original : img}
                  style={styles.image}
                />

                {!loading[i] && (
                  <div
                    style={{
                      ...styles.stamp,
                      borderColor:
                        mode === "after" ? "#7f1d1d" : "#16a34a",
                      color:
                        mode === "after" ? "#fecaca" : "#bbf7d0",
                    }}
                  >
                    {mode === "after" ? "AGED" : "ORIGINAL"}
                  </div>
                )}

                {loading[i] && (
                  <div style={styles.overlay}>
                    <div style={styles.pickWrap}>
                      <svg viewBox="0 0 100 110" style={styles.pick}>
                        <path
                          d="M50 12
                             C72 12 88 28 85 60
                             C82 90 64 104 50 104
                             C36 104 18 90 15 60
                             C12 28 28 12 50 12 Z"
                          fill="rgba(0,0,0,0.45)"
                          strokeWidth="3"
                          strokeDasharray="300"
                          strokeDashoffset="300"
                          className="trace"
                        />
                      </svg>

                      <div style={styles.pickText}>AGING...</div>
                    </div>
                  </div>
                )}
              </div>

              <div style={styles.toggle}>
                <button
                  style={{
                    ...styles.btn,
                    opacity: mode === "before" ? 1 : 0.5,
                  }}
                  onClick={() => toggle(i, "before")}
                  type="button"
                >
                  Original
                </button>

                <button
                  style={{
                    ...styles.btnActive,
                    opacity: mode === "after" ? 1 : 0.5,
                  }}
                  onClick={() => startRelic(i)}
                  type="button"
                >
                  Relic
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes draw {
          from { stroke-dashoffset: 300; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes colorShift {
          0% { stroke: #22c55e; }
          33% { stroke: #3b82f6; }
          66% { stroke: #c084fc; }
          100% { stroke: #22c55e; }
        }

        .trace {
          animation: draw 2.6s linear 3, colorShift 2.6s linear 3;
        }

        @keyframes pulse {
          0% { color: #86efac; }
          50% { color: #c084fc; }
          100% { color: #86efac; }
        }
      `}</style>
    </main>
  );
}

function Circle({ text, color, onClick }: any) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 90,
        height: 90,
        borderRadius: "50%",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: color,
        background: "#020617",
        color: "white",
        cursor: "pointer",
        transform: hover ? "scale(1.12)" : "scale(1)",
        boxShadow: hover
          ? `0 0 40px ${color}, 0 0 80px ${color}66`
          : `0 0 12px ${color}55`,
        transition: "all 0.2s ease",
      }}
    >
      {text}
    </button>
  );
}

const styles: any = {
  page: {
    background: "#020617",
    minHeight: "100vh",
    padding: 40,
    color: "white",
  },

  title: {
    fontSize: 42,
    marginBottom: 30,
  },

  blue: {
    color: "#60a5fa",
  },

  drop: {
    padding: 60,
    borderRadius: 20,
    background: "#0f172a",
    textAlign: "center",
    marginBottom: 30,
    cursor: "pointer",
    position: "relative",
  },

  progressWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 4,
  },

  progressBar: {
    width: "30%",
    height: "100%",
    background: "#22c55e",
    animation: "bar 1s linear infinite",
  },

  buttons: {
    display: "flex",
    gap: 20,
    marginBottom: 30,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
    gap: 20,
  },

  card: {
    background: "#1e293b",
    padding: 10,
    borderRadius: 12,
  },

  imageWrap: {
    position: "relative",
  },

  image: {
    width: "100%",
    borderRadius: 10,
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },

  pickWrap: {
    position: "relative",
    width: 150,
    height: 150,
  },

  pick: {
    width: "100%",
    height: "100%",
  },

  pickText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 18,
    fontWeight: 800,
    fontStyle: "italic",
    animation: "pulse 2s infinite",
  },

  stamp: {
    position: "absolute",
    top: 12,
    left: 12,
    transform: "rotate(-8deg)",
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: 2,
    padding: "4px 10px",
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 6,
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(2px)",
    textShadow: "0 0 6px rgba(0,0,0,0.6)",
  },

  toggle: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },

  btn: {
    padding: "6px 12px",
    background: "#334155",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: 6,
  },

  btnActive: {
    padding: "6px 12px",
    background: "#22c55e",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: 6,
  },
};
