import "../../styles/review-quote.css"
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
  Elliptical: [
    { key: "length", label: "Length (in)" },
    { key: "width", label: "Width (in)" },
  ],
};

export default function ReviewQuote({ configuration, setStep }) {
  const mirrors = Array.isArray(configuration) ? configuration : [configuration];
  const [submitting, isSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    isSubmitting(true);

    const data = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      company: e.target.company.value,
      email: e.target.email.value,
      phone: e.target.phoneNumber.value,
      comments: e.target.comments.value,
    };

    try {
      const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form: data, configuration, type: "quote" }),
    });

    if (response.ok) {
        alert("Message Sent!")
        isSubmitting(false);
    }
  }  catch(err) {
        console.error(err)
        alert("Unable to send your inquiry, please try again")
    } 
  }
   

  return (
    <div className="review-quote">
      <button className="rq-back" onClick={() => setStep("configure")}>
        ← Back
      </button>

      <h2 className="rq-title">Review Your Quote</h2>

      {mirrors.map((config, i) => (
        <div className="rq-summary" key={config.orderNumber ?? i}>
          {mirrors.length > 1 && (
            <div className="rq-mirror-heading">Mirror #{config.orderNumber ?? i + 1}</div>
          )}
          <div className="rq-row">
            <span>Material</span>
            <b>{config.material || "—"}</b>
          </div>
          <div className="rq-row">
            <span>Shape</span>
            <b>{config.shape || "—"}</b>
          </div>
          {(DIMENSION_FIELDS[config.shape] || []).some((f) => config.dimensions?.[f.key]) ? (
            (DIMENSION_FIELDS[config.shape] || []).map(
              (f) =>
                config.dimensions?.[f.key] && (
                  <div className="rq-row" key={f.key}>
                    <span>{f.label}</span>
                    <b>{config.dimensions[f.key]}</b>
                  </div>
                )
            )
          ) : (
            <div className="rq-row">
              <span>Dimensions</span>
              <b>—</b>
            </div>
          )}
          <div className="rq-row">
            <span>Coating</span>
            <b>{config.coating || "—"}</b>
          </div>
          <div className="rq-row">
            <span>Quantity</span>
            <b>{config.quantity || "—"}</b>
          </div>
          {config.notes && (
            <div className="rq-row">
              <span>Notes</span>
              <b>{config.notes}</b>
            </div>
          )}
        </div>
      ))}

      <form className="rq-form" onSubmit={handleSubmit}>
        <div className="rq-name">
          <input type="text" required name="firstName" placeholder="First Name" />
          <input type="text" required name="lastName" placeholder="Last Name" />
        </div>
        <input type="text" name="company" placeholder="Company" />
        <input type="email" required name="email" placeholder="Email" />
        <input type="tel" name="phoneNumber" placeholder="Phone Number" />
        <textarea name="comments" placeholder="Additional Comments" rows="4"></textarea>
        <div className="button-wrapper">
          <button type="submit" className="rq-submit" disabled = {submitting}>{ submitting ? "Sending..." : "Submit Quote Request"}</button>
        </div>
      </form>
    </div>
  );
}
