const { AwsCdkConstructLibrary, ProjectType, NpmAccess } = require('projen');

const RELEASE_STATUS = true;
const RELEASE_BRANCH = 'main';
const PRE_RELEASE = 'beta';
const MAYOR_VERSION = 1;
const RELEASE_TO_NPM = false;
const AWS_CDK_VERSION = '1.116.0';

const project = new AwsCdkConstructLibrary({
  name: 'cdk-organization-billing-alarm',
  packageName: '@spacecomx/cdk-organization-billing-alarm',
  description:
    'CDK construct to monitor estimated billing charges with alerts and notifications for a multi-account AWS Organizations. It gives you the capability to monitor specific AWS Service charges, by a linked AWS account in a master/payer account. It can create customizable billing alarms for multiple linked AWS accounts within AWS Organization.',
  author: 'Wayne Gibson',
  authorAddress: 'wayne.gibson@spacecomx.com',
  repositoryUrl:
    'https://github.com/spacecomx/cdk-organization-billing-alarm.git',
  keywords: [
    'aws',
    'cdk',
    'aws-constructs',
    'constructs',
    'aws-billing',
    'billing',
    'billing-alarm',
    'aws-organizations',
    'cloudwatch',
    'cloudwatch-alarms',
    'sns',
  ],
  license: 'MIT',
  copyrightOwner: 'Spacecomx LLC',
  projectType: ProjectType.LIB,

  cdkVersion: AWS_CDK_VERSION,
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-sns',
    '@aws-cdk/aws-secretsmanager',
  ],

  deps: ['@spacecomx/cdk-billing-alarm'],
  peerDeps: ['@spacecomx/cdk-billing-alarm'],

  release: RELEASE_STATUS,
  defaultReleaseBranch: RELEASE_BRANCH,
  prerelease: PRE_RELEASE,
  majorVersion: MAYOR_VERSION,

  releaseToNpm: RELEASE_TO_NPM,
  npmAccess: NpmAccess.PUBLIC,
});

const exclude = [
  'cdk.out',
  'cdk.context.json',
  'yarn-error.log',
  'dependabot.yml',
  '.env',
];

project.gitignore.exclude(...exclude);
project.npmignore.exclude(...exclude);

project.synth();
