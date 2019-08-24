
import doTheThing from './somewhere/doTheThing';
import randomApi from './somewhereElse/randomApi';

export default (stuff, thisFlag) => {
  
  const {data: things, thisOtherFlag } = randomApi(stuff,thisFlag);

  const array = things.map(t=> t.prop1);

  if(stuff === things || (array.length > 2 && thisFlag && !thisOtherFlag)) {
    // minor prepration of things and array to doTheThing
    doTheThing(nuThings, nuArray);
  };

  return things;
}