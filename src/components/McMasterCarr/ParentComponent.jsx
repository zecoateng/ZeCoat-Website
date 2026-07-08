import {useState} from "react"
import ProductConfiguration from "./ProductConfiguration.jsx"
import QuoteReview from "./ReviewQuote.jsx"
import Intro from "./intro.jsx"

export default function QuoteBuilder(){

    const [step, setStep] = useState("intro");

    const [configuration, setConfiguration] = useState({
        material: "",
        shape: "",
        size: {
            width: "",
            height: "",
            diameter: "",
            flatToFlat: "",
            thickness: "",
            units: "mm"
        },
        coating: "",
        quantity: 1,
        notes: ""
    });


    return (
        <>

        {step === "intro" && (
            <Intro
            setStep = {setStep}
            />
        )

        }
            {step === "configure" && (
                <ProductConfiguration
                    configuration={configuration}
                    setConfiguration={setConfiguration}
                    setStep={setStep}
                />
            )}

            {step === "review" && (
                <QuoteReview
                    configuration={configuration}
                    setStep={setStep}
                />
            )}
        </>
    )
}