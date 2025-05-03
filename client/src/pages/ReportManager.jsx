import React, { useEffect, useState } from 'react';
import PageHolder from './PageHolder';
import { useEth } from '../contexts/EthContext';

function ReportManager() {
    const { state: { web3, reportManagerContract, accounts } } = useEth();
    const [tableData, setTableData] = useState([]);
    const ReportStatus = ['Missing', 'Found', 'False']

    useEffect(() => {

        const test = async () => {
            if (reportManagerContract) {
                const td = []
                const reports = await reportManagerContract.methods.findAllReports().call();
                for (let i = 0; i < reports.length; i++) {
                    td.push(await reportManagerContract.methods.findReportByCID(reports[i]).call());
                }

                setTableData(td);
            }

        }

        test();
    }, [reportManagerContract])

    const handleStatusChange = async (index, reportAddr) => {
        console.log(index, reportAddr);

        try {
            await reportManagerContract.methods.updateReport(reportAddr, index).send({ from: accounts[0] });
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <PageHolder><table className="table">
            <thead className="thead-dark">
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Height</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>contact</th>
                    <th>Urgency</th>
                    <th>Report Status</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map(report => (
                    <tr key={report[0]}>
                        <td>{report[1]}</td>
                        <td>{report[2]}</td>
                        <td>{report[3]}</td>
                        <td>{report[4]}</td>
                        <td>{report[5]}</td>
                        <td>{report[6]}</td>
                        <td>{report[7]}</td>
                        <td>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {ReportStatus[report.status]}
                                </button>
                                <ul className="dropdown-menu">
                                    {ReportStatus.map((element, index) => (
                                        report.status != index ? (
                                            <React.Fragment key={index}>
                                                <li onClick={() => handleStatusChange(index, report[0])}><a className="dropdown-item">{element}</a></li>
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

export default ReportManager;