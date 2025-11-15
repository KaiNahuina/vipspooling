/**
 * CloudFormation Trigger Handler
 */

const response = require('cfn-response'); // required for CFN custom resources

const moduleNames = process.env.MODULES.split(',');
const modules = moduleNames.map((name) => require(`./${name}`));

exports.handler = async (event, context) => {
  const isCfnEvent =
    event.RequestType === 'Create' ||
    event.RequestType === 'Update' ||
    event.RequestType === 'Delete';

  if (isCfnEvent) {
    try {
      await Promise.all(modules.map((module) => module.handler(event, context)));

      // Tell CloudFormation we succeeded
      response.send(event, context, response.SUCCESS, {});
    } catch (err) {
      console.error('CFN Trigger Failed', err);

      // Tell CloudFormation we failed
      response.send(event, context, response.FAILED, { error: err.message });
    }
    return;
  }

  // Normal Cognito invocation
  await Promise.all(modules.map((module) => module.handler(event, context)));
  return event;
};
