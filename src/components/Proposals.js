import React, { Component } from 'react';
import moment from 'moment';
import ProposalItem from './ProposalItem'

class Proposals extends Component {

    constructor(){
        super();

        this.state = {
            currentProposals: [],
            processStatus: false,
            showHash: false
        }
    }

    

    handleChallenge(_proposalID){
        this.props.challengeClicked(_proposalID);
    }

    handleToggleProcess(isTransaction){
        this.props.onProcess(isTransaction);
    }

    onShowHash(){
        this.setState({
            showHash: !this.state.showHash
        })
    }

    render() {
        
        let process = "";
        let hashButton = "";
        if(this.props.dataStatus === true){
        process = <img id="process" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" style={{width: "50px"}}/>
        }
        if(this.props.dataStatus === false){
            hashButton = <div><button onClick={this.onShowHash.bind(this)}>Toggle Hash</button><br/></div>;
        }
        let items;
        if(this.props.currentProposals){
            items = this.props.currentProposals.filter((item) => {return item.paramName === "" ? false: true}).map(item => {
                return (
                    <ProposalItem showHash = {this.state.showHash} toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance} challengeClicked = {this.handleChallenge.bind(this)} key={item.key} item = {item}/>
                )
            });
        }

    return (
        <div className="Proposals">
            <h3>Proposals</h3>
            {hashButton}
            {process}
            {items}
        </div>
    );
  }
}

export default Proposals;
