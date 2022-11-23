import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../lib/UserContext';
import Loading from './loading';
import { tKey } from '../lib/web3auth';

const Profile = () => {
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
			console.log(await tKey.initialize()); // 1st Share

			const indexes = await tKey.getCurrentShareIndexes();
			console.log('Total number of available shares: ' + indexes.length);

			// console.log(await tKey.modules.webStorage); // Get the deviceShare
			await tKey.modules.webStorage.inputShareFromWebStorage();

			// Input 2nd Share
			//const webStorageModule = tKey.modules['webStorage'];
			//await webStorageModule.inputShareFromWebStorage();
			// console.log(await tKey.modules.webStorage.inputShareFromWebStorage());

			// console.log(await tKey.reconstructKey());
			const reconstructedKey = await tKey.reconstructKey();
			console.log('tkey: ' + reconstructedKey.privKey.toString('hex'));

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
				'QWERTY@123',
				'whats your new password?',
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

	const generateNewShare = async () => {
		console.log(await tKey.generateNewShare());
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

	return (
		<>
			{!user ? (
				<Loading />
			) : (
				user?.email && (
					<>
						<div>
							<img
								src={
									user.profileImage
										? user.profileImage
										: 'https://images.web3auth.io/web3auth-logo-w.svg'
								}
								alt='Avatar'
							/>
						</div>
						<div className='label'>Name</div>
						<div className='profile-info'>{user.email}</div>
						<div className='label'>Email ID</div>
						<div className='profile-info'>{user.name}</div>
						<div className='label'>Verifier</div>
						<div className='profile-info'>{user.verifier}</div>
						<div className='label'>Type of Login</div>
						<div className='profile-info'>{user.typeOfLogin}</div>
						<div className='label'>ID Token</div>
						<div className='profile-info'>{user.idToken}</div>
						<div className='label'>Generating New Share</div>
						<button onClick={generateNewShareWithSecurityQuestions}>
							Generate share with password (Share C)
						</button>
						<button onClick={generateNewShare}>
							generateNewShare (Share A/B)
						</button>
						<button onClick={requestNewShare}>requestNewShare (Share C)</button>
						<button onClick={outputShareStore}>
							Output Share Store (Share B)
						</button>
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
      `}</style>
		</>
	);
};

export default Profile;
