import "../../styles/global.css";

export default function Intro({ setStep }) {
    return (
        <section className="intro-page">

            <h1>
                Build Your Quote Request
            </h1>

            <p>
                Use our guided configurator to describe your optical coating
                needs. Provide details about your substrate, dimensions,
                coating selection, quantity, and any additional technical
                requirements for your project.
            </p>

            <p>
                Once complete, your request will be submitted directly to our
                Chief Technical Officer for technical review. After
                evaluating your specifications, our team will contact you with
                pricing, lead times, and any recommendations necessary to
                achieve the desired optical performance.
            </p>
            <div className = "button-spacing">
            <button onClick={() => setStep("configure")}>
                Start Configuration
            </button>
            </div>

        </section>
    );
}