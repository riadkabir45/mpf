import React, { useEffect, useState } from 'react';
import PageHolder from './PageHolder';
import { useEth } from '../contexts/EthContext';

function InvestigationManager() {
    const { state: { userManagerContract, investigationManagerContract, accounts } } = useEth();
    const [tableData, setTableData] = useState([]);

    useEffect(() => {

        const test = async () => {
            if (userManagerContract && investigationManagerContract) {
                const td = []
                const users = await investigationManagerContract.methods.getInvestigators().call();
                for (let i = 0; i < users.length; i++) {
                    td.push(await userManagerContract.methods.getUser(users[i]).call());
                }
                setTableData(td);

            }

        }
        test();
    }, [userManagerContract, investigationManagerContract])

    const handleRoleChange = async (index, userAddr) => {
        console.log(userAddr, index);
        await userManagerContract.methods.changeRole(userAddr, index).send({ from: accounts[0] });
    }

    return (
        <PageHolder><table className="table">
            <thead className="thead-dark">
                <tr>
                    <th>Address</th>
                    <th>Name</th>
                    <th>Slot 1</th>
                    <th>Slot 2</th>
                </tr>
            </thead>
            <tbody>
                {tableData.filter(function (user) {
                    return user[3] == 2;
                }).map(user => (
                    <tr key={user[0]}>
                        <td>{user[0]}</td>
                        <td>{user[1]}</td>
                        <td><button className="btn btn-secondary">Assign</button></td>
                        <td><button className="btn btn-secondary">Assign</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </PageHolder>
    );
}

export default InvestigationManager;