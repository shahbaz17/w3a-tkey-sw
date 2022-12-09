import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../lib/UserContext';
import Loading from './loading';
import { tKey } from '../lib/web3auth';

const Modules = () => {
	const navigate = useNavigate();
	const [user] = useContext(UserContext);

	// Redirect to login page if not loading and no user found
	useEffect(() => {
		// console.log(tKey);
		if (!user) {
			navigate('/login');
		}
		// console.log('User info on profile', user);
		const tKeyUtil = async () => {
			// console.log(tKey);
			// console.log(tKey.serviceProvider.postboxKey.toString('hex'));
			// const importKey = new BN(
			// 	'9275f976cb2c16f6019dcffbc87bf171cff52226b2919a385a8de286bffde8a1',
			// 	'hex',
			// );

			// const postboxKey = tKey.serviceProvider.postboxKey.toString('hex');
			// console.log('postboxKey', postboxKey);

			// const shareStore = await tKey.storageLayer.getMetadata({
			// 	privKey: postboxKey,
			// });
			// console.log('shareStore', shareStore);

			console.log(await tKey.initialize()); // 1st Share

			// console.log(await tKey.initialize({ withShare: shareStore })); // with shareStore
			// console.log(await tKey._initializeNewKey({ importKey })); // Technically 2nd Share

			// const indexes = await tKey.getCurrentShareIndexes();
			// console.log('Total number of available shares: ' + indexes.length);

			// const deviceShare = await tKey.modules.webStorage.getDeviceShare();
			// console.log('DeviceShare from WebStorage', deviceShare);		
			
			// const checkQuestion = await tKey.modules.securityQuestions.getSecurityQuestions();
			// console.log(checkQuestion)
			// const checkAnswer = await tKey.modules.securityQuestions.getAnswer();
			// console.log(checkAnswer)

			// console.log(
			// 	await tKey.modules.webStorage.storeDeviceShareOnFileStorage(
			// 		deviceShare.share.shareIndex,
			// 	),
			// );
			// console.log(await tKey.modules.webStorage); // Get the deviceShare, 2/2 Share

			await tKey.modules.webStorage.inputShareFromWebStorage();

			// await inputShareFromSecurityQuestions(); // <--- Input Security Question Share can also be used here to insert.

			const { requiredShares } = tKey.getKeyDetails();
			console.log('requiredShares', requiredShares);

			// They can generate a securityQuestions for the next logins and input here as 2nd Share.
			// await tKey.modules.securityQuestions.inputShareFromSecurityQuestions(
			// 	'QWERTY@123',
			// );

			// console.log(await tKey.reconstructKey());
			if (requiredShares <= 0) {
				const reconstructedKey = await tKey.reconstructKey();
				console.log('tKey: ' + reconstructedKey.privKey.toString('hex'));
			}

			// const res = await tKey._initializeNewKey({ initializeModules: true });
			// console.log('response from _initializeNewKey', res);
			// console.log(await tKey.reconstructKey());

			//await tKey.initialize();
		};
		tKeyUtil();
	}, [navigate, user]);

	// Security Questions Modules
	const generateNewShareWithSecurityQuestions = async () => {
		try {
			await tKey.modules.securityQuestions.generateNewShareWithSecurityQuestions(
				'QWERTY@12345',
				'What is your password?',
			);
			// const indexes = await tKey.getCurrentShareIndexes();
			// console.log(
			// 	'Total number of available shares after Share C: ' + indexes.length,
			// );
			console.log(await tKey.reconstructKey());
		} catch (error) {
			console.error(error);
		}
	};

	const changeQuestionAnswer = async () => {
		try {
			await tKey.modules.securityQuestions.changeSecurityQuestionAndAnswer(
				'Shahbaz',
				'What is your name?',
			);
			// const indexes = await tKey.getCurrentShareIndexes();
			// console.log(
			// 	'Total number of available shares after changing security question and answer: ' + indexes.length,
			// );
			console.log(await tKey.reconstructKey());
		} catch (error) {
			console.error(error);
		}
	};

	// Not working, can be checked calling getAnswer()
	const saveAnswerOnTkeyStore = async () => {
		try {
			await tKey.modules.securityQuestions.saveAnswerOnTkeyStore(
				'Shahbaz',
			);
		} catch (error) {
			console.error(error);
		}
	};

	const getQuestion = async () => {
		try {
			const result = await tKey.modules.securityQuestions.getSecurityQuestions();
			console.log(result)
		} catch (error) {
			console.error(error);
		}
	};

	// Not working
	const getAnswer = async () => {
		try {
			const result = await tKey.modules.securityQuestions.getAnswer();
			console.log(result)
		} catch (error) {
			console.error(error);
		}
	};

	const inputShareFromSecurityQuestions = async () => {
		try {
			await tKey.modules.securityQuestions.inputShareFromSecurityQuestions('Shahbaz');
			await reconstructKey();
		} catch (error) {
			console.error(error);
		}
	};

	// Core
	const reconstructKey = async() => {
		await initializeKey();
		console.log(await tKey.reconstructKey());
	}

	const initializeKey = async() => {
		console.log(await tKey.initialize());
	}

	const generateNewShare = async () => {
		const val = await tKey.generateNewShare();
		console.log(val);
		const newVal = await tKey.outputShare(val.newShareIndex);
		console.log(newVal);
		const indexes = await tKey.getCurrentShareIndexes();
		console.log(
			'Total number of available shares after Share B: ' + indexes.length,
		);
		await tKey.reconstructKey();
	};

	const outputShareStore = async () => {
		const index = await tKey.getCurrentShareIndexes();
		console.log(index);
		const result = await tKey.outputShareStore(index[0]);
		console.log(result);
		return result;
	};

	const inputShareStoreSafe = async () => {
		const shareStore = await outputShareStore();
		console.log(await tKey.inputShareStoreSafe(shareStore));
	};

	const outputShare = async () => {
		const index = await tKey.getCurrentShareIndexes();
		// console.log(index);
		const result = await tKey.outputShare(index[0])
		console.log(result);
		return result;
	};

	const inputShare = async () => {
		const share = await outputShare();
		// console.log(share)
		console.log(await tKey.inputShare(share));
	};

	// Upon deleting the share, subsequent logins will through error: Share was deleted.
	const deleteShare = async () => {
		const index = await tKey.getCurrentShareIndexes();
		console.log(index)
		console.log(await tKey.deleteShare(index[6]));
	};

	// Web Storage Module
	const getDeviceShare = async() => {
		const result = await tKey.modules.webStorage.getDeviceShare();
		console.log(result);
		return result;
	}

	const storeDeviceShare = async() => {
		const deviceShare = await getDeviceShare()
		await tKey.modules.webStorage.storeDeviceShare(deviceShare);
	}

	const inputShareFromWebStorage = async() => {
		await tKey.modules.webStorage.inputShareFromWebStorage();
	}

	// Share Transfer Module
	const requestNewShare = async () => {
		console.log('In getKeyDetails', await tKey.getKeyDetails());
		const result_requestNewShare =
			await tKey.modules.shareTransfer.requestNewShare(
				navigator.userAgent,
				tKey.getCurrentShareIndexes(),
			);
		console.log('result_requestNewShare', result_requestNewShare);
		const result_getShareTransfer =
			await tKey.modules.shareTransfer.getShareTransferStore();
		console.log('result_getShareTransfer', result_getShareTransfer);
		const requests = await tKey.modules.shareTransfer.lookForRequests();
		console.log('requests', requests);
		let shareToShare;
		try {
			shareToShare = await tKey.modules.webStorage.getDeviceShare();
		} catch (err) {
			console.error('No on device share found. Generating a new share');
			const newShare = await tKey.generateNewShare();
			shareToShare =
				newShare.newShareStores[newShare.newShareIndex.toString('hex')];
		}
		console.log('shareToShare', shareToShare);

		await tKey.modules.shareTransfer.approveRequest(requests[0], shareToShare);

		console.log('Out getKeyDetails', await tKey.getKeyDetails());
	};

	// Share Serialization Module
	const getSeedFromShare = async () => {
		// const shareCreated = await tKey.generateNewShare();
		// console.log(shareCreated)
		const deviceShare = await getDeviceShare();
		// const requiredShareStore = shareCreated.newShareStores[shareCreated.newShareIndex.toString('hex')];
		// remember to include it in initialization modules
		console.log(deviceShare.share.share)
		console.log(deviceShare.share.share.toString('hex'));
		const serializedShare = await tKey.modules.shareSerialization.serialize(
			deviceShare.share.share,
			'mnemonic',
		);
		console.log(serializedShare);
		return serializedShare;
		// Now, this serializedShare is a mnemonic which you can display to user/send mail
	};

	const getShareFromSeed = async() => {
		const serializedShare = await getSeedFromShare();
		const share = await tKey.modules.shareSerialization.deserialize(
			serializedShare,
			'mnemonic',
		);
		console.log(share);
		console.log(share.toString('hex'));
	}

	return (
		<>
			{!user ? (
				<Loading />
			) : (
				user?.email && (
					<>
						<div className='label'>Verifier</div>
						<div className='profile-info'>{user.verifier}</div>
						<div className='label'>Core</div>
						<button onClick={reconstructKey}>
							Reconstruct tKey ( calling initialize() internally )
						</button>
						<button onClick={generateNewShare}>
							generateNewShare (Share B)
						</button>
						<button onClick={outputShareStore}>
							Output Share Store
						</button>
						<button className='not-sure' onClick={inputShareStoreSafe}>
							Input Share Store Safe
						</button>
						<button onClick={outputShare}>
							Output Share
						</button>
						<button className='not-sure' onClick={inputShare}>
							Input Share
						</button>
						<button onClick={deleteShare}>
							Delete Share [ShareIndex = 6]
						</button>
						<hr />
						<div className='label'>Security Questions Modules</div>
						<button className='one-time-use' onClick={generateNewShareWithSecurityQuestions}>
							Generate share with password (Share C) - OneTimeUse
						</button>
						<button onClick={changeQuestionAnswer}>
							Change Question Answer (Share C)
						</button>
						<button onClick={getQuestion}>
							Get Question (Share C)
						</button>
						<button onClick={inputShareFromSecurityQuestions}>
							inputShareFromSecurityQuestions (Share C)
						</button>
						<button className='not-working' onClick={getAnswer}>
							Get Answer (Share C)
						</button>
						<button className='not-working' onClick={saveAnswerOnTkeyStore}>
							saveAnswerOnTkeyStore (Share C)
						</button>
						<hr />
						<div className='label'>Web Storage Module</div>
						<button onClick={getDeviceShare}>Get Device Share</button>
						<button onClick={storeDeviceShare}>Store Device Share</button>
						<button onClick={inputShareFromWebStorage}>Input Share From Web Storage</button>
						<hr />
						<div className='label'>Share Serialization Module</div>
						<button onClick={getSeedFromShare}>Get Seed from Share</button>
						<button onClick={getShareFromSeed}>Get Share from Share</button>
						<hr />
						<div className='label'>Share Transfer Module</div>
						<button onClick={requestNewShare}>requestNewShare (Share C)</button>
					</>
				)
			)}
			<style>{`
        .label {
          font-size: 16px;
          color: #0364ff;
          margin: 10px 0 5px;
        }
		.not-working{
			color: red;
			border-color: red;
		}
		.not-working:hover{
			color: white;
			background: red;
		}
		.one-time-use{
			color: orange;
			border-color: orange;
		}
		.one-time-use:hover{
			color: white;
			background: orange;
		}
		.not-sure{
			color: gray;
			border-color: gray;
		}
		.not-sure:hover{
			color: white;
			background: gray;
		}
      `}</style>
		</>
	);
};

export default Modules;
