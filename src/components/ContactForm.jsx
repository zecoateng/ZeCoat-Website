import "../styles/contactPage.css"
import { useState } from "react";

  export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
    const data = {
      firstName: e.target.firstName.value.trim(),
      lastName: e.target.lastName.value.trim(),
      company: e.target.company.value.trim(),
      email: e.target.email.value.trim(),
      phone: e.target.phoneNumber.value.trim(),
      comments: e.target.comments.value.trim(),
    };

    if (!data.firstName || !data.lastName || !data.email || !data.comments) {
    alert("Please fill out all required fields.");
    setIsSubmitting(false);
    return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(data.email)) {
    alert("Please enter a valid email address.");
    setIsSubmitting(false);
    return;
}

   const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form: data, type: "general" }),
    });

    console.log(response.status);
    console.log(response.ok);

    if (response.ok) {
        alert("Message Sent!")
    }
    } catch(err) {
        console.error(err)
        alert("Unable to send your inquiry, please try again")
    }  finally {
    setIsSubmitting(false);
}
    }

    return (
        <div className = "forms-page">
<div className = "inquiries-statement">
<h1>Get in Touch</h1>
<h3>We welcome your inquiries.  If you would like more information about our custom or off-the-shelf coatings or to request a quote, please fill out this form or email us directly. If possible, please include your technical specifications, quantity and size of the substrates you will be providing, if the mirrors will all come at one time, and when you would like the mirror coated by. 
</h3>
<h3>Your request will be reviewed by our office and we will get back to you within 1-2 business days.</h3>
</div>
<form className = "forms-list" onSubmit = {handleSubmit}>
<div className = "name">
<input type="text" required name="firstName" placeholder="First Name"/>
<input type="text" required name="lastName" placeholder="Last Name"/>
</div>
<input type="text" name="company" placeholder="Company"/>
<input type="text" required name="email" placeholder="Email"/>
<input type="text" name="phoneNumber" placeholder="Phone-Number"/>
<textarea name = "comments" required placeholder="Reason for Contact"></textarea>
<button type = "submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Submit"}</button>
</form>
<div>
</div>

</div>
)
}