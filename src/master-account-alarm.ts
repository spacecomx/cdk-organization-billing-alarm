import { Construct } from '@aws-cdk/core';
import { BillingAlarm, BillingAlarmProps } from '@spacecomx/cdk-billing-alarm';
import { importSecretFromName } from './helper';

declare type AlarmParams = {
  topicDescription?: string;
  alarmDescription: string;
  thresholdAmount: number;
  emailAddress: string[];
  awsService?: string;
};

export interface AlarmConfig {
  /**
  * Description for the topic. A developer-defined string that can be used to identify this topic.
  */
  readonly topicDescription?: string;
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
  readonly emailAddress: string[];
  /**
  * The AWS Service to associate the alarm with e.g (AmazonDynamoDB)
  *
  * @default - Not configured.
  */
  readonly awsService?: string;
}

export interface MasterAccountAlarmProps {
  /**
  * Alarm configuration options to configure the AWS master/payer account billing alarm, with SNS topic or an existing Topic Arn.
  */
  readonly alarmConfiguration: AlarmConfig;
  /**
   * Imports a secret by secret name e.g 'prod/billing/topicArn'
   *
   * A secret with this name must exist in the same account & region as the master/payer AWS account.
   */
  readonly secretName?: string;
}

/**
 * A construct to create a master account billing alarm in master/payer AWS account e.g (AWS Organization).
 *
 * @example
 *
 * new MasterAccountAlarm(stack, 'MasterAccountAlarm', {
 *  alarmConfiguration: {
 *    topicDescription: 'Organizational billing alarm topic',
 *    emailAddress: ['hello@example.org'],
 *    alarmDescription: 'Consolidated billing alarm for all AWS Service charges',
 *    thresholdAmount: 140,
 *  },
 */
export class MasterAccountAlarm extends Construct {
  constructor(scope: Construct, id: string, props: MasterAccountAlarmProps) {
    super(scope, id);

    let topicArn: string = '';

    if (props.secretName) {
      topicArn = importSecretFromName(this, props.secretName);
    }

    this.createBillingAlarm(topicArn, props.alarmConfiguration);
  }

  /**
   * Create billing alarm.
   *
   * @param topicArn string
   * @param AlarmParams
   */
  private createBillingAlarm(
    topicArn: string,
    { topicDescription, emailAddress, alarmDescription, thresholdAmount, awsService }: AlarmParams): void {

    let dimension = {};

    if (awsService) {
      dimension = {
        metricDimensions: {
          service: awsService,
        },
      };
    }

    const config: BillingAlarmProps = {
      topicConfiguration: {
        existingTopicArn: topicArn,
        displayName: topicDescription,
        emailAddress: emailAddress,
      },
      alarmConfiguration: {
        alarmDescription: alarmDescription,
        thresholdAmount: thresholdAmount,
      },
      ...dimension,
    };

    new BillingAlarm(this, 'BillingAlarm', config);
  }
}
