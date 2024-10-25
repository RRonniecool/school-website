import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'; // Firestore functions
import { db } from '../../firebaseConfig'; // Your Firebase config
import './schoolfees.css';

const SchoolFees = ({ userId }) => {
    const [view, setView] = useState('summary'); // Views: 'summary', 'details', 'payment'
    const [paidFeesSummary, setPaidFeesSummary] = useState(null);
    const [feesDetails, setFeesDetails] = useState([]);
    const [selectedClass, setSelectedClass] = useState('JSS1');
    const [paymentType, setPaymentType] = useState('full');
    const receiptRef = useRef(); // Ref to receipt section

    // Fetch data from Firestore when component mounts
    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const docRef = doc(db, "users", userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPaidFeesSummary(data.paidFeesSummary || null);
                    setFeesDetails(data.feesDetails || []);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };

        fetchPaymentData();
    }, [userId]);

    // Function to sanitize the amount by removing commas and currency
    const sanitizeAmount = (amount) => {
        return parseInt(amount.replace(/[^0-9]/g, ''), 10);
    };

    // Handle successful payment
    const handlePaymentSuccess = async (newPayment) => {
        const sanitizedAmount = sanitizeAmount(newPayment.amount);
        const docRef = doc(db, "users", userId);

        // Ensure that paidFeesSummary is initialized correctly
        const updatedTotalPaid = paidFeesSummary?.totalPaid 
            ? sanitizeAmount(paidFeesSummary.totalPaid) + sanitizedAmount
            : sanitizedAmount;

        await updateDoc(docRef, {
            "paidFeesSummary.totalPaid": `${updatedTotalPaid} NGN`,
            "paidFeesSummary.paymentDate": newPayment.paymentDate,
            feesDetails: arrayUnion(newPayment) // Append the new payment to the array
        });

        // Update the local state to reflect changes
        setPaidFeesSummary((prev) => ({
            ...prev,
            totalPaid: `${updatedTotalPaid} NGN`,
            paymentDate: newPayment.paymentDate,
        }));
        setFeesDetails((prev) => [...prev, newPayment]);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();

        // Define payment amounts for each class and payment type
        const paymentAmounts = {
            "JSS1": { full: 50000, half: 25000 },
            "JSS2": { full: 52000, half: 26000 },
            "JSS3": { full: 53000, half: 26500 },
            "SS1": { full: 55000, half: 27500 },
            "SS2": { full: 57000, half: 28500 },
            "SS3": { full: 59000, half: 29500 }
        };

        // Get the amount based on the selected class and payment type
        const selectedAmount = paymentAmounts[selectedClass][paymentType];

        // Simulate a successful payment response (you will replace this with real payment integration)
        const newPayment = {
            class: selectedClass,
            term: '4th Term',
            amount: `${selectedAmount} NGN`,
            paymentType: paymentType,
            status: 'Paid',
            paymentDate: '24/10/2024' // Replace with actual payment date
        };

        handlePaymentSuccess(newPayment); // Call after successful payment
    };

    // Function to print only the receipt section
    const handlePrintReceipt = () => {
        const printContents = receiptRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload page to reset state
    };

    const renderContent = () => {
        switch (view) {
            case 'summary':
                return (
                    <div className="summary-section" ref={receiptRef}>
                        <h3>Paid Fees Summary</h3>
                        {paidFeesSummary ? (
                            <>
                                <p><strong>Class:</strong> {paidFeesSummary.class || 'N/A'}</p>
                                <p><strong>Total Paid:</strong> {paidFeesSummary.totalPaid || '0 NGN'}</p>
                                <p><strong>Payment Date:</strong> {paidFeesSummary.paymentDate || 'N/A'}</p>
                                <button onClick={handlePrintReceipt}>Print Receipt</button>
                            </>
                        ) : (
                            <p>No payment has been made yet. Once you make a payment, the details will appear here.</p>
                        )}
                    </div>
                );
            case 'details':
                return (
                    <div className="details-section">
                        <h3>Fees Breakdown</h3>
                        {feesDetails.length > 0 ? (
                            <ul>
                                {feesDetails.map((fee, index) => (
                                    <li key={index}>
                                        <strong>{fee.term}:</strong> {fee.amount} ({fee.status}) - {fee.paymentDate}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No payment history available. Once payments are made, the details will appear here.</p>
                        )}
                    </div>
                );
            case 'payment':
                return (
                    <div className="payment-section">
                        <h3>Payment Form</h3>
                        <form onSubmit={handlePaymentSubmit}>
                            <div>
                                <label htmlFor="class">Select Class:</label>
                                <select id="class" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                                    <option value="JSS1">JSS1</option>
                                    <option value="JSS2">JSS2</option>
                                    <option value="JSS3">JSS3</option>
                                    <option value="SS1">SS1</option>
                                    <option value="SS2">SS2</option>
                                    <option value="SS3">SS3</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="paymentType">Select Payment Type:</label>
                                <select id="paymentType" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                                    <option value="full">Full Payment</option>
                                    <option value="half">Half Payment</option>
                                </select>
                            </div>
                            <button type="submit" className="pay-now-btn">Proceed to Pay</button>
                        </form>
                    </div>
                );
            default:
                return <div>Loading...</div>;
        }
    };

    return (
        <div className="school-fees-container">
            <h2>School Fees Section</h2>
            <div className="button-group">
                <button className="tab-btn" onClick={() => setView('summary')}>View Summary</button>
                <button className="tab-btn" onClick={() => setView('details')}>View Details</button>
                <button className="tab-btn" onClick={() => setView('payment')}>Make Payment</button>
            </div>
            <div className="content-section">
                {renderContent()}
            </div>
        </div>
    );
};

export default SchoolFees;
