const {
  AwsCdkConstructLibrary,
  ProjectType,
  NpmAccess,
  DependenciesUpgradeMechanism,
} = require('projen');

const RELEASE_STATUS = true;
const RELEASE_BRANCH = 'main';
const PRE_RELEASE = '';
const MAYOR_VERSION = 1;
const RELEASE_TO_NPM = true;
const AWS_CDK_VERSION = '1.121.0';
const AUTOMATION_TOKEN = 'GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  name: 'cdk-organization-billing-alarm',
  packageName: '@spacecomx/cdk-organization-billing-alarm',
  description:
    'Multi-account CDK construct to monitor estimated billing charges with alerts and notifications for a AWS Organization. It gives you the capability to monitor specific AWS Service charges, by a linked AWS account in a master/payer account',
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
    'aws-cloudwatch',
    'cloudwatch-alarms',
    'sns',
    'spacecomx',
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

  publishToPypi: {
    distName: 'spacecomx.cdk-organization-billing-alarm',
    module: 'spacecomx.cdk_organization_billing-alarm',
  },

  depsUpgrade: DependenciesUpgradeMechanism.githubWorkflow({
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: AUTOMATION_TOKEN,
    },
  }),
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['waynegibson'],
  },
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
