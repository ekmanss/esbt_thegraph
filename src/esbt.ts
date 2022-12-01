import { BigInt } from "@graphprotocol/graph-ts"
import {
  ESBT,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  RankUpdate,
  ScoreDecrease,
  ScoreUpdate,
  Transfer,
  UpdateFee
} from "../generated/ESBT/ESBT"
import { ExampleEntity } from "../generated/schema"

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner
  entity.approved = event.params.approved

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.ACCUM_ADDLIQUIDITY(...)
  // - contract.ACCUM_FEE(...)
  // - contract.ACCUM_FEE_DISCOUNTED(...)
  // - contract.ACCUM_FEE_REBATED(...)
  // - contract.ACCUM_POSITIONSIZE(...)
  // - contract.ACCUM_SCORE(...)
  // - contract.ACCUM_SWAP(...)
  // - contract.FEEDISCOUNT_UPDATER(...)
  // - contract.FEE_DISCOUNT_PERCENT(...)
  // - contract.FEE_PERCENT_PRECISION(...)
  // - contract.FEE_REBATE_PERCENT(...)
  // - contract.INTERVAL_RANK_UPDATE(...)
  // - contract.INTERVAL_SCORE_UPDATE(...)
  // - contract.MIN_MINT_TRADING_VALUE(...)
  // - contract.ONLINE_ACTIVITIE(...)
  // - contract.PRICE_PRECISION(...)
  // - contract.REFERRAL_CHILD(...)
  // - contract.REFERRAL_PARRENT(...)
  // - contract.SCORE_DECREASE_PRECISION(...)
  // - contract.SCORE_PRECISION(...)
  // - contract.TIME_RANK_UPD(...)
  // - contract.TIME_SOCRE_DEC(...)
  // - contract.USD_TO_SCORE_PRECISION(...)
  // - contract.VALID_FEE_UPDATER(...)
  // - contract.VALID_LOGGER(...)
  // - contract.VALID_SCORE_UPDATER(...)
  // - contract.VALID_VAULTS(...)
  // - contract.accountToDisReb(...)
  // - contract.addressToTokenID(...)
  // - contract.attributeForTypeAndValue(...)
  // - contract.balanceOf(...)
  // - contract.base64(...)
  // - contract.createTime(...)
  // - contract.defaultRefCode(...)
  // - contract.getAddAddress(...)
  // - contract.getAddBool(...)
  // - contract.getAddMpAddressSetCount(...)
  // - contract.getAddMpAddressSetRoles(...)
  // - contract.getAddMpBytes32SetCount(...)
  // - contract.getAddMpBytes32SetRoles(...)
  // - contract.getAddMpUintSetCount(...)
  // - contract.getAddMpUintetRoles(...)
  // - contract.getAddMpUintetRolesFull(...)
  // - contract.getAddUint(...)
  // - contract.getAddress(...)
  // - contract.getAddressSetCount(...)
  // - contract.getAddressSetRoles(...)
  // - contract.getApproved(...)
  // - contract.getBool(...)
  // - contract.getBytes32SetCount(...)
  // - contract.getBytes32SetRoles(...)
  // - contract.getData(...)
  // - contract.getESBTAddMpUintetRoles(...)
  // - contract.getFeeDiscount(...)
  // - contract.getInt(...)
  // - contract.getRefCode(...)
  // - contract.getReferralForAccount(...)
  // - contract.getScore(...)
  // - contract.getUint(...)
  // - contract.getUintSetCount(...)
  // - contract.getUintetRoles(...)
  // - contract.hasAddMpAddressSet(...)
  // - contract.hasAddMpBytes32Set(...)
  // - contract.hasAddMpUintSet(...)
  // - contract.hasAddressSet(...)
  // - contract.hasBytes32Set(...)
  // - contract.hasUintSet(...)
  // - contract.isApprovedForAll(...)
  // - contract.isOwnerOf(...)
  // - contract.loggerDef(...)
  // - contract.name(...)
  // - contract.nickName(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.rank(...)
  // - contract.rankByScore(...)
  // - contract.rankToDis(...)
  // - contract.rankToDiscount(...)
  // - contract.rankToReb(...)
  // - contract.refCodeOwner(...)
  // - contract.safeMint(...)
  // - contract.scoreDecreasePercentPerDay(...)
  // - contract.scorePara(...)
  // - contract.scoreToRank(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.toChar(...)
  // - contract.toHexString(...)
  // - contract.tokenURI(...)
  // - contract.updateFee(...)
  // - contract.userDiscount(...)
  // - contract.userRebate(...)
  // - contract.userSize(...)
  // - contract.userSizeSum(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRankUpdate(event: RankUpdate): void {}

export function handleScoreDecrease(event: ScoreDecrease): void {}

export function handleScoreUpdate(event: ScoreUpdate): void {}

export function handleTransfer(event: Transfer): void {}

export function handleUpdateFee(event: UpdateFee): void {}
