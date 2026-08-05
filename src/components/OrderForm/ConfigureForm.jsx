import "../../styles/ProductConfigurator.css";
import { useState } from "react";
import SummaryComponent from "./SummaryComponent.jsx"

const MATERIALS = ["Silicon", "Aluminum", "Glass", "Silicon Carbide"];
const SHAPES = ["Round", "Rectangle", "Hexagon"];
const COATINGS = ["ZC-1251", "ZC-XXXX", "ZC-YYYY"];

const DIMENSION_FIELDS = {
  Round: [{ key: "diameter", label: "Diameter (in)" }],
  Rectangle: [
    { key: "width", label: "Width (mm)" },
    { key: "height", label: "Height (mm)" },
    { key: "thickness", label: "Thickness (mm)" },
  ],
  Hexagon: [
    { key: "flatToFlat", label: "Flat-to-Flat (mm)" },
    { key: "thickness", label: "Thickness (mm)" },
  ],
};

export default function ConfigureForm({
  configurationObject,
  configurationTotal,
  index,
  updateConfiguration,
  setStep,
  addMirror
}) {
  const [error, setError] = useState("");

  const updateConfig = ((patch) =>
    updateConfiguration(index, patch)
);

  const handleMaterialChange = (material) => {
    updateConfig({ material })
  };

  const handleShapeChange = (shape) => {
    updateConfig({ shape })
};

  const handleCoatingChange = ((event) =>
    updateConfig({ coating: event.target.value })
);

  const handleNotesChange = ((event) =>
    updateConfig({ notes: event.target.value })
);

  const handleAdd = () => {
    updateConfig({ quantity: configurationObject.quantity + 1 })
  };

  const handleSubtract = () => {
    if (configurationObject.quantity <= 1) return;
    updateConfig({ quantity: configurationObject.quantity - 1 });
  };

  const handleDimensionChange = (key, value) => {
    updateConfig({
      dimensions: { ...configurationObject.dimensions, [key]: value },
    })
  };

  const dimensionFields = DIMENSION_FIELDS[configurationObject.shape] ?? [];

  // Checks if the dimensions for each object is filled
  const areDimensionsComplete = () => {
    dimensionFields.length > 0 &&
    dimensionFields.every((field) => configurationObject.dimensions?.[field.key]);
  }
    

  const isConfigurationComplete = () => {

  };


  return (
    <>
      <div className="design-layout">
        <div className="field material">
          <span className="field-label">Material</span>
          <div className="btn-group">
            {MATERIALS.map((material) => (
              <button
                key={material}
                className={
                  configurationObject.material === material ? "Selected" : "notSelected"
                }
                onClick={() => handleMaterialChange(material)}
              >
                {material}
              </button>
            ))}
          </div>
        </div>

        <div className="field shape">
          <span className="field-label">Shape</span>
          <div className="btn-group">
            {SHAPES.map((shape) => (
              <button
                key={shape}
                className={
                  configurationObject.shape === shape ? "Selected" : "notSelected"
                }
                onClick={() => handleShapeChange(shape)}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {dimensionFields.length > 0 && (
          <div className="field size">
            <span className="field-label">Dimensions</span>
            <div className="specs">
              {dimensionFields.map((field) => (
                <label key={field.key}>
                  {field.label}
                  <input
                    type="number"
                    value={configurationObject.dimensions?.[field.key] ?? ""}
                    onChange={(event) =>
                      handleDimensionChange(field.key, event.target.value)
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="field coating-type">
          <span className="field-label">Coating Type</span>
          <select
            id="options"
            name="coating-types"
            value={configurationObject.coating}
            onChange={handleCoatingChange}
          >
            <option value="" disabled hidden>
              Choose a coating
            </option>
            {COATINGS.map((coating) => (
              <option key={coating} value={coating}>
                {coating}
              </option>
            ))}
          </select>
        </div>

        <div className="field number-of-mirrors">
          <span className="field-label">Number of Mirrors</span>
          <div className="mirror-button">
            <button onClick={handleSubtract}>–</button>
            <div className="config-quantity">{configurationObject.quantity}</div>
            <button onClick={handleAdd}>+</button>
          </div>
        </div>

        <div className="field additional-requirements">
          <span className="field-label">Additional Requirements</span>
          <textarea
            name="Additional Requirements"
            value={configurationObject.notes ?? ""}
            onChange={handleNotesChange}
            placeholder="e.g., Surface quality, scratch-dig requirements, witness sample, etc."
          />
        </div>
      </div>
    </>
  );
}
   