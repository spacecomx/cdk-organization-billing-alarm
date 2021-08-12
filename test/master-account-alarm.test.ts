import { countResources, expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { MasterAccountAlarm, MasterAccountAlarmProps } from '../src';

test('ensure resources exist to create a master account alarm with new sns topic', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const config: MasterAccountAlarmProps = {
    alarmConfiguration: {
      topicDescription: 'Organizational billing alarm topic',
      emailAddress: ['john@example.org'],
      alarmDescription: 'Consolidated billing alarm for all AWS Service charges',
      thresholdAmount: 140,
    },
  };

  new MasterAccountAlarm(stack, 'MasterBillingAlarm', config);

  expectCDK(stack).to(countResources('AWS::SNS::Topic', 1));
  expectCDK(stack).to(
    haveResourceLike('AWS::SNS::Topic', {
      DisplayName: 'Organizational billing alarm topic',
    }),
  );

  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 1));
  expectCDK(stack).to(
    haveResourceLike('AWS::SNS::Subscription', {
      TopicArn: { Ref: 'MasterBillingAlarmTopic11ACFFE5' },
      Endpoint: 'john@example.org',
      Protocol: 'email',
    }),
  );

  expectCDK(stack).to(countResources('AWS::CloudWatch::Alarm', 1));
  expectCDK(stack).to(
    haveResourceLike('AWS::CloudWatch::Alarm', {
      AlarmActions: [
        { Ref: 'MasterBillingAlarmTopic11ACFFE5' },
      ],
      AlarmDescription: 'Consolidated billing alarm for all AWS Service charges',
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      MetricName: 'EstimatedCharges',
      Namespace: 'AWS/Billing',
      Period: 21600,
      Statistic: 'Maximum',
      Threshold: 140,
      Dimensions: [
        {
          Name: 'Currency',
          Value: 'USD',
        },
      ],
    }),
  );
});

test('ensure resources exist to create a master account alarm with specific aws service', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const config: MasterAccountAlarmProps = {
    alarmConfiguration: {
      topicDescription: 'Organizational billing alarm topic',
      emailAddress: ['john@example.org'],
      alarmDescription: 'Billing Alarm for AWS DynamoDB charge estimates only (Account: 12345444000)',
      thresholdAmount: 140,
      awsService: 'AmazonDynamoDB',
    },
  };

  new MasterAccountAlarm(stack, 'MasterBillingAlarm', config);

  expectCDK(stack).to(countResources('AWS::SNS::Topic', 1));
  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 1));

  expectCDK(stack).to(countResources('AWS::CloudWatch::Alarm', 1));
  expectCDK(stack).to(
    haveResourceLike('AWS::CloudWatch::Alarm', {
      AlarmActions: [
        { Ref: 'MasterBillingAlarmTopic11ACFFE5' },
      ],
      AlarmDescription: 'Billing Alarm for AWS DynamoDB charge estimates only (Account: 12345444000)',
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      MetricName: 'EstimatedCharges',
      Namespace: 'AWS/Billing',
      Period: 21600,
      Statistic: 'Maximum',
      Threshold: 140,
      Dimensions: [
        {
          Name: 'Currency',
          Value: 'USD',
        },
        {
          Name: 'ServiceName',
          Value: 'AmazonDynamoDB',
        },
      ],
    }),
  );
});

test('ensure resources exist to create a master account alarm using existing sns topic', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const config: MasterAccountAlarmProps = {
    secretName: 'test/billing/topicArn',
    alarmConfiguration: {
      emailAddress: ['john@example.org'],
      alarmDescription: 'Consolidated organisation AWS Services',
      thresholdAmount: 140,
    },
  };

  new MasterAccountAlarm(stack, 'MasterBillingAlarm', config);

  expectCDK(stack).to(countResources('AWS::SNS::Topic', 0));

  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 1));
  expectCDK(stack).to(
    haveResourceLike('AWS::SNS::Subscription', {
      Endpoint: 'john@example.org',
      Protocol: 'email',
    }),
  );

  expectCDK(stack).to(countResources('AWS::CloudWatch::Alarm', 1));
  expectCDK(stack).to(
    haveResourceLike('AWS::CloudWatch::Alarm', {
      AlarmActions: [
        {
          'Fn::Join': ['', ['{{resolve:secretsmanager:arn:',
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
            ':secret:test/billing/topicArn:SecretString:::}}']],
        },
      ],
    }),
  );
});


test('ensure resources exist to create a master account alarm using existing sns topic without email subscription', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const config: MasterAccountAlarmProps = {
    secretName: 'test/billing/topicArn',
    alarmConfiguration: {
      emailAddress: [],
      alarmDescription: 'Consolidated billing alarm for all AWS Service charges',
      thresholdAmount: 140,
    },
  };

  new MasterAccountAlarm(stack, 'MasterBillingAlarm', config);

  expectCDK(stack).to(countResources('AWS::SNS::Topic', 0));
  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 0));

  expectCDK(stack).to(countResources('AWS::CloudWatch::Alarm', 1));
  expectCDK(stack).to(
    haveResourceLike('AWS::CloudWatch::Alarm', {
      AlarmActions: [
        {
          'Fn::Join': ['', ['{{resolve:secretsmanager:arn:',
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
            ':secret:test/billing/topicArn:SecretString:::}}']],
        },
      ],
      AlarmDescription: 'Consolidated billing alarm for all AWS Service charges',
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      MetricName: 'EstimatedCharges',
      Namespace: 'AWS/Billing',
      Period: 21600,
      Statistic: 'Maximum',
      Threshold: 140,
      Dimensions: [
        {
          Name: 'Currency',
          Value: 'USD',
        },
      ],
    }),
  );
});