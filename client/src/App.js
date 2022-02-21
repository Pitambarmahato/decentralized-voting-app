import React,  { useState, useEffect } from "react";
import Web3 from 'web3';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config.js';

function App(){
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [name, setName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [vote, setVote] = useState();
  const [winner, setWinner] = useState();


  // useEffect(() => {
  //   async function load(){
      // const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545' );
      // const accounts = await web3.eth.requestAccounts()
      // console.log("this is your account ", accounts)
      // setAccount(accounts[[0]]);
      
  //   }
  //   load();
  // })

  const loginHandler = async (e) =>{
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const accounts = await web3.eth.requestAccounts()
    setAccount(accounts[0])
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    setContract(contract)
  }
  const nameHandler = (e) =>{
      setName(e.target.value)
  }


  const submitNameHandler = (e) =>{
    contract.methods.addCandidate(name).send({from:account});
  }

  const getCandidateHandler = async (e) =>{
    for(var i = 0; i<=1; i++){
      var candidate = await contract.methods.getCandidate(i).call();
      setCandidates((candidates)=>[...candidates, candidate]);
    }
  }

  const voteHandler =  (e) =>{
    setVote(e.target.value)
  }

  const submitVote = (e) =>{
    try{
      contract.methods.voteCandidate(vote).send({from:account});
    }catch(error){
      let message = JSON.parse(error.message.substring(56).trim().replace("'", "")).value.data.data;
      console.log(message)
    }
  }

  const getWinner = async (e) =>{
    var win = await contract.methods.getWinner().call();
    console.log(win)
    setWinner(`The winner is ${win}`)
  }
  console.log(candidates)

  // console.log(contract)
  return(
    <div className="container mt-3">
      <h1 style={{textAlign: 'left', backgroundColor:'lightblue'}} className="p-3">Welcome to our voting app</h1>
      <div className="row mt-4">
        <div className="col-lg-4 offset-5">
          <button onClick={loginHandler} className="btn btn-primary">Connect Wallet</button>
        </div>
        <div className="col-lg-4 offset-5 mt-5 text-left">
          <input type="text" className="form-control" placeholder="Enter Candidate Name" onChange={nameHandler} />
          <button onClick={submitNameHandler} className="btn btn-primary mt-3 text-left">Submit Name</button>
        </div>

      </div>
      <div className="row">
        <div className="col-lg-4 offset-5 mt-5 text-left">
          <button onClick={getCandidateHandler} className="btn btn-primary">Show Candidates</button>
          <form className="form-horizontal mt-4 form-group">
            {
              candidates.map((name, index)=>{
                return (
                  <div>
                    <input type="radio" value={index} onChange={voteHandler}/>
                    <label>{name}</label>
                  </div>
                )
              })
            }
            <input type="submit" name="Submit Vote" value = "Submit Vote" onClick={submitVote}  className="btn btn-secondary mt-2"/>
          </form>
          <div className="mt-4 text-left">
            <button onClick={getWinner} className="btn btn-primary">Get Winner</button>
            <h2 style={{'background-color':"red", 'margin-top':10}}>{winner}</h2>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default App;
