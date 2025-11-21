'use client'

import * as Cart from "@/lib/cart"
import styles from './OrderForm.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderForm () {    
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        emailAddress: "",
        mailingAddress: "",
        ccName: "",
        ccNumber: "",
        ccExpirationMonth: 0,
        ccExpirationYear: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const gatherData = async () => {
        const items = Cart.allItems();
        const fullName = formData.name

        const customer = {
            name: fullName,
            emailAddress: formData.emailAddress
        };

        const expiration = {
            month: formData.ccExpirationMonth,
            year: formData.ccExpirationYear < 2000 ? 2000 + formData.ccExpirationYear : formData.ccExpirationYear
        };

        const card = {
            number: formData.ccNumber,
            cardholderName: formData.ccName,
            expiration
        };

        try {
            const res = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                        mailingAddress: formData.mailingAddress, 
                        customer,
                        card,
                        items
                    })
            });
            const data = await res.json();
            if (res.status != 200)
                throw data
            console.log("Order Successfully Created", data);
            Cart.clear()
            router.push(`/orderSuccess?orderID=${encodeURIComponent(data.orderID)}`)
        } catch (err: any) {
            console.error("Order Not Created", err);
            alert(`Error: ${err.error}`)
        }
    }

    return (
        <div className={styles.customerInfo}>
                <h3>Enter Your Information: </h3>
                <div className={styles.nameInfo}>Name:
                    <input  type="text" 
                            id="name" 
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                    />
                </div>
                <div className={styles.addressInfo}>
                    Email Address:
                    <input  type="text" 
                            id="emailAddress" 
                            placeholder="Enter your email address"
                            value={formData.emailAddress}
                            onChange={handleChange}
                    />
                    Mailing Address:
                    <input  type="text" 
                            id="mailingAddress" 
                            placeholder="Enter your mailing address"
                            value={formData.mailingAddress}
                            onChange={handleChange}
                    />
                </div>
                <div className={styles.ccInfo}>
                    Name on Credit Card:
                    <input  type="text" 
                            id="ccName" 
                            placeholder="Enter name on credit card"
                            value={formData.ccName}
                            onChange={handleChange}
                    />
                    Credit Card Number:
                    <input  type="text" 
                            id="ccNumber" 
                            placeholder="Enter your credit card number"
                            value={formData.ccNumber}
                            onChange={handleChange}
                    />
                    Expiration Month: 
                    <input  type="text" 
                            id="ccExpirationMonth" 
                            placeholder="Enter your Expiration Month"
                            value={formData.ccExpirationMonth}
                            onChange={handleChange}
                    />
                    Expiration Year: 
                    <input  type="text" 
                            id="ccExpirationYear" 
                            placeholder="Enter your Expiration Year"
                            value={formData.ccExpirationYear}
                            onChange={handleChange}
                    />
                </div>
                <button onClick={gatherData} className={styles.submitButton}>Submit Order</button>
            </div>
    )
}