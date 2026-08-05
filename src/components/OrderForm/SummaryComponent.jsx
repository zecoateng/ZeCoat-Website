import "../../styles/ProductConfigurator.css";
import { useState } from "react";

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

export default function SummaryComponent({
  configurationObject,
  configurationTotal,
  index,
  setStep,
  addMirror,
  removeMirror
}) {
  const [error, setError] = useState("");

  const isConfigurationComplete = () => {
    return configurationTotal.every((config) => {

    const dimensionFields = DIMENSION_FIELDS[config.shape] ?? [];

    const dimensionsComplete = dimensionFields.every(
      (field) => config.dimensions?.[field.key]
    );

    return (
      config.material &&
      config.shape &&
      config.coating &&
      config.quantity > 0 &&
      dimensionsComplete
    );
  });
  }
    

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
    <>
      <div className="configuration-summary">
        <div className="summary-title">Order Summary</div>
      {configurationTotal.map((configs) => {
        return (
        <>
         Mirror #{configs.orderNumber}
        <div className="summary-row">
          <span className="summary-value">
            {configs.material || "—"} •{" "}
            {configs.shape || "—"} •{" "}
            {configs.coating || "—"} •{" "}
            Qty {configs.quantity}
      </span>
    </div>
        </>
        )
      })}
      <div className = "">
      <button className ="add-button" onClick={addMirror}>
        + Add Mirror
        </button>
        {configurationTotal.length > 1 && (
          <button
          className = "remove-button"
          onClick={() => removeMirror(index)}
          >
           - Remove Mirror
            </button>
          
)}
</div>
      {error && <p className="error-message">{error}</p>}
      <button className="submit" onClick={handleSubmit}>
          Request &amp; Review Quote
        </button>
      </div>
    </>
  );
}
   