import type { AnyMongoAbility, InferSubjects } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';
import type { Action } from 'src/enum/action.enum';

export enum CHECK_POLICIES_KEY {
  HANDLER = 'CHECK_POLICIES_HANDLER',
  CAN = 'CHECK_POLICIES_CAN',
  CANNOT = 'CHECK_POLICIES_CANNOT',
}
// GUARDS -> routes meta -> @CheckPolicies @Can @Cannot

// @CheckPolicies -> handler -> ability => boolean
export type PolicyHandleType = (ability: AnyMongoAbility) => boolean;
export type CaslHandleType = PolicyHandleType | PolicyHandleType[];
export const CheckPoliciesHandler = (...handler: PolicyHandleType[]) => {
  return SetMetadata(CHECK_POLICIES_KEY.HANDLER, handler);
};
// @Can -> Action, Subject, Conditions
export const Can = (
  action: Action,
  subject: InferSubjects<any>,
  conditions?: any,
) => {
  return SetMetadata(CHECK_POLICIES_KEY.CAN, (ability: AnyMongoAbility) => {
    return ability.can(action, subject, conditions);
  });
};
// @Cannot -> Action, Subject, Conditions
export const Cannot = (
  action: Action,
  subject: InferSubjects<any>,
  conditions?: any,
) => {
  return SetMetadata(CHECK_POLICIES_KEY.CANNOT, (ability: AnyMongoAbility) => {
    return ability.cannot(action, subject, conditions);
  });
};
