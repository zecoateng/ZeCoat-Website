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
        <h2>Beam Averaging Calculator</h2>
        <p>Calculate beam-averaged reflectance across mirror aperture</p>
      </div>

      <div class="calculator-grid">
        <div class="calculator-inputs">
          <div class="input-group">
            <label for="mirrorDBeam">Mirror Diameter (mm)</label>
            <input type="number" id="mirrorDBeam" value="100" placeholder="100"/>
          </div>

          <div class="input-group">
            <label for="beamDBeam">Beam Diameter (mm)</label>
            <input type="number" id="beamDBeam" value="50" placeholder="50"/>
          </div>

          <div class="input-group">
            <label for="centralRefl">Central Region Reflectance</label>
            <input type="number" id="centralRefl" value="0.95" placeholder="0.95" step="0.01" min="0" max="1"/>
          </div>

          <div class="input-group">
            <label for="outerRefl">Outer Region Reflectance</label>
            <input type="number" id="outerRefl" value="0.90" placeholder="0.90" step="0.01" min="0" max="1"/>
          </div>

          <button class="calc-button" onclick="calculateBeam()">Calculate Reflectance</button>
        </div>

        <div class="calculator-output">
          <div class="output-section">
            <h3>Results</h3>
            <div id="beamResults" class="output-results">
              <div class="result-item">
                <span class="result-label">Beam-Averaged Reflectance:</span>
                <span class="result-value" id="beamRefl"> </span>
              </div>
              <div class="result-item">
                <span class="result-label">Beam Area (mm²):</span>
                <span class="result-value" id="beamArea"> </span>
              </div>
              <div class="result-item">
                <span class="result-label">Mirror Area (mm²):</span>
                <span class="result-value" id="mirrorArea"> </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
    )
}