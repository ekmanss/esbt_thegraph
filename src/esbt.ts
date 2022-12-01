import {BigInt, log} from "@graphprotocol/graph-ts"
import {
    ESBT,
    ScoreUpdate,
} from "../generated/ESBT/ESBT"
import {ExampleEntity,Account,PointHistory} from "../generated/schema"

export function handleScoreUpdate(event: ScoreUpdate): void {
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
        let refCodeOwnerAddress = event.params._account.toHex()
        let newMemberAddress =  event.params._fromAccount.toHex()



        let account = Account.load(refCodeOwnerAddress)
        if (account === null) {
            log.info("##########create refCodeOwner :{}", [event.params._account.toHex()]);
            account = new Account(refCodeOwnerAddress)
            account.parent = refCodeOwnerAddress
            account.address = refCodeOwnerAddress
            account.createdTimestamp = event.block.timestamp
            account.sons = []
            account.pointHistory = []
        }

        let newMember = Account.load(event.params._fromAccount.toHex())
        if(newMember === null){
            log.info("##########create newMember :{}", [event.params._account.toHex()]);
            newMember = new Account(event.params._fromAccount.toHex())
            newMember.parent = refCodeOwnerAddress
            newMember.address = newMemberAddress
            newMember.createdTimestamp = event.block.timestamp
            newMember.sons = []
            newMember.pointHistory = []
        }



        let accountSonsList = account.sons
        accountSonsList.push(newMemberAddress)
        account.sons = accountSonsList
        account.save()

        newMember.save()

    }
}
