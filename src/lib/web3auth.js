import CustomAuth from '@toruslabs/customauth';
import ThresholdKey from '@tkey/default';
import WebStorageModule from '@tkey/web-storage';
import SecurityQuestionsModule from '@tkey/security-questions';
import ShareTransferModule from '@tkey/share-transfer';
// import TorusServiceProvider from '@tkey/service-provider-torus';
// import TorusStorageLayer from '@tkey/storage-layer-torus';

const customAuthArgs = {
	baseUrl: `${process.env.REACT_APP_BASE_URL}/serviceworker`,
	// redirectPathName: 'callback',
	network: 'testnet',
	uxMode: 'popup', // popup, redirect
	enableLogging: true,
	networkUrl:
		'https://small-long-brook.ropsten.quiknode.pro/e2fd2eb01412e80623787d1c40094465aa67624a',
};

const webStorageModule = new WebStorageModule();
const securityQuestionsModule = new SecurityQuestionsModule();
const shareTransferModule = new ShareTransferModule();

// export const serviceProvider = new TorusServiceProvider({
// 	customAuthArgs,
// });
// const storageLayer = new TorusStorageLayer({
// 	hostUrl: 'https://metadata.tor.us',
// });

export const torus = new CustomAuth(customAuthArgs);
// await torus.init({ skipSw: true });

export const tKey = new ThresholdKey({
	enableLogging: true,
	// serviceProvider: serviceProvider,
	// storageLayer: storageLayer,
	modules: {
		webStorage: webStorageModule,
		securityQuestions: securityQuestionsModule,
		shareTransfer: shareTransferModule,
	}, // For 2/2 flow.
	customAuthArgs,
});
