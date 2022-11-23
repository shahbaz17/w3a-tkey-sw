import CustomAuth from '@toruslabs/customauth';
import ThresholdKey from '@tkey/default';
import WebStorageModule from '@tkey/web-storage';
import TorusServiceProvider from '@tkey/service-provider-torus';

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
export const serviceProvider = new TorusServiceProvider({
	customAuthArgs,
});

export const torus = new CustomAuth(customAuthArgs);
// await torus.init({ skipSw: true });

export const tKey = new ThresholdKey({
	enableLogging: true,
	serviceProvider: serviceProvider,
	modules: { webStorage: webStorageModule }, // For 2/2 flow.
	customAuthArgs,
});
