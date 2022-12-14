import {Address, BigInt, log} from "@graphprotocol/graph-ts"
import {
    ESBT,
    ScoreUpdate,
    ScoreDecrease
} from "../generated/ESBT/ESBT"
import {ExampleEntity,Account,PointHistory} from "../generated/schema"

const ESBT_ADDRESS = "0xc03668dfe2141b99671a630d1ed37651e0615fc4"
export function handleScoreUpdate(event: ScoreUpdate): void {
    const timestamp = event.block.timestamp.toString()
    let ESBTContract =  ESBT.bind(Address.fromString(ESBT_ADDRESS))
    let scoreDecreasePercentPerDay = ESBTContract.scoreDecreasePercentPerDay()
    log.info("????????????????????scoreDecreasePercentPerDay: {}",[scoreDecreasePercentPerDay.toString()])


    if (event.params._reasonCode.equals(BigInt.fromI32(0))) {
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


        const refCodeOwnerSizeSum = ESBTContract.userSizeSum(Address.fromString(refCodeOwnerAddress))
        // const newMemberSizeSum = ESBT.bind(Address.fromString(ESBT_ADDRESS)).userSizeSum(Address.fromString(newMemberAddress))
        log.info("**********************refCodeOwnerSizeSum: {}", [refCodeOwnerSizeSum.toString()])
        // log.info("**********************newMemberSizeSum: {}", [newMemberSizeSum.toString()])


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
        }
        let pointHistoryList = addScoreToAccount.pointHistory
        pointHistoryList.push(pointHistory.id)
        addScoreToAccount.pointHistory = pointHistoryList


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
    }
    let pointHistoryList = addScoreToAccount.pointHistory
    pointHistoryList.push(pointHistory.id)
    addScoreToAccount.pointHistory = pointHistoryList

    pointHistory.save()
    addScoreToAccount.save()


}