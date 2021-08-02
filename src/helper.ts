import { ISecret, Secret } from '@aws-cdk/aws-secretsmanager';
import { Construct } from '@aws-cdk/core';

/**
 * Import secret from name.
 *
 * @param name
 * @returns ISecret
 */
export const importSecretFromName = (app: Construct, name: string): string => {
  const { secretValue }: ISecret = Secret.fromSecretNameV2(app, 'SecretFromName', name);

  return secretValue.toString();
};