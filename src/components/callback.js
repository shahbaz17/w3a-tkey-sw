import { UserContext } from './../lib/UserContext';
import { WalletContext } from '../lib/WalletContext';
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { torus, tKey } from '../lib/web3auth';
import Loading from './loading';

const Callback = () => {
	const navigate = useNavigate();
	const [, setUser] = useContext(UserContext);
	const [, setWallet] = useContext(WalletContext);

	useEffect(() => {
		const init = async () => {
			try {
				// const loginDetails = await torus.getRedirectResult(); // For CustomAuth SDK
				// console.log(loginDetails);
				console.log('Callback page');
				console.log(tKey.serviceProvider);
				console.log(tKey.serviceProvider.postboxKey.toString('hex'));
				const loginDetails =
					await tKey.serviceProvider.directWeb.getRedirectResult(); // with tKey SDK
				console.log('Login Details', loginDetails);
				// await tKey.initialize();
				if (loginDetails?.method === 'triggerLogin') {
					setUser(loginDetails.result?.userInfo);
					setWallet(loginDetails.result);
					navigate('/profile');
				}
			} catch (error) {
				// navigate('/login');
			}
		};
		init();
	}, [navigate, setUser, setWallet]);

	return <Loading />;
};

export default Callback;
