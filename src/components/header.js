import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../lib/UserContext';

const Header = () => {
	const navigate = useNavigate();
	const [user, setUser] = useContext(UserContext);

	const logout = () => {
		setUser(null);
		navigate('/login');
	};

	return (
		<header>
			<nav>
				<ul>
					{user?.email ? (
						<>
							<li>
								<button onClick={() => navigate('/')}>Home</button>
							</li>
							<li>
								<button onClick={() => navigate('/profile')}>Profile</button>
							</li>
							<li>
								<button onClick={() => navigate('/modules')}>tKey</button>
							</li>
							<li>
								<button onClick={() => navigate('/wallet')}>Wallet</button>
							</li>
							<li>
								<button className='logout' onClick={logout}>
									Logout
								</button>
							</li>
						</>
					) : (
						<li>
							<button onClick={() => navigate('/login')}>Login</button>
						</li>
					)}
				</ul>
			</nav>
			<style>{`
        nav {
          max-width: 45rem;
          margin: 0 auto 50px;
          padding: 1.25rem 1.25rem;
          border-bottom: 1px solid #f0f0f0;
        }
        ul {
          display: flex;
          list-style: none;
        }
        li {
          margin-right: 1.5rem;
          line-height: 38px;
        }
        li:first-child {
          margin-left: auto;
        }
        .logout{
          color: #ff6961;
          border: 1px solid #ff6961;
        }
        .logout:hover{
          background: #ff6961;
        }
      `}</style>
		</header>
	);
};

export default Header;
