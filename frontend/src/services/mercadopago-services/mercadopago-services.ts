// src/services/mercadopago.ts

export const createMercadoPagoPreferenceAndRedirect = async (): Promise<void> => {
  try {
    const res = await fetch('/api/createPreference', { method: 'POST' });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error al crear preferencia de Mercado Pago:', errorData);
      throw new Error(errorData.message || 'Error desconocido al crear la preferencia.');
    }

    const data: { id?: string } = await res.json();

    if (data.id) {
      console.log('ID de preferencia de Mercado Pago:', data.id);
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`;
    } else {
      console.error('No se recibió un ID de preferencia de Mercado Pago válido.');
      throw new Error('No se recibió un ID de preferencia válido.');
    }
  } catch (error) {
    console.error('Fallo en el proceso de checkout de Mercado Pago:', error);
    alert('Ocurrió un error al intentar iniciar el pago. Por favor, inténtalo de nuevo.'); //Cambiar esto
  }
};