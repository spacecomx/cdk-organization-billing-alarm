import * as cdk from '@aws-cdk/core';
import { MasterAccountAlarm, MasterAccountAlarmProps, LinkedAccountAlarm, LinkedAccountAlarmProps } from './index';

export class MasterAccountAlarmTest {
  readonly stack: cdk.Stack[];

  constructor() {
    const app = new cdk.App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new cdk.Stack(app, 'TestStack', { env });

    const config: MasterAccountAlarmProps = {
      alarmConfiguration: {
        topicDescription: 'Organizational billing alarm topic',
        emailAddress: ['john@example.org'],
        alarmDescription: 'Consolidated billing alarm for all AWS Service charges',
        thresholdAmount: 140,
        awsService: 'AmazonDynamoDB',
      },
    };

    new MasterAccountAlarm(stack, 'MasterAccountAlarm', config);

    this.stack = [stack];
  }
}
export class MasterAccountAlarmWithAwsServiceTest {
  readonly stack: cdk.Stack[];

  constructor() {
    const app = new cdk.App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new cdk.Stack(app, 'TestStack', { env });

    const config: MasterAccountAlarmProps = {
      alarmConfiguration: {
        topicDescription: 'Organizational billing alarm topic',
        emailAddress: ['john@example.org'],
        alarmDescription: 'Billing Alarm for AWS DynamoDB charge estimates only (Account: 12345444000)',
        thresholdAmount: 140,
        awsService: 'AmazonDynamoDB',
      },
    };

    new MasterAccountAlarm(stack, 'MasterAccountAlarm', config);

    this.stack = [stack];
  }
}

export class LinkedAccountAlarmTest {
  readonly stack: cdk.Stack[];

  constructor() {
    const app = new cdk.App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new cdk.Stack(app, 'TestStack', { env });

    const config: LinkedAccountAlarmProps = {
      secretName: 'test/billing/topicArn',
      accountConfiguration: [
        { account: '444455556666', alarmDescription: 'Consolidated billing alarm for all AWS service charge estimates (Account: 444455556666)', thresholdAmount: 50, emailAddress: ['john@example.org'] },
        { account: '123456789000', alarmDescription: 'Billing Alarm for AWS DynamoDB charge estimates only (Account: 123456789000)', thresholdAmount: 120, awsService: 'AmazonDynamoDB' },
      ],
    };

    new LinkedAccountAlarm(stack, 'LinkedAccountAlarm', config);

    this.stack = [stack];
  }
}
