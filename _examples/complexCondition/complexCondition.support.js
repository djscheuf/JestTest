export const stuffDidNotChange = (stuff, things) => stuff === things;
export const getUniquePropValues = things => things.map(t=> t.prop).filter(onlyUnique);
export const shouldValidateButFailed = (thisFlag, thisOtherFlag) =>  thisFlag && !thisOtherFlag;
export const moreUniqueValuesThanThereShouldBe = arr => arr.length > 2;