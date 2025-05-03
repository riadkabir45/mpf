import React, { useEffect, useState } from 'react';
import PageHolder from './PageHolder';
import { useEth } from '../contexts/EthContext';

function UserManager() {
    const { state: { contract, accounts } } = useEth();
    const [tableData, setTableData] = useState([]);

    useEffect(() => {

        const test = async () => {
            if (contract) {
                const td = []
                const users = await contract.methods.getAllAddresses().call();
                for (let i = 0; i < users.length; i++) {
                    td.push(await contract.methods.getUser(users[i]).call());
                }
                console.log(td);
                setTableData(td);

            }

        }

        test();
    }, [contract])

    const handleRoleChange = async (index, userAddr) => {
        console.log(userAddr, index);
        await contract.methods.changeRole(userAddr, index).send({ from: accounts[0] });
    }

    return (
        <PageHolder><table className="table">
            <thead className="thead-dark">
                <tr>
                    <th>Address</th>
                    <th>Name</th>
                    <th>NID</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map(user => (
                    <tr key={user[0]}>
                        <td>{user[0]}</td>
                        <td>{user[1]}</td>
                        <td>{user[2]}</td>
                        <td>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {user[3] == 0 ? "Admin" : user[3] == 1 ? "Reporter" : "Investigator"}
                                </button>
                                <ul className="dropdown-menu">
                                    {['Admin', 'Reporter', 'Investigator'].map((element, index) => (
                                        user[3] != index ? (
                                            <React.Fragment key={index}>
                                                <li onClick={() => handleRoleChange(index, user[0])} ><a className="dropdown-item">{element}</a></li>
                                            </React.Fragment>
                                        ) : null
                                    ))}
                                </ul>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </PageHolder>
    );
}

export default UserManager;