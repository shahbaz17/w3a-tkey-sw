import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from './components/home';
import Login from './components/login';
import Profile from './components/profile';
import Modules from './components/modules';
import Wallet from './components/wallet';
import Callback from './components/callback';
import Layout from './components/layout';
// import { torus } from './lib/web3auth';
import { UserContext } from './lib/UserContext';
import { WalletContext } from './lib/WalletContext';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

function App() {
	const [user, setUser] = useState();
	const [wallet, setWallet] = useState();
	useEffect(() => {
		const init = async () => {
			// await torus.init({ skipSw: true });
		};
		init();
	}, []);

	return (
		<Router>
			<UserContext.Provider value={[user, setUser] as any}>
				<WalletContext.Provider value={[wallet, setWallet] as any}>
					<Layout>
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/login' element={<Login />} />
							<Route path='/profile' element={<Profile />} />
							<Route path='/modules' element={<Modules />} />
							<Route path='/wallet' element={<Wallet />} />
							<Route path='/callback' element={<Callback />} />
						</Routes>
					</Layout>
				</WalletContext.Provider>
			</UserContext.Provider>
		</Router>
	);
}

export default App;
