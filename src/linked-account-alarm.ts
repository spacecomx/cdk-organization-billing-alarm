import { Construct } from '@aws-cdk/core';
import { BillingAlarm, BillingAlarmProps } from '@spacecomx/cdk-billing-alarm';
import { importSecretFromName } from './helper';

declare type AlarmParams = {
  account: string;
  alarmName?: string;
  alarmDescription: string;
  thresholdAmount: number;
  emailAddress: string[];
  awsService?: string;
};

export interface LinkedAccountConfig {
  /**
   * Account id which this metric comes from.
   */
  readonly account: string;
  /**
   * Name of the alarm.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the alarm name (recommended).
   *
   * @default Generated name
   */
  readonly alarmName?: string;
  /**
  * Description for the alarm. A developer-defined string that can be used to identify this alarm.
  */
  readonly alarmDescription: string;
  /**
   * Enter the threshold amount in USD that must be exceeded to trigger the alarm e.g. (limit: 150).
   */
  readonly thresholdAmount: number;
  /**
   * The email address that will be used to subcribe to the SNS topic for billing alert notifications e.g. ['hello@example.org'] or [''hello@example.org', 'admin@example.org'].
   *
   * @default - Not configured
   */
  readonly emailAddress?: string[];
  /**
  * The AWS Service to associate the alarm with e.g (AmazonDynamoDB)
  *
  * @default - Not configured.
  */
  readonly awsService?: string;
}

export interface LinkedAccountAlarmProps {
  /**
   * Imports a secret by secret name e.g 'prod/billing/topicArn'
   *
   * A secret with this name must exist in the same account & region as the master/payer AWS account.
   */
  readonly secretName: string;
  /**
   * Account configuration to configure linked account billing alarms with an exsiting SNS topic.
   */
  readonly accountConfiguration: LinkedAccountConfig[];
}

/**
 * A construct to create a linked account billing alarm within a master/payer AWS account e.g (AWS Organization).
 *
 * @example
 *
 * new LinkedAccountAlarm(stack, 'LinkedAccountAlarm', {
 *  secretName: 'test/billing/topicArn'
 *  accountConfiguration: [
 *    { account: '444455556666', alarmDescription: 'Consolidated billing alarm for all AWS service charge estimates (Account: 444455556666)', thresholdAmount: 50, emailAddress: ['john@example.org'] },
 *    { account: '123456789000', alarmDescription: 'Billing Alarm for AWS DynamoDB charge estimates only (Account: 123456789000)', thresholdAmount: 120, awsService: 'AmazonDynamoDB' },
 *  ],
 */
export class LinkedAccountAlarm extends Construct {
  constructor(scope: Construct, id: string, props: LinkedAccountAlarmProps) {
    super(scope, id);

    const { secretName, accountConfiguration: accounts } = props;
    const topicArn: string = importSecretFromName(this, secretName);

    accounts.forEach((account: any): void => {
      this.createBillingAlarm(topicArn, account);
    });
  }

  /**
   * Create billing alarm.
   *
   * @param topicArn string
   * @param query AlarmParams
   */
  private createBillingAlarm(
    topicArn: string,
    { account, alarmName, alarmDescription, thresholdAmount, emailAddress, awsService }: AlarmParams): void {

    let serviceDimension: object = {};

    if (awsService) {
      serviceDimension = {
        service: awsService,
      };
    }

    const config: BillingAlarmProps = {
      topicConfiguration: {
        existingTopicArn: topicArn,
        emailAddress: emailAddress,
      },
      alarmConfiguration: {
        alarmName: alarmName,
        alarmDescription: alarmDescription,
        thresholdAmount: thresholdAmount,
      },
      metricDimensions: {
        account: account,
        ...serviceDimension,
      },
    };

    new BillingAlarm(this, `BillingAlarm-${account}`, config);
  }
}
