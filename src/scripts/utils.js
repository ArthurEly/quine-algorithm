function binaryToLogicFunction(binary){
    const logicFunction = [];
    const initialLetter = "A"
    const initialPosition = initialLetter.charCodeAt();

    var tautology = true;
    for(var i=0; i<binary.length; i++){
        console.log("wtf")
        if (binary[i] !== "-"){
            var negate = false;
            if (binary[i] === "0"){
                negate = true;
            }
            tautology = false;
            logicFunction.push(<span className={`term ${negate ? 'negate' : ''}`}>{String.fromCharCode(initialPosition + i)}</span>)
        }
        if(tautology){
            logicFunction.push(<span className={`term`}>1</span>)
            return logicFunction;
        }
    }
    return logicFunction;
}

export function createColumns(columns){
    var columnsComponent = [];
    var binaries = [];

    columns.forEach((row)=>{
        var newRow = [];
        row.forEach((expressions)=>{
            var newExpressions = [];
            expressions.forEach((expression)=>{
                var jaTem = false;
                binaries.forEach((bin)=>{
                    if (JSON.stringify(bin) === JSON.stringify(expression.binary)){
                        jaTem = true;
                    }
                })
                if(!jaTem){
                    binaries.push(expression.binary);
                    newExpressions.push(expression);
                }
            })
            newRow.push(newExpressions);
        })
        columnsComponent.push(newRow);
    })

    console.log(columnsComponent);

    return columnsComponent;
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

export function stringArrayToIntArray(array, variables){
    const results = array.split(' ').filter(numero => (numero != '' && numero < Math.pow(2, variables)))
    var numberArray = results.map(Number);
    return numberArray.sort((a,b)=>a-b);
}