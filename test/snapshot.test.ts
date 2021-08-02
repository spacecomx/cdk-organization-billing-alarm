import '@aws-cdk/assert/jest';
import { SynthUtils } from '@aws-cdk/assert';
import {
  MasterAccountAlarmTest,
  MasterAccountAlarmWithAwsServiceTest,
  LinkedAccountAlarmTest,
} from '../src/integ.default';

test('integration snapshot test for master account billing alarm configuation', ()=> {
  const integration = new MasterAccountAlarmTest();

  integration.stack.forEach(stack => {
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});

test('integration snapshot test for master account billing alarm configuation with aws service', ()=> {
  const integration = new MasterAccountAlarmWithAwsServiceTest();

  integration.stack.forEach(stack => {
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});

test('integration snapshot test for linked account billing alarm configuation', ()=> {
  const integration = new LinkedAccountAlarmTest();

  integration.stack.forEach(stack => {
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});