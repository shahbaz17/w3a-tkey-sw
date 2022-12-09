// import CustomAuth from '@toruslabs/customauth';
import ThresholdKey from '@tkey/default';
import WebStorageModule from '@tkey/web-storage';
import SecurityQuestionsModule from '@tkey/security-questions';
import ShareTransferModule from '@tkey/share-transfer';
// import TorusServiceProvider from '@tkey/service-provider-torus';
// import TorusStorageLayer from '@tkey/storage-layer-torus';
import PrivateKeyModule, {SECP256K1Format, ED25519Format} from "@tkey/private-keys";
import SeedPhraseModule, {MetamaskSeedPhraseFormat} from "@tkey/seed-phrase";

const customAuthArgs = {
	// baseUrl: `${process.env.REACT_APP_BASE_URL}/serviceworker`,
	baseUrl: `${window.location.origin}/serviceworker`,
	network: 'testnet',
	// redirectPathName: 'callback',
	// uxMode: 'popup', // popup, redirect
	// enableLogging: true,
	networkUrl: 'https://small-long-brook.ropsten.quiknode.pro/e2fd2eb01412e80623787d1c40094465aa67624a',
};

const webStorageModule = new WebStorageModule();
const securityQuestionsModule = new SecurityQuestionsModule();
const shareTransferModule = new ShareTransferModule();
const privateKeyModule = new PrivateKeyModule([SECP256K1Format, ED25519Format]);
const seedPhraseModule = new SeedPhraseModule([MetamaskSeedPhraseFormat]);

// export const serviceProvider = new TorusServiceProvider({
// 	customAuthArgs,
// });
// const storageLayer = new TorusStorageLayer({
// 	hostUrl: 'https://metadata.tor.us',
// });

// export const torus = new CustomAuth(customAuthArgs);
// await torus.init({ skipSw: true });

export const tKey = new ThresholdKey({
	enableLogging: true,
	// serviceProvider: serviceProvider,
	// storageLayer: storageLayer,
	modules: {
		webStorage: webStorageModule,
		securityQuestions: securityQuestionsModule,
		shareTransfer: shareTransferModule,
		privateKeyModule: privateKeyModule,
		seedPhraseModule: seedPhraseModule,
	}, // For 2/2 flow.
	customAuthArgs,
});
