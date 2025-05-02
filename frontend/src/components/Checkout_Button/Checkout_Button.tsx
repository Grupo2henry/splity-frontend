'use client';

import React from 'react';

const CheckoutButton = () => {
  const handleCheckout = async () => {
    const res = await fetch('/api/createPreference', { method: 'POST' });
    console.log(res);
    const data = await res.json() as { id?: string }; // Explicitly type 'data'
    if (data.id) {
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`;
    }
  };

  return <button onClick={handleCheckout}>Suscribirme</button>;
};

export default CheckoutButton;
