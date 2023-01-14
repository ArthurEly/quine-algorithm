import React, {useEffect, useState} from "react"
import logo from './logo.svg';
import './App.css';
import Results from "./components/Results";
import rotina from "./scripts/alternativeQuine"

function App() {
  const [results, setResults] = useState(null);

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
        if(minTerms.length > 0){
          setResults(rotina(minTerms,dontCares,variablesQty))
        }else{
          alert('Se tua função não tem minTermos, ela é falsa/igual a 0.\nPreencha os minTermos!!')
        }
      }catch{
        setMessage("Deu treta")
      }
    }
  }
  
  var resultsComponent = <Results data={results}/>;

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
            <select defaultValue={variablesQty} onChange={(value) => setVariablesQty(value.target.value)}>
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
      {results !== null ? resultsComponent : <div className="resultsContainer withoutResults">{message}<br/>Se nao tiveres minTermos na tua função, a função é falsa/igual a zero</div>}
    </div>
  )
}

export default App;
