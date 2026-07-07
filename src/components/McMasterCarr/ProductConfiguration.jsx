import "../../styles/ProductConfigurator.css"
import { useState } from "react";

export default function ProductConfiguration({
    configuration,
    setConfiguration,
    setStep
}
   
) {

    const handleAdd = () => {
        setConfiguration({
            ...configuration,
            quantity: configuration.quantity + 1})
    }

    const handleSubtract = () => {
        if (configuration.quantity <= 1) {
            return;
        } else {
            setConfiguration({
            ...configuration,
            quantity: configuration.quantity - 1})
        }
    }

    const handleMaterialChange = (material) => {
        setConfiguration({
            ...configuration,
            material: material
        })
    }

    const handleNotesChange = (event) => {
        setConfiguration({
            ...configuration,
            notes: event.target.value
        })
    }

    const handleSizeChange = (shape) => {
        setConfiguration({
            ...configuration,
            shape: shape
        })
    }

    //Once you add this it will work

    const handleCoatingChange = (event) => {
        setConfiguration({
            ...configuration,
            coating: event.target.value
        })

    }

      const isConfigurationComplete = () =>  {
        return (
        configuration.material &&
        configuration.shape &&
        configuration.coating &&
        configuration.size &&
        configuration.quantity > 0
    )};

    const [error, setError] = useState("");




    return (
    <div className = "layout">
    
    <div className = "design-layout">
    <div className = "material">
        Material
        <button className = {configuration.material === "Silicon" ? "Selected" : "notSelected"} onClick = {() => {handleMaterialChange("Silicon")}}>Silicon</button>
        <button className = {configuration.material === "Aluminum" ? "Selected" : "notSelected"} onClick = {() => {handleMaterialChange("Aluminum")}}>Aluminum</button>
        <button className = {configuration.material === "Glass" ? "Selected" : "notSelected"} onClick = {() => {handleMaterialChange("Glass")}}>Glass</button>
        <button className = {configuration.material === "Silicon Carbide" ? "Selected" : "notSelected"} onClick = {() => {handleMaterialChange("Silicon Carbide")}}>Silicon Carbide</button>

    </div>
    <div className = "shape">
        Shape
        <button onClick =  {() => {handleSizeChange("Round")}}>Round</button>
        <button onClick =  {() => {handleSizeChange("Rectangle")}}>Rectangle</button>
        <button onClick =  {() => {handleSizeChange("Hexagon")}}>Hezagonal</button>

    </div>
    <div className = "size">
        {configuration.shape === "Rectangle" &&
        (
            <div className = "specs">
                Width (mm)
                <input />
                Height (mm)
                <input />
                Thickness (mm)
                <input />
            </div>
        )}
        {configuration.shape === "Round" &&
        (
            <div className = "specs">
                Diameter (in)
                <input />
            </div>
        )}
        {configuration.shape === "Hexagon" 
        &&
        (
            <div className = "specs">
                Flat-to-Flat (mm)
                <input />
                Thickness (mm)
                <input />
            </div>
        )}

    </div>
    <div className = "coating-type">
        Coating Type
        <select name="coating-types" value = {configuration.coating} id="options" onChange = {handleCoatingChange}>
            <option value="" disabled hidden>Choose a coating</option>
            <option value="ZC-1251">ZC-1251</option>
            <option value="ZC-XXXX">ZC-XXXX</option>
            <option value="ZC-YYYY">ZC-YYYY</option>
        </select>
    </div>
    <div className = "number-of-mirrors">
        Number of Mirrors
        <div className = "mirror-button">
            <button onClick = {handleSubtract}>-</button>
            <div className = "config-quantity">{configuration.quantity}</div> 
            <button onClick = {handleAdd}>+</button>
            </div>
    </div>
    <div className = "additional-requirements">
        Additional Requirements
        <textarea name="Additional Requirements" onChange = {handleNotesChange} id="" placeholder="e.g, Surface quality, scratch-dig requirements, witness sample, etc"></textarea>
    </div>
  </div>
  <div className = "configuration-summary">
    
    <button onClick={() => {
        if (isConfigurationComplete()) {
            setError("");
            setStep("review");
        } else {
            setError("Please complete all required fields before proceeding.");
        }
    }}>Request & Review Quote</button>
    {error && (
    <p className="error-message">
        {error}
    </p>
)}
  </div>
  </div>

    );
}