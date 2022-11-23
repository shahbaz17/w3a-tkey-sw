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
		if (!user) {
			navigate('/login');
		}
		console.log('User info on profile', user);
		const tKeyUtil = async () => {
			console.log(tKey);
			console.log(tKey.getApi());
			console.log(tKey.serviceProvider.postboxKey.toString('hex'));
			console.log(await tKey.initialize());
			// console.log(await tKey.outputShare());
			//await tKey.initialize();
		};
		tKeyUtil();
	}, [user, navigate]);

	return (
		<>
			{!user ? (
				<Loading />
			) : (
				user?.email && (
					<>
						<div>
							<img src={user.profileImage} alt='Avatar' />
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
