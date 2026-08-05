import "../../styles/resources.css"
import { useState } from "react";

export default function Resources() {

    const [stressInputs, setStressInputs] = useState({
        youngModulus: 71.7,
        poissonRatio: 0.17,
        subThickness: 0.75,
        subWidth: 25.4,
        deflection: null,
        filmThickness: null,
});

const [stressCalc, setStressCalc] = useState(0);

const updateStress = (e) => {
     setStressInputs(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

const calculateStress = () => {
  const YM = stressInputs.youngModulus ??  0;
  const PR = stressInputs.poissonRatio ?? 0.17;
  const ST = stressInputs.subThickness ?? 0.75;
  const W = stressInputs.subWidth ?? 0.75;
  const defl = stressInputs.deflection;
  const FT = stressInputs.filmThickness;

  if (!defl || !FT) return null;

    const a = (( YM * ST ** 2) / (3 * (1-PR)))
    setStressCalc((a * (( defl /FT)/( defl ) ** 2 + (W /2) ** 2)).toFixed(4))
    return;
}


    return (
        <div class="calculators-container">
    <div class="calculator-card">
      <div class="calculator-header">
        <h2>Telescope Design Calculator</h2>
        <p>Quick calculation for primary mirror specifications</p>
      </div>

      <div class="calculator-grid">
        <div class="calculator-inputs">
          <div class="input-group">
            <label for="mirrorDia">Primary Mirror Diameter (mm)</label>
            <input type="number" id="mirrorDia" value="200" placeholder="200"/>
          </div>

          <div class="input-group">
            <label for="primaryFocal">Primary Focal Length (mm)</label>
            <input type="number" id="primaryFocal" value="1000" placeholder="1000"/>
          </div>

          <div class="input-group">
            <label for="systemFocal">System Focal Length (mm)</label>
            <input type="number" id="systemFocal" value="3000" placeholder="3000"/>
          </div>

          <div class="input-group">
            <label for="backFocal">Back Focal Length (mm)</label>
            <input type="number" id="backFocal" value="100" placeholder="100"/>
          </div>

          <div class="input-group">
            <label for="fieldView">Field of View (degrees)</label>
            <input type="number" id="fieldView" value="0.5" placeholder="0.5" step="0.1"/>
          </div>

          <button class="calc-button" onclick="calculateTelescope()">Calculate Design</button>
        </div>

        <div class="calculator-output">
          <div class="output-section">
            <h3>Results</h3>
            <div id="telescopeResults" class="output-results">
              <div class="result-item">
                <span class="result-label">Extension Factor (m):</span>
                <span class="result-value" id="extensionFactor"> </span>
              </div>
              <div class="result-item">
                <span class="result-label">Primary R.O.C.:</span>
                <span class="result-value" id="primaryROC"> </span>
              </div>
              <div class="result-item">
                <span class="result-label">Secondary Diameter:</span>
                <span class="result-value" id="secondaryDia"> </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
    )
}