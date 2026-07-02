export default function intro({
    setStep
}
    
) {
    return (
<>
    <div>
        Hello!!
    </div>
    <button onClick = {() => {setStep("configure")}}>Start Quote</button>
    
    </>

    )
}