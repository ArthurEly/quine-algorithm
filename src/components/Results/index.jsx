import React, { useEffect, useState } from 'react'
import rotina, {getFunctions} from "../../scripts/alternativeQuine"
import {createComponent} from "../../scripts/utils"

export default function Results({data}) {
    var {minTerms, finalExp, table} = data;
    var {essentialPrimes, othersPrimes} = getFunctions(finalExp, table);

    var essentialPrimesComponent = createComponent(essentialPrimes);
    var othersPrimesComponent = createComponent(othersPrimes);
    const [constant, setConstant] = useState(null);
    
    const modifyTable = (table) => {
        var row = 0;
        var column = 0;
        var auxTable = [];
        for (var i = 0; i < table.length; i++){
            auxTable[i] = table[i].slice();
        }
        
        console.log(table);
        console.log(auxTable);
        for(var j=0; j<auxTable[0].length; j++){
            var counter = 0;
            for(var i=0; i<auxTable.length; i++){
                if (auxTable[i][j] === "x"){
                    counter+=1;
                    row = i;
                    column = j;
                }
            }
            if (counter === 1){
                auxTable[row][column] = "X";
            } 
        }

        return auxTable;
    
    }

    var newTable = modifyTable(table);
    
    const checkTable = (table)=>{
        setConstant(null);
        var xs = 0;
        var tableArea = table.length * table[0].length;

        for(var i=0; i<table.length; i++){
            for(var j=0; j<table[0].length; j++){
                if (table[i][j] === 'x' || table[i][j] === 'X'){
                    xs+=1;
                }
            }
        }

        if(xs === 0)
            setConstant(0)
        else if (xs === tableArea)
            setConstant(1)

    }

    useEffect(()=>{
        checkTable(table);
    },[table])

    return (
        <div className="resultsContainer">
            <div className="horizontalContainer">
                <div className="columns">
                
                </div>
                <div className="title">
                {
                minTerms.map((term)=>{
                    return(
                        <div className="cel">{term}</div>
                    )
                })
                }
                </div>
            </div>
            <div className="horizontalContainer">
                <div className="lines">
                {
                    finalExp.map((prime)=>{
                    return(
                        <div className="horizontalContainer spc">
                        <div className="cel minTerms">({prime.numbers.map((number, i) => {
                            return(<>{number}{i === (prime.numbers.length-1) ?  "" : ", "}</>)
                        })})
                        </div>
                        <div className="binary">
                            {prime.binary}
                        </div>
                        </div>
                    )
                    })
                }
                </div>
                <div className="table">
                {   
                    newTable.map((item)=>{
                    return(
                    <div className="horizontalContainer">
                    {
                        item.map((subitem)=>{
                        return(
                            <div className={`cel tableCels ${subitem === 'X' ? "essential" : ""}`}>{subitem}</div>
                        )
                        })
                    }
                    </div>
                    )
                })
                }
                </div>
            </div>
            <div className="functionsContainer">
                <h3>Essential Primes</h3>
                <div className="primesContainer"> 
                { essentialPrimesComponent }
                </div>
                {/* <h3>Others Primes</h3>
                <div className="primesContainer">
                { othersPrimesComponent } 
                </div> */}
                <h2>Suggested function</h2>
                { 
                    constant === null ? 
                    <div className="function">
                        { essentialPrimesComponent }
                        { (othersPrimesComponent.length > 0 && essentialPrimesComponent.length > 0) ? "+" : ""}
                        { othersPrimesComponent } 
                    </div>
                    :
                    <div className="function">
                        { constant }
                    </div>
                }
            </div>
        </div>
  )
}
