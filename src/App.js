import React, {useEffect, useState} from "react"
import logo from './logo.svg';
import './App.css';
import Results from "./components/Results";
import rotina, {getFunctions} from "./scripts/quine"
import rotina2 from "./scripts/alternativeQuine"

function App() {
  const [results, setResults] = useState(null);

  var resultsComponent = <Results data={results}/>;
  const [minTerms, setMinTerms] = useState("4 8 5 6 9 10 13");
  const [dontCares, setDontCares] = useState("0 7 15");
  const [variablesQty, setVariablesQty] = useState('4');
  const [message, setMessage] = useState("Aguardando inputs...")
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (minTerms === null){
      setMessage("Preencha os mintermos!!!")
    }else{
      setVariablesQty(parseInt(variablesQty));
      try{
        setResults(rotina2(minTerms,dontCares,variablesQty))
      }catch{
        setMessage("Deu treta")
      }
    }
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
            <select value={variablesQty} onChange={(value) => setVariablesQty(value.target.value)}>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </label>
          <input type="submit" />
        </form>
      </div>
      {results !== null ? resultsComponent : <div className="resultsContainer withoutResults">{message}</div>}
    </div>
  )
}

export default App;
