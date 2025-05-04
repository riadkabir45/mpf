import React, { useEffect, useState } from 'react';
import PageHolder from './PageHolder';
import { useEth } from '../contexts/EthContext';

function ReportManager() {
    const { state: { web3, reportManagerContract, accounts } } = useEth();
    const [tableData, setTableData] = useState([]);
    const [bottomData, setBottomData] = useState('{}');
    const [searchQuery, setSearchQuery] = useState('');
    const ReportStatus = ['Missing', 'Found', 'False']

    const toTitleCase = (str) => {
        return str.toLowerCase().split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    };

    useEffect(() => {

        const test = async () => {
            if (reportManagerContract) {
                const td = []
                const reports = await reportManagerContract.methods.findAllReports().call();
                for (let i = 0; i < reports.length; i++) {
                    td.push(await reportManagerContract.methods.findReportByCID(reports[i]).call());
                }

                const btd = { locations: null, locationReport: [] };
                btd.locations = await reportManagerContract.methods.sortDivisionByCount().call();

                for (let i = 0; i < btd.locations.length; i++) {
                    const locationReports = await reportManagerContract.methods.findReportByDivision(btd.locations[i]).call();
                    btd.locationReport.push(locationReports);
                }

                setTableData(td);
                setBottomData(btd);
                console.log(btd)
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

    const filteredData = tableData.filter(report => {
        return report.slice(1).some(field =>
            String(field).toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <PageHolder>
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-control mb-3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Height</th>
                            <th>Description</th>
                            <th>Location</th>
                            <th>Contact</th>
                            <th>Urgency</th>
                            <th>Report Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(report => (
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
                                        <button className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            {ReportStatus[report[8]]}
                                        </button>
                                        <ul className="dropdown-menu">
                                            {ReportStatus.map((element, index) => (
                                                report[8] != index ? (
                                                    <li key={index} onClick={() => handleStatusChange(index, report[0])}>
                                                        <a className="dropdown-item">{element}</a>
                                                    </li>
                                                ) : null
                                            ))}
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <span>
                {bottomData.locations ? bottomData.locations.map((location, index) => (
                    <span key={index}>
                        {`${toTitleCase(location)}(${bottomData.locationReport[index].length})`}
                        {index < bottomData.locations.length - 1 && ', '}
                    </span>
                )) : null}
            </span>
        </PageHolder>
    );
}

export default ReportManager;