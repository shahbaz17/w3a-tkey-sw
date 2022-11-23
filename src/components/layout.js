import Header from './header';

const Layout = props => (
	<>
		<Header />
		<main>
			<div className='container'>{props.children}</div>
		</main>
		<style>{`
      * {
        font-family: sans-serif !important;
        outline: none;
      }
      .container {
        max-width: 42rem;
        margin: 0 auto;
        padding: 0 10px;
      }
      button{
        margin: 0.5rem;
        padding: 0.7rem;
        text-align: center;
        color: #0070f3;
        background-color: #fafafa;
        text-decoration: none;
        border: 1px solid #0070f3;
        border-radius: 10px;
        transition: color 0.15s ease, border-color 0.15s ease;
        width: 100%;
      }
      button:hover,
      button:focus,
      button:active{
        cursor: pointer;
        color: #fafafa;
	      background-color: #0070f3;
      }
    `}</style>
	</>
);

export default Layout;
