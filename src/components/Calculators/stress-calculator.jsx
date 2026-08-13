import "../../styles/resources.css"
import { useState } from "react";

export default function Resources() {

    const [stressInputs, setStressInputs] = useState({
        youngModulus: 71.7,
        poissonRatio: 0.17,
        subThickness: 0.75,
        subWidth: 25.4,
        deflection: "",
        filmThickness: "",
});

const [stressCalc, setStressCalc] = useState(0);

const updateStress = (e) => {
     setStressInputs(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

const calculateStress = () => {
  // Convert all inputs to SI (meters / pascals)
  const E = Number(stressInputs.youngModulus) * 1e9;   // GPa -> Pa
  const nu = Number(stressInputs.poissonRatio);
  const ts = Number(stressInputs.subThickness) * 1e-3; // mm -> m
  const w = Number(stressInputs.subWidth) * 1e-3;      // mm -> m
  const defl = Number(stressInputs.deflection) * 1e-6; // um -> m
  const tf = Number(stressInputs.filmThickness) * 1e-6;// um -> m

  if (!defl || !tf) return;

  // Stoney equation with radius of curvature from the sagitta relation:
  // R = (delta^2 + (w/2)^2) / (2*delta)
  const a = (E * ts ** 2) / (3 * (1 - nu));
  const sigmaPa = (a * (defl / tf)) / (defl ** 2 + (w / 2) ** 2);

  setStressCalc((sigmaPa / 1e6).toFixed(1)); // Pa -> MPa
}


    return (
        <div class="calculators-container">
    <div class="calculator-card">
      <div class="calculator-header">
        <h2>Coating Stress Calculator</h2>
        <p>Calculate stress in thin film coatings based on substrate and material properties</p>
      </div>

      <div class="calculator-grid">
        <div class="calculator-inputs">
          <div class="input-group">
            <label for="yMod">Young's Modulus (GPa)</label>
            <input type="number" name="youngModulus" id="yMod" value= {stressInputs.youngModulus} onChange = {updateStress}/>
          </div>

          <div class="input-group">
            <label for="pRat">Poisson's Ratio</label>
            <input type="number" name ="poissonRatio" id="pRat" value= {stressInputs.poissonRatio} step="0.01" onChange = {updateStress}/>
          </div>

          <div class="input-group">
            <label for="subThick">Substrate Thickness (mm)</label>
            <input type="number" name ="subThickness" id="subThick" value= {stressInputs.subThickness} onChange = {updateStress}/>
          </div>

          <div class="input-group">
            <label for="subWidth">Substrate Width (mm)</label>
            <input type="number" name ="subWidth" id="subWidth" value={stressInputs.subWidth} onChange = {updateStress}/>
          </div>

          <div class="input-group">
            <label for="defl">Deflection (μm)</label>
            <input type="number" name="deflection" id="defl" value={stressInputs.deflection} step="0.1" onChange = {updateStress}/>
          </div>

          <div class="input-group">
            <label for="filmThick">Film Thickness (μm)</label>
            <input type="number" id="filmThick" name="filmThickness" value={stressInputs.filmThickness} step="0.01" onChange = {updateStress}/>
          </div>

          <button class="calc-button" onClick= {calculateStress}>Calculate Stress</button>
        </div>

        <div class="calculator-output">
          <div class="output-section">
            <h3>Results</h3>
            <div id="stress" class="output-value">Stress: {stressCalc} MPa</div>
          </div>

          <div class="info-box">
            <p><strong>Formula:</strong></p>
            <p class="formula">σ = (Es × ts² / 3(1−ν)) × (δ / tf) × 1 / (δ² + w²/4)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
    )
}