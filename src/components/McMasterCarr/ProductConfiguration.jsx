import "../../styles/ProductConfigurator.css";
import { useState } from "react";

const MATERIALS = ["Silicon", "Aluminum", "Glass", "Silicon Carbide"];
const SHAPES = ["Round", "Rectangle", "Hexagon"];
const COATINGS = ["ZC-1251", "ZC-XXXX", "ZC-YYYY"];

// Dimension inputs per shape; each key is stored under configuration.dimensions.
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

export default function ProductConfiguration({
  configuration,
  setConfiguration,
  setStep,
}) {
  const [error, setError] = useState("");

  const updateConfig = (patch) =>
    setConfiguration({ ...configuration, ...patch });

  const handleMaterialChange = (material) => updateConfig({ material });
  const handleShapeChange = (shape) => updateConfig({ shape });
  const handleCoatingChange = (event) =>
    updateConfig({ coating: event.target.value });
  const handleNotesChange = (event) =>
    updateConfig({ notes: event.target.value });

  const handleAdd = () => updateConfig({ quantity: configuration.quantity + 1 });
  const handleSubtract = () => {
    if (configuration.quantity <= 1) return;
    updateConfig({ quantity: configuration.quantity - 1 });
  };

  const handleDimensionChange = (key, value) =>
    updateConfig({
      dimensions: { ...configuration.dimensions, [key]: value },
    });

  const dimensionFields = DIMENSION_FIELDS[configuration.shape] ?? [];

  const areDimensionsComplete = () =>
    dimensionFields.length > 0 &&
    dimensionFields.every((field) => configuration.dimensions?.[field.key]);

  const isConfigurationComplete = () =>
    Boolean(
      configuration.material &&
        configuration.shape &&
        configuration.coating &&
        configuration.quantity > 0 &&
        areDimensionsComplete()
    );

  const handleSubmit = () => {
    if (isConfigurationComplete()) {
      setError("");
      setStep("review");
    } else {
      setError("Please complete all required fields before proceeding.");
    }
  };

  const summaryValue = (value) =>
    value || value === 0 ? (
      <span className="summary-value">{value}</span>
    ) : (
      <span className="summary-value empty">—</span>
    );

  return (
    <div className="layout">
      <h1 className="config-title">Configure Your Coating</h1>

      <div className="design-layout">
        <div className="field material">
          <span className="field-label">Material</span>
          <div className="btn-group">
            {MATERIALS.map((material) => (
              <button
                key={material}
                className={
                  configuration.material === material ? "Selected" : "notSelected"
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
                  configuration.shape === shape ? "Selected" : "notSelected"
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
                    value={configuration.dimensions?.[field.key] ?? ""}
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
            value={configuration.coating}
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
            <div className="config-quantity">{configuration.quantity}</div>
            <button onClick={handleAdd}>+</button>
          </div>
        </div>

        <div className="field additional-requirements">
          <span className="field-label">Additional Requirements</span>
          <textarea
            name="Additional Requirements"
            value={configuration.notes ?? ""}
            onChange={handleNotesChange}
            placeholder="e.g., Surface quality, scratch-dig requirements, witness sample, etc."
          />
        </div>
      </div>

      <div className="configuration-summary">
        <div className="summary-title">Summary</div>

        <div className="summary-row">
          <span className="summary-key">Material</span>
          {summaryValue(configuration.material)}
        </div>
        <div className="summary-row">
          <span className="summary-key">Shape</span>
          {summaryValue(configuration.shape)}
        </div>
        <div className="summary-row">
          <span className="summary-key">Coating</span>
          {summaryValue(configuration.coating)}
        </div>
        <div className="summary-row">
          <span className="summary-key">Quantity</span>
          {summaryValue(configuration.quantity)}
        </div>

        <button className="submit" onClick={handleSubmit}>
          Request &amp; Review Quote
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
