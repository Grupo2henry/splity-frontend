export async function reportPaymentStatus({
    status,
    paymentId,
    preferenceId,
  }: {
    status: string;
    paymentId: string;
    preferenceId: string;
  }) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No hay token disponible. El usuario no está autenticado.");
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/test`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          paymentId,
          preferenceId,
        }),
      });
      console.log("Este es el response: ", response)
      if (!response.ok) {
        throw new Error("Error al enviar el estado del pago al backend");
      }
  
      return await response.json();
    } catch (error) {
      console.log("Sucedio un error.")
      console.error("Error reportando estado de pago:", error);
    }
  }