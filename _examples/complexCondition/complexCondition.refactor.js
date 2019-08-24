
import doTheThing from './somewhere/doTheThing';
import randomApi from './somewhereElse/randomApi';
import {
  stuffDidNotChange,
  getUniquePropValues,
  shouldValidateButFailed,
  moreUniqueValuesThanThereShouldBe
} from './complexCondition.support';

export default (stuff, thisFlag) => {
  
  const {data: things, thisOtherFlag } = randomApi(stuff,thisFlag);
  const array = getUniquePropValues(things);

  if(stuffDidNotChange(stuff,things)){
    doTheThing();
  }

  const tooManyUnique = moreUniqueValuesThanThereShouldBe(array);
  const failedToValidate = shouldValidateButFailed(thisFlag ,thisOtherFlag);
  const shouldDoThingAnyway = tooManyUnique && failedToValidate;
  if(shouldDoThingAnyway) {
    doTheThing();
  };

  return things;
}