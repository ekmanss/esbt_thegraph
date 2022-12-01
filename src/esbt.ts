import {BigInt, log} from "@graphprotocol/graph-ts"
import {
    ESBT,
    ScoreUpdate,
} from "../generated/ESBT/ESBT"
import {ExampleEntity} from "../generated/schema"

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
    }
}
