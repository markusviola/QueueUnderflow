import React, { Component } from 'react';
import './App.css';
import augTCR from './tcr-framework/AugTCR';
import RegisterForm from './components/RegisterForm';
import ChallengerForm from './components/ChallengerForm';
import ProposalForm from './components/ProposalForm';
import Champions from './components/Champions';
import Contenders from './components/Contenders';
import Parameterizers from './components/Parameterizers';
import Proposals from './components/Proposals';


class App extends Component {

  constructor(){
    super();

    this.state = {
      envStatus: false,
      processStatus: false,
      hash: "",
      challengeID: 0,
      selectedContender: "",
      selectedProposal: "",

      renderRegisterForm: false,
      renderChallengerForm: false,
      renderProposalForm: false,
      renderChampions: false,
      renderContenders: false,
      renderParameterizers: false,
      renderProposals: false
    }
  }

  initEnvironment(){
    this.setState({ env: new augTCR()}, ()=>{
      this.state.env.setEnvironmentInstance(
        "0x060A4b9CE5cc529677A8cA542aea98929b170900",
        "0x6835308EA5C8962Cb160188E96c88D2163B18Dfd",
        "0xa7056cA8F5c556e7F275c045cc28b57Bb0c4C469")
      .then(()=>{
        this.setState({envStatus: true}, ()=>{
          this.setState({renderRegisterForm: true},()=>{
            this.state.env.PLCRGetTokenAddress()
            .then((tokenAddress)=> {
              console.log("EIP20 Token: "+tokenAddress);
              console.log("TCR Environment is successfully initialized... [Status: Ready]");
              this.initEventWatchers();
            });
          })
        })
      });
    });
  }

  initEventWatchers(){
    this.state.env.PLCROperationEvent().then((result)=>{this.hideProcess(result[0], result[1])});
    this.state.env.registryNewContender().then((result)=>{this.hideProcess(result[0], result[1])});
    this.state.env.registryNewChallenge().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.paramNewProposal().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.paramNewProposalChallenge().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.PLCRVoteCommited().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.PLCRVoteRevealed().then((result)=>{this.hideProcess(result[0],result[1])});
  }

  hideProcess(result,message){
    if(result){
      alert(message);
    }
    else alert(message);
    
    this.setState({processStatus: false});
  }

  componentDidMount(){
    this.initEnvironment()
    //this.state.env.initEnvironmentAndToken(9, "CIDER", 9, "CID", [300,300,3600,3600,3600,3600,3600,3600,50,50,50,50,0,0],"Gladiator");
    
  }

  handleSubmit(e){
    e.preventDefault();
    if(this.state.envStatus === true){
      this.state.env.PLCRTokenFaucet(this.refs.amount.value)
      .then((isTransaction) => {
        this.toggleProcess(isTransaction);
      });
      this.refs.amount.value = "";
    }
    
  }

  onGetVotingBalance(){
    this.state.env.PLCRGetVotingBalance()
    .then((balance) => {
      alert("Your current balance is: "+ balance);
    });
  }

  expireApplyStage(){
    this.state.env.registryAAAExpireApplication(this.state.contenderHash);
  }

  expireProposalStage(){
    this.state.env.paramAAAExpireProposal(this.state.contenderHash);
  }

  expireCommitStage(){
    this.state.env.PLCRAAAExpireCommitDuration(this.state.challengeID);
  }

  expireRevealStage(){
    this.state.env.PLCRAAAExpireRevealDuration(this.state.challengeID);
  }

  toggleProcess(isProcessing){
    this.setState({processStatus: isProcessing});
  }

  onHashChange(evt){
    this.setState({hash: evt.target.value});
  }

  onChallengeIDChange(evt){
    this.setState({challengeID: evt.target.value});
  }

  renderComponent(value){
    this.setState({
      renderRegisterForm: "registerForm" === value ? true : false,
      renderChallengerForm: "challengerForm" === value ? true : false,
      renderProposalForm: "proposalForm" === value ? true : false,
      renderChampions: "champions" === value ? true : false,
      renderContenders: "contenders" === value ? true : false,
      renderParameterizers: "parameterizers" === value ? true : false,
      renderProposals: "proposals" === value ? true : false,
    })
  }

  handleChallenge(_contenderHash){
    this.setState({
      selectedContender: _contenderHash
    },() => {
      this.renderComponent("challengerForm");
    })
  }

  render() {

    let process = "";

    if(this.state.processStatus === true){
      process = <img id="process" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" style={{width: "50px"}}/>
    }
    
    let renderRegisterForm = "";
    let renderChallengerForm = "";
    let renderProposalForm = "";
    let renderChampions = "";
    let renderContenders = "";
    let renderParameterizers = "";
    let renderProposals = "";

    if(this.state.renderRegisterForm) renderRegisterForm = <RegisterForm onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderChallengerForm) renderChallengerForm = <ChallengerForm predefinedHash = {this.state.selectedContender} onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderProposalForm) renderProposalForm = <ProposalForm onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderChampions) renderChampions = <Champions instance = {this.state.env}/>
    else if(this.state.renderContenders) renderContenders = <Contenders onProcess = {this.toggleProcess.bind(this)} challengeClicked = {this.handleChallenge.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderParameterizers) renderParameterizers = <Parameterizers instance = {this.state.env}/>
    else if(this.state.renderProposals) renderProposals = <Proposals instance = {this.state.env}/>

    

    return (
      <div className="App" style={{float:"left", textAlign: "left"}}>
        <strong>Augmented TCR</strong><br/>
        {process}
        <form onSubmit={this.handleSubmit.bind(this)}>
              <br/>                  
              
              Token Faucet:
              <div>
                  <label>Amount</label> <input type="text" ref="amount" />
              </div>
              <br/>
                <button type="submit">Buy Token!</button>
        </form>    

        <button onClick={this.onGetVotingBalance.bind(this)}>Get Balance</button>
        <br/>
        <br/>
        Expire Stage Duration: 
        <div style={{display:"flex",justifyContent:"space-between", width: "630px"}}>
          <input type="text" placeholder="Contender or Proposal ID" onChange={this.onHashChange.bind(this)}/>
          <button onClick={this.expireApplyStage.bind(this)}>Application</button>
          <button onClick={this.expireProposalStage.bind(this)}>Proposal</button>
          <input type="text" placeholder="Challenge ID" onChange={this.onChallengeIDChange.bind(this)}/>
          <button onClick={this.expireCommitStage.bind(this)}>Commit</button>
          <button onClick={this.expireRevealStage.bind(this)}>Reveal</button>
        </div>
        <br/>
        <div style={{display:"flex",justifyContent:"space-between", width: "680px"}}>
          <button onClick={this.renderComponent.bind(this, "registerForm")}>Register Form</button>
          <button onClick={this.renderComponent.bind(this, "challengerForm")}>Challenger Form</button>
          <button onClick={this.renderComponent.bind(this, "proposalForm")}>Proposal Form</button>
          <button onClick={this.renderComponent.bind(this, "champions")}>Champions</button>
          <button onClick={this.renderComponent.bind(this, "contenders")}>Contenders</button>
          <button onClick={this.renderComponent.bind(this, "parameterizers")}>Parameterizers</button>
          <button onClick={this.renderComponent.bind(this, "proposals")}>Proposals</button>
        </div>
        
        {renderRegisterForm}
        {renderChallengerForm}
        {renderProposalForm}
        {renderChampions}
        {renderContenders}
        {renderParameterizers}
        {renderProposals}
        
      </div>
    );
  }
}

export default App;
