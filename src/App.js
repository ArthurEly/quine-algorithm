import React, {useEffect, useState} from "react"
import logo from './logo.svg';
import './App.css';
import Results from "./components/Results";
import rotina, {getFunctions} from "./scripts/quine"

function App() {
  const [results, setResults] = useState(null);
  // var {minTerms, primes, table} = rotina("4 7 8 9","0 2 6 11 13 14",4);

  // setResults({minTerms, primes, table})
  var resultsComponent = <Results data={results}/>;
  const [minTerms, setMinTerms] = useState("");
  const [dontCares, setDontCares] = useState("");
  const [variablesQty, setVariablesQty] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setVariablesQty(parseInt(variablesQty));
    setResults(rotina(minTerms,dontCares,variablesQty))
  }
  
  return (
    <div className="pageContainer">
      <div className="inputsContainer">
        <form className="form" onSubmit={handleSubmit}>
          <label>minTermos:
            <input 
              type="text" 
              value={minTerms}
              onChange={(e) => setMinTerms(e.target.value)}
            />
          </label>
          <label>dontCares:
            <input 
              type="text" 
              value={dontCares}
              onChange={(e) => setDontCares(e.target.value)}
            />
          </label>
          <label>nro variáveis:
            <input 
              type="text" 
              value={variablesQty}
              onChange={(e) => setVariablesQty(e.target.value)}
            />
          </label>
          <input type="submit" />
        </form>
      </div>
      {results !== null ? resultsComponent : <>digita algo ai cabeça</>}
    </div>
  )
}

export default App;
