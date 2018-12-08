import React, { Component } from 'react';
import ChampionItem from './ChampionItem';


class Champions extends Component {
    
    handleChallenge(contender){
        this.props.challengeClicked(contender);
    }

    render() {

        let process = "";
        if(this.props.dataStatus === true){
            process = <img id="process" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" style={{width: "50px"}}/>
        }

        let items;
        if(this.props.currentContenders){
            items = this.props.currentContenders.filter((item) => {return item.contender === "" ? false: true}).map(item => {
                if(item.isChampion){
                    return (
                        <ChampionItem instance = {this.props.instance} challengeClicked = {this.handleChallenge.bind(this)} key={item.key} item = {item}/>
                    )
                }
            });
        }
            
    return (
        <div className="Champions">
            <h3>Champions</h3>
            {items}
            {process}
        </div>
    );
  }
}

export default Champions;
