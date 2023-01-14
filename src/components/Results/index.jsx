import React, { useEffect, useState } from 'react'
import {getFunctions} from "../../scripts/alternativeQuine"
import {createComponent} from "../../scripts/utils"
import { createColumns } from '../../scripts/utils';

export default function Results({data}) {
    var {minTerms, finalExp, table, columns} = data;

    var columnsComponent = createColumns(columns);

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
    
    console.log(essentialPrimes);

    return (
        <div className="resultsContainer">
            <div className='columnsContainer'>
                {
                    columnsComponent.map((column,i)=>{
                        return(
                            i !== columnsComponent.length-1 ? 
                            <div className='column'>
                                <h2 className='tile'>Coluna {i}</h2>
                                {
                                    column.map((row,i)=>{
                                        return(
                                            <div className={`row ${i % 2 === 0 ? 'even' : 'odd'}`}>
                                            {
                                                row.map((expression,i)=>{
                                                    return(
                                                        <div className={`expression`}>
                                                            <span className='minTerms'>({expression.numbers.map((number, i) => {
                                                                return(<>{number}{i === (expression.numbers.length-1) ?  "" : ", "}</>)
                                                            })})</span>
                                                            <span className='binary'>{expression.binary}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        :
                        <></>
                        )
                    })
                }
            </div>
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
                    <div className="function">
                        { essentialPrimesComponent }
                        { (othersPrimesComponent.length > 0 && essentialPrimesComponent.length > 0) ? "+" : ""}
                        { othersPrimesComponent } 
                    </div>
                }
            </div>
        </div>
  )
}
