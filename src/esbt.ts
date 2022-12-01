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

        let account = Account.load(event.params._account.toHex())
        if (account === null) {
            account = new Account(event.params._account.toHex())
            account.parent = event.params._account.toHex()
            account.address = event.params._fromAccount.toHex()
            account.createdTimestamp = event.block.timestamp
            account.sons = []

            account.save()
        }



    }
}
