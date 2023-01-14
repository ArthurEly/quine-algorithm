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
    
        if (numberArray.length > 0){
            var firstGroups = createGroups(numberArray, variables);
            //console.log(firstGroups);
    
            var loopGroups = firstGroups;
            var loopTry = true;
            var allPrimes = [];
            var loopCounter = 0;

            while (loopTry){
                var {newTry, newGroup} = minimizeGroups(loopCounter, loopGroups, variables);

                newGroup = organizateGroups(newGroup);
                newGroup.forEach((group)=>{
                    group.forEach((primes)=>{ 
                        //console.log(primes);
                        allPrimes.push(primes);
                    })
                })
                loopGroups = newGroup;
                loopTry = newTry;
                loopCounter+=1;
            }

            // console.log(allPrimes);
            var primes = cleanPrimes(allPrimes);
            //console.log(primes);
            
            var minTerms = getAllValidMinTerms(dontCares, primes);
            // console.log(minTerms)
    
            var table = createTable(primes.length, minTerms.length);
            // console.log(table)
            
            for (var i=0; i<primes.length; i++){
                for (var j=0; j<minTerms.length; j++){
                    for (var k=0; k<primes[i].numbers.length; k++){
                        // console.log(primes[i].numbers[k]);
                        // console.log(minTerms[j]);
                        if(primes[i].numbers[k] === minTerms[j]){
                            table[i][j] = "x";
                        }
                    }
                }
            }
            return {primes, minTerms, table};
        }
    }
}

//mover pra ultils
export function getFunctions(primes, table){
    var othersPrimes = [];
    var essentialPrimes = [];
    var position = 0;
    var xPositions = [];
    //console.log(primes);
    //sim

    //get essentials primes
    for (var j=0; j<(table[0].length); j++){
        var counter = 0;
        for (var i=0; i<table.length; i++){
            if (table[i][j] === "x"){
                counter+=1;
                position = i;
                //console.log("pushing: ["+i+"]["+j+"]");
                xPositions.push([i,j]);
            }
        }
        if (counter === 1){
            if (!hasDuplicatedFunction(primes[position].binary, essentialPrimes)){
                essentialPrimes.push(primes[position]);
                //xPositions = removeXPositions(position,xPositions);
            }
        } 
    }

    essentialPrimes.forEach((e_prime)=>{
        xPositions = removeXPositions(primes.indexOf(e_prime),xPositions);
    })

    // xPositions.forEach((x)=>{
    //     console.log(x);
    // })
    //get others primes
    //the algorithm will choose the smallests expressions first
    //this loop will continue while the xPositions array not empty

    for(var i=0; (xPositions.length > 0); i++){
        if (!essentialPrimes.includes(primes[xPositions[i][0]]) && xPositions.length > 0){
            // console.log(primes[position]);
            if (!hasDuplicatedFunction(primes[xPositions[i][0]].binary, othersPrimes)){
                othersPrimes.push(primes[xPositions[i][0]]);
            }
        }       
        xPositions = removeXPositions(xPositions[i][0],xPositions);
    }

    // console.log("Essential primes");
    // console.log(essentialPrimes)
    // console.log("Others primes");
    // console.log(othersPrimes)

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
function createTable(lines, columns){
    var table = [];

    for(var i=0; i<lines; i++){
        table.push([]);
        for(var j=0; j<columns; j++){
            table[i].push("-");
        }
    }

    return table;
}

//mover pra ultils
function createGroups(numberArray, variables){
    var groups = [];

    numberArray.map((number) => {
        var binary = convertIntToBinary(number, variables).split('');
        //var binary = binarios[number].split('');
        groups.push({column: 0, numbers: number, binary});
    })
    
    groups = organizateGroups(groups);

    return groups;
}

//mover pra ultils
function organizateGroups(groups){
    var organizedGroups = [[],[],[],[],[]];

    groups.forEach((minTerm)=>{
        var counter = countOnes(minTerm.binary);
        organizedGroups[counter].push({column: minTerm.column, numbers: minTerm.numbers, binary: minTerm.binary});
    }) 

    organizedGroups = cleanArray(organizedGroups);
    
    return organizedGroups;    
}

function minimizeGroups(column, groups, variables){
    var newGroup = [];
    var newTry = false;
    var numbers = [];

    for(var i=0; i<groups.length; i++){
        for(var j=0; j<groups[i].length; j++){
            if (groups[i+1] !== undefined){
                //when a minTerm doesnt like to look like the others ><
                //only valid with the min terms of the fisrt column
                var nobleMinTerm = column === 0;
                for(var k=0; k<groups[i+1].length; k++){
                    var {index, diffBits} = compareBinary(groups[i][j].binary, groups[i+1][k].binary, variables);

                    if (diffBits === 1 && (groups[i][j].column === groups[i+1][k].column)){
                        if(!numbers.includes(groups[i][j].numbers)) numbers.push(groups[i][j].numbers);
                        if(!numbers.includes(groups[i+1][k].numbers)) numbers.push(groups[i+1][k].numbers);
                        
                        nobleMinTerm = false;
                        newTry = true;

                        var aux = groups[i][j].binary.slice();
                        aux[index] = "-";
                        newGroup.push({column: column+1, numbers: [groups[i][j].numbers, groups[i+1][k].numbers], binary: aux});
                    }
                }
                if(nobleMinTerm && !numbers.includes(groups[i][j].numbers)){
                    if (!newGroup.includes({column: column, numbers: [groups[i][j].numbers], binary: groups[i][j].binary})){
                        newGroup.push({column: column, numbers: [groups[i][j].numbers], binary: groups[i][j].binary});
                    }
                }
            }else{
                //we need this in the case that the last minTerm had not match with anyone else
                if(column === 0 && !numbers.includes(groups[i][j].numbers)){
                    newGroup.push({column: column, numbers: [groups[i][j].numbers], binary: groups[i][j].binary});
                }
            }
        }
    }

    return {newTry, newGroup};
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
function cleanPrimes(allPrimes){
    var opitimizedPrimes = allPrimes;
    var arrayLength = allPrimes.length;

    //FIRST STEP
    //clean minor primes
    for(var i=(arrayLength-1); i>=0; i--){
        if(allPrimes[i].column > 1){
            allPrimes[i].numbers.forEach((number)=>{
                //console.log(number)
                //allPrimes.map((prime)=> console.log(prime.numbers));
                opitimizedPrimes = opitimizedPrimes.filter(prime => prime.numbers != number);
            })
        } 
    }

    //SECOND STEP
    //clean major primes
    // console.log("oooooooooooooooi");
    // console.log(opitimizedPrimes);
    for(var i=0; i<opitimizedPrimes.length; i++){
        for(var j=i+1; j<opitimizedPrimes.length; j++){
            if(opitimizedPrimes[i].column > 1 && opitimizedPrimes[j].column > 1){
                if(JSON.stringify(opitimizedPrimes[i].binary) === JSON.stringify(opitimizedPrimes[j].binary)){
                    opitimizedPrimes.splice(j, 1);
                }
            }
        }
    }

    //THIRD STEP
    //adjusting major primes numbers
    opitimizedPrimes.map((prime)=>{
        //console.log(prime)
        if(prime.column > 1){
            var allNumbers = [];
            getNumbers(prime.numbers, allNumbers);
            prime.numbers = allNumbers;
        }
    })

    return opitimizedPrimes;
}

//mover pra ultils
function getNumbers(numbers, allNumbers){
    //var numbersArray = [];
    if (typeof(numbers) === "object"){
        numbers.forEach((subnumbers)=>{
            getNumbers(subnumbers, allNumbers);
        })
    }else{
        //now, they are all integers
        allNumbers.push(numbers);
    }
}

//mover pra ultils
function cleanArray(array){
    return array.filter(item => item.length != 0)
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