import React, { Component } from 'react';


class ChampionItem extends Component {

    onChallengeClicked(){
        this.props.challengeClicked(this.props.item.contenderHash);
    }

    render() {

        let challengeButton = "";
        if(this.props.item.isConcluded){
            challengeButton = <div><button onClick={this.onChallengeClicked.bind(this)}>Rechallenge!</button><br/></div>;
        }
        else challengeButton = "Champion is currently challenged."
        
                
    return (
        <div className="ChampionItem">
            <strong>{this.props.item.contender}</strong><br/>
            {challengeButton}<br/><br/>
        </div>
    );
  }
}

export default ChampionItem;
