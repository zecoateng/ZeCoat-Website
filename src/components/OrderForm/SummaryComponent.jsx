import "../../styles/ProductConfigurator.css";
import { useState } from "react";

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
  configurationTotal,
  setStep,
  addMirror,
  removeMirror,
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
  };

  const handleSubmit = () => {
    if (isConfigurationComplete()) {
      setError("");
      setStep("review");
    } else {
      setError("Please complete all required fields before proceeding.");
    }
  };

  return (
    <div className="configuration-summary">
      <div className="summary-title">Order Summary</div>

      {configurationTotal.map((configs) => (
        <div className="summary-mirror" key={configs.orderNumber}>
          <div className="summary-mirror-label">Mirror #{configs.orderNumber}</div>
          <div className="summary-row">
            <span className="summary-value">
              {configs.material || "—"} • {configs.shape || "—"} •{" "}
              {configs.coating || "—"} • Qty {configs.quantity}
            </span>
          </div>
        </div>
      ))}

      <div className="mirror-actions">
        <button className="add-button" onClick={addMirror}>
          + Add Mirror
        </button>
        {configurationTotal.length > 1 && (
          <button
            className="remove-button"
            onClick={() => removeMirror(configurationTotal.length - 1)}
          >
            – Remove Mirror
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      <button className="submit" onClick={handleSubmit}>
        Request &amp; Review Quote
      </button>
    </div>
  );
}
