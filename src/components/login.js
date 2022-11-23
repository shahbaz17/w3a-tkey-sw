import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { torus, tKey, serviceProvider } from '../lib/web3auth';
import { UserContext } from '../lib/UserContext';
import { WalletContext } from '../lib/WalletContext';
import Loading from './loading';

const Login = () => {
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const navigate = useNavigate();
	const [user, setUser] = useContext(UserContext);
	const [, setWallet] = useContext(WalletContext);

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
		const init = async () => {
			// await torus.init({ skipSw: true }); // with CustomAuth SDK
			await serviceProvider.init({ skipSw: false }); // with tKey SDK
		};
		init();
	}, [user, navigate]);

	const googleLogin = async () => {
		setIsLoggingIn(true);

		const loginParams = {
			typeOfLogin: 'google',
			verifier: 'web3auth-core-google',
			clientId:
				'774338308167-q463s7kpvja16l4l0kko3nb925ikds2p.apps.googleusercontent.com',
		};

		try {
			// await torus.triggerLogin(loginParams);
			const res = await serviceProvider.triggerLogin(loginParams);
			console.log('Login Response in Sample', res);
			console.log('Private Key', res.privateKey);
			setUser(res.userInfo);
			setWallet(res);
			navigate('/profile');
		} catch {
			setIsLoggingIn(false);
		}
	};

	return (
		<>
			{isLoggingIn ? (
				<Loading />
			) : (
				<div>
					<button onClick={googleLogin} disabled={isLoggingIn}>
						Login with Google
					</button>
					<h5>Using tKey SDK</h5>
				</div>
			)}
		</>
	);
};

export default Login;
