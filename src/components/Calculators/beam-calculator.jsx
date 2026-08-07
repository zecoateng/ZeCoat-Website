import "../../styles/resources.css";
import { useState } from "react";


function circleOverlap(d, R, r) {
  if (d >= R + r) return 0;
  if (d <= Math.abs(R - r)) return Math.PI * Math.min(R, r) ** 2;
  const part1 = R * R * Math.acos((d * d + R * R - r * r) / (2 * d * R));
  const part2 = r * r * Math.acos((d * d + r * r - R * R) / (2 * d * r));
  const part3 = 0.5 * Math.sqrt((-d + R + r) * (d + R - r) * (d - R + r) * (d + R + r));
  return part1 + part2 - part3;
}

export default function BeamCalculator() {
  const [mirrorD, setMirrorD] = useState("100");
  const [beamD, setBeamD] = useState("50");
  const [nStr, setNStr] = useState("5");
  const [refl, setRefl] = useState(["0.95", "0.93", "0.90", "0.88", "0.85"]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const setN = (v) => {
    setNStr(v);
    const n = parseInt(v, 10);
    if (!isNaN(n) && n >= 1 && n <= 20) {
      setRefl((prev) => {
        const arr = prev.slice(0, n);
        while (arr.length < n) arr.push("0.90");
        return arr;
      });
    }
  };

  const setReflAt = (i, v) => setRefl((prev) => prev.map((x, idx) => (idx === i ? v : x)));

  const calculate = () => {
    const mD = parseFloat(mirrorD);
    const bD = parseFloat(beamD);
    const n = parseInt(nStr, 10);

    if (isNaN(mD) || isNaN(bD) || mD <= 0 || bD <= 0) {
      setResults(null);
      setError("Enter positive mirror and beam diameters.");
      return;
    }
    if (isNaN(n) || n < 1) {
      setResults(null);
      setError("Number of rings must be at least 1.");
      return;
    }
    if (bD >= mD) {
      setResults(null);
      setError("Beam diameter must be smaller than the mirror diameter.");
      return;
    }
    const R = refl.slice(0, n).map((x) => parseFloat(x));
    if (R.some((x) => isNaN(x))) {
      setResults(null);
      setError("Enter a reflectance value for every ring.");
      return;
    }
    setError("");

    const Rm = mD / 2;
    const Rb = bD / 2;
    const maxCenter = Rm - Rb;
    const edges = [];
    for (let i = 0; i <= n; i++) edges.push((i * Rm) / n);
    const Abeam = Math.PI * Rb * Rb;

    const avgAt = (d) => {
      let s = 0;
      for (let k = 0; k < n; k++) {
        const ai = circleOverlap(d, Rb, edges[k + 1]) - circleOverlap(d, Rb, edges[k]);
        s += ai * R[k];
      }
      return s / Abeam;
    };

    const nRadial = 300;
    let min = Infinity;
    let max = -Infinity;
    for (let j = 0; j < nRadial; j++) {
      const d = (maxCenter * j) / (nRadial - 1);
      const v = avgAt(d);
      if (v < min) min = v;
      if (v > max) max = v;
    }

    const nMC = 10000;
    let mean = 0;
    for (let i = 0; i < nMC; i++) {
      const d = maxCenter * Math.sqrt(Math.random());
      mean += avgAt(d);
    }
    mean /= nMC;

    setResults({ min, mean, max });
  };

  const downloadCSV = () => {
    if (!results) return;
    let csv = "Metric,Beam_Averaged_Reflectance\n";
    csv += "Min," + results.min + "\n";
    csv += "Mean," + results.mean + "\n";
    csv += "Max," + results.max + "\n\n";
    csv += "Ring,Reflectance\n";
    refl.forEach((r, i) => {
      csv += (i + 1) + "," + r + "\n";
    });
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "beam_averaged_reflectance.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="calculators-container">
      <div className="calculator-card">
        <div className="calculator-header">
          <h2>Beam Averaging Calculator</h2>
          <p>Beam-averaged reflectance across a mirror aperture, as the beam scans from center to edge.</p>
        </div>

        <div className="tele-body">
          <div className="beam-inputs-grid">
            <div className="input-group">
              <label htmlFor="mirrorD">Mirror Diameter</label>
              <input type="number" id="mirrorD" value={mirrorD} onChange={(e) => setMirrorD(e.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor="beamD">Beam Diameter</label>
              <input type="number" id="beamD" value={beamD} onChange={(e) => setBeamD(e.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor="nAnnuli">Number of Rings (annuli)</label>
              <input type="number" id="nAnnuli" min="1" max="20" value={nStr} onChange={(e) => setN(e.target.value)} />
            </div>
          </div>

          <div className="beam-rings">
            <label>Reflectance per ring (Ring 1 = innermost, values 0–1)</label>
            <div className="beam-rings-grid">
              {refl.map((val, i) => (
                <div className="input-group" key={i}>
                  <label htmlFor={"ring" + i}>Ring {i + 1}</label>
                  <input
                    type="number"
                    id={"ring" + i}
                    step="0.01"
                    min="0"
                    max="1"
                    value={val}
                    onChange={(e) => setReflAt(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="beam-actions">
            <button className="calc-button" type="button" onClick={calculate}>Run Calculation</button>
            <button className="calc-button" type="button" onClick={downloadCSV} disabled={!results}>Download CSV</button>
          </div>

          <div className="tele-results-full">
            {error && <p className="tele-error"><strong>Error:</strong> {error}</p>}
            {!error && !results && (
              <p className="tele-hint">Enter your mirror and beam sizes, set a reflectance for each ring, then click "Run Calculation".</p>
            )}
            {!error && results && (
              <div className="output-results">
                <div className="result-item">
                  <span className="result-label">Minimum Beam-Averaged Reflectance</span>
                  <span className="result-value">{results.min.toFixed(4)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Mean Beam-Averaged Reflectance</span>
                  <span className="result-value">{results.mean.toFixed(4)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Maximum Beam-Averaged Reflectance</span>
                  <span className="result-value">{results.max.toFixed(4)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
