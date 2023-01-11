function binaryToLogicFunction(binary){
    const terms = ["A","B","C","D"];
    const logicFunction = [];

    for(var i=0; i<binary.length;i++){
        var negate = false;
        if (binary[i] !== "-"){
            if (binary[i] === "0"){
                negate = true;
            }
            logicFunction.push(<span className={`term ${negate ? 'negate' : ''}`}>{terms[i]}</span>)
        }

    }

    return logicFunction;
}

export function createComponent(array){
    var component = [];

    array.forEach((prime, i) => {
        component.push(<>
            { i !== 0 ? "+" : "" }{ binaryToLogicFunction(prime.binary) }
        </>)
    })

    return component;
}

//mover pra ultils
export function stringArrayToIntArray(array, variables){
    console.log(array)
    const results = array.split(' ').filter(numero => (numero != '' && numero < Math.pow(2, variables)))
    var numberArray = results.map(Number);
    return numberArray.sort((a,b)=>a-b);
}