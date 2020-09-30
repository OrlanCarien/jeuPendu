import React, {Component} from 'react';
import './App.css';
const HIDDEN_SYMBOL = "_";
const Lettre = ({ lettre, feedback }) => (
  <div className={`lettre ${feedback}`}>
    <span className="lettre">
      {feedback === 'hidden' ? HIDDEN_SYMBOL : lettre}
    </span>
  </div>
)
const FormJoueur= ({  nomJoueur, onSubmit}) => (
  <div id="divForm">
    <form id="form"  onSubmit={(event) => onSubmit(event)}>
      <label>
        Joueur 1 :
        <input type="text" id="joueur1" />
      </label>
      <label>
        Joueur 2 :
        <input type="text" id="joueur2" />
      </label>
      <br/>
      <br/>
      <input type="submit" value="Commencer" />
    </form>
  </div>
)
const Score = ({ score, nomJoueur, joueurCourant }) => (
  <div>
    <span className={`score`}>
      Score de {nomJoueur[0]} : {score[0]}
      <br/>
      Score de {nomJoueur[1]} : {score[1]}
      <br/>
      Tour de {nomJoueur[joueurCourant]}
      <br/>
    </span>
  </div>
)
const Reinit = ({ nomJoueur, joueurCourant, onClick, onClickReboot, nomVainqueur }) => (
  <div className="reinitParent">
    <br/>
    <br/>
    <div className={`win`}>{nomVainqueur} a gagné!</div>
    <br/>
    <br/>
    <button className={`reinit`} onClick={() => onClick()}>
      Recommencer
    </button>
    <button className={`reboot`} onClick={() => onClickReboot()}>
      Changer de joueur
    </button>
  </div>
)
const Entree = ({ lettre, feedback, range, onClick }) => (
  <div className={`entree ${feedback} ${range}`} onClick={() => onClick(lettre)}>
    <span className="symbol">
      {lettre}
    </span>
  </div>
)
function getAllIndexes (arr, val){
    let indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}
let count = 0 
let copy = []
const LISTE_MOT = ["SERPENT", "TORTUE", "CHEVAL", "CROCODILE", "LION", "ELEPHANT", "CHEVRE", "MOUTON", "CRAPAUD"]
let min = 0
let max = LISTE_MOT.length
let random = parseInt(min + Math.random() * (max - min), 10)
let MOT = LISTE_MOT[random]
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
//On transforme le string mot en array
const getMot = (mot) =>{
  return mot.split('')
}
//On transforme le string mot en lettre ({id:..., name:..., feedback:...})
const getLettre = (mot) =>{
  let lettre = getMot(mot)
  lettre = lettre.map(function(value, index){
    value = {id: index+1, name: value, feedback: "hidden"}
    return value
  })
  return lettre
}
//On transforme le string mot en entree ({id:..., name:..., feedback:...})
const getEntree = (alphabet) =>{
  let entree = getMot(alphabet)
  entree = entree.map(function(value, index){
    value = {id: index+1, name: value, feedback: "clickable"}
    return value
  })
  return entree
}
//fonction qui permet d'initialiser le state
const getInitialiser  = (obj, detail) =>  {
  
  if(detail ===  "constructor")
    obj.state = {
      won : false,
      start : false,
      nomJoueur: [],
      joueurCourant : 0,
      nomVainqueur: "",
      score : [0,0],
      matchedIndices : [],
      mot :getMot(MOT),
      lettre :getLettre(MOT),
      entree : getEntree(ALPHABET)
      }
  else if(detail ===  "reboot")
    obj.setState( {
      won : false,
      start : false,
      nomJoueur: [],
      joueurCourant : 0,
      nomVainqueur: "",
      score : [0,0],
      matchedIndices : [],
      mot :getMot(MOT),
      lettre :getLettre(MOT),
      entree : getEntree(ALPHABET)
      })
  else
    obj.setState({
      won : false,
      start: true,
      joueurCourant : 0,
      nomVainqueur: "",
      score : [0,0],
      matchedIndices : [],
      mot :getMot(MOT),
      lettre :getLettre(MOT),
      entree : getEntree(ALPHABET)
      })

} 
class App extends Component {
  constructor(props) {
    super(props);
    getInitialiser(this, "constructor")
    
  }
  handleReboot = (document) => {
    
    getInitialiser(this, "reboot")
  }
  handleReinit = () => {
    let oldRandom = random
    do
    {
      random = parseInt(min + Math.random() * (max - min), 10)
    }while(oldRandom === random)
    MOT = LISTE_MOT[random]
    getInitialiser(this, "function")
  }

  handleKeyDown = (event) => {

        if(!this.state.won && event.keyCode > 64 && event.keyCode < 91)
        { 
          let valeurLettre = this.state.entree[event.keyCode-65].name
          this.handleClick(valeurLettre)
        }
      
  }
  handleSubmit = (event) => {

    event.preventDefault()
    let start = this.state.start
    let nomJoueur = [...this.state.nomJoueur]
    nomJoueur[0] = document.getElementById("joueur1").value
    nomJoueur[1] = document.getElementById("joueur2").value
    start = true
    this.setState({ start })
    this.setState({ nomJoueur })
    
    document.addEventListener("keydown", this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown)
  }
  
  handleClick = (boutonClique) => {
    let entree = [ ...this.state.entree ]
    let joueurCourant = this.state.joueurCourant
    let score = this.state.score
    let nomJoueur = this.state.nomJoueur
    let compteur = 0
    entree.map(function(index) {
      if(index.name ===  boutonClique){
        entree[compteur] = {...entree[compteur], feedback: "alreadyClicked"}
      }
      compteur++
      return 1
    })
    this.setState({ entree })
    if(this.state.mot.indexOf(boutonClique) !== -1 && this.state.won === false){
      
      
      let indexes = getAllIndexes(this.state.mot, boutonClique);
      let lettre = [ ...this.state.lettre ]
      let matchedIndices = [ ...this.state.matchedIndices ]
      let dejaClique = false
      indexes.map(function(index) {
        if(matchedIndices[index] && matchedIndices[index][0] === boutonClique)
          dejaClique = true
        matchedIndices[index] = {...matchedIndices[index], ...lettre[index].name}
        lettre[index] = {...lettre[index], feedback: "visible"}
        
        return 1
      })
      if(dejaClique){
        score[joueurCourant] = score[joueurCourant] - 2;
        if(joueurCourant === 0)
          joueurCourant = 1
        else
          joueurCourant = 0
        
      } 
      else
        score[joueurCourant] = score[joueurCourant] + 2;
      this.setState({ score })
      
      this.setState({ lettre })
      this.setState({ matchedIndices })
      
      copy = this.state.mot
      count = 0
      matchedIndices.map(function(value, key){
        if(value !== undefined && copy[key] === value[0])
        {
          count = count + 1
        }
        return 1
      })
      if(count === this.state.mot.length){
        
        let joueurAdverse = joueurCourant === 1 ? 0 : 1
        if(score[joueurCourant] > score[joueurAdverse])
          this.setState({ nomVainqueur: nomJoueur[joueurCourant]})
        else
          this.setState({ nomVainqueur: nomJoueur[joueurAdverse]})
        this.setState({ won: true })
      }
    }
    else{
      score[joueurCourant] = score[joueurCourant] - 1;
      if(joueurCourant === 0)
          joueurCourant = 1
      else
          joueurCourant = 0
      
      this.setState({ score })
    }
    this.setState({ joueurCourant })
    
  }

 render () {
    const { lettre, entree, won, score, start, nomJoueur, joueurCourant, nomVainqueur} = this.state
    return (
      <div className="App">
      {!start && <FormJoueur nomJoueur={nomJoueur} onSubmit={this.handleSubmit} />}

      {start && lettre.map((lettre, index) => (
            <Lettre lettre={lettre.name} feedback={lettre.feedback} key={index} />
       ))}
      {start && !won && entree.map((entree, index) => (
           
            <Entree lettre={entree.name} feedback={entree.feedback} range={index < 13 ? 'firstRange' : 'secondRange'} onClick={this.handleClick} key={index}   />

      ))}
      {start && <Score nomJoueur={nomJoueur} joueurCourant={joueurCourant} score={score}/>}
      {start && won && <Reinit nomJoueur={nomJoueur} joueurCourant={joueurCourant} nomVainqueur={nomVainqueur} onClick={this.handleReinit} onClickReboot={this.handleReboot}/>}
       
      </div>
    )
  }

}


export default App;
