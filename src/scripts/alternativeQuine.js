//mover pra ultils
function convertIntToBinary(int, variables){
    var binary = (int >>> 0).toString(2);

    while(binary.length < variables){
        binary = "0" + binary.substring(0);
    }

    return binary;
}

export default function rotina(answer1, dontCares, variables){
    if (answer1.length !== 0){
        var numberArray = stringArrayToIntArray(answer1+" "+dontCares, variables);  
        dontCares = stringArrayToIntArray(dontCares, variables);  
        // console.log(numberArray);
        // console.log(dontCares);

        if (numberArray.length > 0){
            // console.log(variables);
            var firstGroups = createGroups(numberArray, variables);
            var loopGroups = firstGroups;
            var loopTry = true;
            var finalExp = [];

            while (loopTry){
                // console.log('entrei de novo');
                var {newTry, newGroup, finalExpressions} = minimizeGroupsAlternative(loopGroups, variables);

                // console.log(newGroup);
                // console.log(finalExpressions);

                if (finalExpressions.length > 0){
                    finalExpressions.forEach((exp)=>{
                        finalExp.push(exp);
                    })
                }

                loopGroups = newGroup;
                loopTry = newTry;
            }

            // console.log(finalExp);
            
            var minTerms = getAllValidMinTerms(dontCares, finalExp);
            // console.log(minTerms)
    
            var table = createTable(finalExp, minTerms);
            // console.log(table)

            return {finalExp, minTerms, table};
        }
    }
}

function minimizeGroupsAlternative(groups, variables){
    var newTry = false;
    var newGroup;
    var newExpressions = [];
    var finalExpressions = [];
    var minTerms = [];
    var binaries = [];

    //comparo grupos
    for(let i=0; i<groups.length; i++){
        //pego o elemento
        for(let j=0; j<groups[i].length; j++){
            if(groups[i+1] !== undefined){
                //comparo com os elementos do próximo grupo
                var isFinalExpression = true;
                for(let k=0; k<groups[i+1].length; k++){

                    var {index, diffBits} = compareBinary(groups[i][j].binary, groups[i+1][k].binary, variables);
                    
                    if (diffBits === 1){
                        newTry = true;
                        isFinalExpression = false;

                        let aux = JSON.parse(JSON.stringify(groups[i][j]));
                        aux.binary[index] = "-";
                        aux.column += 1;
                        
                        groups[i+1][k].numbers.forEach((number)=>{
                            aux.numbers.push(number);
                        })
                        
                        if(!minTerms.includes(groups[i][j].numbers)) minTerms.push(groups[i][j].numbers);
                        if(!minTerms.includes(groups[i+1][k].numbers)) minTerms.push(groups[i+1][k].numbers);

                        newExpressions.push(aux);
                    }
                }
                if(isFinalExpression){
                    let naoRepete = true;

                    binaries.forEach((bin)=>{
                        if(JSON.stringify(bin) === JSON.stringify(groups[i][j].binary))
                            naoRepete = false;
                    })

                    if(naoRepete){
                        if (!minTerms.includes(groups[i][j].numbers)){
                            finalExpressions.push(groups[i][j]);
                            binaries.push(groups[i][j].binary);
                        }
                    }
                }
            }else{
                let naoRepete = true;

                binaries.forEach((bin)=>{
                    if(JSON.stringify(bin) === JSON.stringify(groups[i][j].binary))
                        naoRepete = false;
                })

                if(naoRepete){
                    if (!minTerms.includes(groups[i][j].numbers)){
                        finalExpressions.push(groups[i][j]);
                        binaries.push(groups[i][j].binary);
                    }
                }
            }
        }
    }

    newGroup = organizateGroups(newExpressions, variables);
    
    return {newTry, newGroup, finalExpressions}
}

//mover pra ultils
export function getFunctions(primes, table){
    var othersPrimes = [];
    var essentialPrimes = [];
    var row = 0;
    var xPositions = [];

    //get essentials primes
    for (var j=0; j<(table[0].length); j++){
        var counter = 0;
        for (var i=0; i<table.length; i++){
            if (table[i][j] === "x"){
                counter+=1;
                row = i;
                xPositions.push([i,j]);
            }
        }
        if (counter === 1){
            if(!essentialPrimes.includes(primes[row])){
                essentialPrimes.push(primes[row]);
            }
        } 
    }

    essentialPrimes.forEach((e_prime)=>{
        xPositions = removeXPositions(primes.indexOf(e_prime),xPositions);
    })

    //get others primes
    //the algorithm will choose the smallests expressions first
    //this loop will continue while the xPositions array not empty

    for(i=0; (xPositions.length > 0); i++){
        if (!essentialPrimes.includes(primes[xPositions[i][0]]) && xPositions.length > 0){
            // console.log(primes[position]);
            if (!hasDuplicatedFunction(primes[xPositions[i][0]].binary, othersPrimes)){
                othersPrimes.push(primes[xPositions[i][0]]);
            }
        }       
        xPositions = removeXPositions(xPositions[i][0],xPositions);
    }

    return {essentialPrimes, othersPrimes};
}

function removeXPositions(line, xPositions){
    var columns = [];

    var newXPositions = xPositions.filter((xPos) => {
        if (xPos[0] === line){
            if(!columns.includes(xPos[1])) columns.push(xPos[1]);
        }
        if(xPos[0] !== line){
            return  xPos[0] !== line;
        }
    });

    columns.forEach((column)=>{
        newXPositions = newXPositions.filter(xPos => xPos[1] !== column);
    })
    
    return newXPositions;
}

//mover pra ultils
function hasDuplicatedFunction(binary, othersPrimes){
    var hasADuplicate = false;
    othersPrimes.forEach((prime)=>{
        if (JSON.stringify(prime.binary) === JSON.stringify(binary)) hasADuplicate = true
    })
    return hasADuplicate;
}

//mover pra ultils
function createTable(finalExp, minTerms){
    var table = [];

    for(var i=0; i<finalExp.length; i++){
        table.push([]);
        for(var j=0; j<minTerms.length; j++){
            table[i].push(" ");
        }
    }

    for (i=0; i<finalExp.length; i++){
        for (j=0; j<minTerms.length; j++){
            for (var k=0; k<finalExp[i].numbers.length; k++){
                if(finalExp[i].numbers[k] === minTerms[j]){
                    table[i][j] = "x";
                }
            }
        }
    }

    return table;
}

//mover pra ultils
function createGroups(numberArray, variables){
    var groups = [];

    numberArray.forEach((number) => {
        var binary = convertIntToBinary(number, variables).split('');
        //var binary = binarios[number].split('');
        groups.push({column: 0, numbers: [number], binary});
    })
    
    groups = organizateGroups(groups, variables);

    return groups;
}

//mover pra ultils
function organizateGroups(groups, variables){
    var organizedGroups = [];

    for (var i=0; i<=variables; i++){
        organizedGroups.push([]);
    }
    
    groups.forEach((minTerm,i)=>{
        var counter = countOnes(minTerm.binary);
        organizedGroups[counter].push(minTerm);
    }) 

    return organizedGroups;    
}

//mover pra ultils
function getAllValidMinTerms(dontCares, primes){
    var array = [];
    primes.forEach((prime)=>{
        prime.numbers.map((number)=>{
            if(typeof(number) != 'object'){
                if(!array.includes(number) && !dontCares.includes(number)) array.push(number);
            }else{
                number.map((subnumber)=>{
                    if(!array.includes(subnumber) && !dontCares.includes(subnumber)) array.push(subnumber); 
                })
            }
        })
    })

    return array.sort((a,b) => a - b);
}

//mover pra ultils
function stringArrayToIntArray(array, variables){
    const results = array.split(' ').filter(numero => (numero != '' && numero < Math.pow(2, variables)))
    var numberArray = results.map(Number);
    return numberArray.sort((a,b)=>a-b);
}

//mover pra ultils
function compareBinary(binA, binB, variables){
    //console.log("comparing "+binA+" with "+binB);
    var diffBits = 0;
    var index = -1;
    for(var i=0; i<variables; i++){
        if (binA[i] != binB[i]){
            diffBits+=1;
            index = i;
        } 

    }

    if (diffBits > 1) index = -1;

    //console.log("number of diffent bits "+diffBits);
    return { index , diffBits };
}

//mover pra ultils
function countOnes(binary){
    var counter = 0;

    binary.map((bit)=>{
        if (bit === '1') counter+=1;
    })

    return counter;
}