import React, { Component } from 'react';
import './App.css';
import augTCR from './tcr-framework/AugTCR';
import RegisterForm from './components/RegisterForm';
import ChallengerForm from './components/ChallengerForm';
import ProposalForm from './components/ProposalForm';
import ProposalChallengerForm from './components/ProposalChallengerForm';
import Champions from './components/Champions';
import Contenders from './components/Contenders';
import Parameterizers from './components/Parameterizers';
import Proposals from './components/Proposals';
import Profile from './components/Profile';
import moment from 'moment';
import contract from './tcr-framework/ContractInstances';

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
      renderProposalChallengerForm: false,
      renderChampions: false,
      renderContenders: false,
      renderParameterizers: false,
      renderProposals: false,
      renderProfile: false,

      contenderProcessStatus: false,
      currentContenders: [],
      proposalProcessStatus: false,
      currentProposals: [],
      currentContenderChallenges: [],
      contenderChallengesProcessStatus: false,
      currentProposalChallenges: [],
      proposalChallengesProcessStatus: false,
      currentParameterizers: [],
      parameterizersProcessStatus: false
    }
  }

  initEnvironment(){
    this.setState({ env: new augTCR()}, ()=>{
      this.state.env.setEnvironmentInstance(
      contract.plcrAddress,
      contract.parameterizerAddress,
      contract.registryAddress)
      .then(()=>{
        this.setState({envStatus: true}, ()=>{
          this.setState({renderRegisterForm: true},()=>{
            this.state.env.PLCRGetTokenAddress()
            .then((tokenAddress)=> {
              console.log("EIP20 Token: "+tokenAddress);
              console.log("TCR Environment is successfully initialized... [Status: Ready]");
              this.initEventWatchers();
              this.retrieveData();
              
            });
          });
        });
      });
    });
  }

  async retrieveData(){
    this.setState({contenderProcessStatus: true},() =>{
      this.getContenderItems();
    })
    this.setState({proposalProcessStatus: true},() =>{
      this.getProposalItems();     
    })
    this.setState({contenderChallengesProcessStatus: true},() =>{
      this.getContenderChallengeItems();     
    })
    this.setState({proposalChallengesProcessStatus: true},() =>{
      this.getProposalChallengeItems();     
    })
    this.setState({parameterizersProcessStatus: true},() =>{
      this.getParameterizerItems();     
    })
  }

  initEventWatchers(){
    
    this.state.env.PLCROperationEvent().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.PLCRVoteCommited().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.PLCRVoteRevealed().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.PLCRTokensRescued().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.PLCRVotingRightsWithdrawn().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.PLCRVotingRightsGranted().then((result)=>{this.hideProcess(result[0],result[1])});
    
  
    this.state.env.registryOperationEvent().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.registryNewContender().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.registryNewChallenge().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.registryChallengerWon().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.registryChallengerLost().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.registryTouchedAndRemoved().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.registryWithdrawalEvent().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.registryDepositEvent().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.registryIncentiveClaimed().then((result)=>{this.hideProcess(result[0],result[1])});


    this.state.env.paramOperationEvent().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.paramNewProposal().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.paramNewProposalChallenge().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.paramPChallengerWon().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.paramPChallengerLost().then((result)=>{this.hideProcess(result[0],result[1])});
    this.state.env.paramIncentiveClaimed().then((result)=>{this.hideProcess(result[0],result[1])});
    
  }

  async getContenderItems(){
    this.state.env.registryGetAllContenders()
      .then(
          async (result) => {
          let updatedContenders = []

          for(let i=0; i<result.length; i++){

              var incentivePool = "N/A";
              var isConcluded = "N/A";
              var commitState = "N/A";
              var revealState = "N/A";
              var challenger = ""

              var expiration;
              var applyExpiry = new Date(result[i].appExpiry*1000);
              var now = new Date();

              if(now > applyExpiry) expiration = "Process finished."
              else expiration = "Application expires "+moment(applyExpiry).from(now)+".";

              if(result[i].challengeID !== 0){

                  let challengeInfo = await this.state.env.registryGetChallenge(result[i].challengeID);
                  var commitEndDate = new Date(challengeInfo.commitEndDate*1000);
                  var revealEndDate = new Date(challengeInfo.revealEndDate*1000);

                  if(now > commitEndDate) commitState = "Voting duration concluded."
                  else commitState = <div>{"Commit: Voting expires "+moment(commitEndDate).from(now)+"."}<br/></div>;

                  if(now > revealEndDate) revealState = "Reveal duration concluded."
                  else revealState = <div>{"Reveal: Confirmation expires "+moment(revealEndDate).from(now)+"."}<br/></div>;

                  incentivePool = challengeInfo.incentivePool;
                  isConcluded = challengeInfo.isConcluded;
                  challenger = challengeInfo.challenger;
              }
              
              updatedContenders.push({
                  key: i+1,
                  contenderHash: result[i].contenderHash,
                  contender: result[i].desc,
                  issuer: result[i].issuer,
                  isChampion: result[i].isChampion,
                  challengeID: result[i].challengeID,
                  applicationExpiry: expiration,
                  incentivePool: incentivePool,
                  isConcluded: isConcluded,
                  commitVoteExpiry: commitState,
                  revealVoteExpiry: revealState,
                  challenger: challenger
              })
          }
          
          this.setState({currentContenders: updatedContenders, contenderProcessStatus: false},() => {});
      });
  }

  async getContenderChallengeItems(){
    this.state.env.registryGetAllChallenges()
      .then(
          async (result) => {

          let updatedContenderChallenges = [];

          for(let i=0; i<result.length; i++){

              var commitState = "N/A";
              var revealState = "N/A";

              var now = new Date();
              var commitEndDate = new Date(result[i].commitEndDate*1000);
              var revealEndDate = new Date(result[i].revealEndDate*1000);

              if(now > commitEndDate) commitState = "Voting duration concluded."
              else commitState = <div>{"Commit: Voting expires "+moment(commitEndDate).from(now)+"."}<br/></div>;

              if(now > revealEndDate) revealState = "Reveal duration concluded."
              else revealState = <div>{"Reveal: Confirmation expires "+moment(revealEndDate).from(now)+"."}<br/></div>;

              updatedContenderChallenges.push({
                  key: i+1,
                  challengeID: result[i].challengeID,
                  incentivePool: result[i].incentivePool,
                  isConcluded: result[i].isConcluded,
                  commitVoteExpiry: commitState,
                  revealVoteExpiry: revealState
              })
          }

          this.setState({currentContenderChallenges: updatedContenderChallenges, contenderChallengesProcessStatus: false},() => {});
      });
  }

  async getProposalItems(){
      this.state.env.paramGetAllProposals()
      .then(
          async (result) => {
          let updatedProposals = [];
          for(let i=0; i<result.length; i++){
              

              var incentivePool = "N/A";
              var isConcluded = "N/A";
              var commitState = "N/A";
              var revealState = "N/A";
              var challenger = "";

              var expiration;
              var propExpiry = new Date(result[i].proposalExpiry*1000);
              var now = new Date();

              if(now > propExpiry) expiration = "Process finished."
              else expiration = "Proposal expires "+moment(propExpiry).from(now)+".";
              
              if(result[i].challengeID !== 0){

                  let challengeInfo = await this.state.env.paramGetChallenge(result[i].challengeID);
                  var commitEndDate = new Date(challengeInfo.commitEndDate*1000);
                  var revealEndDate = new Date(challengeInfo.revealEndDate*1000);

                  if(now > commitEndDate) commitState = "Voting duration concluded."
                  else commitState = <div>{"Commit: Voting expires "+moment(commitEndDate).from(now)+"."}<br/></div>;

                  if(now > revealEndDate) revealState = "Reveal duration concluded."
                  else revealState = <div>{"Reveal: Confirmation expires "+moment(revealEndDate).from(now)+"."}<br/></div>;

                  incentivePool = challengeInfo.incentivePool;
                  isConcluded = challengeInfo.isConcluded;
                  challenger = challengeInfo.challenger;
              }
              
              updatedProposals.push({
                  key: i+1,
                  proposalID: result[i].proposalID,
                  paramName: result[i].paramName,
                  paramVal: result[i].paramVal,
                  challengeID: result[i].challengeID,
                  proposalExpiry: expiration,
                  incentivePool: incentivePool,
                  isConcluded: isConcluded,
                  commitVoteExpiry: commitState,
                  revealVoteExpiry: revealState,
                  challenger: challenger
              })

              
          }
          this.setState({currentProposals: updatedProposals, proposalProcessStatus: false},() => {});
      });
  }  

  async getProposalChallengeItems(){
    this.state.env.paramGetAllChallenges()
      .then(
          async (result) => {
          let updatedProposalChallenges = [];

          for(let i=0; i<result.length; i++){

              var commitState = "N/A";
              var revealState = "N/A";

              var now = new Date();
              var commitEndDate = new Date(result[i].commitEndDate*1000);
              var revealEndDate = new Date(result[i].revealEndDate*1000);

              if(now > commitEndDate) commitState = "Voting duration concluded."
              else commitState = <div>{"Commit: Voting expires "+moment(commitEndDate).from(now)+"."}<br/></div>;

              if(now > revealEndDate) revealState = "Reveal duration concluded."
              else revealState = <div>{"Reveal: Confirmation expires "+moment(revealEndDate).from(now)+"."}<br/></div>;
              
              updatedProposalChallenges.push({
                  key: i+1,
                  challengeID: result[i].challengeID,
                  incentivePool: result[i].incentivePool,
                  isConcluded: result[i].isConcluded,
                  commitVoteExpiry: commitState,
                  revealVoteExpiry: revealState
              })
          }

          this.setState({currentProposalChallenges: updatedProposalChallenges, proposalChallengesProcessStatus: false},() => {});
      });
  }

  async getParameterizerItems(){
    this.state.env.paramGetAllParameterizers()
    .then((result) => {
        let updatedParameterizers = [];
        for(let i=0; i<result.length; i++){
            updatedParameterizers.push({
                key: i+1,
                paramName: result[i].paramName,
                paramVal: result[i].paramVal
            })
            
        }
        this.setState({currentParameterizers: updatedParameterizers, parameterizersProcessStatus: false});
    });
  }

  hideProcess(result,message){
    if(result){
      alert(message);
      this.retrieveData();
    }
    else alert(message);
    
    this.setState({processStatus: false});
  }

  componentDidMount(){
    this.initEnvironment()
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
    this.state.env.registryAAAExpireApplication(this.state.hash)
    .then((isTransaction) => {
      this.toggleProcess(isTransaction);
    });
  }

  expireProposalStage(){
    this.state.env.paramAAAExpireProposal(this.state.hash)
    .then((isTransaction) => {
      this.toggleProcess(isTransaction);
    });
  }

  expireCommitStage(){
    this.state.env.PLCRAAAExpireCommitDuration(this.state.challengeID)
    .then((isTransaction) => {
      this.toggleProcess(isTransaction);
    });
  }

  expireRevealStage(){
    this.state.env.PLCRAAAExpireRevealDuration(this.state.challengeID)
    .then((isTransaction) => {
      this.toggleProcess(isTransaction);
    });
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
      renderProposalChallengerForm: "proposalChallengerForm" === value ? true : false,
      renderChampions: "champions" === value ? true : false,
      renderContenders: "contenders" === value ? true : false,
      renderParameterizers: "parameterizers" === value ? true : false,
      renderProposals: "proposals" === value ? true : false,
      renderProfile: "profile" === value ? true : false,
    })
  }

  handleChallenge(contender){
    this.setState({
      selectedContender: contender
    },() => {
      this.renderComponent("challengerForm");
    })
  }

  handleProposalChallenge(proposal){
    this.setState({
      selectedProposal: proposal
    },() => {
      this.renderComponent("proposalChallengerForm");
    })
  }

  render() {

    let process = "";

    if(this.state.processStatus === true){
      process = <img id="process" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" style={{width: "35px", height: "35px"}}/>
    }
    
    let renderRegisterForm = "";
    let renderChallengerForm = "";
    let renderProposalForm = "";
    let renderProposalChallengerForm = "";
    let renderChampions = "";
    let renderContenders = "";
    let renderParameterizers = "";
    let renderProposals = "";
    let renderProfile = "";

    if(this.state.renderRegisterForm) renderRegisterForm = <RegisterForm onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderChallengerForm) renderChallengerForm = <ChallengerForm selectedContender = {this.state.selectedContender} onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderProposalForm) renderProposalForm = <ProposalForm onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderProposalChallengerForm) renderProposalChallengerForm = <ProposalChallengerForm selectedProposal = {this.state.selectedProposal} onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderChampions) renderChampions = <Champions currentContenders = {this.state.currentContenders} dataStatus = {this.state.contenderProcessStatus} onProcess = {this.toggleProcess.bind(this)} challengeClicked = {this.handleChallenge.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderContenders) renderContenders = <Contenders currentContenders = {this.state.currentContenders} dataStatus = {this.state.contenderProcessStatus} onProcess = {this.toggleProcess.bind(this)} challengeClicked = {this.handleChallenge.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderParameterizers) renderParameterizers = <Parameterizers currentParameterizers = {this.state.currentParameterizers} dataStatus = {this.state.parameterizersProcessStatus} instance = {this.state.env}/>
    else if(this.state.renderProfile) renderProfile = <Profile onProcess = {this.toggleProcess.bind(this)} currentContenderChallenges = {this.state.currentContenderChallenges} currentProposalChallenges = {this.state.currentProposalChallenges} currentProposals = {this.state.currentProposals} dataStatusB = {this.state.proposalProcessStatus} currentContenders = {this.state.currentContenders} dataStatusA = {this.state.contenderProcessStatus} dataStatusC = {this.state.contenderChallengesProcessStatus} dataStatusD = {this.state.proposalChallengesProcessStatus} instance = {this.state.env}/>
    else if(this.state.renderProposals) renderProposals = <Proposals currentProposals = {this.state.currentProposals} dataStatus = {this.state.proposalProcessStatus} onProcess = {this.toggleProcess.bind(this)} challengeClicked = {this.handleProposalChallenge.bind(this)} instance = {this.state.env}/>

    return (
      <div className="App" style={{float:"left", textAlign: "left"}}>
        <strong>StackOverflow</strong><br/>
        {process}<br/>
       
        {/* <form onSubmit={this.handleSubmit.bind(this)}>        
          Token Faucet:
          <div>
              <label>Amount</label> <input type="text" ref="amount" />
          </div>
          <br/>
            <button type="submit">Buy Token!</button>
        </form>    

        <button onClick={this.onGetVotingBalance.bind(this)}>Get Balance</button>
        <br/>
        <br/> */}
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
        <div style={{display:"flex",justifyContent:"space-between", width: "700"}}>
          <button onClick={this.renderComponent.bind(this, "registerForm")}>Register Form</button>
          <button onClick={this.renderComponent.bind(this, "proposalForm")}>Proposal Form</button>
          <button onClick={this.renderComponent.bind(this, "champions")}>Champions</button>
          <button onClick={this.renderComponent.bind(this, "contenders")}>Contenders</button>
          <button onClick={this.renderComponent.bind(this, "parameterizers")}>Parameterizers</button>
          <button onClick={this.renderComponent.bind(this, "proposals")}>Proposals</button>
          <button onClick={this.renderComponent.bind(this, "profile")}>Profile</button>
          <button onClick={this.retrieveData.bind(this)}>Refresh</button>
        </div>
        
        {renderRegisterForm}
        {renderProposalForm}
        {renderChallengerForm}
        {renderProposalChallengerForm}
        {renderChampions}
        {renderContenders}
        {renderParameterizers}
        {renderProposals}
        {renderProfile}
        
      </div>
    );
  }
}

export default App;
