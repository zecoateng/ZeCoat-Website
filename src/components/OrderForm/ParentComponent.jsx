import {useState} from "react"
import SummaryComponent from "./SummaryComponent.jsx"
import ConfigureForm from "./ConfigureForm.jsx"
import QuoteReview from "./ReviewQuote.jsx"
import Intro from "./intro.jsx"

export default function QuoteBuilder(){

    const [step, setStep] = useState("intro");

    const [configuration, setConfiguration] = useState([
        {
        orderNumber: 1,
        material: "",
        shape: "",
        dimensions: {
            width: "",
            height: "",
            diameter: "",
            flatToFlat: "",
            thickness: "",
            units: "mm"
        },
        coating: "",
        quantity: 1,
        notes: "",
    },]
    );

    const updateConfiguration = (index, patch) => {
    setConfiguration((prev) =>
        prev.map((config, i) =>
            i === index
                ? { ...config, ...patch }
                : config
        )
    );
};

 const addMirror = () => {
    setConfiguration(prev => [
        ...prev,
        {
            orderNumber: prev.length + 1,
            material: "",
            shape: "",
            dimensions: {
                width: "",
                height: "",
                diameter: "",
                flatToFlat: "",
                thickness: "",
                units: "mm",
            },
            coating: "",
            quantity: 1,
            notes: "",
        }
    ]);
};

const removeMirror = (indexToRemove) => {
  setConfiguration((prev) => {
    if (prev.length === 1) return prev;

    return prev
      .filter((_, index) => index !== indexToRemove)
      .map((config, index) => ({
        ...config,
        orderNumber: index + 1,
      }));
  });
};


    return (
        <>

        {step === "intro" && (
            <Intro
            setStep = {setStep}
            />
        )

        }
            {step === "configure" &&
            <div className = "page">
                <div className = "config-header">
                    <h1 className = "config-title">Configure Coating</h1>
                </div>
            <div className = "page-layout">
            <div className = "form-layout">
                {configuration.map((config) => (
                    <ConfigureForm
                    key={config.orderNumber}
                    configurationObject={config}
                    updateConfiguration={updateConfiguration}
                    />
                    ))}
                    </div>
                    <div className = "summary-layout">
                    <SummaryComponent
                    configurationTotal={configuration}
                    setStep={setStep}
                    addMirror={addMirror}
                    removeMirror={removeMirror}
                    />
                    </div>
                </div>
                </div>
                }
            {step === "review" && (
                <QuoteReview
                    configuration={configuration}
                    setStep={setStep}
                />
            )}
        </>
    )
}
