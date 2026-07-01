import "../../styles/ProductConfigurator.css"


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

    const handleCoatingChange = () => {

    }

      const isConfigurationComplete = () =>  {
        return (
        configuration.material &&
        configuration.shape &&
        configuration.coating &&
        configuration.quantity > 0
    )};




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
            <div>
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
            <div>
                Flat-to-Flat (mm)
                <input />
                Thickness (mm)
                <input />
            </div>
        )}
        {configuration.shape === "Hexagon" 
        &&
        (
            <div>
                Flat-to-Flat (mm)
                <input />
                Thickness (mm)
                <input />
            </div>
        )}

    </div>
    <div className = "coating-type">
        Coating Type
        <select name="" id="options">
            <option value="">ZC-1251</option>
            <option value="">ZC-XXXX</option>
            <option value="">ZC-YYYY</option>
        </select>
    </div>
    <div className = "number-of-mirrors">
        Number of Mirrors
        <button onClick = {handleAdd}></button>
        <h2>{configuration.quantity}</h2>
        <button onClick = {handleSubtract}></button>
    </div>
    <div className = "additional-requirements">
        Additional Requirements
        <textarea name="Additional Requirements" onChange = {handleNotesChange} id="" placeholder="e.g, Surface quality, scratch-dig requirements, witness sample, etc"></textarea>
    </div>
{configuration.notes}
  </div>
  <div className = "configuration-summary">
    
    <button onClick = {() => {
        if (isConfigurationComplete())
        {setStep("review")}}
    }>Request & Review Quote</button>
  </div>
  </div>

    );
}