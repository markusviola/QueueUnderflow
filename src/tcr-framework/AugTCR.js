import Web3 from 'web3'
import Web3Utils from 'web3-utils'
import contracts from './ContractInstances';

class AugTCR {

    constructor() {
        
        this.paramNames = [
            "minDeposit", 
            "pMinDeposit", 
            "applyStageLen", 
            "pApplyStageLen", 
            "commitStageLen", 
            "pCommitStageLen",
            "revealStageLen",
            "pRevealStageLen",
            "dispensationPct",
            "pDispensationPct",
            "voteQuorum",
            "pVoteQuorum"
        ]

        this.parameNamesFull = [
            "Minimum Deposit",
            "System Minimum Deposit", 
            "Apply Stage Length", 
            "System Apply Stage Length", 
            "Commit Stage Length", 
            "System Commit Stage Length",
            "Reveal Stage Length",
            "System Reveal Stage Length",
            "Dispensation Percentage",
            "System Dispensation Percentage",
            "Vote Quorum",
            "System Vote Quorum"
        ]

        //Initializes the Web3 connection instance.
        if(typeof window.web3 != 'undefined'){
            console.log("Using web3 detected from external source like Metamask");
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            window.web3 = new Web3(new 
            Web3.providers.HttpProvider("http://localhost:8545"));
        }

        
        console.log("Current Account: "+window.web3.eth.accounts[0]);
        //Sets the account, for it to be recognized by Metamask 
        window.web3.eth.defaultAccount = window.web3.eth.accounts[0];

        //Sets the contract connection for the instance.
        const OrchContract = window.web3.eth.contract(contracts.orchestratorABI);
        this.contractInstance = OrchContract.at(contracts.orchestratorAddress);
        
    }

    getCurrentAccount(){
        return window.web3.eth.accounts[0];
    }

    getFullParamName(_paramName){
        let shortParams = this.paramNames;
        for(let i=0; i<shortParams.length; i++){
            if(shortParams[i] === _paramName){
                _paramName = this.parameNamesFull[i];
            }
        }
        
        return _paramName;
    }

    //Events
    PLCROperationEvent(){
        return new Promise((resolve, reject)=>{
            this.plcrInstance.OperationSuccess().watch((error, result)=>{
                if(!error) {
                    resolve([true,"Transaction successful!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }

    PLCRVoteCommited(){
        return new Promise((resolve, reject)=>{
            this.plcrInstance._VoteCommitted().watch((error, result)=>{
                if(!error) {
                    resolve([true,"Commited vote!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }

    PLCRVoteRevealed(){
        return new Promise((resolve, reject)=>{
            this.plcrInstance._VoteRevealed().watch((error, result)=>{
                if(!error) {
                    resolve([true,"Revealed vote!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }

    PLCRVotingRightsGranted(){
        return new Promise((resolve, reject)=>{
            this.plcrInstance._VotingRightsGranted().watch((error, result)=>{
                if(!error) {
                    resolve([true,"Voting rights granted!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }

    PLCRVotingRightsWithdrawn(){
        return new Promise((resolve, reject)=>{
            this.plcrInstance._VotingRightsWithdrawn().watch((error, result)=>{
                if(!error) {
                    resolve([true,"Voting rights withdrawn!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }

    PLCRTokensRescued(){
        return new Promise((resolve, reject)=>{
            this.plcrInstance._TokensRescued().watch((error, result)=>{
                if(!error) {
                    resolve([true,"Tokens has been rescued!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }

    paramOperationEvent(){
        return new Promise((resolve, reject)=>{
            this.parameterizerInstance.OperationSuccess().watch((error, result)=>{
                if(!error) {
                    resolve([true,"Transaction successful!"]);
                }
                else reject([false, "Transaction failed!"]);
            })
        }); 
    }

    paramNewProposal(){
        return new Promise((resolve, reject)=>{
            this.parameterizerInstance.NewProposal().watch((error, result)=>{
                if(!error) {
                    resolve([true,"New proposal has been raised!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }
    
    paramNewProposalChallenge(){
        return new Promise((resolve, reject)=>{
            this.parameterizerInstance.NewProposalChallenge().watch((error, result)=>{
                if(!error) {
                    resolve([true,"A proposal has been disputed!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }

    paramPChallengerWon(){
        return new Promise((resolve, reject)=>{
            this.parameterizerInstance.PChallengerWon().watch((error, result)=>{
                if(!error) {
                    resolve([true,"A challenger won. The proposal failed!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }

    paramPChallengerLost(){
        return new Promise((resolve, reject)=>{
            this.parameterizerInstance.PChallengerLost().watch((error, result)=>{
                if(!error) {
                    resolve([true,"A challenger lost. The proposal passed!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }

    paramIncentiveClaimed(){
        return new Promise((resolve, reject) => {
            this.parameterizerInstance.IncentiveClaimed().watch((error, result)=>{
                if(!error) {
                    resolve([true, "A contender reward was claimed!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        })
    }

    registryChallengerWon(){
        return new Promise((resolve, reject)=>{
            this.registryInstance.ChallengerWon().watch((error, result)=>{
                if(!error) {
                    resolve([true,"A challenger won. The contender is removed."]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }

    registryChallengerLost(){
        return new Promise((resolve, reject)=>{
            this.registryInstance.ChallengerLost().watch((error, result)=>{
                if(!error) {
                    resolve([true,"A challenger lost. The contender remains!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        }); 
    }
   

    registryOperationEvent(){
        return new Promise((resolve, reject)=>{
            this.registryInstance.OperationSuccess().watch((error, result)=>{
                if(!error) {
                    resolve([true, "Transaction successful!"]);
                }
                else reject([false, "Transaction failed!"]);
            })
        }); 
    }

    registryWithdrawalEvent(){
        return new Promise((resolve, reject)=>{
            this.registryInstance.Withdrawal().watch((error, result)=>{
                if(!error) {
                    resolve([true, "A contender has withdrawn tokens!"]);
                }
                else reject([false, "Transaction failed!"]);
            })
        }); 
    }

    registryDepositEvent(){
        return new Promise((resolve, reject)=>{
            this.registryInstance.Deposit().watch((error, result)=>{
                if(!error) {
                    resolve([true, "A contender has deposited tokens!"]);
                }
                else reject([false, "Transaction failed!"]);
            })
        }); 
    }

    registryTouchedAndRemoved(){
        return new Promise((resolve, reject)=>{
            this.registryInstance.TouchedAndRemoved().watch((error, result)=>{
                if(!error) {
                    resolve([true, "A champion has been touched and removed!"]);
                }
                else resolve(false, "Transaction failed!");
            })
        }); 
    }
    
    registryNewContender(){
        return new Promise((resolve, reject) => {
            this.registryInstance.NewContender().watch((error, result)=>{
                if(!error) {
                    resolve([true, "A new contender has been added!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        })
    }

    registryNewChallenge(){
        return new Promise((resolve, reject) => {
            this.registryInstance.NewChallenge().watch((error, result)=>{
                if(!error) {
                    resolve([true, "A contender has been challenged!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        })
    }

    registryIncentiveClaimed(){
        return new Promise((resolve, reject) => {
            this.registryInstance.IncentiveClaimed().watch((error, result)=>{
                if(!error) {
                    resolve([true, "A contender reward was claimed!"]);
                }
                else reject([false, "Transaction failed."]);
            })
        })
    }

    


    //Environment Builder
    initEnvironmentWithToken(_token, _registryName, _parameters){
        this.contractInstance.buildEnv(_token, _registryName, _parameters,
            {gas: 3000000, from: this.getCurrentAccount()},(err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    initEnvironmentAndToken(_supply, _tokenName, _decimals, _symbol, _parameters, _registryName){
        this.contractInstance.buildEnvAndToken(window.web3.toWei(_supply, 'ether'), _tokenName, _decimals, _symbol, _parameters, _registryName,
            {gas: 3000000, from: this.getCurrentAccount()},(err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    //There should be a looper to navigate instances.
    retrieveEnvironmentInstance(_id, _creator){

        return new Promise((resolve, reject) => {
            this.contractInstance.getEnvInstances(_id, _creator,
                {from: this.getCurrentAccount()},
                (err, result) => {
                    console.log("PLCR: "+result[0])
                    console.log("Parameterizer: "+result[1])
                    console.log("Registry: "+result[2])
                    resolve(result);
                }
            );
        });
    }

    //Instance Setter
    setEnvironmentInstance(plcrAddress, paramAddress, regAddress){
        
        return new Promise((resolve, reject) => {
            const PLCRContract = window.web3.eth.contract(contracts.plcrABI);
            this.plcrInstance = PLCRContract.at(plcrAddress);

            const ParameterizerContract = window.web3.eth.contract(contracts.parameterizerABI);
            this.parameterizerInstance = ParameterizerContract.at(paramAddress);

            const RegistryContract = window.web3.eth.contract(contracts.registryABI);
            this.registryInstance = RegistryContract.at(regAddress);

            resolve();
        });

    }

    //PLCR Functions

    PLCRTokenFaucet(_value){
        return new Promise((resolve, reject)=>{
            this.plcrInstance.tokenFaucet(_value,
                {gas: 3000000, from: this.getCurrentAccount(), value: 3000000},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        }); 
    }

    PLCRGetVotingBalance(){
        return new Promise((resolve, reject) => {
            this.plcrInstance.getVotingBalance({from: this.getCurrentAccount()},(err, result) => {
                resolve(result.c[0]);
            }    
        );
        });
    }

    PLCRGetTokenAddress(){
        return new Promise((resolve, reject) => {
            this.plcrInstance.token.call((err, result) => {
                resolve(result);
            });
        });
        
    }

    PLCRGetPoll(_pollID){
        this.plcrInstance.getPoll(_pollID,
            (err, result) => {
                console.log(result);
            }    
        );
    }

    PLCRRequestVotingRights(_numTokens){
        return new Promise((resolve, reject) => {
            this.plcrInstance.requestVotingRights(_numTokens,
                {gas: 300000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        })
    }

    PLCRWithdrawVotingRights(_numTokens) {
        return new Promise((resolve, reject) => {
            this.plcrInstance.withdrawVotingRights(_numTokens,
                {gas: 300000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        })
    }

    
    
    PLCRCommitVote(_pollID, _voteOption, _salt, _numTokens){
        return new Promise((resolve, reject) => {
            this.plcrInstance.commitVote(_pollID, Web3Utils.soliditySha3(parseInt(_voteOption) ,parseInt(_salt)), parseInt(_numTokens), 0,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        })
        
    }

    PLCRRevealVote(_pollID, _voteOption, _salt){
        return new Promise((resolve, reject) => {
            this.plcrInstance.revealVote(_pollID, _voteOption, _salt,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        })
    }

    PLCRDidCommit(_challengeID){
        return new Promise((resolve, reject) => {
            this.plcrInstance.didCommit(this.getCurrentAccount(),_challengeID,
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject("Error")
                    }
                    else resolve(result)
                }
            );
        });
    }

    PLCRDidReveal(_challengeID){
        return new Promise((resolve, reject) => {
            this.plcrInstance.didReveal(this.getCurrentAccount(),_challengeID,
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject("Error")
                    }
                    else resolve(result)
                }
            );
        });
    }
    
    PLCRRescueTokens(_challengeID){
        return new Promise((resolve, reject) => {
            this.plcrInstance.rescueTokens(_challengeID,
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    PLCRGetLastNode(){
        return new Promise((resolve, reject) => {
            this.plcrInstance.getLastNode(this.getCurrentAccount(),
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject("Error")
                    }
                    else resolve(result.c[0])
                }
            );
        });
    }
    

    PLCRAAAExpireCommitDuration(_pollID){
        return new Promise((resolve, reject) => {
            this.plcrInstance.AAAexpireCommitDuration(_pollID,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    PLCRAAAExpireRevealDuration(_pollID){
        return new Promise((resolve, reject) => {
            this.plcrInstance.AAAexpireRevealDuration(_pollID,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );        
        })
    }

    //Registry Functions
    registryRegister(_desc, _amount, _extra){
        return new Promise((resolve, reject) => {
            this.registryInstance.register(window.web3.sha3((this.getCurrentAccount()+_desc+_extra)), parseInt(_amount), _desc, _extra,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    registryDeposit(_contenderHash, _amount){
        return new Promise((resolve, reject) => {
            this.registryInstance.deposit(_contenderHash, _amount,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    registryWithdraw(_contenderHash, _amount){
        return new Promise((resolve, reject) => {
            this.registryInstance.withdraw(_contenderHash, _amount,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    registryChallenge(_contenderHash, _evidence){
        
        return new Promise((resolve, reject) => {
            this.registryInstance.challenge(_contenderHash, _evidence,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    //Array of Bytes32
    registryBatchUpdateStatuses(_contenderHashes){
        return new Promise((resolve, reject) => {
            this.registryInstance.batchUpdateStatuses(_contenderHashes,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    //Array of Integer
    registryBatchClaimIncentives(_challengeIDs){
        return new Promise((resolve, reject) => {
            this.registryInstance.batchClaimIncentives(_challengeIDs,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    registryViewVoterIncentive(_challengeID){
        return new Promise((resolve, reject) => {
            this.registryInstance.viewVoterIncentive(this.getCurrentAccount(), _challengeID,
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject("Error")
                    }
                    else resolve(result.c[0])
                }
            );
        });
    }

    registryIncentiveClaimStatus(_challengeID){
        return new Promise((resolve, reject) => {
            this.registryInstance.incentiveClaimStatus(_challengeID, this.getCurrentAccount(),
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject("Error")
                    }
                    else resolve(result)
                }
            );
        });
    }

    registryAAAExpireApplication(_contenderHash){
        return new Promise((resolve, reject) => {
            this.registryInstance.AAAexpireApplication(_contenderHash,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        })
    }

    registryGetContenderStake(_contenderHash){
        return new Promise((resolve, reject) => {
            this.registryInstance.contenders(_contenderHash,
                {gas: 3000000, from: this.getCurrentAccount()},
                    (err, result) => {
                        if(typeof result === 'undefined'){
                            reject("Error");
                        }
                        resolve(result[4].c[0]);
                    }
                )
            }
        )
        
    }
    
    registryGetContenderNonce() {
        return new Promise((resolve, reject) => {
            this.registryInstance.getContenderNonce(
                (err, result) => {
                    console.log(result);
                    resolve(result);
                }
            );   
        });
    }

    registryGetContender(_contenderHash) {
        return new Promise((resolve, reject) => {
            this.registryInstance.getContender(_contenderHash,
                (err, result) => {
                    return {
                        desc: result[0],
                        challengeID: result[1].c[0],
                        appExpiry: result[2],
                        isChampion: result[3],
                        issuer: result[4]    
                    };
                }
            );  
        });
    }

    async registryGetAllContenders(){
        
        let contenders = [];
        let A = await new Promise((resolve, reject) =>{
            this.registryInstance.getContenderNonce((err, nonce) => { 
                resolve(nonce) 
            });
        })

        if(A.length === 0) return contenders;
        else{
            for(let i = 0; i<A.length; i++){
                let B = await new Promise((resolve, reject) => {
                    this.registryInstance.getContender(A[i],
                        (err, result) => {
                            contenders.push({
                                contenderHash: A[i],
                                desc: result[0],
                                challengeID: result[1].c[0],
                                appExpiry: result[2].c[0],
                                isChampion: result[3],
                                issuer: result[4]
                            });
                            resolve();
                        }
                    );
                });
            }
            
            return contenders;
        }
    }

    registryGetChallengeNonce() {
        this.registryInstance.getChallengeNonce(
            (err, result) => {
                return result;
            }
        );   
    }
    
    async registryGetChallenge(_challengeID) {
        let result = await new Promise((resolve, reject) => {
            let challenge = {}
            this.registryInstance.getChallenge(_challengeID,
                async (err, result) => {
                    challenge.challengeID = _challengeID;
                    challenge.isConcluded = result[0];
                    challenge.incentivePool = result[1].c[0];
                    challenge.challenger = result[2];
                    await this.plcrInstance.getPoll(_challengeID,
                        (err, result) => {
                            challenge.commitEndDate = result[0].c[0];
                            challenge.revealEndDate = result[1].c[0];
                            resolve(challenge);
                        }    
                    );
                }
            );  
        });
        return result;
    }

    async registryGetAllChallenges(){

        let challenges = [];
        let A = await new Promise((resolve, reject) => {
            this.registryInstance.getChallengeNonce((err, nonce) => { resolve(nonce) });
        })

        if(A.length === 0) return challenges;
        else{
            for(let i = 0; i<A.length; i++){
                let challenge = {}
                await new Promise((resolve, reject) => {
                    this.registryInstance.getChallenge(A[i],
                        async (err, result) => {
                            
                            challenge.challengeID = A[i].c[0];
                            challenge.isConcluded = result[0];
                            challenge.incentivePool = result[1].c[0];
                            challenge.challenger = result[2];
                            await new Promise((resolve, reject) => {
                                this.plcrInstance.getPoll(A[i],
                                    (err, result) => {
                                        challenge.commitEndDate = result[0].c[0];
                                        challenge.revealEndDate = result[1].c[0];
                                        challenges.push(challenge)
                                        resolve()
                                    }
                                )
                            })
                            resolve();
                        }
                    )
                });
            }
            return challenges;
        }
    }

    //Parameterizer Functions

    paramProposeAdjustment(_paramName, _paramVal){
        return new Promise((resolve, reject) => {
            this.parameterizerInstance.proposeAdjustment(_paramName, _paramVal,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }
    
    paramChallengeProposal(_proposalID){
        return new Promise((resolve, reject) => {
            this.parameterizerInstance.challengeProposal(_proposalID,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined') {
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    paramProcessProposalResult(_proposalID){
        return new Promise((resolve, reject) => {
            this.parameterizerInstance.processProposalResult(_proposalID,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined') {
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    paramBatchClaimIncentives(_challengeIDs){
        return new Promise((resolve, reject) => {
            this.parameterizerInstance.batchClaimIncentives(_challengeIDs,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined') {
                        reject(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    paramViewVoterIncentive( _challengeID){
        return new Promise((resolve, reject) => {
            this.parameterizerInstance.viewVoterIncentive(this.getCurrentAccount(), _challengeID,
                (err, result) => {
                    if(typeof result === 'undefined') {
                        reject("Error")
                    }
                    else resolve(result.c[0])
                }
            ); 
        });
    }

    paramIncentiveClaimStatus(_challengeID){
        return new Promise((resolve, reject) => {
            this.parameterizerInstance.incentiveClaimStatus(_challengeID, this.getCurrentAccount(),
                (err, result) => {
                    if(typeof result === 'undefined') {
                        reject("Error")
                    }
                    else resolve(result)
                }
            ); 
        });
    }

    paramGet(_name){
        return new Promise((resolve, reject) => {
            this.parameterizerInstance.get(_name,
                (err, result) => {
                    resolve(String(result.c[0]));
                }
            ); 
        });
    }

    async paramGetAllParameterizers(){
        let parameterizers = []
        for(let i = 0; i<this.paramNames.length; i++){
            await new Promise((resolve, reject) => {
                this.parameterizerInstance.get(this.paramNames[i],
                    (err, result) => {
                        parameterizers.push({
                            paramName: this.paramNames[i],
                            paramVal: result.c[0]
                        });
                        resolve()
                    }
                );
            }) 
        }    
        return parameterizers;
    }

    paramGetProposalNonce() {
        this.parameterizerInstance.getProposalNonce(
            (err, result) => {
                return result;
            }
        );   
    }

    paramGetProposal(_proposalID) {
        this.parameterizerInstance.getProposal(_proposalID,
            (err, result) => {
                return {
                    proposalID: _proposalID,
                    paramName: result[0],
                    paramVal: result[1].c[0],
                    challengeID: result[2].c[0],
                    proposalExpiry: result[3].c[0],
                };
            }
        );  
    }

    async paramGetAllProposals(){
        
        let proposals = [];
        let A = await new Promise((resolve, reject) =>{
            this.parameterizerInstance.getProposalNonce((err, nonce) => { resolve(nonce) });
        })

        if(A.length === 0) return proposals;
        else{
            for(let i = 0; i<A.length; i++){
                let B = await new Promise((resolve, reject) => {
                    this.parameterizerInstance.getProposal(A[i],
                        (err, result) => {
                            proposals.push({
                                proposalID: A[i],
                                paramName: result[0],
                                paramVal: result[1].c[0],
                                challengeID: result[2].c[0],
                                proposalExpiry: result[3].c[0],
                            });
                            resolve();
                        }
                    );
                });
            }
            return proposals;
        }
    }

    paramGetChallengeNonce() {
        this.parameterizerInstance.getChallengeNonce(
            (err, result) => {
                console.log(result);
                return result;
            }
        );   
    }

    

    async paramGetChallenge(_challengeID) {
        let result = await new Promise((resolve, reject) => {
            let challenge = {}
            this.parameterizerInstance.getChallenge(_challengeID,
                async (err, result) => {
                    challenge.challengeID = _challengeID;
                    challenge.isConcluded = result[0];
                    challenge.incentivePool = result[1].c[0];
                    challenge.challenger = result[2];
                    await this.plcrInstance.getPoll(_challengeID,
                        (err, result) => {
                            challenge.commitEndDate = result[0].c[0];
                            challenge.revealEndDate = result[1].c[0];
                            resolve(challenge);
                        }    
                    );
                }
            );  
        });

        return result;
    }

    async paramGetAllChallenges(){

        let challenges = [];
        let A = await new Promise((resolve, reject) => {
            this.parameterizerInstance.getChallengeNonce((err, nonce) => { resolve(nonce) });
        })

        if(A.length === 0) return challenges;
        else{
            for(let i = 0; i<A.length; i++){
                let challenge = {}
                await new Promise((resolve, reject) => {
                    this.parameterizerInstance.getChallenge(A[i],
                        async (err, result) => {
                            challenge.challengeID = A[i].c[0];
                            challenge.isConcluded = result[0];
                            challenge.incentivePool = result[1].c[0];
                            challenge.challenger = result[2];
                            await new Promise((resolve, reject) => {
                                this.plcrInstance.getPoll(A[i],
                                    (err, result) => {
                                        challenge.commitEndDate = result[0].c[0];
                                        challenge.revealEndDate = result[1].c[0];
                                        challenges.push(challenge)
                                        resolve()
                                    }
                                )
                            })
                            resolve();
                        }
                    )
                });
            }
            return challenges;
        }
    }

    paramAAAExpireProposal(_proposalID){
        return new Promise((resolve, reject) => {
            this.parameterizerInstance.AAAexpireProposal(_proposalID,
                {gas: 3000000, from: this.getCurrentAccount()},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        reject(false)
                    }
                    else resolve(true)
                }
            );        
        })
    }

}

export default AugTCR;