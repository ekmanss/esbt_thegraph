import {Address, BigInt, log} from "@graphprotocol/graph-ts"
import {
    ESBT,
    ScoreUpdate,
    ScoreDecrease
} from "../generated/ESBT/ESBT"
import {ExampleEntity,Account,PointHistory, CommonDataStore} from "../generated/schema"

export function handleScoreUpdate(event: ScoreUpdate): void {
    const timestamp = event.block.timestamp.toString()

    if (event.params._reasonCode.equals(BigInt.fromI32(0))) {
        let totalMintedCounter = CommonDataStore.load("totalMintedCounter")
        if(totalMintedCounter === null){
            totalMintedCounter = new CommonDataStore("totalMintedCounter")
            totalMintedCounter.value = "1"

            totalMintedCounter.save()
        }else {
            totalMintedCounter.value = BigInt.fromString(totalMintedCounter.value).plus(BigInt.fromI32(1)).toString()

            totalMintedCounter.save()
        }




        log.info("#####################ScoreUpdate: _reasonCode = 0", []);
        log.info(
            "#####################refCodeOwner: {} , newMember: {} , initPoint: {}",
            [
                event.params._account.toHex(),
                event.params._fromAccount.toHex(),
                event.params._addition.toString(),
            ]
        )
        const refCodeOwnerAddress = event.params._account.toHex()
        const newMemberAddress =  event.params._fromAccount.toHex()


        let account = Account.load(refCodeOwnerAddress)
        if (account === null) {
            // log.info("##########create refCodeOwner :{}", [event.params._account.toHex()]);
            account = new Account(refCodeOwnerAddress)
            account.parent = refCodeOwnerAddress
            account.address = refCodeOwnerAddress
            account.createdTimestamp = timestamp
            account.sons = []
            account.pointHistory = []
            account.invitedTimestamp = "0"
            account.totalPoints = "0"
            account.invitedScore = "0"

            account.save()
        }

        let newMember = Account.load(newMemberAddress)
        if(newMember === null){
            // log.info("##########create newMember :{}", [event.params._account.toHex()]);
            newMember = new Account(newMemberAddress)
            newMember.parent = refCodeOwnerAddress
            newMember.address = event.params._fromAccount.toHex()
            newMember.createdTimestamp = timestamp
            newMember.sons = []
            newMember.pointHistory = []
            newMember.invitedTimestamp = timestamp
            account.totalPoints = "0"
            account.invitedScore = "0"

            newMember.save()
        }
        newMember.parent = refCodeOwnerAddress
        newMember.invitedTimestamp = timestamp


        let accountSonsList = account.sons
        accountSonsList.push(newMemberAddress)
        account.sons = accountSonsList

        let pointHistory = new PointHistory(refCodeOwnerAddress.concat("-").concat(timestamp.toString()).concat("-").concat(newMemberAddress))
        pointHistory.increase = true
        pointHistory.timestamp = timestamp
        pointHistory.point = "10000000000000000000"
        pointHistory.account = newMemberAddress
        pointHistory.typeCode = "0"

        let accountPointHistoryList = account.pointHistory
        accountPointHistoryList.push(pointHistory.id)
        account.pointHistory = accountPointHistoryList
        let newTotalPoints = (BigInt.fromString("10000000000000000000").plus(BigInt.fromString(account.totalPoints))).toString()
        account.totalPoints = newTotalPoints

        account.save()
        newMember.save()
        pointHistory.save()
    }else {
        //add score
        let reasonCode = event.params._reasonCode.toString()
        let addScoreToAddress = event.params._account.toHex()
        let fromAddress = event.params._fromAccount.toHex()
        let score = event.params._addition.toString()
        // log.info("#####################add score: reasonCode = {}, addScoreTo = {} ,  score = {}", [reasonCode,addScoreToAddress,score]);


        let pointHistory = new PointHistory(addScoreToAddress.concat("-").concat(event.block.timestamp.toString()).concat("-").concat(score).concat("-").concat(reasonCode))
        pointHistory.increase = true
        pointHistory.timestamp = event.block.timestamp.toString()
        pointHistory.point = score
        pointHistory.account = fromAddress
        pointHistory.typeCode = reasonCode


        let addScoreToAccount = Account.load(addScoreToAddress)
        if(addScoreToAccount === null){
            addScoreToAccount = new Account(addScoreToAddress)
            addScoreToAccount.createdTimestamp = timestamp
            addScoreToAccount.address = addScoreToAddress
            addScoreToAccount.parent = addScoreToAddress
            addScoreToAccount.sons = []
            addScoreToAccount.pointHistory = []
            addScoreToAccount.invitedTimestamp = "0"
            addScoreToAccount.totalPoints = "0"
            addScoreToAccount.invitedScore = "0"
        }
        let pointHistoryList = addScoreToAccount.pointHistory
        pointHistoryList.push(pointHistory.id)
        addScoreToAccount.pointHistory = pointHistoryList
        addScoreToAccount.totalPoints = (BigInt.fromString(score).plus(BigInt.fromString(addScoreToAccount.totalPoints))).toString()
        if(reasonCode === "11" || reasonCode === "111" || reasonCode === "12" || reasonCode === "13" || reasonCode === "113"){
            addScoreToAccount.invitedScore = (BigInt.fromString(score).plus(BigInt.fromString(addScoreToAccount.invitedScore))).toString()
        }


        pointHistory.save()
        addScoreToAccount.save()
    }
}


export function handleScoreDecrease(event: ScoreDecrease): void {

    let addScoreToAddress = event.params._account.toHex()
    let score = event.params._amount.toString()
    const timestamp = event.block.timestamp.toString()

    log.info("!!!!!!!!!!!!!!!!!!!!!!!!!!!!decrease score: addScoreToAddress = {} ,  score = {}", [addScoreToAddress,score]);
    let pointHistory = new PointHistory(addScoreToAddress.concat("-").concat(timestamp).concat("-").concat(score))
    pointHistory.increase = false
    pointHistory.timestamp = timestamp
    pointHistory.point = score
    pointHistory.account = addScoreToAddress
    pointHistory.typeCode = "999"


    let addScoreToAccount = Account.load(addScoreToAddress)
    if(addScoreToAccount === null){
        addScoreToAccount = new Account(addScoreToAddress)
        addScoreToAccount.createdTimestamp = timestamp
        addScoreToAccount.address = addScoreToAddress
        addScoreToAccount.parent = addScoreToAddress
        addScoreToAccount.sons = []
        addScoreToAccount.pointHistory = []
        addScoreToAccount.invitedTimestamp = "0"
        addScoreToAccount.totalPoints = "0"
        addScoreToAccount.invitedScore = "0"
    }
    let pointHistoryList = addScoreToAccount.pointHistory
    pointHistoryList.push(pointHistory.id)
    addScoreToAccount.pointHistory = pointHistoryList
    let newTotalPoints = BigInt.fromString(addScoreToAccount.totalPoints).minus(BigInt.fromString(score)).toString()
    addScoreToAccount.totalPoints = newTotalPoints

    pointHistory.save()
    addScoreToAccount.save()


}