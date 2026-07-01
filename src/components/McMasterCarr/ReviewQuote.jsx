export default function ReviewQuote({ configuration, setStep }) {
    return (
        <div className="review-quote">
            <h2>Review Your Quote</h2>

            <ul>
                <li>Material: {configuration.material || "—"}</li>
                <li>Shape: {configuration.shape || "—"}</li>
                <li>Coating: {configuration.coating || "—"}</li>
                <li>Quantity: {configuration.quantity}</li>
                {configuration.notes && <li>Notes: {configuration.notes}</li>}
            </ul>
   <form className = "forms-list" action="/api/contact" method="POST"> 

<p>FORMS LIST</p>
<div className = "name">
<input type="text" placeholder="First Name"/>
<input type="text" placeholder="Last Name"/>
</div>
<input type="text" placeholder="Company"/>
<input type="text" placeholder="Email"/>
<input type="text" placeholder="Phone-Number"/>
<textarea placeholder="Additional Comments"></textarea>
<button>Submit</button>
</form>
<div>
</div>
            <button onClick={() => setStep("configure")}>Back</button>
        </div>
    );
}
