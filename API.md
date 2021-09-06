# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### LinkedAccountAlarm <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountAlarm"></a>

A construct to create a linked account billing alarm within a master/payer AWS account e.g (AWS Organization).

#### Initializers <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountAlarm.Initializer"></a>

```typescript
import { LinkedAccountAlarm } from '@spacecomx/cdk-organization-billing-alarm'

new LinkedAccountAlarm(scope: Construct, id: string, props: LinkedAccountAlarmProps)
```

##### `scope`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountAlarm.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountAlarm.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountAlarm.parameter.props"></a>

- *Type:* [`@spacecomx/cdk-organization-billing-alarm.LinkedAccountAlarmProps`](#@spacecomx/cdk-organization-billing-alarm.LinkedAccountAlarmProps)

---





### MasterAccountAlarm <a name="@spacecomx/cdk-organization-billing-alarm.MasterAccountAlarm"></a>

A construct to create a master account billing alarm in master/payer AWS account e.g (AWS Organization).

#### Initializers <a name="@spacecomx/cdk-organization-billing-alarm.MasterAccountAlarm.Initializer"></a>

```typescript
import { MasterAccountAlarm } from '@spacecomx/cdk-organization-billing-alarm'

new MasterAccountAlarm(scope: Construct, id: string, props: MasterAccountAlarmProps)
```

##### `scope`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.MasterAccountAlarm.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.MasterAccountAlarm.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.MasterAccountAlarm.parameter.props"></a>

- *Type:* [`@spacecomx/cdk-organization-billing-alarm.MasterAccountAlarmProps`](#@spacecomx/cdk-organization-billing-alarm.MasterAccountAlarmProps)

---





## Structs <a name="Structs"></a>

### AlarmConfig <a name="@spacecomx/cdk-organization-billing-alarm.AlarmConfig"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { AlarmConfig } from '@spacecomx/cdk-organization-billing-alarm'

const alarmConfig: AlarmConfig = { ... }
```

##### `alarmDescription`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.AlarmConfig.property.alarmDescription"></a>

- *Type:* `string`

Description for the alarm.

A developer-defined string that can be used to identify this alarm.

---

##### `emailAddress`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.AlarmConfig.property.emailAddress"></a>

- *Type:* `string`[]
- *Default:* Not configured

The email address that will be used to subcribe to the SNS topic for billing alert notifications e.g. ['hello@example.org'] or [''hello@example.org', 'admin@example.org'].

---

##### `thresholdAmount`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.AlarmConfig.property.thresholdAmount"></a>

- *Type:* `number`

Enter the threshold amount in USD that must be exceeded to trigger the alarm e.g. (limit: 150).

---

##### `awsService`<sup>Optional</sup> <a name="@spacecomx/cdk-organization-billing-alarm.AlarmConfig.property.awsService"></a>

- *Type:* `string`
- *Default:* Not configured.

The AWS Service to associate the alarm with e.g (AmazonDynamoDB).

---

##### `topicDescription`<sup>Optional</sup> <a name="@spacecomx/cdk-organization-billing-alarm.AlarmConfig.property.topicDescription"></a>

- *Type:* `string`

Description for the topic.

A developer-defined string that can be used to identify this topic.

---

### LinkedAccountAlarmProps <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountAlarmProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { LinkedAccountAlarmProps } from '@spacecomx/cdk-organization-billing-alarm'

const linkedAccountAlarmProps: LinkedAccountAlarmProps = { ... }
```

##### `accountConfiguration`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountAlarmProps.property.accountConfiguration"></a>

- *Type:* [`@spacecomx/cdk-organization-billing-alarm.LinkedAccountConfig`](#@spacecomx/cdk-organization-billing-alarm.LinkedAccountConfig)[]

Account configuration to configure linked account billing alarms with an exsiting SNS topic.

---

##### `secretName`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountAlarmProps.property.secretName"></a>

- *Type:* `string`

Imports a secret by secret name e.g 'prod/billing/topicArn'.

A secret with this name must exist in the same account & region as the master/payer AWS account.

---

### LinkedAccountConfig <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountConfig"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { LinkedAccountConfig } from '@spacecomx/cdk-organization-billing-alarm'

const linkedAccountConfig: LinkedAccountConfig = { ... }
```

##### `account`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountConfig.property.account"></a>

- *Type:* `string`

Account id which this metric comes from.

---

##### `alarmDescription`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountConfig.property.alarmDescription"></a>

- *Type:* `string`

Description for the alarm.

A developer-defined string that can be used to identify this alarm.

---

##### `thresholdAmount`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountConfig.property.thresholdAmount"></a>

- *Type:* `number`

Enter the threshold amount in USD that must be exceeded to trigger the alarm e.g. (limit: 150).

---

##### `alarmName`<sup>Optional</sup> <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountConfig.property.alarmName"></a>

- *Type:* `string`
- *Default:* Generated name

Name of the alarm.

If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the alarm name (recommended).

---

##### `awsService`<sup>Optional</sup> <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountConfig.property.awsService"></a>

- *Type:* `string`
- *Default:* Not configured.

The AWS Service to associate the alarm with e.g (AmazonDynamoDB).

---

##### `emailAddress`<sup>Optional</sup> <a name="@spacecomx/cdk-organization-billing-alarm.LinkedAccountConfig.property.emailAddress"></a>

- *Type:* `string`[]
- *Default:* Not configured

The email address that will be used to subcribe to the SNS topic for billing alert notifications e.g. ['hello@example.org'] or [''hello@example.org', 'admin@example.org'].

---

### MasterAccountAlarmProps <a name="@spacecomx/cdk-organization-billing-alarm.MasterAccountAlarmProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { MasterAccountAlarmProps } from '@spacecomx/cdk-organization-billing-alarm'

const masterAccountAlarmProps: MasterAccountAlarmProps = { ... }
```

##### `alarmConfiguration`<sup>Required</sup> <a name="@spacecomx/cdk-organization-billing-alarm.MasterAccountAlarmProps.property.alarmConfiguration"></a>

- *Type:* [`@spacecomx/cdk-organization-billing-alarm.AlarmConfig`](#@spacecomx/cdk-organization-billing-alarm.AlarmConfig)

Alarm configuration options to configure the AWS master/payer account billing alarm, with SNS topic or an existing Topic Arn.

---

##### `secretName`<sup>Optional</sup> <a name="@spacecomx/cdk-organization-billing-alarm.MasterAccountAlarmProps.property.secretName"></a>

- *Type:* `string`

Imports a secret by secret name e.g 'prod/billing/topicArn'.

A secret with this name must exist in the same account & region as the master/payer AWS account.

---



