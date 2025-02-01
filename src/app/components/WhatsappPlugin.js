'use client'
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
    const phoneNumber = '923222355327';
    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <div className="fixed bottom-4 text-black right-4 flex flex-col space-y-4 items-center z-50">
                <div
                    className="shadow-lg cursor-pointer flex items-center justify-center bg-green-500 p-2 rounded-full mb-4"
                    onClick={handleClick}>
                    <FaWhatsapp className="text-white w-6 h-6 md:w-8 md:h-8" />
                </div>
            </div>
        </>
    );
}
