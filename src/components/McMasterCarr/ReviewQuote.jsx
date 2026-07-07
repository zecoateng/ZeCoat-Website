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
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            form: data,
            configuration,
        })
    })
    }
    

    return (
         
        <div className="review-quote">
            <button onClick={() => setStep("configure")}>Back</button>
            <h2>Review Your Quote</h2>

            <ul>
                <li>Material: {configuration.material || "—"}</li>
                <li>Shape: {configuration.shape || "—"}</li>
                <li>Coating: {configuration.coating || "—"}</li>
                <li>Quantity: {configuration.quantity}</li>
                {configuration.notes && <li>Notes: {configuration.notes}</li>}
            </ul>
   <form className = "forms-list" onSubmit = {handleSubmit}> 
<div className = "name">
<input type="text" name = "firstName" placeholder="First Name"/>
<input type="text" name = "lastName" placeholder="Last Name"/>
</div>
<input type="text" name = "company" placeholder="Company"/>
<input type="text" name = "email" placeholder="Email"/>
<input type="text" name = "phoneNumber" placeholder="Phone-Number"/>
<textarea name = "comments" placeholder="Additional Comments"></textarea>
<button>Submit</button>
</form>
<div>
</div>
       
        </div>
    );
}
