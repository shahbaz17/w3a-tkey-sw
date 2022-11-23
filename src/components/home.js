import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../lib/UserContext';

const Home = () => {
	const navigate = useNavigate();
	const [user] = useContext(UserContext);

	// Redirect to login page if not loading and no user found
	useEffect(() => {
		if (user) {
			// console.log(user);
		} else {
			navigate('/login');
		}
	}, [user, navigate]);

	return (
		<>
			{user?.email && (
				<>
					<div>
						You're logged in with{' '}
						<a href='https://web3auth.io' target='blank'>
							Web3Auth
						</a>{' '}
						{user.name}!
					</div>
				</>
			)}
			<style>{`
        a{
          text-decoration: none;
        }
      `}</style>
		</>
	);
};

export default Home;
