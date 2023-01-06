import React from 'react'
import rotina, {getFunctions} from "../../scripts/quine"
import {createComponent} from "../../scripts/utils"

export default function Results({data}) {
    var {minTerms, primes, table} = data;
    var {essentialPrimes, othersPrimes} = getFunctions(primes, table);

    var essentialPrimesComponent = createComponent(essentialPrimes);
    var othersPrimesComponent = createComponent(othersPrimes);

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
                    primes.map((prime)=>{
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
                table.map((item)=>{
                    return(
                    <div className="horizontalContainer">
                    {
                        item.map((subitem)=>{
                        return(
                            <div className="cel tableCels">{subitem}</div>
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
                <div className="function">
                { essentialPrimesComponent }
                { (othersPrimesComponent.length > 0 && essentialPrimesComponent.length > 0) ? "+" : ""}
                { othersPrimesComponent } 
                </div>
            </div>
        </div>
  )
}
