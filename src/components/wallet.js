import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from '../lib/WalletContext';
import Loading from './loading';

const Wallet = () => {
	const navigate = useNavigate();
	const [wallet] = useContext(WalletContext);

	// Redirect to login page if not loading and no user found
	useEffect(() => {
		if (!wallet) {
			navigate('/login');
		}
	}, [wallet, navigate]);

	return (
		<>
			{!wallet ? (
				<Loading />
			) : (
				wallet?.publicAddress && (
					<>
						<div className='label'>ETH Address</div>
						<div className='profile-info'>{wallet.publicAddress}</div>
						<div className='label'>Pub Key X</div>
						<div className='profile-info'>{wallet.pubKey.pub_key_X}</div>
						<div className='label'>Pub Key Y</div>
						<div className='profile-info'>{wallet.pubKey.pub_key_Y}</div>
						<div className='label private-key'>Private Key</div>
						<div className='profile-info private-key'>{wallet.privateKey}</div>
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
        .private-key{
          color: #ff6961;
        }
      `}</style>
		</>
	);
};

export default Wallet;
