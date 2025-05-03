import PageHolder from "./PageHolder";
import { useEth } from "../contexts/EthContext";

function Login() {
    const { state: { contract, accounts } } = useEth();

    const handleLogin = async (event) => {
        const user = await contract.methods.userExists(accounts[0]).call();
        if (user) localStorage.setItem('userSession', accounts[0]);
        console.log(user);
    }

    return (
        <PageHolder className='d-flex flex-column gap-2'>
            <h1>Log in to MPF</h1>
            <button onClick={handleLogin} className="btn btn-primary">Login</button>
        </PageHolder>
    );
}

export default Login;