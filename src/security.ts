import { getInstalledVersion } from './get-version';
import { getNodeList } from './fetch-node-versions';
import { ILogMessage, INodeVersion } from './const';
import { logMessages } from './log-messages';

export const hasNodeVersionSecurity = (nodeList: INodeVersion[], usedNodeVersion: string) => {
	return nodeList.some((nodeVersion) => {
		return nodeVersion.version.slice(1) === usedNodeVersion && nodeVersion.security !== false;
	});
};

export const getSecurityNodeLog = async (usedNodeVersion: string) => {
	const nodeList = await getNodeList('security');
	if (nodeList.error) {
		return { error: false, text: nodeList.text };
	}

	return hasNodeVersionSecurity(JSON.parse(nodeList.text), usedNodeVersion)
		? { error: false, text: logMessages.success.nodeVersionSecurity(usedNodeVersion) }
		: { error: true, text: logMessages.error.nodeVersionNotSecurityError(usedNodeVersion) };
};

export const getNodeSecurityChecker = async () => {
	const usedNodeVersion: ILogMessage = await getInstalledVersion('node');
	return usedNodeVersion.error ? usedNodeVersion : getSecurityNodeLog(usedNodeVersion.text);
};
