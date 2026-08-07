import "../../styles/resources.css";
import { useState } from "react";

const degToRad = (deg) => deg * (Math.PI / 180);

const LIMITS = {
  D1: { min: 75, max: 650, label: "75 to 650 mm" },
  F: { min: 225, max: 2000, label: "225 to 2000 mm" },
  Ft: { min: 675, max: 6000, label: "675 to 6000 mm" },
  b: { min: 50, max: 450, label: "50 to 450 mm" },
  FOV: { min: 0, max: 2, label: "0° to 2°" },
};

const SURFACE_FINISH = ["0.3 nm", "0.5 nm", "1 nm", "2 nm", "3 nm", "4 nm", "5 nm"];

const WAVELENGTHS = [
  ["EUV 1", "Extended Ultraviolet 1 (30 nm)"],
  ["EUV 2", "Extended Ultraviolet 2 (40 nm)"],
  ["EUV 3", "Extended Ultraviolet 3 (50 nm)"],
  ["FUV 1", "Far Ultraviolet 1 (100 nm)"],
  ["FUV 2", "Far Ultraviolet 2 (120 nm)"],
  ["UV-Vis", "Ultraviolet - Visible (300 nm)"],
  ["VIS", "Visible (400 nm)"],
  ["IR", "Infrared (6 μm)"],
];

const BASE_COATINGS = [
  ["None", "None"],
  ["Iridium", "Binder + Iridium (30-90 nm)"],
  ["EUV 30-50", "Binder + EUV Multilayer (30-50 nm)"],
  ["EUV 50-60", "Binder + EUV Multilayer (50-70 nm)"],
  ["EUV 60-90", "Binder + EUV Multilayer (60-90 nm)"],
];

const FIRST_SURFACE = [
  ["Aluminium-Space", "Aluminum Coated in Space (85 nm to Radio)"],
  ["AlF", "Protected Aluminum AlF (100 nm to Radio)"],
  ["MgF2", "Protected Aluminum MgF₂ (120 nm to Radio)"],
  ["Ag-Low-Pol", "Protected Silver - Low Polarization (300-1000 nm)"],
  ["Ag-IR", "Protected Silver (ZC-1251) - Infrared (1-40 μm)"],
  ["Ag-Kepler", "Protected Silver - Kepler Band (430-1300 nm)"],
  ["Ag-Transparent", "Protected Silver - Kepler Band + Transparent Conductor"],
];

const BLACK_COATINGS = ["Visible to Near Infrared", "Mid Infrared (2-5 μm)", "Long Infrared (8-14 μm)"];

const wavelengthToOthers = {
  "EUV 1": { base: "EUV 30-50", surface: "Aluminium-Space" },
  "EUV 2": { base: "EUV 50-60", surface: "Aluminium-Space" },
  "EUV 3": { base: "EUV 60-90", surface: "Aluminium-Space" },
  "FUV 1": { base: "None", surface: "AlF" },
  "FUV 2": { base: "None", surface: "MgF2" },
  "UV-Vis": { base: "None", surface: "Ag-Low-Pol" },
  "VIS": { base: "None", surface: "Ag-Low-Pol" },
  "IR": { base: "None", surface: "Ag-IR" },
};

const baseToOthers = {
  "Iridium": { wavelength: "EUV 1", surface: "Aluminium-Space" },
  "EUV 30-50": { wavelength: "EUV 1", surface: "Aluminium-Space" },
  "EUV 50-60": { wavelength: "EUV 3", surface: "Aluminium-Space" },
  "EUV 60-90": { wavelength: "EUV 3", surface: "Aluminium-Space" },
};

const surfaceToOthers = {
  "Aluminium-Space": { wavelength: "EUV 1", base: "Iridium" },
  "AlF": { wavelength: "FUV 1", base: "None" },
  "MgF2": { wavelength: "FUV 2", base: "None" },
  "Ag-Low-Pol": { wavelength: "UV-Vis", base: "None" },
  "Ag-Kepler": { wavelength: "VIS", base: "None" },
  "Ag-Transparent": { wavelength: "VIS", base: "None" },
  "Ag-IR": { wavelength: "IR", base: "None" },
};

const labelFor = (list, val) => {
  const found = list.find((o) => o[0] === val);
  return found ? found[1] : val;
};

export default function TelescopeCalculator() {
  const [type, setType] = useState("classic");
  const [inp, setInp] = useState({ D1: "200", F: "1000", Ft: "3000", b: "100", FOV: "0.5" });
  const [coat, setCoat] = useState({
    surfaceFinish: "0.3 nm",
    wavelength: "EUV 1",
    base: "EUV 30-50",
    surface: "Aluminium-Space",
    black: "Visible to Near Infrared",
    meteor: false,
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [badFields, setBadFields] = useState({});

  const chooseType = (t) => {
    setType(t);
    setResults(null);
    setError("");
    setBadFields({});
  };

  const onInput = (name, value) => setInp((p) => ({ ...p, [name]: value }));

  const onWavelength = (val) => {
    const d = wavelengthToOthers[val];
    setCoat((p) => ({ ...p, wavelength: val, base: d ? d.base : p.base, surface: d ? d.surface : p.surface }));
  };
  const onBase = (val) => {
    const d = baseToOthers[val];
    setCoat((p) => ({ ...p, base: val, wavelength: d ? d.wavelength : p.wavelength, surface: d ? d.surface : p.surface }));
  };
  const onSurface = (val) => {
    const d = surfaceToOthers[val];
    setCoat((p) => ({ ...p, surface: val, wavelength: d ? d.wavelength : p.wavelength, base: d ? d.base : p.base }));
  };

  const calculate = () => {
    const D1 = parseFloat(inp.D1);
    const F = parseFloat(inp.F);
    const Ft = parseFloat(inp.Ft);
    const b = parseFloat(inp.b);
    const FOV = parseFloat(inp.FOV);
    const vals = { D1, F, Ft, b, FOV };

    if ([D1, F, Ft, b, FOV].some((v) => isNaN(v))) {
      setBadFields({});
      setResults(null);
      setError("Please enter all optical values.");
      return;
    }
    const bad = {};
    Object.keys(LIMITS).forEach((k) => {
      if (vals[k] < LIMITS[k].min || vals[k] > LIMITS[k].max) bad[k] = true;
    });
    if (Object.keys(bad).length) {
      setBadFields(bad);
      setResults(null);
      setError("One or more values are outside the allowed range.");
      return;
    }
    setBadFields({});
    setError("");

    const m = Ft / F;
    const A = (F + b) / (m + 1);
    const a = m * A;
    const R1 = 2 * F;
    const R2 = (2 * A * m) / (m - 1);
    const B = a - b;
    const D2 = (D1 * A) / F;
    const OD = degToRad(FOV) * Ft;
    const PC = m * (1 + (R1 * (m - 1)) / (m * (2 * B - R1)));

    let K1, K2, coma, astig;
    if (type === "classic") {
      K1 = -1;
      K2 = -((4 * m) / ((m - 1) ** 2)) - 1;
      coma = 0.5;
      astig = m * ((2 * B - m * R1) / ((2 * B - R1) * m ** 2));
    } else {
      K1 = (-2 * (a / B)) / m ** 3 - 1;
      K2 = (-4 * m * (m - 1) - 2 * (3 + 33 / 25)) / ((m - 1) ** 3) - 1;
      coma = (m ** 2 / 2) * (1 / m ** 2 - (1 + K1) * (B / (2 * B - R1)));
      astig = m * ((2 * B - m * R1) / (m ** 2 * (2 * B - R1)) - (B / (2 * B - R1)) ** 2 * (1 + K1));
    }

    const COF = PC - 2 * astig;
    const comaFactor = type === "classic" ? 3 / 8 : 3 / 4;
    const COMA = comaFactor * (D1 / Ft) ** 2 * coma * degToRad(FOV) * 103132;
    const ASTIG = (D1 / Ft) * degToRad(FOV) ** 2 * astig * (103132 / 4);
    const RCOF = Ft / COF;

    const e1c = type === "classic" ? -1 : K1;
    const e2c = type === "classic" ? -1 * ((m + 1) / (m - 1)) ** 2 : K2;
    const E1 = ((e1c / 32) * (D1 / 2) ** 4) / R1 ** 3;
    const E2 = ((e2c / 32) * (OD / 2) ** 4) / R2 ** 3;
    const Theta1 = ((e1c / 4) * (D1 / 2) ** 3) / R1 ** 3;
    const Theta2 = ((e2c / 4) * (OD / 2) ** 3) / R2 ** 3;

    setResults({
      D1, F, Ft, b, FOV, m, A, a, B, R1, R2, K1, K2,
      coma, astig, PC, COF, COMA, ASTIG, RCOF, D2, OD, E1, E2, Theta1, Theta2,
    });
  };

  const f4 = (x) => x.toFixed(4);
  const e4 = (x) => x.toExponential(4);

  const numInput = (name, label) => (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input
        type="number"
        id={name}
        value={inp[name]}
        onChange={(e) => onInput(name, e.target.value)}
        style={badFields[name] ? { border: "2px solid red" } : undefined}
        title={badFields[name] ? "Allowed range: " + LIMITS[name].label : ""}
      />
    </div>
  );

  const row = (label, value) => (
    <div className="result-item">
      <span className="result-label">{label}</span>
      <span className="result-value">{value}</span>
    </div>
  );

  return (
    <div className="calculators-container">
      <div className="calculator-card">
        <div className="calculator-header">
          <h2>Telescope Design Calculator</h2>
          <p> This calculator allows you to DESIGN either a Classical Cassegrain or Ritchey Chrétien custom space telescope. Some of the parameters include the primary mirror diameter, the desired wavelength to be observed, and the advanced mirror coatings that we can add. Our goal is to show researchers, engineers, and companies what is possible for us to make here at Zecoat.</p>
        </div>

        <div className="tele-body">
          <div className="tele-type-toggle">
            <button
              type="button"
              className={"tele-type-btn" + (type === "classic" ? " active" : "")}
              onClick={() => chooseType("classic")}
            >
              Classic Cassegrain
            </button>
            <button
              type="button"
              className={"tele-type-btn" + (type === "rc" ? " active" : "")}
              onClick={() => chooseType("rc")}
            >
              Ritchey-Chrétien
            </button>
          </div>

          <div className="tele-inputs-grid">
            {numInput("D1", "Primary Mirror Diameter (mm)")}
            {numInput("F", "Primary Focal Length (mm)")}
            {numInput("Ft", "System Focal Length (mm)")}
            {numInput("b", "Back Focal Length (mm)")}
            {numInput("FOV", "Field of View (degrees)")}

            <div className="input-group">
              <label htmlFor="surface-finish">Surface Finish</label>
              <select id="surface-finish" value={coat.surfaceFinish}
                onChange={(e) => setCoat((p) => ({ ...p, surfaceFinish: e.target.value }))}>
                {SURFACE_FINISH.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="wavelength">Observed Wavelength</label>
              <select id="wavelength" value={coat.wavelength} onChange={(e) => onWavelength(e.target.value)}>
                {WAVELENGTHS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="base-coating">Base Coating</label>
              <select id="base-coating" value={coat.base} onChange={(e) => onBase(e.target.value)}>
                {BASE_COATINGS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="first-surface-coating">First Surface Coating</label>
              <select id="first-surface-coating" value={coat.surface} onChange={(e) => onSurface(e.target.value)}>
                {FIRST_SURFACE.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="black-coating">Black Coating</label>
              <select id="black-coating" value={coat.black}
                onChange={(e) => setCoat((p) => ({ ...p, black: e.target.value }))}>
                {BLACK_COATINGS.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="input-group tele-checkbox">
              <input type="checkbox" id="meteor-shield" checked={coat.meteor}
                onChange={(e) => setCoat((p) => ({ ...p, meteor: e.target.checked }))} />
              <label htmlFor="meteor-shield">Include Deployable Meteor Shield</label>
            </div>
          </div>

          <button className="calc-button" type="button" onClick={calculate}>Calculate Design</button>

          <div className="tele-results-full">
            {error && <p className="tele-error"><strong>Error:</strong> {error}</p>}
            {!error && results && (
              <div className="tele-summary-columns">
                <div className="tele-summary-column">
                  <h4>Design Parameters</h4>
                  {row("Primary Diameter (D₁)", f4(results.D1) + " mm")}
                  {row("Primary Focal Length (F)", f4(results.F) + " mm")}
                  {row("System Focal Length (Fₜ)", f4(results.Ft) + " mm")}
                  {row("Back Focal Length (b)", f4(results.b) + " mm")}
                  {row("Field of View", f4(results.FOV) + "°")}
                  {row("Extension Factor (m)", f4(results.m))}
                  {row("Secondary to Primary Focus (A)", f4(results.A) + " mm")}
                  {row("Focal Plane to Secondary (a)", f4(results.a) + " mm")}
                  {row("Mirror Separation (B)", f4(results.B) + " mm")}
                  {row("Primary R.O.C. (R₁)", f4(results.R1) + " mm")}
                  {row("Secondary R.O.C. (R₂)", f4(results.R2) + " mm")}
                  {row("Primary Conic (K₁)", f4(results.K1))}
                  {row("Secondary Conic (K₂)", f4(results.K2))}
                </div>
                <div className="tele-summary-column">
                  <h4>Schwarzschild Coefficients</h4>
                  {row("Coma Coefficient", f4(results.coma))}
                  {row("Astigmatism Coefficient", f4(results.astig))}
                  {row("Petzval Curvature", f4(results.PC))}
                  {row("Curvature of Field", f4(results.COF) + " mm")}
                  {row("Coma", f4(results.COMA) + " ″")}
                  {row("Astigmatism", f4(results.ASTIG) + " ″")}
                  {row("Radius Curvature of Field", f4(results.RCOF) + " mm")}
                  {row("Axial Secondary Diameter (D₂)", f4(results.D2) + " mm")}
                  {row("Optical Secondary Diameter", f4(results.OD) + " mm")}
                  {row("Epsilon 0.707 Primary", e4(results.E1) + " mm")}
                  {row("Epsilon 0.707 Secondary", e4(results.E2) + " mm")}
                  {row("Slope at Edge of Primary", e4(results.Theta1) + " mm")}
                  {row("Slope at Edge of Secondary", e4(results.Theta2) + " mm")}
                </div>
                <div className="tele-summary-column">
                  <h4>Coating Options</h4>
                  {row("Surface Finish", coat.surfaceFinish)}
                  {row("Observed Wavelength", labelFor(WAVELENGTHS, coat.wavelength))}
                  {row("Base Coating", labelFor(BASE_COATINGS, coat.base))}
                  {row("First Surface Coating", labelFor(FIRST_SURFACE, coat.surface))}
                  {row("Black Coating", coat.black)}
                  {row("Deployable Meteor Shield", coat.meteor ? "Yes" : "No")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
