import React, { Component } from 'react';
import ContenderItem from './ContenderItem'
import {Card} from 'react-materialize'

class Contenders extends Component {

    constructor(){
        super();

        this.state = {
            commitCard: false,
            revealCard: false,
            commitChallengeID: 0,
            revealChallengeID: 0,
            salt: 0,
            tokenValue: 0,
        }
    }

    handleChallenge(contender){
        this.props.challengeClicked(contender);
    }

    handleToggleProcess(isTransaction){
        this.props.onProcess(isTransaction);
    }

    cancelCommit(){
        this.setState({
            commitCard: false,
            revealCard: false,
            salt: 0,
            tokenValue: 0
        })
    }

    onVoteUpClicked(){
        this.props.instance.PLCRCommitVote(this.state.commitChallengeID, 1, this.state.salt, this.state.tokenValue)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
        });
    }

    onVoteDownClicked(){
        this.props.instance.PLCRCommitVote(this.state.commitChallengeID, 0, this.state.salt, this.state.tokenValue)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
        });
    }

    onRevealVoteUpClicked(){
        this.props.instance.PLCRRevealVote(this.state.revealChallengeID, 1, this.state.salt)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
        });
    }

    onRevealVoteDownClicked(){
        this.props.instance.PLCRRevealVote(this.state.revealChallengeID, 0, this.state.salt)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
        });
    }

    onCommitChallenge(id){
        this.setState({
            commitCard: true,
            commitChallengeID: id
        })
    }

    onRevealChallenge(id){
        this.setState({
            revealCard: true,
            revealChallengeID: id
        })
    }

    onSaltChange(evt){
        this.setState({
            salt: evt.target.value
        })
    }

    onTokenAmountChange(evt){
        this.setState({
            tokenValue: evt.target.value
        })
    }

    render() {

        let commitCard = "";
        let revealCard = "";

        if(this.state.commitCard){
            commitCard = <div className="vote-card">
                <Card className = "z-depth-2" actions={[
                <a href='#' className="teal-text text-lighten-1" onClick={this.onVoteUpClicked.bind(this)}><b>Vote Up</b></a>,
                <a href='#' className="teal-text text-lighten-1" onClick={this.onVoteDownClicked.bind(this)}><b>Vote Down</b></a>,
                <a href='#' className="teal-text text-lighten-1" onClick={this.cancelCommit.bind(this)}><b>Close</b></a>]}>
                    <h4 style={{color: "#666666"}}>Commit Vote</h4>
                    <div className="divider"></div>
                    <br/>
                    <div>
                        <label>Set Vote Key:</label><br/>
                        <input type="number" placeholder="Input a number. (Remember this for vote reveal.)" onChange={this.onSaltChange.bind(this)}/>
                    </div>
                    <div>
                        <label>Vote Stake:</label><br/>
                        <input type="number" placeholder="Input number of tokens" onChange={this.onTokenAmountChange.bind(this)}/>
                    </div>
                </Card></div>
        }

        if(this.state.revealCard){
            revealCard = <div className="vote-card">
                <Card className="z-depth-2" actions={[
                <a href='#' className="teal-text text-lighten-1" onClick={this.onRevealVoteUpClicked.bind(this)}><b>Vote Up</b></a>,
                <a href='#' className="teal-text text-lighten-1" onClick={this.onRevealVoteDownClicked.bind(this)}><b>Vote Down</b></a>,
                <a href='#' className="teal-text text-lighten-1" onClick={this.cancelCommit.bind(this)}><b>Close</b></a>]}>
                    <h4 style={{color: "#666666"}}>Reveal Vote</h4>
                    <div className="divider"></div>
                    <br/>
                    <div>
                        <label>Committed Vote Key:</label><br/>
                        <input type="number" placeholder="Input your vote key" onChange={this.onSaltChange.bind(this)}/>
                    </div>
                </Card></div>
        }

        let process = "";
        if(this.props.dataStatus === true){
            process = <div className="preloader-wrapper small active">
            <div className="spinner-layer">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        }
        
        
        let items;
        if(this.props.currentContenders){
            items = this.props.currentContenders.filter((item) => {return item.contender === "" ? false: true}).map(item => {
                return (
                    <ContenderItem selectedChallengeToCommit = {this.onCommitChallenge.bind(this)} selectedChallengeToReveal = {this.onRevealChallenge.bind(this)} showHash = {this.state.showHash} toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance} challengeClicked = {this.handleChallenge.bind(this)} key={item.key} item = {item}/>
                )
            });
        }

    return (
        <div className="Contenders z-depth-1" style={{width: "108%", borderTopLeftRadius: "25px", borderBottomRightRadius: "25px"}}>
            <div className="card grey-text text-lighten-5 z-depth-0" style={{backgroundColor: "#7f2099", margin: 0,paddingTop: "1px", paddingBottom: "1px", paddingLeft: "30px", borderTopLeftRadius: "25px"}}><h4>Applicant List</h4></div>
            {commitCard}
            {revealCard}
            <br/>
            <table style={{width: "1000px", marginLeft: "30px"}}>
            <thead style={{color: "#666666"}}>
            <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Apply Stage</th>
                <th>Commit Stage</th>
                <th>Reveal Stage</th>
                <th className="right">Operations</th>
            </tr>
            </thead>
            <tbody>
                {items}
            </tbody>
            </table>
            
            <br/>
            <div style={{marginLeft: "30px"}}>{process}</div>
            <br/>
            
        </div>
    );
  }
} 

export default Contenders;
