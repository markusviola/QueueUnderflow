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
        this.evaluateDeposit()
        console.log("HELLO WORLD");
    }

    async evaluateDeposit(){
        let deposit = await this.props.instance.registryGetContenderStake(this.props.item.contenderHash);
        let minDeposit = await this.props.instance.paramGet("minDeposit");
      
        this.setState({isSafe: deposit === parseInt(minDeposit) ? true: false,
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
        else challengeState = <div>Currently challenged<br/></div>

        if(this.state.isSafe){
            stakeStatus = <div>(Your stake is sufficient.)<br/></div>
        }
        else stakeStatus = <div>(Your champion is not safe. Current minimum deposit: {this.state.currentMinDeposit})<br/></div>
        
        
                
    return (
        <div className="AsChampionItem">
            <strong>{this.props.item.contender}</strong><br/>
            {challengeState}
            Reserved Stake: {this.state.reservedStake} tokens
            <div style={{display: "flex", justifyContent: "flex-start", width: "200px"}}>
                <input type="number" placeholder="No. of Tokens" onChange={this.onDepositValueChanged.bind(this)}/>
                <button onClick={this.onDepositClicked.bind(this)}>Deposit</button>
            </div>
            {stakeStatus}
        </div>
    );
  }
}

export default AsChampionItem;
