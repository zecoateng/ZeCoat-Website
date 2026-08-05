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
            <div id="stress" class="output-value">Stress: {stressCalc} mPA</div>
          </div>

          <div class="info-box">
            <p><strong>Formula:</strong></p>
            <p class="formula">σ = (Es × ts² / 3(1-ν)) × (δ / tf) × (1 / (tf² + w²/4))</p>
          </div>
        </div>
      </div>
    </div>
  </div>
    )
}