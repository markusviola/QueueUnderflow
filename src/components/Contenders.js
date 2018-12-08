import React, { Component } from 'react';
import ContenderItem from './ContenderItem'

class Contenders extends Component {

    constructor(){
        super();

        this.state = {
            showHash: false
        }
    }

    handleChallenge(contender){
        this.props.challengeClicked(contender);
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
        if(this.props.currentContenders){
            items = this.props.currentContenders.filter((item) => {return item.contender === "" ? false: true}).map(item => {

                return (
                    <ContenderItem showHash = {this.state.showHash} toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance} challengeClicked = {this.handleChallenge.bind(this)} key={item.key} item = {item}/>
                )
            });
        }

    return (
        <div className="Contenders">
            <h3>Contenders</h3>
            {hashButton}
            {process}
            {items}
        </div>
    );
  }
} 

export default Contenders;
