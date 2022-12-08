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

			const { requiredShares } = tKey.getKeyDetails();
			console.log('requiredShares', requiredShares);

			const deviceShare = await tKey.modules.webStorage.getDeviceShare();
			console.log('DeviceShare from WebStorage', deviceShare);		
			
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

			// They can generate a securityQuestions for the next logins and input here as 2nd Share.
			// await tKey.modules.securityQuestions.inputShareFromSecurityQuestions(
			// 	'QWERTY@123',
			// );

			// console.log(await tKey.reconstructKey());
			if (requiredShares === 0) {
				const reconstructedKey = await tKey.reconstructKey();
				console.log('tkey: ' + reconstructedKey.privKey.toString('hex'));
			}

			// const res = await tKey._initializeNewKey({ initializeModules: true });
			// console.log('response from _initializeNewKey', res);
			// console.log(await tKey.reconstructKey());

			//await tKey.initialize();
		};
		tKeyUtil();
	}, [navigate, user]);

	const generateNewShareWithSecurityQuestions = async () => {
		try {
			await tKey.modules.securityQuestions.generateNewShareWithSecurityQuestions(
				'Shahbaz',
				'What is your name?',
			);
			const indexes = await tKey.getCurrentShareIndexes();
			console.log(
				'Total number of available shares after Share C: ' + indexes.length,
			);
			await tKey.reconstructKey();
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
			const indexes = await tKey.getCurrentShareIndexes();
			console.log(
				'Total number of available shares after changing security question and answer: ' + indexes.length,
			);
			await tKey.reconstructKey();
			await saveAnswerOnTkeyStore();
		} catch (error) {
			console.error(error);
		}
	};

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

	const getAnswer = async () => {
		try {
			const result = await tKey.modules.securityQuestions.getAnswer();
			console.log(result)
		} catch (error) {
			console.error(error);
		}
	};

	const generateNewShare = async () => {
		const val = await tKey.generateNewShare();
		console.log(val);
		const newval = await tKey.outputShare(val.newShareIndex);
		console.log(newval);
		const indexes = await tKey.getCurrentShareIndexes();
		console.log(
			'Total number of available shares after Share A/B: ' + indexes.length,
		);
		await tKey.reconstructKey();
	};

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

	const outputShareStore = async () => {
		const index = await tKey.getCurrentShareIndexes();
		console.log(index);
		console.log(await tKey.outputShareStore(index[1]));
	};

	const getSeedFromShare = async () => {
		const shareCreated = await tKey.generateNewShare();
		const requiredShareStore =
			shareCreated.newShareStores[shareCreated.newShareIndex.toString('hex')];
		// remember to include in initializtion modules
		const serializedShare = await tKey.modules.shareSerialization.serialize(
			requiredShareStore.share.share,
			'mnemonic',
		);
		console.log(serializedShare);
		// Now, this serializedShare is a mnemonic which you can display to user/send mail
	};

	return (
		<>
			{!user ? (
				<Loading />
			) : (
				user?.email && (
					<>
						<div className='label'>Verifier</div>
						<div className='profile-info'>{user.verifier}</div>
						<div className='label'>Security Questions Modules</div>
						
						<button onClick={generateNewShareWithSecurityQuestions}>
							Generate share with password (Share C)
						</button>
						<button onClick={changeQuestionAnswer}>
							Change Question Answer (Share C)
						</button>
						<button onClick={getQuestion}>
							Get Question (Share C)
						</button>
						<button className='not-working' onClick={getAnswer}>
							Get Answer (Share C)
						</button>
						<button className='not-working' onClick={saveAnswerOnTkeyStore}>
							saveAnswerOnTkeyStore (Share C)
						</button>
						<div className='label'>Core</div>
						<button onClick={generateNewShare}>
							generateNewShare (Share A/B)
						</button>
						<button onClick={requestNewShare}>requestNewShare (Share C)</button>
						<button onClick={outputShareStore}>
							Output Share Store (Share B)
						</button>
						<div className='label'>Seed Phrase Module</div>
						<button onClick={getSeedFromShare}>Get Seed from Share</button>
					</>
				)
			)}
			<style>{`
        .label {
          font-size: 12px;
          color: #0364ff;
          margin: 10px 0 5px;
        }
        .profile-info {
          font-size: 15px;
          word-wrap: break-word;
        }
        img{
          border-radius: 50%;
        }
		.not-working{
			color: red;
			border-color: red;
		}
		.not-working:hover{
			color: white;
			background: red;
		}
      `}</style>
		</>
	);
};

export default Modules;
