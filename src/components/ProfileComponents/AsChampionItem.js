import React, { Component } from 'react';


class AsChampionItem extends Component {

    constructor(){
        super();

        this.state = {
            isSafe: false,
            reservedStake: 0,
            deposit: 0,
            currentMinDeposit: 0
        }
    }

    componentDidMount(){
        this.evaluateDeposit();
    }

    async evaluateDeposit(){
        let deposit = await this.props.instance.registryGetContenderStake(this.props.item.contenderHash);
        let minDeposit = await this.props.instance.paramGet("minDeposit");
      
        this.setState({isSafe: deposit >= parseInt(minDeposit) ? true: false,
                    reservedStake: deposit,
                    currentMinDeposit: minDeposit}, () => {})
    }

    onDepositValueChanged(evt){
        this.setState({deposit: evt.target.value})
    }

    onDepositClicked(){
        this.props.instance.registryDeposit(this.props.item.contenderHash, this.state.deposit)
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    render() {

        let challengeState = "";
        let stakeStatus = "";
        
        if(this.props.item.isConcluded){
            challengeState = ""
        }
        else challengeState = <div style={{color: "#e06666"}}><b>Currently challenged</b><br/></div>

        if(this.state.isSafe){
            stakeStatus = <div>(Your stake is sufficient.)<br/></div>
        }
        else stakeStatus = <div>(Your champion is not safe. Current minimum deposit: {this.state.currentMinDeposit})<br/></div>
        
        
                
    return (
        <div className="AsChampionItem">
            <h5 style={{color: "#4f4f4f"}}><b>{this.props.item.contender}</b></h5>
            {challengeState}
            Reserved Stake: {this.state.reservedStake} tokens
          
            <div style={{display: "flex", alignItems: "center"}}>
                <input type="number" style={{width: "170px", marginRight: "7px"}} placeholder="No. of Tokens" onChange={this.onDepositValueChanged.bind(this)}/>
                <a className="waves-effect waves-light teal-text text-lighten-1" onClick={this.onDepositClicked.bind(this)}>
                <i className="material-icons right">add_box</i><b>DEPOSIT</b></a>
            </div>
            
                
            {stakeStatus}
        </div>
    );
  }
}

export default AsChampionItem;
