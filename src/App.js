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
import QuestionForm from './components/Q&A/QuestionForm';
import Questions from './components/Q&A/Questions';
import Question from './components/Q&A/Question';
import 'materialize-css'; 
import 'materialize-css/dist/css/materialize.min.css';
import {Button, Icon, Dropdown, NavItem, CollapsibleItem, Collapsible, Row, Col, Input} from 'react-materialize';

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
      selectedQuestion: 0,

      renderRegisterForm: false,
      renderChallengerForm: false,
      renderProposalForm: false,
      renderProposalChallengerForm: false,
      renderChampions: false,
      renderContenders: false,
      renderParameterizers: false,
      renderProposals: false,
      renderProfile: false,
      renderQuestion: false,
      renderQuestions: false,
      renderQuestionForm: false,

      renderQA: false,

      contenderProcessStatus: false,
      currentContenders: [],
      proposalProcessStatus: false,
      currentProposals: [],
      currentContenderChallenges: [],
      contenderChallengesProcessStatus: false,
      currentProposalChallenges: [],
      proposalChallengesProcessStatus: false,
      currentParameterizers: [],
      parameterizersProcessStatus: false,

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
      renderQuestions: "questions" === value ? true : false,
      renderQuestionForm: "questionForm" === value ? true : false,
      renderQuestion: "question" === value ? true : false,
      renderQA: "QA" === value ? true : false
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

  handleQuestion(questionID){
    this.setState({
      selectedQuestion: questionID
    },() => {
      this.renderComponent("question")
    })
  }

  onQAClicked(){

  }

  render() {

    let process = "";

    if(this.state.renderQA){
      
    }
    if(this.state.processStatus === true){
      process = <div className="progress" style ={{margin: "0"}}>
                  <div className="indeterminate"></div>
                </div>
    }
    
    let renderRegisterForm = "";
    let renderChallengerForm = "";
    let renderProposalForm = "";
    let renderProposalChallengerForm = "";
    let renderChampions = renderChampions = <Champions currentContenders = {this.state.currentContenders} dataStatus = {this.state.contenderProcessStatus} onProcess = {this.toggleProcess.bind(this)} challengeClicked = {this.handleChallenge.bind(this)} instance = {this.state.env}/>
    let renderContenders = "";
    let renderParameterizers = "";
    let renderProposals = "";
    let renderProfile = "";
    let renderQuestionForm ="";
    let renderQuestions = "";
    let renderQuestion = "";

    if(this.state.renderRegisterForm) renderRegisterForm = <RegisterForm onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderQuestionForm) renderQuestionForm = <QuestionForm onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderQuestions) renderQuestions = <Questions handleQuestion = {this.handleQuestion.bind(this)} onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderQuestion) renderQuestion = <Question currentContenders = {this.state.currentContenders} selectedQuestion = {this.state.selectedQuestion} onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderChallengerForm) renderChallengerForm = <ChallengerForm selectedContender = {this.state.selectedContender} onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderProposalForm) renderProposalForm = <ProposalForm onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderProposalChallengerForm) renderProposalChallengerForm = <ProposalChallengerForm selectedProposal = {this.state.selectedProposal} onProcess = {this.toggleProcess.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderContenders) renderContenders = <Contenders currentContenders = {this.state.currentContenders} dataStatus = {this.state.contenderProcessStatus} onProcess = {this.toggleProcess.bind(this)} challengeClicked = {this.handleChallenge.bind(this)} instance = {this.state.env}/>
    else if(this.state.renderParameterizers) renderParameterizers = <Parameterizers currentParameterizers = {this.state.currentParameterizers} dataStatus = {this.state.parameterizersProcessStatus} instance = {this.state.env}/>
    else if(this.state.renderProfile) renderProfile = <Profile onProcess = {this.toggleProcess.bind(this)} currentContenderChallenges = {this.state.currentContenderChallenges} currentProposalChallenges = {this.state.currentProposalChallenges} currentProposals = {this.state.currentProposals} dataStatusB = {this.state.proposalProcessStatus} currentContenders = {this.state.currentContenders} dataStatusA = {this.state.contenderProcessStatus} dataStatusC = {this.state.contenderChallengesProcessStatus} dataStatusD = {this.state.proposalChallengesProcessStatus} instance = {this.state.env}/>
    else if(this.state.renderProposals) renderProposals = <Proposals currentProposals = {this.state.currentProposals} dataStatus = {this.state.proposalProcessStatus} onProcess = {this.toggleProcess.bind(this)} challengeClicked = {this.handleProposalChallenge.bind(this)} instance = {this.state.env}/>

    return (
      <div className="App">

        
        <div className="navbar-fixed">
          <ul id="dropdown1" className="dropdown-content">
            <li><a href="#!">Ask Question</a></li>
            <li className="divider"></li>
            <li><a href="#!">Questions</a></li>
          </ul>
          <nav className="nav-extended white z-depth-1">
            <div className="nav-wrapper">
              <a href="#" className="brand-logo"><img className="logo-image" src="logo.png"/><div style={{display: "table", alignItems: "center", width: "100%"}}>
              </div></a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><a href="#" className="grey-text text-darken-1" onClick={this.renderComponent.bind(this, "profile")}><i className="material-icons right">person</i>Persona</a></li>
              </ul>
            </div>
            {process}
          </nav>
        </div>
        <div className = "main-sidebar-wrapper grey-text text-darken-1 white">
          <Collapsible className ="main-sidebar">
          <CollapsibleItem header='Q&amp;A' icon='question_answer'>
            <div className="collection">
              <a href="#!" className="collection-item grey-text" onClick={this.renderComponent.bind(this, "questionForm")}>Ask Question</a>
              <a href="#!" className="collection-item grey-text" onClick={this.renderComponent.bind(this, "questions")}>Questions</a>
            </div>
          </CollapsibleItem>
          <CollapsibleItem header='Registry' icon='format_list_numbered'>
            <div className="collection">
              <a href="#!" className="collection-item grey-text" onClick={this.renderComponent.bind(this, "registerForm")}>Become A Champion</a>
              <a href="#!" className="collection-item grey-text" onClick={this.renderComponent.bind(this, "contenders")}>Contenders</a>
            </div>
          </CollapsibleItem>
          <CollapsibleItem header='System' icon='settings'>
            <div className="collection">
              <a href="#!" className="collection-item grey-text" onClick={this.renderComponent.bind(this, "proposalForm")}>Propose A Value</a>
              <a href="#!" className="collection-item grey-text" onClick={this.renderComponent.bind(this, "proposals")}>Proposals</a>
              <a href="#!" className="collection-item grey-text" onClick={this.renderComponent.bind(this, "parameterizers")}>Parameterizers</a>
            </div>
          </CollapsibleItem>
          </Collapsible>
        </div>

        <div style={{display: "flex",width: "270px", float: "right",  marginTop: "-0.4%"}}>
        
          <div className="card" style={{position: "fixed", height: "945px",width: "270px"}}>
            <div className="container">
            <br/>
            {renderChampions}
            </div>
          </div>
        </div>
        
        
        <br/>

        <div className="container" style={{paddingLeft: "100px",paddingRight: "200px"}}>
        
        {renderRegisterForm}
        {renderProposalForm}
        {renderChallengerForm}
        {renderProposalChallengerForm}
        {renderContenders}
        {renderParameterizers}
        {renderProposals}
        {renderProfile}
        {renderQuestions}
        {renderQuestionForm}
        {renderQuestion}
        </div>
        <br/>
        <br/>
        <br/>
        {/* <div style={{display:"flex",justifyContent:"space-between", width: "1700px", marginLeft: "350px"}}>
          <input type="text" placeholder="Contender or Proposal ID" onChange={this.onHashChange.bind(this)}/>
          <Button onClick={this.expireApplyStage.bind(this)}>Application</Button>
          <Button onClick={this.expireProposalStage.bind(this)}>Proposal</Button>
          <input type="text" placeholder="Challenge ID" onChange={this.onChallengeIDChange.bind(this)}/>
          <Button onClick={this.expireCommitStage.bind(this)}>Commit</Button>
          <Button onClick={this.expireRevealStage.bind(this)}>Reveal</Button>
        </div> */}
        <div style={{bottom: "0", position: "fixed", width: "100%"}}>
          <div className = "card white" style={{margin: "0"}}>
            <div className = "row" style={{display: "flex", alignItems: "center", margin: "0"}}>
              <div className = "col s2"><input type="text" placeholder="Contender/ Proposal ID" onChange={this.onHashChange.bind(this)}/></div>
              <div style ={{width: "280px", display: "flex",justifyContent:"space-evenly"}}>
                  <Button onClick={this.expireApplyStage.bind(this)} className="grey">Application</Button>
                  <Button onClick={this.expireProposalStage.bind(this)} className="grey">Proposal</Button>
              </div>
              <div className = "col s2"><input type="text" placeholder="Challenge ID" onChange={this.onChallengeIDChange.bind(this)}/></div>
              <div style ={{width: "280px", display: "flex",justifyContent:"space-evenly"}}>
                  <Button onClick={this.expireCommitStage.bind(this)} className="grey">Commit</Button>
                  <Button onClick={this.expireRevealStage.bind(this)} className="grey">Reveal</Button>
              </div>
            </div>
          </div>
        </div>
        
          
        

      </div>
    );
  }
}

export default App;







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