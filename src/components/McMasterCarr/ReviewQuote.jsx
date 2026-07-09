"../../styles/review-quote.css"

export default function ReviewQuote({ configuration, setStep }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      company: e.target.company.value,
      email: e.target.email.value,
      phone: e.target.phoneNumber.value,
      comments: e.target.comments.value,
    };

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form: data, configuration, type: "quote" }),
    });
  };

  return (
    <div className="review-quote">
      <button className="rq-back" onClick={() => setStep("configure")}>
        ← Back
      </button>

      <h2 className="rq-title">Review Your Quote</h2>

      <div className="rq-summary">
        <div className="rq-row">
          <span>Material: </span>
          <b>{configuration.material || "—"}</b>
        </div>
        <div className="rq-row">
          <span>Shape: </span>
          <b>{configuration.shape || "—"}</b>
        </div>
        <div className="rq-row">
          <span>Coating: </span>
          <b>{configuration.coating || "—"}</b>
        </div>
        <div className="rq-row">
          <span>Quantity: </span>
          <b>{configuration.quantity || "—"}</b>
        </div>
        {configuration.notes && (
          <div className="rq-row">
            <span>Notes: </span>
            <b>{configuration.notes}</b>
          </div>
        )}
      </div>

      <form className="rq-form" onSubmit={handleSubmit}>
        <div className="rq-name">
          <input type="text" required name="firstName" placeholder="First Name" />
          <input type="text" required name="lastName" placeholder="Last Name" />
        </div>
        <input type="text" name="company" placeholder="Company" />
        <input type="email" required name="email" placeholder="Email" />
        <input type="tel" name="phoneNumber" placeholder="Phone Number" />
        <textarea name="comments" placeholder="Additional Comments" rows="4"></textarea>
        <button type="submit" className="rq-submit">Submit Quote Request</button>
      </form>
    </div>
  );
}