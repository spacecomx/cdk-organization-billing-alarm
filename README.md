[![npm version](https://badge.fury.io/js/%40spacecomx%2Fcdk-organization-billing-alarm.svg)](https://badge.fury.io/js/%40spacecomx%2Fcdk-organization-billing-alarm)
[![PyPI version](https://badge.fury.io/py/spacecomx.cdk-organization-billing-alarm.svg)](https://badge.fury.io/py/spacecomx.cdk-organization-billing-alarm)

# @spacecomx/cdk-organization-billing-alarm

CDK construct to monitor estimated billing charges with alerts and notifications for a multi-account AWS Organizations. It gives you the capability to monitor specific AWS Service charges, by a linked AWS account in a master/payer account. It can create customizable billing alarms for multiple linked AWS accounts within AWS Organization. It can subscribe multiple email address endpoints to an SNS Topic created by the package or it can use an existing SNS Topic Arn within the master/payer account.

For single AWS account billing alarm requirements, see [@spacecomx/cdk-billing-alarm](https://github.com/spacecomx/cdk-billing-alarm#readme)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)

  - [Example 1: Create billing alarm in a master/payer account](#example_1)
  - [Example 2: Link alarm to an existing SNS Topic Arn](#example_2)
  - [Example 3: Link alarm to specific AWS Account in master/payer account](#example_3)
  - [Example 4: Updating/Removing SNS Topic email address endpoint subscription](#example_4)

- [Post Deployment](#post-deployment)
- [API Documentation](#api-documentation)

## Prerequisites

> :warning: Before you can create a billing alarm, you must enable billing alerts in your master/payer account when using consolidated billing. For more information, see [Enabling Billing Alerts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html#turning_on_billing_metrics).

## Installation

TypeScript/JavaScript:

```bash
npm i @spacecomx/cdk-organization-billing-alarm
```

or:

```bash
yarn add @spacecomx/cdk-organization-billing-alarm
```

Python:

```bash
pip install spacecomx.cdk-organization-billing-alarm
```

## Usage

<a name="example_1"></a>

### Example 1: Create billing alarm in a master/payer account.

This type of billing alarm configuration will provide estimated charges for every AWS Service that you use, in addition to the estimated overall total of your AWS charges within your AWS master/payer account e.g (AWS Organization).

- It creates a new SNS Topic in your AWS master/payer account.
- It then subscribes the email address endpoint to the topic.
- It then creates the Cloudwach estimate billing alarm.
- It then associates the SNS topic with the newly created billing alarm.

> :small_orange_diamond: The `emailAddress` is an endpoint that subscribes to a SNS topic. The `thresholdAmount` is the amount in USD, that will trigger the alarm when AWS charges exceed the threshold.

```typescript
import { Stack, StackProps } from '@aws-cdk/core';
import {
  MasterAccountAlarm,
  MasterAccountAlarmProps,
} from '@spacecomx/cdk-organization-billing-alarm';

export class OrganizationBillingAlarmStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const config: MasterAccountAlarmProps = {
      alarmConfiguration: {
        topicDescription: 'Organization Billing Alarm Topic',
        emailAddress: ['john@example.org'],
        alarmDescription: 'Consolidated Billing Alarm: All AWS Services',
        thresholdAmount: 140,
      },
    };

    new MasterAccountAlarm(this, 'MasterAccountAlarm', config);
  }
}
```

<a name="example_2"></a>

### Example 2: Link alarm to an existing SNS Topic Arn.

This type of billing alarm configuration simliar to [example 1](#example_1), with the exception that the billing alarm is now linked to an existing SNS Topic in the master/payer account.

- It uses an existing SNS Topic within the AWS master/payer account.
- It imports a secret by secret name that was created in master/payer account using AWS Secrets Manager e.g (prod/billing/topicArn).
- It then subscribes the email address endpoint to the retrieved SNS Topic's Arn.
- It then creates the Cloudwach estimate billing alarm.
- It then associates the SNS topic with the newly created billing alarm.

> :small_orange_diamond: The `secretName` option is required and used to retrieve the existing SNS Topic's Arn from AWS Secrets Manager. The secret name **must exist** in the same account and region as the master/payer AWS account.

```typescript
import { Stack, StackProps } from '@aws-cdk/core';
import {
  MasterAccountAlarm,
  MasterAccountAlarmProps,
} from '@spacecomx/cdk-organization-billing-alarm';

export class OrganizationBillingAlarmStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const config: MasterAccountAlarmProps = {
      secretName: 'prod/billing/topicArn', // use existing sns topic
      alarmConfiguration: {
        emailAddress: ['john@example.org'],
        alarmDescription: 'Consolidated Billing Alarm: All AWS Services',
        thresholdAmount: 140,
      },
    };

    new MasterAccountAlarm(this, 'MasterAccountAlarm', config);
  }
}
```

<a name="example_3"></a>

### Example 3: Link alarm to specific AWS Account in master/payer account.

This type of billing alarm configuration provides customizable options for linked AWS accounts within the master/payer account. The packages `accountConfiguration` required option allows for multiple AWS accounts to link to a single SNS Topic using the required `secretName` option.

- It uses an existing SNS Topic's Arn within the AWS master/payer account.
- It imports a secret by secret name that was created in master/payer account using AWS Secrets Manager e.g (prod/billing/topicArn).
- It then creates the Cloudwach estimate billing alarm associated to the linked AWS account.
- It then associates the SNS topic with the newly created billing alarm.

> :small_orange_diamond: The `secretName` option is required and used to retrieve the existing SNS Topic's Arn from AWS Secrets Manager. The secret name **must exist** in the same account and region as the master/payer AWS account.

```typescript
import { Stack, StackProps } from '@aws-cdk/core';
import {
  LinkedAccountAlarm,
  LinkedAccountAlarmProps,
} from '@spacecomx/cdk-organization-billing-alarm';

export class OrganizationBillingAlarmStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const config: LinkedAccountAlarmProps = {
      secretName: 'prod/billing/topicArn',
      accountConfiguration: [
        {
          accountId: '444455556666',
          alarmDescription:
            'Billing Alarm: All AWS Services (Acc: 444455556666)',
          thresholdAmount: 50,
        },
      ],
    };

    new LinkedAccountAlarm(this, 'LinkedAccountAlarm', config);
  }
}
```

-OR-

You can manage **multiple linked AWS accounts** each with its own billing alarm configuration, with a single implementation of the `LinkedAccountAlarm` construct. The code example below uses a **_single SNS Topic_** to manage alerts and notifications for all linked accounts within the master/payer account. Each linked account can send alerts and notifications to either a single email address or multiple email addresses, subscribed to the SNS Topic within the master/payer account

> :small_orange_diamond: Should you need more that one SNS topic e.g. you want seperate out linked accounts by department or business unit, each having its own SNS Topic. One option would be to, firstly create an SNS Topic in the master/payer account for each department or business unit. Remember to create a new secret with that SNS Topic's Arn in AWS Secrets Manager. Then simply, new up `LinkedAccountAlarm` constructs that group those linked accounts by department or business unit, each with its own SNS Topic.

```typescript
const config: LinkedAccountAlarmProps = {
  secretName: 'prod/billing/other/topicArn', // single topic used by multiple accounts
  accountConfiguration: [
    {
      accountId: '444455556666',
      alarmDescription: 'Billing Alarm: All AWS Services (Acc: 444455556666)',
      thresholdAmount: 50,
    },
    {
      accountId: '123456789000',
      alarmDescription: 'Billing Alarm: All AWS Services (Acc: 123456789000)',
      thresholdAmount: 120,
    },
  ],
};
```

> :small_orange_diamond: For more fine-grain billing alarm customizations, per linked AWS account, use the `emailAddress` and `awsService` options. See the code example below.

```typescript
const config: LinkedAccountAlarmProps = {
  secretName: 'prod/billing/topicArn',
  accountConfiguration: [
    {
      accountId: '444455556666',
      alarmDescription: 'Billing Alarm: All AWS Services (Acc: 444455556666)',
      thresholdAmount: 50,
      emailAddress: ['admin@example.org', 'billing@example.org'], // notifications these emails
    },
    {
      accountId: '123456789000',
      alarmDescription: 'Billing Alarm: Amazon DynamoDB (Acc: 123456789000)',
      thresholdAmount: 120,
      awsService: 'AmazonDynamoDB', // alarm alert - Amazon DynamoDB
    },
    {
      accountId: '33356789000',
      alarmDescription: 'Billing Alarm: Amazon APIGateway (Acc: 33356789000)',
      thresholdAmount: 60,
      emailAddress: ['hosting@example.com'], // notifications this email
      awsService: 'AmazonApiGateway', // alarm alert - Amazon API Gateway
    },
  ],
};
```

> :small_orange_diamond: Should you need to remove a `awsService` or an `emailAddress` subscribed to a specific linked account, simply remove the configurations option.

<a name="example_4"></a>

### Example 4: Updating/Removing SNS Topic email address endpoint subscription.

When would you use this option?

- When an existing SNS topic that already has an email address endpoint subscribed to it,
- or you dont require any additional email address endpoints to be added to the existing topic,
- or you want to add your own email address endpoints manually to the SNS topic (not recommended),
- or you want to remove an email address endpoints from the SNS topic created with the package,
- or you want to add or update email address endpoints for the SNS topic using the package.

> :small_orange_diamond: To manage adding and removing endpoints for the SNS topic, use the packages `emailAddress` option. You can simply set the `emailAddress: ['john@example.org']` option to `emailAddress: []`. Please note that email endpoint subscriptions created manually via AWS SNS Console **will not be removed** by the package.

```typescript
const config: MasterAccountAlarmProps = {
  alarmConfiguration: {
    emailAddress: [], // required, so pass empty array
    ...
  },
};
```

-OR-

For removing an endpoint or endpoints for specific linked AWS account, simply remove the `emailAddress` option from the configuration. The linked account will now use the master/payer account email address subscribed to the SNS Topic e.g `secretName: 'prod/billing/topicArn` if one exists.

```typescript
const config: LinkedAccountAlarmProps = {
  secretName: 'prod/billing/topicArn',
  accountConfiguration: [
    {
      accountId: '444455556666',
      alarmDescription: 'Billing Alarm: All AWS Services (Acc: 444455556666)',
      thresholdAmount: 50,
      emailAddress: ['admin@example.org'], // not required, just remove it
    },
  ],
};
```

Adding and removing endpoints means **_you will need to again confirm the subscription_** of each email address you specified with `emailAddress` option or those added manually by you e.g AWS SNS console (not recommended). See [post deployment](#post-deployment) for details.

> :warning: Please be **cautious**. Without an endpoint been provided i.e. (email address been subscribed to the SNS topic), the billing alarm will still trigger when exceeding the alarm threshold. However you will **not recieve any email alarm notifications** via email.

## Post Deployment

Once the Billing Alarm Stack resources has been successfully created in your AWS account, you will need to confirm the subscription of each email address you specified with the `emailAddress` configuration option. Clicking on the **"Confirm Subscription"** link for that email, will automatically activate billing alarm notifications for that email address.

If you did not receive the email, you can process a **"Request Confirmation"** for the subscription from the Simple Notification Service (SNS) console within your AWS account.

> :warning: Without confirming the email subscription you will **not recieve any email alarm notifications** via email. The billing alarm will trigger when exceeding the alarm threshold, but **you will not be notified** via email.

## API Documentation

For more detail, see [API documentation](https://github.com/spacecomx/cdk-organization-billing-alarm/blob/main/API.md)

## Contributions

Contributions of all kinds are welcome! Check out our [contributor's guide](https://github.com/spacecomx/cdk-organization-billing-alarm/blob/main/CONTRIBUTING.md) and our [code of conduct](https://github.com/spacecomx/cdk-organization-billing-alarm/blob/main/CODE_OF_CONDUCT.md)

## Credits

- [Wayne Gibson](https://github.com/waynegibson)

## Alternatives

- [@spacecomx/cdk-billing-alarm](https://github.com/spacecomx/cdk-billing-alarm#readme) - used for single account billing alarm requirements and some.

## License

@spacecomx/cdk-organization-billing-alarm is distributed under the [MIT](https://github.com/spacecomx/cdk-organization-billing-alarm/blob/main/LICENSE) license.
