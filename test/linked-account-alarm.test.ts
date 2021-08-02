import { countResources, expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { LinkedAccountAlarm, LinkedAccountAlarmProps } from '../src';

test('ensure resources exist to create a linked account alarm with existing sns topic', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const config: LinkedAccountAlarmProps = {
    secretName: 'test/billing/topicArn',
    accountConfiguration: [
      { account: '444455556666', alarmName: 'Billing Alarm (All Services)', alarmDescription: 'Consolidated billing alarm for all AWS service charge estimates (Account: 444455556666)', thresholdAmount: 50 },
    ],
  };

  new LinkedAccountAlarm(stack, 'LinkedBillingAlarm', config);

  expectCDK(stack).to(countResources('AWS::SNS::Topic', 0));
  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 0));

  expectCDK(stack).to(countResources('AWS::CloudWatch::Alarm', 1));
  expectCDK(stack).to(
    haveResourceLike('AWS::CloudWatch::Alarm', {
      AlarmActions: [
        {
          'Fn::Join': [
            '',
            [
              '{{resolve:secretsmanager:arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':secretsmanager:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':secret:test/billing/topicArn:SecretString:::}}',
            ],
          ],
        },
      ],
      AlarmName: 'Billing Alarm (All Services)',
      AlarmDescription: 'Consolidated billing alarm for all AWS service charge estimates (Account: 444455556666)',
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      MetricName: 'EstimatedCharges',
      Namespace: 'AWS/Billing',
      Period: 21600,
      Statistic: 'Maximum',
      Threshold: 50,
      Dimensions: [
        {
          Name: 'Currency',
          Value: 'USD',
        },
        {
          Name: 'LinkedAccount',
          Value: '444455556666',
        },
      ],
    }),
  );
});

test('ensure resources exist to create a linked account alarm with existing sns topic with email subscription', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const config: LinkedAccountAlarmProps = {
    secretName: 'test/billing/topicArn',
    accountConfiguration: [
      { account: '444455556666', alarmDescription: 'Consolidated billing alarm for all AWS service charge estimates (Account: 444455556666)', thresholdAmount: 50, emailAddress: ['john@example.org'] },
    ],
  };

  new LinkedAccountAlarm(stack, 'LinkedBillingAlarm', config);

  expectCDK(stack).to(countResources('AWS::SNS::Topic', 0));

  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 1));
  expectCDK(stack).to(
    haveResourceLike('AWS::SNS::Subscription', {
      Endpoint: 'john@example.org',
      Protocol: 'email',
      TopicArn: {
        'Fn::Join': [
          '',
          [
            '{{resolve:secretsmanager:arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':secretsmanager:',
            {
              Ref: 'AWS::Region',
            },
            ':',
            {
              Ref: 'AWS::AccountId',
            },
            ':secret:test/billing/topicArn:SecretString:::}}',
          ],
        ],
      },
    }),
  );

  expectCDK(stack).to(countResources('AWS::CloudWatch::Alarm', 1));
  expectCDK(stack).to(
    haveResourceLike('AWS::CloudWatch::Alarm', {
      AlarmDescription: 'Consolidated billing alarm for all AWS service charge estimates (Account: 444455556666)',
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      MetricName: 'EstimatedCharges',
      Namespace: 'AWS/Billing',
      Period: 21600,
      Statistic: 'Maximum',
      Threshold: 50,
      Dimensions: [
        {
          Name: 'Currency',
          Value: 'USD',
        },
        {
          Name: 'LinkedAccount',
          Value: '444455556666',
        },
      ],
    }),
  );
});

test('ensure resources exist to create a linked account alarm with existing sns topic with specific aws service', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const config: LinkedAccountAlarmProps = {
    secretName: 'test/billing/topicArn',
    accountConfiguration: [
      { account: '444455556666', alarmDescription: 'Billing Alarm for AWS DynamoDB charge estimates only (Account: 444455556666)', thresholdAmount: 50, awsService: 'AmazonDynamoDB' },
    ],
  };

  new LinkedAccountAlarm(stack, 'LinkedBillingAlarm', config);

  expectCDK(stack).to(countResources('AWS::SNS::Topic', 0));
  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 0));

  expectCDK(stack).to(countResources('AWS::CloudWatch::Alarm', 1));
  expectCDK(stack).to(
    haveResourceLike('AWS::CloudWatch::Alarm', {
      AlarmDescription: 'Billing Alarm for AWS DynamoDB charge estimates only (Account: 444455556666)',
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      MetricName: 'EstimatedCharges',
      Namespace: 'AWS/Billing',
      Period: 21600,
      Statistic: 'Maximum',
      Threshold: 50,
      Dimensions: [
        {
          Name: 'Currency',
          Value: 'USD',
        },
        {
          Name: 'LinkedAccount',
          Value: '444455556666',
        },
        {
          Name: 'ServiceName',
          Value: 'AmazonDynamoDB',
        },
      ],
    }),
  );
});

test('ensure resources exist to create a billing alarm for multiple linked accounts', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const config: LinkedAccountAlarmProps = {
    secretName: 'test/billing/topicArn',
    accountConfiguration: [
      { account: '444455556666', alarmDescription: 'Consolidated billing alarm for all AWS service charge estimates (Account: 444455556666)', thresholdAmount: 50 },
      { account: '123456789000', alarmDescription: 'Consolidated billing alarm for all AWS service charge estimates (Account: 123456789000)', thresholdAmount: 120 },
    ],
  };

  new LinkedAccountAlarm(stack, 'LinkedBillingAlarm', config);

  expectCDK(stack).to(countResources('AWS::SNS::Topic', 0));
  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 0));

  expectCDK(stack).to(countResources('AWS::CloudWatch::Alarm', 2));
  expectCDK(stack).to(
    haveResourceLike('AWS::CloudWatch::Alarm', {
      AlarmDescription: 'Consolidated billing alarm for all AWS service charge estimates (Account: 444455556666)',
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      MetricName: 'EstimatedCharges',
      Namespace: 'AWS/Billing',
      Period: 21600,
      Statistic: 'Maximum',
      Threshold: 50,
      Dimensions: [
        {
          Name: 'Currency',
          Value: 'USD',
        },
        {
          Name: 'LinkedAccount',
          Value: '444455556666',
        },
      ],
    }),
  );
  expectCDK(stack).to(
    haveResourceLike('AWS::CloudWatch::Alarm', {
      AlarmDescription: 'Consolidated billing alarm for all AWS service charge estimates (Account: 123456789000)',
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      MetricName: 'EstimatedCharges',
      Namespace: 'AWS/Billing',
      Period: 21600,
      Statistic: 'Maximum',
      Threshold: 120,
      Dimensions: [
        {
          Name: 'Currency',
          Value: 'USD',
        },
        {
          Name: 'LinkedAccount',
          Value: '123456789000',
        },
      ],
    }),
  );
});